import { useState, useEffect } from 'react';
import { DebtForm } from './components/DebtForm';
import { HumorLevelSelector } from './components/HumorLevelSelector';
import { ToneSelector } from './components/ToneSelector';
import { MessagePreview } from './components/MessagePreview';
import { PaywallModal } from './components/PaywallModal';
import { HistoryView } from './components/HistoryView';
import { ClientsView } from './components/ClientsView';
import { SettingsView } from './components/SettingsView';
import { PricingView } from './components/PricingView';
import { useGemini } from './hooks/useGemini';
import { useUsageLimit } from './hooks/useUsageLimit';
import { useSound } from './hooks/useSound';
import { useAuth } from './hooks/useAuth';
import { useSubscription } from './hooks/useSubscription';
import { usePersistentState } from './hooks/usePersistentState';
import { I18nProvider, useTranslation } from './i18n';
import type { Debt, Tone, HumorLevel, GeneratedMessage } from './types';
import { tones } from './data/tones';

type View = 'form' | 'humor' | 'tone' | 'preview';

function AppContent() {
  const [view, setView] = useState<View>('form');
  // Persistencia de configuración
  const [savedToneId, setSavedToneId] = usePersistentState<string | null>('el-cobrador-tone', null);
  const [savedLevel, setSavedLevel] = usePersistentState<HumorLevel>('el-cobrador-level', 'balanced');
  const [savedCurrency, setSavedCurrency] = usePersistentState<'MXN' | 'USD'>('el-cobrador-currency', 'MXN');
  const [savedDebtor, setSavedDebtor] = usePersistentState<string>('el-cobrador-last-debtor', '');
  
  // Inicializar tone desde persistencia
  const initialTone = savedToneId ? tones.find(t => t.id === savedToneId) || null : null;
  
  const [debt, setDebt] = useState<Debt>({
    debtor: savedDebtor,
    amount: 0,
    currency: savedCurrency,
    reason: ''
  });
  const [level, setLevel] = useState<HumorLevel>(savedLevel);
  const [selectedTone, setSelectedTone] = useState<Tone | null>(initialTone);
  const [message, setMessage] = useState<GeneratedMessage | null>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showClients, setShowClients] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  const { generateMessage, loading, error } = useGemini();
  const { 
    canGenerate, 
    incrementUsage, 
    isPro,
    getTimeUntilReset,
    getProgressPercentage,
    FREE_DAILY_LIMIT
  } = useUsageLimit();
  const { playGenerate, playCopy, playShare, playFlip, playClick } = useSound();
  const { user } = useAuth();
  const { isPro: isProSubscription } = useSubscription(user?.id || null);
  const { t } = useTranslation();
  
  // Usar isPro de useUsageLimit o de useSubscription
  const isProUser = isPro || isProSubscription;

  const handleContinueFromForm = () => {
    if (debt.debtor && debt.amount > 0) {
      setView('humor');
    }
  };

  const handleContinueFromHumor = () => {
    setView('tone');
  };

  const handleToneSelect = async (tone: Tone) => {
    setSelectedTone(tone);

    if (!canGenerate) {
      setPaywallOpen(true);
      return;
    }

    const result = await generateMessage(debt, tone, level, user?.id);
    if (result) {
      setMessage(result);
      incrementUsage();
      playGenerate();
      setView('preview');
    }
  };

  const handleFlip = () => {
    if (message) {
      setDebt(prev => ({
        ...prev,
        debtor: 'Yo',
        amount: debt.amount,
        reason: `contra-cobro por ${debt.reason}`
      }));
      setMessage(null);
      setView('form');
    }
  };

  const handleRestart = () => {
    setDebt({ debtor: '', amount: 0, currency: savedCurrency, reason: '' });
    setLevel('balanced');
    setSelectedTone(null);
    setMessage(null);
    setView('form');
  };

  // Persistir configuración cuando cambie
  useEffect(() => {
    if (debt.debtor) {
      setSavedDebtor(debt.debtor);
    }
  }, [debt.debtor]);

  useEffect(() => {
    setSavedCurrency(debt.currency);
  }, [debt.currency]);

  useEffect(() => {
    setSavedLevel(level);
  }, [level]);

  useEffect(() => {
    if (selectedTone) {
      setSavedToneId(selectedTone.id);
    }
  }, [selectedTone]);

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface selection:bg-primary-container selection:text-on-primary-container pb-24">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md flex justify-between items-center px-6 h-16">
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setView('form')}
        >
          <div className="w-10 h-10 overflow-hidden rounded-full bg-primary-container border-2 border-primary">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=capybara&backgroundColor=eaddff"
              alt="Capybara Mascot"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="font-headline font-black tracking-tight text-2xl text-primary">El Cobrador</h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Login button - show when not authenticated */}
          {!user && (
            <button 
              onClick={() => setShowSettings(true)}
              className="bg-primary text-on-primary px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              {t.settings.loginWithGoogle}
            </button>
          )}
          {/* User avatar when logged in */}
          {user && (
            <button 
              onClick={() => setShowSettings(true)}
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary hover:opacity-80 transition-opacity"
            >
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-6 max-w-2xl mx-auto relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-20 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl"></div>

        {/* View: Form */}
        {view === 'form' && (
          <section className="relative z-10 pt-4">
            {/* Badge de mensajes gratis */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full shadow-sm">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <span className="text-[12px] font-bold tracking-wide">{isPro ? t.common.unlimited : t.common.dailyLimit}</span>
              </div>
            </div>
            <DebtForm debt={debt} onChange={setDebt} onContinue={handleContinueFromForm} />
          </section>
        )}

        {/* View: Humor Selector */}
        {view === 'humor' && (
          <section className="relative z-10">
            <button
              onClick={() => setView('form')}
              className="mb-4 flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="text-sm font-medium">Volver</span>
            </button>
            <h2 className="font-headline font-extrabold text-4xl text-on-surface tracking-tighter leading-none mb-4 uppercase">
              {t.humor.title}
            </h2>
            <p className="text-on-surface-variant max-w-[80%] leading-relaxed mb-8">
              {t.humor.subtitle}
            </p>
            <HumorLevelSelector level={level} onChange={setLevel} onContinue={handleContinueFromHumor} />
          </section>
        )}

        {/* View: Tone Selector */}
        {view === 'tone' && (
          <section className="relative z-10">
            <button
              onClick={() => setView('humor')}
              className="mb-4 flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="text-sm font-medium">Volver</span>
            </button>
            <h2 className="font-headline font-extrabold text-4xl text-on-surface tracking-tighter leading-none mb-4 uppercase">
              Elige tu <br /><span className="text-primary italic">ejecutor</span>
            </h2>
            <p className="text-on-surface-variant max-w-[80%] leading-relaxed mb-8">
              Selecciona la personalidad que mejor se adapte a tu estilo de cobranza hoy.
            </p>
            <ToneSelector 
              tones={tones} 
              selected={selectedTone} 
              onSelect={handleToneSelect} 
              loading={loading} 
              isPro={isProUser}
              onUpgrade={() => setShowPricing(true)}
            />
          </section>
        )}

        {/* View: Preview */}
        {view === 'preview' && message && (
          <section className="relative z-10 animate-in fade-in slide-in-from-right duration-300">
            <MessagePreview
              message={message}
              debt={debt}
              selectedTone={selectedTone}
              level={level}
              onFlip={() => { playFlip(); handleFlip(); }}
              onRestart={() => { playClick(); handleRestart(); }}
              onCopy={() => playCopy()}
              onShare={() => playShare()}
            />
          </section>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 bg-error-container text-on-error-container p-4 rounded-xl">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
      </main>

      {/* Paywall Modal */}
      <PaywallModal
        open={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        timeUntilReset={getTimeUntilReset()}
        progressPercentage={getProgressPercentage}
        dailyLimit={FREE_DAILY_LIMIT}
      />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full z-50 rounded-t-[40px] bg-surface-container-lowest border-t border-outline-variant/30 shadow-[0_-10px_40px_rgba(103,80,164,0.05)] flex justify-around items-center h-20 px-4">
        <button
          onClick={() => setView('form')}
          className={`flex flex-col items-center justify-center ${view === 'form' ? 'bg-primary text-on-primary' : 'text-outline hover:text-primary'} rounded-[24px_40px_32px_40px] px-5 py-2 scale-105 duration-300 ease-in-out`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: view === 'form' ? "'FILL' 1" : "'FILL' 0" }}>payments</span>
          <span className="font-body text-[11px] font-medium">{t.nav.debts}</span>
        </button>
        <button
          onClick={() => setShowHistory(true)}
          className={`flex flex-col items-center justify-center p-2 transition-all ${showHistory ? 'text-primary scale-105' : 'text-outline hover:text-primary'}`}
        >
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="font-body text-[11px] font-medium">{t.nav.history}</span>
        </button>
        <button
          onClick={() => setShowClients(true)}
          className={`flex flex-col items-center justify-center p-2 transition-all ${showClients ? 'text-primary scale-105' : 'text-outline hover:text-primary'}`}
        >
          <span className="material-symbols-outlined">group</span>
          <span className="font-body text-[11px] font-medium">{t.nav.clients}</span>
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className={`flex flex-col items-center justify-center p-2 transition-all ${showSettings ? 'text-primary scale-105' : 'text-outline hover:text-primary'}`}
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-body text-[11px] font-medium">{t.nav.settings}</span>
        </button>
      </nav>

      {/* History Modal */}
      {showHistory && (
        <HistoryView
          onClose={() => setShowHistory(false)}
          onReuse={(msg, savedDebt) => {
            setMessage(msg);
            setDebt(savedDebt);
            setView('preview');
            setShowHistory(false);
          }}
          onNewMessage={() => {
            setShowHistory(false);
            handleRestart();
          }}
          isPro={isProUser}
        />
      )}

      {/* Clients Modal */}
      {showClients && (
        <ClientsView 
          onClose={() => setShowClients(false)} 
          onSelect={(debtorName) => {
            setDebt(prev => ({ ...prev, debtor: debtorName }));
            setShowClients(false);
          }}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsView
          onClose={() => setShowSettings(false)}
          isPro={isPro}
          onUpgrade={() => setShowPricing(true)}
        />
      )}

      {/* Pricing Modal */}
      {showPricing && (
        <PricingView
          open={showPricing}
          onClose={() => setShowPricing(false)}
          isPro={isPro}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}

export default App;
