import { useState } from 'react';
import type { DebtReminder } from '../hooks/useAutoReminders';
import { useTranslation } from '../i18n';

interface Props {
  reminder: DebtReminder;
  onMarkPaid: () => void;
  onMarkForgiven: () => void;
  onSnooze: (days: number) => void;
}

export function DebtReminderCard({ reminder, onMarkPaid, onMarkForgiven, onSnooze }: Props) {
  const { t, language } = useTranslation();
  const [showOptions, setShowOptions] = useState(false);

  // Determinar etapa del recordatorio
  const getStage = () => {
    const days = reminder.daysElapsed;
    if (days >= 14) return { stage: 14, emoji: '⚠️', color: 'error', title: t.reminders?.day14Title || 'Último aviso' };
    if (days >= 7) return { stage: 7, emoji: '📅', color: 'tertiary', title: t.reminders?.day7Title || 'Recordatorio' };
    return { stage: 3, emoji: '🤔', color: 'secondary', title: t.reminders?.day3Title || 'Primer seguimiento' };
  };

  const { stage, emoji, color, title } = getStage();

  const colorClasses = {
    secondary: 'bg-secondary-container text-on-secondary-container border-secondary',
    tertiary: 'bg-tertiary-container text-on-tertiary-container border-tertiary',
    error: 'bg-error-container text-on-error-container border-error'
  };

  const gradientClasses = {
    secondary: 'from-secondary-container to-secondary-container/50',
    tertiary: 'from-tertiary-container to-tertiary-container/50',
    error: 'from-error-container to-error-container/50'
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border-l-4 p-5 transition-all hover:shadow-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClasses[color as keyof typeof gradientClasses]} opacity-50`} />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{emoji}</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-70">
              {title} • {language === 'es' ? `Hace ${reminder.daysElapsed} días` : `${reminder.daysElapsed} days ago`}
            </p>
            <h4 className="font-headline font-bold text-lg text-on-surface">
              {reminder.debtor_name} • ${reminder.amount.toLocaleString()} {reminder.currency}
            </h4>
          </div>
        </div>

        {/* Question */}
        <p className="text-on-surface-variant font-medium mb-4 text-sm">
          {language === 'es' 
            ? `¿${reminder.debtor_name} ya te pagó los $${reminder.amount}?`
            : `Has ${reminder.debtor_name} paid you $${reminder.amount}?`
          }
        </p>

        {/* Actions */}
        {!showOptions ? (
          <div className="flex gap-2">
            <button
              onClick={onMarkPaid}
              className="flex-1 py-2.5 px-4 rounded-full bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">check_circle</span>
              {t.reminders?.yesPaid || 'Sí, pagó'}
            </button>
            <button
              onClick={() => setShowOptions(true)}
              className="flex-1 py-2.5 px-4 rounded-full bg-surface-container-high text-on-surface font-bold text-sm hover:bg-surface-container transition-all active:scale-95"
            >
              {t.reminders?.notYet || 'Todavía no'}
            </button>
          </div>
        ) : (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
            <p className="text-xs text-on-surface-variant font-medium text-center">
              {language === 'es' ? '¿Qué quieres hacer?' : 'What do you want to do?'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => onSnooze(3)}
                className="flex-1 py-2 px-3 rounded-full bg-surface-container-high text-on-surface-variant font-semibold text-xs hover:bg-surface-container transition-all"
              >
                +3 {language === 'es' ? 'días' : 'days'}
              </button>
              <button
                onClick={() => onSnooze(7)}
                className="flex-1 py-2 px-3 rounded-full bg-surface-container-high text-on-surface-variant font-semibold text-xs hover:bg-surface-container transition-all"
              >
                +7 {language === 'es' ? 'días' : 'days'}
              </button>
            </div>
            <button
              onClick={onMarkForgiven}
              className="w-full py-2 px-4 rounded-full text-on-surface-variant font-medium text-xs hover:text-error transition-all"
            >
              {t.reminders?.markForgiven || 'Perdonar deuda'}
            </button>
            <button
              onClick={() => setShowOptions(false)}
              className="w-full text-center text-xs text-on-surface-variant/50 hover:text-on-surface-variant"
            >
              {t.common?.cancel || 'Cancelar'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
