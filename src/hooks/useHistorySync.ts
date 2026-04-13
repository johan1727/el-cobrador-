import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { GeneratedMessage, Debt } from '../types';

interface HistoryItem {
  id: string;
  message: GeneratedMessage;
  debt: Debt;
  date: string;
  synced?: boolean;
}

interface UseHistorySyncProps {
  userId: string | null;
  isAuthenticated: boolean;
}

export function useHistorySync({ userId, isAuthenticated }: UseHistorySyncProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const local = localStorage.getItem('el-cobrador-history');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        setHistory(parsed);
      } catch (e) {
        console.error('Error parsing local history:', e);
      }
    }
  }, []);

  // Sync cloud to local when user logs in
  const syncCloudToLocal = useCallback(async () => {
    if (!isAuthenticated || !userId || !supabase) return;

    setLoading(true);
    setSyncError(null);

    try {
      const { data, error } = await supabase
        .from('user_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // Transform Supabase data to HistoryItem format
        const cloudItems: HistoryItem[] = data.map(item => ({
          id: item.id,
          message: {
            text: item.message_text,
            tone: item.tone,
            level: item.level as 'light' | 'balanced' | 'spicy',
            timestamp: new Date(item.created_at).getTime()
          },
          debt: {
            debtor: item.debtor,
            amount: parseFloat(item.amount),
            currency: item.currency as 'MXN' | 'USD',
            reason: item.reason || ''
          },
          date: item.created_at,
          synced: true
        }));

        // Merge with local (cloud wins on conflict - newer timestamp)
        const local = localStorage.getItem('el-cobrador-history');
        const localItems: HistoryItem[] = local ? JSON.parse(local) : [];

        // Create map of existing IDs
        const existingIds = new Set(cloudItems.map(i => i.id));
        
        // Add local-only items
        const merged = [
          ...cloudItems,
          ...localItems.filter(i => !existingIds.has(i.id))
        ];

        // Sort by timestamp desc
        merged.sort((a, b) => b.message.timestamp - a.message.timestamp);

        // Save merged to localStorage
        localStorage.setItem('el-cobrador-history', JSON.stringify(merged));
        setHistory(merged);
        setLastSynced(new Date());

        // Sync local-only items to cloud
        const unsyncedLocal = localItems.filter(i => !i.synced && !existingIds.has(i.id));
        for (const item of unsyncedLocal) {
          await saveToCloud(item, userId);
        }
      }
    } catch (err) {
      console.error('Sync error:', err);
      setSyncError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, userId]);

  // Save single item to cloud
  const saveToCloud = async (item: HistoryItem, uid: string) => {
    if (!supabase) return;

    try {
      const { error } = await supabase.from('user_history').insert({
        id: item.id,
        user_id: uid,
        message_text: item.message.text,
        tone: item.message.tone,
        level: item.message.level,
        debtor: item.debt.debtor,
        amount: item.debt.amount,
        currency: item.debt.currency,
        reason: item.debt.reason,
        created_at: item.date
      });

      if (error) throw error;
    } catch (err) {
      console.error('Error saving to cloud:', err);
    }
  };

  // Save message (local + cloud if authenticated)
  const saveMessage = useCallback(async (
    debt: Debt,
    tone: { name: string },
    level: 'light' | 'balanced' | 'spicy',
    text: string
  ) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      message: {
        text,
        tone: tone.name,
        level,
        timestamp: Date.now()
      },
      debt,
      date: new Date().toISOString(),
      synced: false
    };

    // Save to localStorage
    const existing = localStorage.getItem('el-cobrador-history');
    const history = existing ? JSON.parse(existing) : [];
    history.unshift(newItem);
    const trimmed = history.slice(0, 50);
    localStorage.setItem('el-cobrador-history', JSON.stringify(trimmed));
    setHistory(trimmed);

    // If authenticated, also save to cloud
    if (isAuthenticated && userId) {
      try {
        await saveToCloud(newItem, userId);
        newItem.synced = true;
        // Update localStorage with synced status
        localStorage.setItem('el-cobrador-history', JSON.stringify(trimmed));
      } catch (err) {
        console.error('Failed to sync to cloud:', err);
      }
    }

    return newItem;
  }, [isAuthenticated, userId]);

  // Update message (edit)
  const updateMessage = useCallback(async (
    id: string,
    newText: string
  ) => {
    // Update local
    const existing = localStorage.getItem('el-cobrador-history');
    if (!existing) return;

    const history: HistoryItem[] = JSON.parse(existing);
    const itemIndex = history.findIndex(i => i.id === id);
    if (itemIndex === -1) return;

    history[itemIndex].message.text = newText;
    history[itemIndex].message.timestamp = Date.now();
    history[itemIndex].synced = false;
    localStorage.setItem('el-cobrador-history', JSON.stringify(history));
    setHistory(history);

    // Update cloud if authenticated
    if (isAuthenticated && userId && supabase) {
      try {
        const { error } = await supabase
          .from('user_history')
          .update({
            message_text: newText,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .eq('user_id', userId);

        if (error) throw error;
        
        history[itemIndex].synced = true;
        localStorage.setItem('el-cobrador-history', JSON.stringify(history));
      } catch (err) {
        console.error('Error updating cloud:', err);
      }
    }
  }, [isAuthenticated, userId]);

  // Delete message
  const deleteMessage = useCallback(async (id: string) => {
    // Delete from local
    const existing = localStorage.getItem('el-cobrador-history');
    if (!existing) return;

    const history: HistoryItem[] = JSON.parse(existing);
    const filtered = history.filter(i => i.id !== id);
    localStorage.setItem('el-cobrador-history', JSON.stringify(filtered));
    setHistory(filtered);

    // Delete from cloud if authenticated
    if (isAuthenticated && userId && supabase) {
      try {
        const { error } = await supabase
          .from('user_history')
          .delete()
          .eq('id', id)
          .eq('user_id', userId);

        if (error) throw error;
      } catch (err) {
        console.error('Error deleting from cloud:', err);
      }
    }
  }, [isAuthenticated, userId]);

  // Auto-sync when auth changes
  useEffect(() => {
    if (isAuthenticated && userId) {
      syncCloudToLocal();
    }
  }, [isAuthenticated, userId, syncCloudToLocal]);

  return {
    history,
    loading,
    lastSynced,
    syncError,
    saveMessage,
    updateMessage,
    deleteMessage,
    syncCloudToLocal
  };
}
