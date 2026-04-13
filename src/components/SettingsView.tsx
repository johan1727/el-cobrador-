import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDarkMode } from '../hooks/useDarkMode';
import { useTranslation } from '../i18n';

interface Props {
  onClose: () => void;
  isPro: boolean;
  onUpgrade: () => void;
}

export function SettingsView({ onClose, isPro, onUpgrade }: Props) {
  const { t, language, setLanguage } = useTranslation();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [soundEnabled, setSoundEnabled] = useState(false); // opt-in: false by default
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const { user, signInWithGoogle, signOut, isConfigured } = useAuth();

  useEffect(() => {
    // Load settings
    const savedSound = localStorage.getItem('el-cobrador-sound');
    const savedAnimations = localStorage.getItem('el-cobrador-animations');
    const savedNotifications = localStorage.getItem('el-cobrador-notifications');

    // Sound is opt-in: only enable if explicitly set to 'true'
    if (savedSound === 'true') setSoundEnabled(true);
    if (savedAnimations) setAnimationsEnabled(savedAnimations === 'true');
    if (savedNotifications) setNotificationsEnabled(savedNotifications === 'true');
  }, []);

  const toggleSetting = (key: string, value: boolean, setter: (v: boolean) => void) => {
    setter(value);
    localStorage.setItem(`el-cobrador-${key}`, String(value));
  };

  const handleLogin = async () => {
    if (!isConfigured) {
      alert(language === 'es' ? 'Supabase no está configurado. Usando modo local.' : 'Supabase not configured. Using local mode.');
      return;
    }

    setLoginLoading(true);
    const { error } = await signInWithGoogle();
    setLoginLoading(false);

    if (error) {
      console.error('Login error:', error);
      alert((language === 'es' ? 'Error al iniciar sesión: ' : 'Login error: ') + error.message);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

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

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Account Section - Asymmetric Bento */}
          <section>
            <h2 className="text-on-surface-variant font-bold text-sm tracking-widest uppercase mb-4 px-2">{t.settings.account}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* User Card */}
              {user ? (
                <>
                  <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col items-center justify-center text-center space-y-3">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-surface-container">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full ring-4 ring-surface-container-lowest">
                        <span className="material-symbols-outlined text-sm">verified</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-primary">{user.name}</h3>
                      <p className="text-on-surface-variant text-sm">{user.email}</p>
                      {isPro && (
                        <span className="inline-block mt-2 bg-primary text-on-primary text-[10px] font-bold px-3 py-1 rounded-full">
                          PRO
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-surface-container-low p-6 rounded-xl flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">mail</span>
                        <span className="text-on-surface font-medium text-sm">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">verified_user</span>
                        <span className="text-on-surface font-medium">{t.settings.verifiedAccount || 'Verified Account'}</span>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="mt-6 w-full py-3 px-4 bg-error-container text-on-error-container font-bold rounded-full hover:brightness-95 transition-all text-sm flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined">logout</span>
                      {t.settings.logout}
                    </button>
                  </div>
                </>
              ) : (
                <div className="md:col-span-2 bg-surface-container-low p-6 rounded-xl">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-primary">account_circle</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-on-surface">{t.settings.loginTitle || 'Sign in to save your history'}</h3>
                      <p className="text-on-surface-variant text-sm mt-1">{t.settings.syncMessage}</p>
                    </div>
                    <button
                      onClick={handleLogin}
                      disabled={loginLoading}
                      className="w-full max-w-sm bg-primary text-on-primary py-3 rounded-full font-bold flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {loginLoading ? (
                        <>
                          <span className="material-symbols-outlined animate-spin">refresh</span>
                          {t.common.loading}
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined">login</span>
                          {t.settings.loginWithGoogle}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Premium Pro Card */}
          {!isPro && (
            <section>
              <div className="bg-gradient-to-br from-primary to-primary-container p-8 rounded-xl relative overflow-hidden shadow-xl">
                <div className="absolute -right-8 -top-8 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
                    <span className="text-white font-bold tracking-widest text-xs uppercase">{t.settings.premiumBadge}</span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-white leading-none">El Cobrador Pro</h2>
                  <p className="text-white/80 max-w-[240px] text-sm leading-relaxed">
                    {t.settings.premiumSubtitle}
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      setTimeout(onUpgrade, 100);
                    }}
                    className="bg-white text-primary font-bold px-8 py-3 rounded-full text-sm shadow-lg hover:scale-105 transition-transform"
                  >
                    {t.settings.upgradeNow}
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Preferences Section */}
          <section className="space-y-4">
            <h2 className="text-on-surface-variant font-bold text-sm tracking-widest uppercase px-2">{t.settings.preferences}</h2>
            <div className="bg-surface-container-low rounded-xl overflow-hidden">
              {/* Notifications */}
              <div className="p-4 flex items-center justify-between hover:bg-surface-container-high transition-colors border-b border-outline-variant/10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">notifications</span>
                  </div>
                  <div>
                    <p className="text-on-surface font-semibold">{t.settings.notifications}</p>
                    <p className="text-on-surface-variant text-xs">{t.settings.notificationsDesc}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSetting('notifications', !notificationsEnabled, setNotificationsEnabled)}
                  className={`w-12 h-6 rounded-full relative flex items-center px-1 transition-colors ${notificationsEnabled ? 'bg-primary' : 'bg-surface-container-highest'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Dark Mode */}
              <div className="p-4 flex items-center justify-between hover:bg-surface-container-high transition-colors border-b border-outline-variant/10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">dark_mode</span>
                  </div>
                  <div>
                    <p className="text-on-surface font-semibold">{t.settings.darkMode}</p>
                    <p className="text-on-surface-variant text-xs">{t.settings.darkModeDesc}</p>
                  </div>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`w-12 h-6 rounded-full relative flex items-center px-1 transition-colors ${darkMode ? 'bg-primary' : 'bg-surface-container-highest'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Animations */}
              <div className="p-4 flex items-center justify-between hover:bg-surface-container-high transition-colors border-b border-outline-variant/10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">motion_photos_on</span>
                  </div>
                  <div>
                    <p className="text-on-surface font-semibold">{t.settings.animations}</p>
                    <p className="text-on-surface-variant text-xs">{t.settings.animationsDesc}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSetting('animations', !animationsEnabled, setAnimationsEnabled)}
                  className={`w-12 h-6 rounded-full relative flex items-center px-1 transition-colors ${animationsEnabled ? 'bg-primary' : 'bg-surface-container-highest'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${animationsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Sounds */}
              <div className="p-4 flex items-center justify-between hover:bg-surface-container-high transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">volume_up</span>
                  </div>
                  <div>
                    <p className="text-on-surface font-semibold">{t.settings.sounds}</p>
                    <p className="text-on-surface-variant text-xs">{t.settings.soundsDesc}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSetting('sound', !soundEnabled, setSoundEnabled)}
                  className={`w-12 h-6 rounded-full relative flex items-center px-1 transition-colors ${soundEnabled ? 'bg-primary' : 'bg-surface-container-highest'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Language Selector */}
              <div className="p-4 flex items-center justify-between hover:bg-surface-container-high transition-colors border-t border-outline-variant/10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">language</span>
                  </div>
                  <div>
                    <p className="text-on-surface font-semibold">{t.settings.language}</p>
                    <p className="text-on-surface-variant text-xs">{t.settings.languageDesc}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLanguage('es')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      language === 'es'
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    🇲🇽 {t.settings.spanish}
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      language === 'en'
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    🇺🇸 {t.settings.english}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="space-y-4">
            <h2 className="text-on-surface-variant font-bold text-sm tracking-widest uppercase px-2">{t.settings.about}</h2>
            <div className="bg-surface-container-low rounded-xl overflow-hidden">
              <div className="p-4 flex items-center justify-between hover:bg-surface-container-high transition-colors border-b border-outline-variant/10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">info</span>
                  </div>
                  <p className="text-on-surface font-semibold">{t.settings.version}</p>
                </div>
                <span className="text-on-surface-variant text-sm font-bold">v1.0.0</span>
              </div>
              <a className="p-4 flex items-center justify-between hover:bg-surface-container-high transition-colors" href="https://consiguemelo.me" target="_blank" rel="noopener noreferrer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">language</span>
                  </div>
                  <p className="text-on-surface font-semibold">{t.settings.website}</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
              </a>
            </div>
          </section>

          {/* Footer */}
          <p className="text-center text-on-surface-variant text-[10px] mt-6 tracking-[0.2em] uppercase font-bold opacity-40">
            El Cobrador 2024
          </p>
        </div>
      </div>
    </div>
  );
}
