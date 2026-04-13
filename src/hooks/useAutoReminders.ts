import { useCallback, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface DebtReminder {
  id: string;
  user_id: string;
  history_item_id: string;
  debtor_name: string;
  amount: number;
  currency: string;
  reminder_3_sent: boolean;
  reminder_7_sent: boolean;
  reminder_14_sent: boolean;
  paid_status: 'pending' | 'paid' | 'forgiven' | 'disputed';
  created_at: string;
  paid_at: string | null;
  next_reminder_date: string;
  daysElapsed: number;
}

interface HistoryItem {
  id: string;
  debt: {
    debtor: string;
    amount: number;
    currency: string;
  };
}

export function useAutoReminders(userId: string | null) {
  const [reminders, setReminders] = useState<DebtReminder[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Crear recordatorio automático al generar mensaje
  const createReminder = useCallback(async (historyItem: HistoryItem) => {
    if (!userId || !supabase) return;

    try {
      const today = new Date();
      const reminder3Date = new Date(today);
      reminder3Date.setDate(today.getDate() + 3);

      const { error } = await supabase.from('debt_reminders').insert({
        user_id: userId,
        history_item_id: historyItem.id,
        debtor_name: historyItem.debt.debtor,
        amount: historyItem.debt.amount,
        currency: historyItem.debt.currency,
        next_reminder_date: reminder3Date.toISOString().split('T')[0],
        paid_status: 'pending'
      });

      if (error) throw error;
      
      // Recargar lista
      await loadReminders();
    } catch (err) {
      console.error('Error creating reminder:', err);
    }
  }, [userId]);

  // Cargar recordatorios pendientes
  const loadReminders = useCallback(async () => {
    if (!userId || !supabase) {
      setReminders([]);
      setPendingCount(0);
      return;
    }

    setLoading(true);
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('debt_reminders')
        .select('*')
        .eq('user_id', userId)
        .eq('paid_status', 'pending')
        .lte('next_reminder_date', today)
        .order('next_reminder_date', { ascending: true });

      if (error) throw error;

      // Calcular días transcurridos y agregar metadata
      const enriched = (data || []).map((item: any) => {
        const created = new Date(item.created_at);
        const now = new Date();
        const daysElapsed = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        
        return {
          ...item,
          daysElapsed
        } as DebtReminder;
      });

      setReminders(enriched);
      setPendingCount(enriched.length);
    } catch (err) {
      console.error('Error loading reminders:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Marcar como pagado
  const markAsPaid = useCallback(async (reminderId: string) => {
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from('debt_reminders')
        .update({ 
          paid_status: 'paid',
          paid_at: new Date().toISOString()
        })
        .eq('id', reminderId);

      if (error) throw error;
      
      // Actualizar estado local
      setReminders(prev => prev.filter(r => r.id !== reminderId));
      setPendingCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking as paid:', err);
    }
  }, []);

  // Marcar como perdonada
  const markAsForgiven = useCallback(async (reminderId: string) => {
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from('debt_reminders')
        .update({ 
          paid_status: 'forgiven',
          paid_at: new Date().toISOString()
        })
        .eq('id', reminderId);

      if (error) throw error;
      
      setReminders(prev => prev.filter(r => r.id !== reminderId));
      setPendingCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking as forgiven:', err);
    }
  }, []);

  // Posponer recordatorio
  const snoozeReminder = useCallback(async (reminderId: string, days: number) => {
    if (!supabase) return;

    try {
      const newDate = new Date();
      newDate.setDate(newDate.getDate() + days);
      
      const { error } = await supabase
        .from('debt_reminders')
        .update({ next_reminder_date: newDate.toISOString().split('T')[0] })
        .eq('id', reminderId);

      if (error) throw error;
      
      // Recargar para reflejar cambios
      await loadReminders();
    } catch (err) {
      console.error('Error snoozing reminder:', err);
    }
  }, [loadReminders]);

  // Procesar recordatorios (determinar qué recordatorio enviar: 3, 7 o 14 días)
  const processReminderStage = useCallback(async (reminder: DebtReminder) => {
    const days = reminder.daysElapsed;
    
    if (days >= 14 && !reminder.reminder_14_sent) {
      return { stage: 14, emoji: '⚠️', title: 'Último aviso' };
    } else if (days >= 7 && !reminder.reminder_7_sent) {
      return { stage: 7, emoji: '📅', title: 'Recordatorio' };
    } else if (days >= 3 && !reminder.reminder_3_sent) {
      return { stage: 3, emoji: '🤔', title: 'Primer seguimiento' };
    }
    
    return null;
  }, []);

  // Marcar recordatorio como enviado
  const markReminderSent = useCallback(async (reminderId: string, stage: number) => {
    if (!supabase) return;

    const updates: any = {};
    if (stage === 3) updates.reminder_3_sent = true;
    if (stage === 7) updates.reminder_7_sent = true;
    if (stage === 14) updates.reminder_14_sent = true;
    
    // Calcular siguiente fecha
    const nextDate = new Date();
    if (stage === 3) nextDate.setDate(nextDate.getDate() + 4); // Día 7
    else if (stage === 7) nextDate.setDate(nextDate.getDate() + 7); // Día 14
    else if (stage === 14) nextDate.setDate(nextDate.getDate() + 30); // Un mes después
    
    updates.next_reminder_date = nextDate.toISOString().split('T')[0];

    try {
      await supabase
        .from('debt_reminders')
        .update(updates)
        .eq('id', reminderId);
    } catch (err) {
      console.error('Error marking reminder sent:', err);
    }
  }, []);

  // Cargar al montar
  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  return {
    reminders,
    pendingCount,
    loading,
    createReminder,
    loadReminders,
    markAsPaid,
    markAsForgiven,
    snoozeReminder,
    processReminderStage,
    markReminderSent
  };
}
