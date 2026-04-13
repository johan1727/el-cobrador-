import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../i18n';

interface Props {
  initialText: string;
  onSave: (newText: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EditMessageInline({ initialText, onSave, onCancel, isLoading }: Props) {
  const { t, language } = useTranslation();
  const [text, setText] = useState(initialText);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxLength = 500;

  // Auto-focus and resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(text.length, text.length);
    }
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [text]);

  const handleSave = () => {
    if (text.trim() && text !== initialText) {
      onSave(text.trim());
    } else {
      onCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSave();
    }
  };

  const isDirty = text !== initialText;
  const charCount = text.length;
  const isNearLimit = charCount > maxLength * 0.8;
  const isOverLimit = charCount > maxLength;

  return (
    <div className="w-full animate-in fade-in slide-in-from-top-1 duration-200">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.history.editPlaceholder || 'Escribe tu mensaje...'}
          disabled={isLoading}
          className={`w-full bg-surface-container-high rounded-xl p-4 text-on-surface placeholder:text-on-surface-variant/50 resize-none border-2 transition-all ${
            isOverLimit
              ? 'border-error focus:border-error'
              : isNearLimit
              ? 'border-tertiary focus:border-tertiary'
              : 'border-outline-variant/30 focus:border-primary'
          } focus:outline-none min-h-[80px] max-h-[200px] font-medium leading-relaxed`}
          rows={3}
        />
        
        {/* Character counter */}
        <div className={`absolute bottom-2 right-2 text-xs font-semibold ${
          isOverLimit ? 'text-error' : isNearLimit ? 'text-tertiary' : 'text-on-surface-variant/50'
        }`}>
          {charCount}/{maxLength}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={handleSave}
          disabled={isLoading || isOverLimit || !text.trim()}
          className={`flex-1 py-2.5 px-4 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            isDirty && !isOverLimit && text.trim()
              ? 'bg-primary text-on-primary hover:opacity-90 active:scale-95'
              : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <>
              <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
              {language === 'es' ? 'Guardando...' : 'Saving...'}
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-sm">check</span>
              {t.common.save}
            </>
          )}
        </button>
        
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 py-2.5 px-4 rounded-full bg-surface-container-high text-on-surface-variant font-bold text-sm hover:bg-surface-container transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">close</span>
          {t.common.cancel}
        </button>
      </div>

      {/* Keyboard shortcuts hint */}
      <p className="text-[10px] text-on-surface-variant/60 mt-2 text-center">
        {language === 'es' 
          ? 'Ctrl+Enter para guardar • Esc para cancelar'
          : 'Ctrl+Enter to save • Esc to cancel'
        }
      </p>
    </div>
  );
}
