import type { HumorLevel } from '../types';
import { useTranslation } from '../i18n';

interface Props {
  level: HumorLevel;
  onChange: (level: HumorLevel) => void;
  onContinue: () => void;
}

export function HumorLevelSelector({ level, onChange, onContinue }: Props) {
  const { t } = useTranslation();
  const levels: HumorLevel[] = ['light', 'balanced', 'spicy'];
  const blobClasses = ['blob-1', 'blob-2', 'blob-3'];

  const getLevelColors = (l: HumorLevel, isSelected: boolean) => {
    if (!isSelected) return 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high';
    
    switch (l) {
      case 'light':
        return 'bg-tertiary-container/30 text-tertiary scale-105 shadow-lg';
      case 'balanced':
        return 'bg-primary text-on-primary scale-105 shadow-lg shadow-primary/20';
      case 'spicy':
        return 'bg-error/80 text-on-error scale-105 shadow-lg shadow-error/20';
      default:
        return 'bg-primary text-on-primary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {levels.map((l, index) => {
          const levelData = t.humor.levels[l];
          const isSelected = level === l;
          const emoji = l === 'light' ? '😇' : l === 'balanced' ? '😏' : '😈';
          
          return (
            <button
              key={l}
              onClick={() => onChange(l)}
              className={`${blobClasses[index]} p-6 flex items-center gap-4 transition-all duration-300 text-left ${getLevelColors(l, isSelected)}`}
            >
              <span className="text-4xl">{emoji}</span>
              <div className="flex-1">
                <h3 className="font-headline font-bold text-xl tracking-tight leading-none mb-1">
                  {levelData.name.toUpperCase()}
                </h3>
                <p className={`text-sm ${isSelected ? 'opacity-90' : 'text-on-surface-variant'}`}>
                  {levelData.desc}
                </p>
              </div>
              {isSelected && (
                <span className="material-symbols-outlined text-2xl">check_circle</span>
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={onContinue}
        className="w-full py-5 wavy-button bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-black text-xl uppercase tracking-wider shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-200"
      >
        {t.common.continue}
      </button>
    </div>
  );
}
