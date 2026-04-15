import { useEffect } from 'react';
import { useTranslation } from '../i18n';

interface Props {
  open: boolean;
  onClose: () => void;
  timeUntilReset?: { hours: number; minutes: number };
  progressPercentage?: number;
  dailyLimit?: number;
}

export function PaywallModal({ 
  open, 
  onClose, 
  timeUntilReset,
  progressPercentage = 100,
  dailyLimit = 10
}: Props) {
  const { t, language } = useTranslation();
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-on-surface/20 backdrop-blur-md" onClick={onClose} />

      {/* Upgrade Pro Modal - Stitch Style */}
      <div className="relative z-50 w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Hero Visual Section */}
        <div className="relative h-48 bg-gradient-to-br from-primary via-primary-container to-secondary overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&q=80')] bg-cover bg-center opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <div className="absolute bottom-6 left-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/30 border border-white/20 mb-3">
              <span className="material-symbols-outlined text-[18px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
              <span className="text-[12px] font-bold text-white tracking-wider">{t.paywall.badge}</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-none">{t.paywall.title}</h2>
          
          {/* Progress indicator */}
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-white text-sm font-bold">{dailyLimit}/{dailyLimit}</span>
          </div>
          </div>
        </div>

        <div className="p-8">
          <p className="text-on-surface-variant text-lg font-medium leading-relaxed mb-4">
            {t.paywall.subtitle}
          </p>
          
          {/* Countdown */}
          {timeUntilReset && (
            <div className="mb-8 p-4 bg-surface-container-low rounded-xl border border-outline-variant/20">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">schedule</span>
                <div>
                  <p className="text-sm text-on-surface-variant">{t.paywall.newMessagesIn}</p>
                  <p className="text-xl font-bold text-primary">
                    {timeUntilReset.hours}h {timeUntilReset.minutes}m
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Benefits List (Bento-ish Layout) */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            <div className="flex items-center gap-5 p-4 rounded-lg bg-surface-container-low transition-all hover:bg-surface-container">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">all_inclusive</span>
              </div>
              <div>
                <h4 className="font-bold text-on-surface">{t.paywall.features.unlimited.title}</h4>
                <p className="text-sm text-on-surface-variant">{t.paywall.features.unlimited.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-5 p-4 rounded-lg bg-surface-container-low transition-all hover:bg-surface-container">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined">history</span>
              </div>
              <div>
                <h4 className="font-bold text-on-surface">{t.paywall.features.history.title}</h4>
                <p className="text-sm text-on-surface-variant">{t.paywall.features.history.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-5 p-4 rounded-lg bg-surface-container-low transition-all hover:bg-surface-container">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-tertiary-fixed-dim flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined">qr_code_2</span>
              </div>
              <div>
                <h4 className="font-bold text-on-surface">{t.paywall.features.qr.title}</h4>
                <p className="text-sm text-on-surface-variant">{t.paywall.features.qr.desc}</p>
              </div>
            </div>
          </div>

          {/* Pricing & Action */}
          <div className="flex flex-col items-center gap-6 pt-2 border-t border-outline-variant/10">
            <div className="text-center">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-extrabold text-primary">$3.99</span>
                <span className="text-on-surface-variant font-medium">{t.paywall.period}</span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1 font-semibold tracking-wide uppercase">{t.paywall.cancelAnytime}</p>
            </div>
            <button
              onClick={() => {
                alert(t.paywall.comingSoon);
              }}
              className="w-full py-5 rounded-full bg-gradient-to-r from-primary to-primary-container text-white text-lg font-extrabold shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              {t.paywall.cta}
              <span className="material-symbols-outlined">rocket_launch</span>
            </button>
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={onClose}
                className="text-on-surface-variant text-sm font-bold hover:text-primary transition-colors"
              >
                {t.paywall.keepFree}
              </button>
              <p className="text-xs text-on-surface-variant/60">
                {t.paywall.resetAtMidnight}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
