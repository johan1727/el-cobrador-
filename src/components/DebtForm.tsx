import { useState } from 'react';
import type { Debt } from '../types';
import { useTranslation } from '../i18n';

interface DebtFormProps {
  debt: Debt;
  onChange: (debt: Debt) => void;
  onContinue: () => void;
}

const SUGGESTIONS = [
  { key: 'pizza', icon: '🍕' },
  { key: 'beers', icon: '🍻' },
  { key: 'uber', icon: '🚕' },
  { key: 'food', icon: '🍔' },
  { key: 'cinema', icon: '🎬' },
  { key: 'shopping', icon: '🛒' }
] as const;

export function DebtForm({ debt, onChange, onContinue }: DebtFormProps) {
  const { t } = useTranslation();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const isValid = debt.debtor && debt.amount > 0;

  const handleSuggestionClick = (suggestion: string) => {
    onChange({ ...debt, reason: suggestion });
  };

  return (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); if (isValid) onContinue(); }}>
      {/* Hero Section & Capybara */}
      <section className="flex flex-col items-center text-center mb-8">
        <div className="relative mb-4">
          {/* Floating Tag */}
          <div className="absolute -top-2 -right-4 bg-tertiary-container text-on-tertiary-container px-3 py-1.5 rounded-xl text-[10px] font-bold rotate-12 shadow-lg border-2 border-surface z-10">
            {t.form.tagline}
          </div>
          {/* Capybara Avatar */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center p-3 shadow-lg">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=capybara-cool&backgroundColor=eaddff&accessories=sunglasses"
              alt="Capybara Cool"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-on-surface mb-1">{t.form.title}</h2>
        <p className="text-on-surface-variant font-medium text-sm">{t.form.subtitle}</p>
      </section>

      {/* Concepto Card */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-[0_20px_40px_rgba(101,47,231,0.08)] border border-outline-variant/10">
        <label className="block text-on-surface-variant text-sm font-bold mb-3 px-1">{t.form.concept}</label>
        <div className="flex items-center gap-3 bg-surface-container rounded-xl p-3 focus-within:bg-white focus-within:ring-2 ring-primary/20 transition-all">
          <div className="bg-primary/10 p-2 rounded-lg">
            <span className="material-symbols-outlined text-primary">shopping_bag</span>
          </div>
          <input
            type="text"
            value={debt.reason}
            onChange={(e) => onChange({ ...debt, reason: e.target.value })}
            placeholder={t.form.conceptPlaceholder}
            className="bg-transparent border-none focus:ring-0 w-full font-semibold text-on-surface placeholder:text-on-surface-variant/50 text-sm"
          />
        </div>

        {/* Smart Suggestions */}
        <div className="flex flex-wrap gap-2 mt-4">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => handleSuggestionClick(t.form.suggestions[s.key])}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                debt.reason === t.form.suggestions[s.key]
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container'
              }`}
            >
              {s.icon} {t.form.suggestions[s.key].split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Layout for Who & How Much */}
      <div className="grid grid-cols-2 gap-4">
        {/* Who Section */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-[0_20px_40px_rgba(101,47,231,0.08)] border border-outline-variant/10">
          <label className="block text-on-surface-variant text-sm font-bold mb-3 px-1">{t.form.who}</label>
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-primary overflow-hidden">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 bg-tertiary-container w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                <span className="material-symbols-outlined text-[10px] font-bold">add</span>
              </div>
            </div>
            <input
              type="text"
              value={debt.debtor}
              onChange={(e) => onChange({ ...debt, debtor: e.target.value })}
              placeholder={t.form.whoPlaceholder}
              className="bg-transparent border-none focus:ring-0 w-full font-bold text-on-surface placeholder:text-on-surface-variant/50 text-sm min-w-0"
            />
          </div>
        </div>

        {/* Amount Section */}
        <div className="bg-primary p-5 rounded-2xl shadow-[0_20px_40px_rgba(101,47,231,0.15)]">
          <label className="block text-on-primary/70 text-sm font-bold mb-3 px-1">{t.form.amount}</label>
          <div className="flex items-center gap-1">
            <span className="text-on-primary text-2xl font-black">$</span>
            <input
              type="number"
              value={debt.amount || ''}
              onChange={(e) => onChange({ ...debt, amount: Number(e.target.value) })}
              placeholder={t.form.amountPlaceholder}
              className="bg-transparent border-none focus:ring-0 w-full font-black text-2xl text-on-primary placeholder:text-on-primary/40 min-w-0"
            />
          </div>
        </div>
      </div>

      {/* Currency Selector */}
      <div className="flex gap-2">
        {(['MXN', 'USD'] as const).map((curr) => (
          <button
            key={curr}
            type="button"
            onClick={() => onChange({ ...debt, currency: curr })}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
              debt.currency === curr
                ? 'bg-primary text-on-primary shadow-md'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {curr === 'MXN' && '🇲🇽 '}
            {curr === 'USD' && '🇺🇸 '}
            {curr}
          </button>
        ))}
      </div>

      {/* Advanced Options Toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full flex items-center justify-center gap-2 text-on-surface-variant font-bold text-sm py-2 hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined text-sm">{showAdvanced ? 'expand_less' : 'tune'}</span>
        {showAdvanced ? t.form.hideAdvanced : t.form.advancedOptions}
      </button>

      {/* Expanded Advanced Options */}
      {showAdvanced && (
        <div className="bg-surface-container-low rounded-xl p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div>
            <label className="block text-on-surface-variant text-xs font-bold mb-2 uppercase tracking-wider">{t.form.dueDate}</label>
            <input
              type="date"
              className="w-full bg-surface-container rounded-lg py-2 px-3 text-sm font-semibold text-on-surface border-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-on-surface-variant text-xs font-bold mb-2 uppercase tracking-wider">{t.form.additionalNotes}</label>
            <textarea
              placeholder={t.form.notesPlaceholder}
              rows={2}
              className="w-full bg-surface-container rounded-lg py-2 px-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 border-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>
        </div>
      )}

      {/* Submit Button - FAB Style */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={!isValid}
          className={`w-full py-4 rounded-full font-black text-lg tracking-tight shadow-xl transition-all duration-200 flex items-center justify-center gap-2 ${
            isValid
              ? 'bg-gradient-to-r from-primary to-primary-container text-white shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-95'
              : 'bg-surface-container text-on-surface-variant cursor-not-allowed'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            {isValid ? 'check_circle' : 'info'}
          </span>
          {isValid ? t.form.generateMessage : t.form.fillData}
        </button>
      </div>
    </form>
  );
}

