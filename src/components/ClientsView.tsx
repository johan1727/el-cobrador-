import { useState, useEffect } from 'react';
import { useTranslation } from '../i18n';

interface Props {
  onClose: () => void;
  onSelect: (debtorName: string) => void;
}

interface Client {
  name: string;
  count: number;
  total: number;
  lastUsed: number;
}

export function ClientsView({ onClose, onSelect }: Props) {
  const { t } = useTranslation();
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [newClient, setNewClient] = useState('');
  const [totalOwed, setTotalOwed] = useState(0);

  useEffect(() => {
    // Load from history
    const saved = localStorage.getItem('el-cobrador-history');
    if (saved) {
      try {
        const history = JSON.parse(saved);
        const clientMap = new Map<string, Client>();
        let total = 0;

        history.forEach((item: any) => {
          const name = item.debt.debtor;
          if (!name) return;

          const existing = clientMap.get(name);
          if (existing) {
            existing.count++;
            existing.total += item.debt.amount;
            if (item.message.timestamp > existing.lastUsed) {
              existing.lastUsed = item.message.timestamp;
            }
          } else {
            clientMap.set(name, {
              name,
              count: 1,
              total: item.debt.amount,
              lastUsed: item.message.timestamp
            });
          }
          total += item.debt.amount;
        });

        setClients(Array.from(clientMap.values()).sort((a, b) => b.lastUsed - a.lastUsed));
        setTotalOwed(total);
      } catch {
        setClients([]);
        setTotalOwed(0);
      }
    }
  }, []);

  const filteredClients = search
    ? clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : clients;

  const handleAddClient = () => {
    if (newClient.trim()) {
      onSelect(newClient.trim());
    }
  };

  const handleDeleteClient = (name: string) => {
    if (confirm(t.clients.confirmDelete(name))) {
      const updated = clients.filter(c => c.name !== name);
      setClients(updated);
    }
  };

  // Calculate stats
  const pendingAmount = clients.reduce((sum, c) => sum + c.total, 0);

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
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-primary">close</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <main className="px-6 pt-2 pb-8">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline">search</span>
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t.clients.searchPlaceholder}
                  className="w-full bg-surface-container-high border-none rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder-on-surface-variant focus:ring-2 focus:ring-primary transition-all duration-300"
                />
              </div>
            </div>

            {/* Hero Balance Card */}
            <div className="relative overflow-hidden mb-8 p-8 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white shadow-xl">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <p className="text-white/70 font-medium tracking-wide mb-2">{t.clients.totalPortfolio}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-extrabold tracking-tight">${totalOwed.toLocaleString()}</span>
                  <span className="text-white/60 text-lg">MXN</span>
                </div>
                <div className="mt-6 flex gap-4">
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/80">{t.clients.pending}</span>
                    <p className="text-lg font-bold">${pendingAmount.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/80">{t.clients.debtors}</span>
                    <p className="text-lg font-bold text-secondary-fixed-dim">{clients.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Add New Client Input */}
            <div className="mb-6 flex gap-2">
              <input
                type="text"
                value={newClient}
                onChange={(e) => setNewClient(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddClient()}
                placeholder={t.clients.addNew}
                className="flex-1 bg-surface-container-high border-none rounded-lg py-4 px-4 text-on-surface placeholder-on-surface-variant focus:ring-2 focus:ring-primary transition-all"
              />
              <button
                onClick={handleAddClient}
                disabled={!newClient.trim()}
                className="bg-primary text-on-primary px-4 py-3 rounded-lg font-bold disabled:opacity-50 flex items-center gap-2"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>

            {/* Empty State or Client List */}
            {filteredClients.length === 0 ? (
              <section className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-64 h-64 mb-8 relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-surface-container-low rounded-full scale-110 blur-xl opacity-50"></div>
                  <div className="relative bg-surface-container-lowest p-10 rounded-xl shadow-lg border border-surface-container">
                    <span className="material-symbols-outlined text-8xl text-primary/20" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-on-surface mb-3 tracking-tight">{t.clients.emptyTitle}</h2>
                <p className="text-on-surface-variant max-w-xs mb-6 leading-relaxed">
                  {t.clients.emptySubtitle}
                </p>
                <p className="text-on-surface-variant text-sm">
                  {t.clients.emptyTip}
                </p>
              </section>
            ) : (
              <section className="space-y-3">
                <h3 className="text-on-surface-variant font-bold text-sm tracking-widest uppercase px-2 mb-4">
                  {t.clients.title} ({clients.length})
                </h3>
                {filteredClients.map((client) => (
                  <div
                    key={client.name}
                    className="bg-surface-container-low p-5 rounded-xl flex items-center justify-between transition-all hover:scale-[1.01] hover:shadow-sm group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">person</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface">{client.name}</h4>
                        <p className="text-xs text-on-surface-variant font-medium">
                          {client.count} {client.count > 1 ? t.common.messages : t.common.message} • {t.common.total}: ${client.total.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelect(client.name)}
                        className="bg-primary text-on-primary px-5 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
                      >
                        {t.clients.charge}
                      </button>
                      <button
                        onClick={() => handleDeleteClient(client.name)}
                        className="text-error hover:bg-error/10 p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        title={t.common.delete}
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Bento Stats */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="col-span-1 bg-surface-container-low p-6 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary">insights</span>
                  <p className="text-sm font-bold text-on-surface-variant">{t.clients.totalCollections}</p>
                </div>
                <p className="text-2xl font-extrabold text-on-surface">
                  {clients.reduce((sum, c) => sum + c.count, 0)}
                </p>
              </div>
              <div className="col-span-1 bg-surface-container-low p-6 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary">history_edu</span>
                  <p className="text-sm font-bold text-on-surface-variant">{t.clients.averagePerCollection}</p>
                </div>
                <p className="text-2xl font-extrabold text-on-surface">
                  ${clients.length > 0 ? Math.round(totalOwed / clients.reduce((sum, c) => sum + c.count, 0)).toLocaleString() : '0'}
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
