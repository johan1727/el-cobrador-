import { useEffect } from 'react';
import { useState } from 'react';
import { useTranslation } from '../i18n';

interface Props {
  open: boolean;
  onClose: () => void;
  isPro: boolean;
}

export function PricingView({ open, onClose, isPro }: Props) {
  const { t, language } = useTranslation();
  const [isAnnual, setIsAnnual] = useState(false);

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

  const plans = [
    {
      key: 'basic' as const,
      icon: 'child_care',
      highlighted: false
    },
    {
      key: 'vip' as const,
      icon: 'rocket_launch',
      highlighted: true
    },
    {
      key: 'pro' as const,
      icon: 'diamond',
      highlighted: false
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-surface overflow-y-auto">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md flex justify-between items-center px-6 h-16 border-b border-outline-variant/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 overflow-hidden rounded-full bg-primary-container border-2 border-primary">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=capybara&backgroundColor=eaddff"
              alt="Capybara Mascot"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="font-headline font-black tracking-tight text-2xl text-primary">{t.common.appName}</h1>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-primary">close</span>
        </button>
      </header>

      <main className="pt-24 px-6 pb-32 max-w-5xl mx-auto">
        {/* Hero Section */}
        <section className="text-center py-12">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-bold text-sm mb-6">
            <span className="material-symbols-outlined text-sm mr-2" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            {t.pricing.hero.badge}
          </span>
          <h2 className="font-headline font-extrabold text-4xl md:text-5xl tracking-tight text-on-surface mb-6 leading-tight">
            {t.pricing.hero.title}
          </h2>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto font-medium">
            {t.pricing.hero.subtitle}
          </p>
        </section>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 p-1 bg-surface-container-high rounded-full">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
                !isAnnual
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {language === 'es' ? 'Mensual' : 'Monthly'}
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${
                isAnnual
                  ? 'bg-tertiary text-on-tertiary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {language === 'es' ? 'Anual' : 'Annual'}
              <span className="text-xs bg-tertiary-container text-on-tertiary-container px-2 py-0.5 rounded-full">
                -16%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {plans.map((plan) => {
            const planData = t.pricing.plans[plan.key];
            const isCurrentPlan = (plan.key === 'basic' && !isPro) || (plan.key === 'vip' && isPro);
            
            return (
              <div
                key={plan.key}
                className={`relative p-8 rounded-2xl flex flex-col transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-surface-container-lowest shadow-[0_20px_50px_rgba(101,47,231,0.12)] border-2 border-primary scale-105 z-10'
                    : 'bg-surface-container border-2 border-transparent hover:border-primary-container'
                }`}
              >
                {plan.highlighted && 'popular' in planData && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                    {planData.popular}
                  </div>
                )}
                
                <div className="mb-8">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                    plan.highlighted ? 'bg-primary-container' : 'bg-surface-container-highest'
                  }`}>
                    <span 
                      className={`material-symbols-outlined text-3xl ${plan.highlighted ? 'text-on-primary-container' : 'text-primary'}`} 
                      style={{ fontVariationSettings: plan.highlighted ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {plan.icon}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold font-headline text-on-surface mb-2">{planData.name}</h3>
                  <p className="text-on-surface-variant font-medium">{planData.description}</p>
                </div>

                <div className="mb-8">
                  <span className="text-4xl font-extrabold text-on-surface">
                    {isAnnual && plan.key !== 'basic'
                      ? (plan.key === 'vip' ? '$499' : '$999')
                      : planData.price}
                  </span>
                  <span className="text-on-surface-variant font-semibold">
                    {isAnnual && plan.key !== 'basic'
                      ? (language === 'es' ? '/año' : '/year')
                      : (language === 'es' ? '/mes' : '/month')}
                  </span>
                  {isAnnual && plan.key !== 'basic' && (
                    <p className="text-xs text-tertiary font-medium mt-1">
                      {language === 'es' ? '¡Ahorra 2 meses!' : 'Save 2 months!'}
                    </p>
                  )}
                  {!isAnnual && plan.key !== 'basic' && (
                    <p className="text-xs text-on-surface-variant/60 font-medium mt-1">
                      {language === 'es' ? 'o $' + (plan.key === 'vip' ? '499' : '999') + '/año (-16%)' : 'or $' + (plan.key === 'vip' ? '499' : '999') + '/year (-16%)'}
                    </p>
                  )}
                </div>

                <ul className="space-y-4 mb-12 flex-grow">
                  {planData.features.map((feature, i) => (
                    <li key={i} className={`flex items-center gap-3 ${plan.highlighted ? 'font-semibold' : 'font-medium'} text-on-surface`}>
                      <span 
                        className="material-symbols-outlined text-primary text-xl" 
                        style={{ fontVariationSettings: plan.highlighted ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        check_circle
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  disabled={isCurrentPlan}
                  onClick={() => {
                    if (!isCurrentPlan && plan.key === 'vip') {
                      alert(language === 'es' ? '¡Próximamente! Integración con pasarela de pagos.' : 'Coming soon! Payment gateway integration.');
                    }
                  }}
                  className={`w-full py-4 rounded-full font-bold transition-all active:scale-95 ${
                    plan.highlighted
                      ? 'bg-tertiary text-on-tertiary shadow-lg hover:scale-105'
                      : isCurrentPlan
                      ? 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed'
                      : 'bg-primary text-on-primary hover:shadow-xl'
                  }`}
                >
                  {isCurrentPlan ? planData.ctaCurrent : planData.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* Trust Section */}
        <section className="mt-20 p-10 rounded-xl bg-surface-container-high text-center">
          <h4 className="text-xl font-bold font-headline text-on-surface mb-8">{t.pricing.trust.title}</h4>
          <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-3xl text-primary">verified_user</span>
              <span className="font-bold">{t.pricing.trust.security}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-3xl text-primary">lock</span>
              <span className="font-bold">{t.pricing.trust.privacy}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-3xl text-primary">sentiment_very_satisfied</span>
              <span className="font-bold">{t.pricing.trust.success}</span>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-16 mb-20">
          <h2 className="text-3xl font-extrabold font-headline text-center mb-10 text-on-surface">{t.pricing.faq.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg bg-surface-container-low border-l-4 border-primary">
              <p className="font-bold text-on-surface mb-2 text-lg">{t.pricing.faq.q1.question}</p>
              <p className="text-on-surface-variant">{t.pricing.faq.q1.answer}</p>
            </div>
            <div className="p-6 rounded-lg bg-surface-container-low border-l-4 border-primary">
              <p className="font-bold text-on-surface mb-2 text-lg">{t.pricing.faq.q2.question}</p>
              <p className="text-on-surface-variant">{t.pricing.faq.q2.answer}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
