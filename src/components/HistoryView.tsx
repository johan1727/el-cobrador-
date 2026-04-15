import { useState, useEffect, useMemo, useCallback } from 'react';
import type { GeneratedMessage, Debt } from '../types';
import { useTranslation } from '../i18n';
import { useAuth } from '../hooks/useAuth';
import { useAutoReminders } from '../hooks/useAutoReminders';
import { EditMessageInline } from './EditMessageInline';
import { DebtReminderCard } from './DebtReminderCard';

interface Props {
  onClose: () => void;
  onReuse: (msg: GeneratedMessage, debt: Debt) => void;
  onNewMessage?: () => void;
  isPro?: boolean;
}

interface HistoryItem {
  id: string;
  message: GeneratedMessage;
  debt: Debt;
  date: string;
  synced?: boolean;
}

type FilterType = 'all' | 'light' | 'balanced' | 'spicy';

export function HistoryView({ onClose, onReuse, onNewMessage, isPro = false }: Props) {
  const { t, language } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [totalAmount, setTotalAmount] = useState(0);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

  const weekDays = t.history.weekDays;

  // Load from localStorage and sync with cloud
  useEffect(() => {
    const saved = localStorage.getItem('el-cobrador-history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const sorted = parsed.sort((a: HistoryItem, b: HistoryItem) => b.message.timestamp - a.message.timestamp);
        setHistory(sorted);
        const total = sorted.reduce((sum: number, item: HistoryItem) => sum + (item.debt.amount || 0), 0);
        setTotalAmount(total);
      } catch (error) {
        console.error('Error parsing history:', error);
      }
    }
  }, []);

  // Sync with Supabase when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      syncWithCloud();
    }
  }, [isAuthenticated, user]);

  const syncWithCloud = async () => {
    if (!user) return;
    setSyncStatus('syncing');
    
    try {
      const { supabase } = await import('../lib/supabase');
      if (!supabase) throw new Error('Supabase not configured');

      // Fetch cloud history
      const { data, error } = await supabase
        .from('user_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const cloudItems: HistoryItem[] = data.map(item => ({
          id: item.id,
          message: {
            text: item.message_text,
            tone: item.tone,
            level: item.level,
            timestamp: new Date(item.created_at).getTime()
          },
          debt: {
            debtor: item.debtor,
            amount: parseFloat(item.amount),
            currency: item.currency,
            reason: item.reason || ''
          },
          date: item.created_at,
          synced: true
        }));

        // Merge with local
        const local = localStorage.getItem('el-cobrador-history');
        const localItems: HistoryItem[] = local ? JSON.parse(local) : [];
        const cloudIds = new Set(cloudItems.map(i => i.id));
        const merged = [...cloudItems, ...localItems.filter(i => !cloudIds.has(i.id))];
        
        merged.sort((a, b) => b.message.timestamp - a.message.timestamp);
        
        localStorage.setItem('el-cobrador-history', JSON.stringify(merged));
        setHistory(merged);
        setTotalAmount(merged.reduce((sum, item) => sum + (item.debt.amount || 0), 0));
      }

      setSyncStatus('synced');
      setLastSynced(new Date());
    } catch (err) {
      console.error('Sync error:', err);
      setSyncStatus('error');
    }
  };

  const filteredHistory = useMemo(() => {
    let result = history;
    if (filterType !== 'all') {
      result = result.filter(item => item.message.level === filterType);
    }
    if (filter) {
      result = result.filter(item =>
        item.debt.debtor.toLowerCase().includes(filter.toLowerCase()) ||
        item.message.tone.toLowerCase().includes(filter.toLowerCase())
      );
    }
    return result;
  }, [history, filter, filterType]);

  const handleDelete = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('el-cobrador-history', JSON.stringify(updated));
    // Recalculate total
    const total = updated.reduce((sum, item) => sum + (item.debt.amount || 0), 0);
    setTotalAmount(total);
  };

  const handleEditStart = (id: string) => {
    setEditingId(id);
    setEditSuccess(false);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditLoading(false);
  };

  const handleEditSave = async (id: string, newText: string) => {
    setEditLoading(true);
    
    try {
      // Update localStorage
      const saved = localStorage.getItem('el-cobrador-history');
      if (saved) {
        const parsed: HistoryItem[] = JSON.parse(saved);
        const itemIndex = parsed.findIndex(i => i.id === id);
        if (itemIndex !== -1) {
          parsed[itemIndex].message.text = newText;
          parsed[itemIndex].message.timestamp = Date.now();
          localStorage.setItem('el-cobrador-history', JSON.stringify(parsed));
          
          // Update local state
          setHistory(prev => {
            const updated = [...prev];
            const idx = updated.findIndex(i => i.id === id);
            if (idx !== -1) {
              updated[idx].message.text = newText;
              updated[idx].message.timestamp = Date.now();
            }
            return updated;
          });
        }
      }

      // Update Supabase if authenticated
      if (isAuthenticated && user) {
        const { supabase } = await import('../lib/supabase');
        if (supabase) {
          await supabase
            .from('user_history')
            .update({ message_text: newText, updated_at: new Date().toISOString() })
            .eq('id', id)
            .eq('user_id', user.id);
        }
      }

      setEditSuccess(true);
      setTimeout(() => {
        setEditingId(null);
        setEditSuccess(false);
      }, 1500);
    } catch (err) {
      console.error('Error updating message:', err);
    } finally {
      setEditLoading(false);
    }
  };

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'history' | 'reminders'>('history');
  
  // Auto reminders
  const { 
    reminders, 
    pendingCount, 
    loading: remindersLoading,
    markAsPaid, 
    markAsForgiven, 
    snoozeReminder,
    loadReminders 
  } = useAutoReminders(user?.id || null);

  // Export to CSV (Premium feature)
  const exportToCSV = useCallback(() => {
    if (!isAuthenticated || !user) return;
    
    const headers = ['Fecha', 'Deudor', 'Monto', 'Moneda', 'Tono', 'Nivel', 'Mensaje', 'Estado'];
    const rows = history.map(item => [
      new Date(item.message.timestamp).toLocaleDateString(),
      item.debt.debtor,
      item.debt.amount,
      item.debt.currency,
      item.message.tone,
      item.message.level,
      `"${item.message.text.replace(/"/g, '""')}"`, // Escape quotes
      'Pendiente' // Default status
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `el-cobrador-historial-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }, [history, isAuthenticated, user]);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Error copying:', err);
    }
  };

  const handleClearAll = () => {
    if (confirm(t.history.confirmDeleteAll)) {
      setHistory([]);
      setTotalAmount(0);
      localStorage.removeItem('el-cobrador-history');
    }
  };

  // Generate weekly chart data (mock for visual)
  const weeklyData = [12, 20, 16, 24, 32, 14, 18];

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-on-surface/20 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-2xl max-h-[90vh] bg-surface-container-lowest sm:rounded-[2rem] rounded-t-[2rem] overflow-hidden flex flex-col shadow-2xl">
        {/* Header - Stitch Style */}
        <header className="flex items-center justify-between px-6 py-4 bg-surface sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden">
              <img
                alt="Avatar"
                className="w-full h-full object-cover"
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=capybara&backgroundColor=eaddff"
              />
            </div>
            <h1 className="text-xl font-extrabold text-primary tracking-tight">{t.common.appName}</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Sync indicator */}
            {isAuthenticated && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-surface-container-high">
                {syncStatus === 'syncing' && (
                  <>
                    <span className="material-symbols-outlined text-primary text-sm animate-spin">sync</span>
                    <span className="text-xs text-on-surface-variant">Sync...</span>
                  </>
                )}
                {syncStatus === 'synced' && (
                  <>
                    <span className="material-symbols-outlined text-primary text-sm">cloud_done</span>
                    {lastSynced && (
                      <span className="text-xs text-on-surface-variant">
                        {lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </>
                )}
                {syncStatus === 'error' && (
                  <>
                    <span className="material-symbols-outlined text-error text-sm">cloud_off</span>
                    <span className="text-xs text-error">Error</span>
                  </>
                )}
              </div>
            )}
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-primary">close</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <main className="px-6 pt-2 pb-24">
            {/* Hero Section: Stats Overview */}
            <section className="mb-8">
              <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-container rounded-xl p-8 text-white shadow-xl">
                <div className="relative z-10">
                  <p className="text-on-primary-container text-sm font-semibold tracking-wider uppercase mb-2">{t.history.totalCollected}</p>
                  <h2 className="text-4xl font-extrabold tracking-tight mb-6">${totalAmount.toLocaleString()}</h2>
                  <div className="flex gap-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/10">
                      <p className="text-xs opacity-70">{t.history.messages}</p>
                      <p className="font-bold">{history.length}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/10">
                      <p className="text-xs opacity-70">{t.history.average}</p>
                      <p className="font-bold">${history.length > 0 ? Math.round(totalAmount / history.length).toLocaleString() : '0'}</p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              </div>
            </section>

            {/* Tabs: History | Reminders */}
            {isAuthenticated && (
              <section className="mb-6">
                <div className="flex gap-2 p-1 bg-surface-container-high rounded-full">
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-2 px-4 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      activeTab === 'history'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">history</span>
                    {t.history.title}
                  </button>
                  <button
                    onClick={() => setActiveTab('reminders')}
                    className={`flex-1 py-2 px-4 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      activeTab === 'reminders'
                        ? 'bg-error text-on-error shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">notifications</span>
                    {t.reminders?.title || 'Por cobrar'}
                    {pendingCount > 0 && (
                      <span className="ml-1 w-5 h-5 bg-on-error text-error text-xs rounded-full flex items-center justify-center font-bold">
                        {pendingCount > 9 ? '9+' : pendingCount}
                      </span>
                    )}
                  </button>
                </div>
              </section>
            )}

            {/* Content based on active tab */}
            {activeTab === 'reminders' && isAuthenticated ? (
              <section className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-on-surface tracking-tight">
                    {t.reminders?.title || 'Deudas por cobrar'}
                  </h3>
                  <button
                    onClick={() => loadReminders()}
                    className="text-primary text-sm font-bold hover:opacity-80 transition-opacity"
                    disabled={remindersLoading}
                  >
                    <span className={`material-symbols-outlined text-sm ${remindersLoading ? 'animate-spin' : ''}`}>
                      {remindersLoading ? 'sync' : 'refresh'}
                    </span>
                  </button>
                </div>

                {reminders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant text-center">
                    <div className="w-20 h-20 mb-4 bg-surface-container-low rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-primary/30">check_circle</span>
                    </div>
                    <h3 className="text-lg font-bold text-on-surface mb-2">
                      {t.history.allCaughtUpTitle}
                    </h3>
                    <p className="text-sm max-w-xs">
                      {t.history.allCaughtUpDesc}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reminders.map((reminder) => (
                      <DebtReminderCard
                        key={reminder.id}
                        reminder={reminder}
                        onMarkPaid={() => markAsPaid(reminder.id)}
                        onMarkForgiven={() => markAsForgiven(reminder.id)}
                        onSnooze={(days) => snoozeReminder(reminder.id, days)}
                      />
                    ))}
                  </div>
                )}
              </section>
            ) : (
              <>
                {/* Filters Section */}
                <section className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-on-surface tracking-tight">{t.history.title}</h3>
                {history.length > 0 && (
                  <div className="flex items-center gap-3">
                    {/* Export CSV - Premium only */}
                    {isPro && (
                      <button
                        onClick={exportToCSV}
                        className="text-primary text-sm font-bold hover:opacity-80 transition-opacity flex items-center gap-1"
                        title={t.history.exportCSV}
                      >
                        <span className="material-symbols-outlined text-sm">download</span>
                        CSV
                      </button>
                    )}
                    <button
                      onClick={handleClearAll}
                      className="text-error text-sm font-bold hover:opacity-80 transition-opacity flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">delete_sweep</span>
                      {t.history.deleteAll}
                    </button>
                  </div>
                )}
              </div>

              {/* Filter Pills */}
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {[
                  { key: 'all', label: t.history.filters.all },
                  { key: 'light', label: t.history.filters.light },
                  { key: 'balanced', label: t.history.filters.balanced },
                  { key: 'spicy', label: t.history.filters.spicy }
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilterType(f.key as FilterType)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
                      filterType === f.key
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {filterType === f.key && (
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>filter_list</span>
                    )}
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative mt-3">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">search</span>
                <input
                  type="text"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder={t.history.searchPlaceholder}
                  className="w-full bg-surface-container-high py-3 pl-12 pr-4 rounded-lg text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-primary/20 outline-none border-none"
                />
              </div>
            </section>

            {/* Activity Cards List */}
            <section className="space-y-4">
              {filteredHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant text-center">
                  <div className="w-24 h-24 mb-4 relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-surface-container-low rounded-full scale-110 blur-xl opacity-50"></div>
                    <div className="relative bg-surface-container-lowest p-6 rounded-xl shadow-lg border border-surface-container">
                      <span className="material-symbols-outlined text-5xl text-primary/30" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-on-surface mb-2">
                    {filter || filterType !== 'all' ? 'No se encontraron resultados' : 'No hay mensajes guardados'}
                  </h3>
                  <p className="text-sm max-w-xs">
                    {filter || filterType !== 'all'
                      ? 'Intenta con otros filtros de búsqueda'
                      : 'Genera tu primer mensaje de cobro y aparecerá aquí'
                    }
                  </p>
                </div>
              ) : (
                filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    className="bg-surface-container-low p-5 rounded-xl flex items-start justify-between transition-all hover:scale-[1.01] hover:shadow-sm group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-primary text-lg">person</span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-on-surface truncate">{item.debt.debtor}</h4>
                          <p className="text-xs text-on-surface-variant">
                            {new Date(item.message.timestamp).toLocaleDateString(t.history.locale, {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })} • {item.message.tone}
                          </p>
                        </div>
                      </div>
                      
                      {/* Message text or Edit inline */}
                      {editingId === item.id ? (
                        <div className="ml-[52px]">
                          <EditMessageInline
                            initialText={item.message.text}
                            onSave={(newText) => handleEditSave(item.id, newText)}
                            onCancel={handleEditCancel}
                            isLoading={editLoading}
                          />
                          {editSuccess && (
                            <p className="text-xs text-primary font-semibold mt-2 flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">check_circle</span>
                              {t.history.editSuccess}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-on-surface-variant text-sm line-clamp-2 ml-[52px]">{item.message.text}</p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-2 ml-[52px]">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase">
                          {item.message.level}
                        </span>
                        <span className="text-xs text-on-surface-variant">
                          ${item.debt.amount.toLocaleString()} {item.debt.currency}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2 shrink-0">
                      {!editingId && (
                        <>
                          <button
                            onClick={() => handleCopy(item.message.text, item.id)}
                            className={`p-2 rounded-full transition-colors ${
                              copiedId === item.id
                                ? 'text-primary bg-primary/10'
                                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
                            }`}
                            title={copiedId === item.id ? t.history.copied : t.history.copyMessage}
                          >
                            <span className="material-symbols-outlined text-lg">
                              {copiedId === item.id ? 'check_circle' : 'content_copy'}
                            </span>
                          </button>
                          <button
                            onClick={() => handleEditStart(item.id)}
                            className="text-on-surface-variant hover:bg-surface-container-high hover:text-primary p-2 rounded-full transition-colors"
                            title={t.history.edit}
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button
                            onClick={() => onReuse(item.message, item.debt)}
                            className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors"
                            title="Reutilizar"
                          >
                            <span className="material-symbols-outlined">replay</span>
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-error hover:bg-error/10 p-2 rounded-full transition-colors"
                            title="Eliminar"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </section>

            {/* Weekly Chart - Visual Only */}
            {history.length > 0 && (
              <section className="mt-10 mb-6">
                <div className="bg-surface-container p-6 rounded-xl">
                  <h5 className="text-primary font-bold text-sm mb-4">Actividad de la semana</h5>
                  <div className="h-32 flex items-end justify-between gap-2">
                    {weeklyData.map((height, i) => (
                      <div key={i} className="w-full flex flex-col items-center gap-1">
                        <div
                          className="w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary/40"
                          style={{ height: `${height * 3}px` }}
                        />
                        <span className="text-[10px] text-on-surface-variant font-bold">{weekDays[i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
              </>
            )}
          </main>
        </div>

        {/* FAB for New Message */}
        {onNewMessage && (
          <button
            onClick={onNewMessage}
            className="fixed right-6 bottom-28 w-14 h-14 rounded-xl bg-primary text-white shadow-2xl flex items-center justify-center transition-all hover:rotate-12 active:scale-90 z-40"
          >
            <span className="material-symbols-outlined text-3xl">add</span>
          </button>
        )}
      </div>
    </div>
  );
}
