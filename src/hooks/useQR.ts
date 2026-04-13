import { useState, useCallback } from 'react';
import QRCode from 'qrcode';

export function useQR() {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateQR = useCallback(async (message: string, debtor: string, amount: number) => {
    setLoading(true);
    try {
      const appUrl = import.meta.env.VITE_APP_URL || 'https://consiguemelo.me';
      const encodedMessage = encodeURIComponent(message.substring(0, 100));
      const url = `${appUrl}?flip=true&from=${encodeURIComponent(debtor)}&amount=${amount}&msg=${encodedMessage}`;
      
      const dataUrl = await QRCode.toDataURL(url, {
        width: 256,
        margin: 2,
        color: {
          dark: '#6750A4',
          light: '#FFFBFE'
        }
      });
      
      setQrDataUrl(dataUrl);
      return dataUrl;
    } catch (error) {
      console.error('Error generating QR:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadQR = useCallback(() => {
    if (!qrDataUrl) return;
    
    const link = document.createElement('a');
    link.download = 'el-cobrador-qr.png';
    link.href = qrDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [qrDataUrl]);

  return { qrDataUrl, loading, generateQR, downloadQR };
}
