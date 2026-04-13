import { useState } from 'react';
import type { GeneratedMessage, Debt, Tone, HumorLevel } from '../types';
import { useQR } from '../hooks/useQR';

interface Props {
  message: GeneratedMessage;
  debt: Debt;
  selectedTone: Tone | null;
  level: HumorLevel;
  onFlip: () => void;
  onRestart: () => void;
  onCopy?: () => void;
  onShare?: () => void;
}

export function MessagePreview({ message, debt, selectedTone, level, onFlip, onRestart, onCopy, onShare }: Props) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const { qrDataUrl, loading: qrLoading, generateQR, downloadQR } = useQR();

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(message.text + '\n\n💸 Generado con ElCobrador.app');
    window.open(`https://wa.me/?text=${text}`, '_blank');
    onShare?.();
  };

  const handleGenerateQR = async () => {
    if (!qrDataUrl) {
      await generateQR(message.text, debt.debtor, debt.amount);
    }
    setShowQR(!showQR);
  };

  const levelEmoji = level === 'light' ? '😇' : level === 'balanced' ? '😏' : '😈';

  return (
    <div className="space-y-6">
      {/* Message Card */}
      <div className="relative mb-8">
        <div className="blob-shape bg-surface-container-lowest p-8 relative overflow-hidden ring-[3px] ring-primary/10">
          {/* Watermark */}
          <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none rotate-12 scale-150">
            <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <span className="font-headline font-bold text-xs uppercase tracking-widest text-primary">Vista Previa</span>
            <span className="bg-tertiary-container/10 text-tertiary-container px-3 py-1 rounded-full text-[10px] font-bold">URGENTE</span>
          </div>

          {/* Main Message Body */}
          <div className="space-y-4">
            <h2 className="font-headline font-extrabold text-3xl tracking-tighter text-on-surface leading-none">
              ¡HOLA, <span className="text-primary italic">{debt.debtor.toUpperCase()}!</span>
            </h2>
            <p className="text-lg leading-relaxed text-on-surface-variant whitespace-pre-wrap">
              {message.text}
            </p>
            <div className="p-4 bg-surface-container-high rounded-2xl border-l-4 border-primary">
              <p className="font-body italic text-sm text-on-surface-variant">
                Te recordamos que tu balance de <span className="font-bold text-on-surface">${debt.amount.toLocaleString()}</span> está esperando ser liberado.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tone & Level Chips */}
      <div className="flex gap-2 flex-wrap">
        <span className="bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
          {selectedTone?.name || message.tone}
        </span>
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
          {levelEmoji} {level.toUpperCase()}
        </span>
      </div>

      {/* Actions Grid 2x2 */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleCopy}
          className="blob-button bg-primary text-white p-6 flex flex-col items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 duration-200 shadow-xl shadow-primary/10"
        >
          <span className="material-symbols-outlined text-2xl">{copied ? 'check_circle' : 'content_copy'}</span>
          <span className="font-headline font-bold text-xs uppercase tracking-tight">{copied ? '¡Copiado!' : 'Copiar'}</span>
        </button>

        <button
          onClick={handleShareWhatsApp}
          className="blob-button bg-[#25D366] text-white p-6 flex flex-col items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 duration-200 shadow-xl shadow-green-500/20"
        >
          <span className="material-symbols-outlined text-2xl">chat</span>
          <span className="font-headline font-bold text-xs uppercase tracking-tight">WhatsApp</span>
        </button>

        <button
          onClick={handleGenerateQR}
          disabled={qrLoading}
          className="blob-button bg-tertiary text-white p-6 flex flex-col items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 duration-200 shadow-xl shadow-tertiary/10 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-2xl">qr_code_2</span>
          <span className="font-headline font-bold text-xs uppercase tracking-tight">{qrLoading ? 'Generando...' : 'QR'}</span>
        </button>

        <button
          onClick={onFlip}
          className="blob-button bg-surface-container-highest text-on-surface p-6 flex flex-col items-center justify-center gap-2 hover:bg-surface-container-high transition-all active:scale-95 duration-200"
        >
          <span className="material-symbols-outlined text-2xl">flip</span>
          <span className="font-headline font-bold text-xs uppercase tracking-tight">Flip</span>
        </button>
      </div>

      {/* Collapsible QR Section */}
      {showQR && (
        <div className="blob-shape bg-surface-container p-6 flex flex-col items-center text-center animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="w-full flex justify-between items-center mb-4 px-2">
            <span className="font-headline font-bold text-sm uppercase text-on-surface-variant">Código QR de Pago</span>
            <button onClick={() => setShowQR(false)} className="text-on-surface-variant hover:text-primary">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          {qrDataUrl && (
            <>
              <div className="bg-white p-4 rounded-[32px] shadow-sm mb-4">
                <img src={qrDataUrl} alt="QR Code" className="w-48 h-48 opacity-90" />
              </div>
              <button
                onClick={downloadQR}
                className="flex items-center gap-2 px-6 py-2 rounded-full border-2 border-primary text-primary font-bold text-sm hover:bg-primary hover:text-on-primary transition-all"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                DESCARGAR
              </button>
            </>
          )}
        </div>
      )}

      {/* Viral Footer */}
      <footer className="flex flex-col items-center justify-center py-8 opacity-60">
        <p className="font-headline text-xl text-primary mb-1">
          💸 Generado con ElCobrador.app
        </p>
        <div className="flex gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/30"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary/30"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary/30"></span>
        </div>
      </footer>

      {/* Restart Button */}
      <button
        onClick={onRestart}
        className="w-full py-4 rounded-xl text-primary font-bold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined">refresh</span>
        Crear nuevo cobro
      </button>
    </div>
  );
}
