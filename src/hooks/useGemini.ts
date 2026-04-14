import { useState, useCallback } from 'react';
import type { Debt, Tone, HumorLevel, GeneratedMessage } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Fallback messages when API fails
const fallbackMessagesES: Record<string, Record<string, string[]>> = {
  'Corporativo': {
    'light': [
      'Estimado {deudor}, le recordamos amablemente que tiene un saldo pendiente de {amount}. Quedamos atentos a su pronto pago. 📋',
      'Hola {deudor}, el departamento de finanzas solicita la regularización del monto de {amount}. ¡Gracias por su comprensión! 🤝'
    ],
    'balanced': [
      'Estimado {deudor}, según nuestros registros, usted debe {amount}. Recomendamos liquidar para evitar "procedimientos disciplinarios" 😏',
      'Hola {deudor}, le informamos que su cuenta tiene un saldo de {amount}. El capibara de cobranza ha sido notificado 🦫'
    ],
    'spicy': [
      'Atención {deudor}: Su deuda de {amount} ha sido escalada a Recursos Humanos. Prepare su renuncia... a la deuda 💼😈',
      'URGENTE {deudor}: Su saldo de {amount} está generando intereses... emocionales. Pague antes de que el CEO se entere 🔥'
    ]
  },
  'Mafioso': {
    'light': [
      'Eh {deudor}, tengo una "oferta" que no puedes rechazar... pagarme los {amount} amigablemente 😉',
      'Hola {deudor}, la "familia" te recuerda que debes {amount}. Sería una lástima que pasara algo... como yo quedarme sin dinero 💰'
    ],
    'balanced': [
      'Escucha {deudor}, Don Capybara quiere su {amount}. Es un jefe justo... pero exigente 🦫🔪',
      'Eh {deudor}, te estás ganando un lugar en la lista negra por no pagar {amount}. Y no hablo de Spotify 🎵🚫'
    ],
    'spicy': [
      'Amigo {deudor}, Don Vito no duerme hasta cobrar {amount}. Y tú no quieres verlo desvelado... 😴🔪',
      'Oye {deudor}, debes {amount} y eso es un problema. Para ti. Para tu salud. Para tu perro 🐕‍🦺'
    ]
  },
  'default': {
    'light': [
      'Hola {deudor}! 👋 Solo pasaba a recordarte amigablemente que me debes {amount}. No rush, pero sí rush 😄',
      'Hey {deudor}! 🌟 Tu deuda de {amount} me está dando ansiedad existencial. ¿Me ayudas a dormir tranquilo? 🥺'
    ],
    'balanced': [
      'Veo veo {deudor}... con mi ojito veo {amount} que me debes y que no me has pagado 👀💸',
      'Hola {deudor}! 👋 Tu deuda de {amount} está más fría que mi ex. ¿La calentamos con un pago? 🥶➡️🔥'
    ],
    'spicy': [
      'Oye {deudor}, {amount} no se pagan solos... a menos que seas mi sugar, que no lo eres 😤💅',
      '{deudor}, debes {amount} y tu dignidad está en números rojos 📉 La bóveda de amistad necesita recarga 🏦😈'
    ]
  }
};

const fallbackMessagesEN: Record<string, Record<string, string[]>> = {
  'Corporate': {
    'light': [
      'Dear {debtor}, we kindly remind you that you have an outstanding balance of {amount}. We look forward to your prompt payment. 📋',
      'Hi {debtor}, the finance department requests the regularization of the amount of {amount}. Thank you for your understanding! 🤝'
    ],
    'balanced': [
      'Dear {debtor}, according to our records, you owe {amount}. We recommend settling to avoid "disciplinary procedures" 😏',
      'Hello {debtor}, we inform you that your account has a balance of {amount}. The capybara collections team has been notified 🦫'
    ],
    'spicy': [
      'Attention {debtor}: Your debt of {amount} has been escalated to HR. Prepare your resignation... from debt 💼😈',
      'URGENT {debtor}: Your balance of {amount} is generating... emotional interest. Pay before the CEO finds out 🔥'
    ]
  },
  'Mob Boss': {
    'light': [
      'Hey {debtor}, I have an "offer" you cannot refuse... paying me {amount} nicely 😉',
      'Hi {debtor}, the "family" reminds you that you owe {amount}. It would be a shame if something happened... like me running out of money 💰'
    ],
    'balanced': [
      'Listen {debtor}, Don Capybara wants his {amount}. He is a fair boss... but demanding 🦫🔪',
      'Hey {debtor}, you are earning a spot on the blacklist for not paying {amount}. And I am not talking about Spotify 🎵🚫'
    ],
    'spicy': [
      'Friend {debtor}, Don Vito does not sleep until he collects {amount}. And you do not want to see him sleep deprived... 😴🔪',
      'Hey {debtor}, you owe {amount} and that is a problem. For you. For your health. For your dog 🐕‍🦺'
    ]
  },
  'default': {
    'light': [
      'Hi {debtor}! 👋 Just passing by to kindly remind you that you owe me {amount}. No rush, but yes rush 😄',
      'Hey {debtor}! 🌟 Your debt of {amount} is giving me existential anxiety. Can you help me sleep peacefully? 🥺'
    ],
    'balanced': [
      'I spy {debtor}... with my little eye I see {amount} that you owe me and have not paid 👀💸',
      'Hello {debtor}! 👋 Your debt of {amount} is colder than my ex. Shall we warm it up with a payment? 🥶➡️🔥'
    ],
    'spicy': [
      'Hey {debtor}, {amount} does not pay itself... unless you are my sugar, which you are not 😤💅',
      '{debtor}, you owe {amount} and your dignity is in the red 📉 The friendship vault needs a recharge 🏦😈'
    ]
  }
};

export function useGemini() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMessage = useCallback(async (
    debt: Debt,
    tone: Tone,
    level: HumorLevel,
    userId?: string,
    language: 'es' | 'en' = 'es'
  ): Promise<GeneratedMessage | null> => {
    setLoading(true);
    setError(null);

    try {
      // Check if API key exists
      if (!API_KEY) {
        console.warn('⚠️ No API key found, using fallback message');
        return generateFallbackMessage(debt, tone, level, language);
      }

      const prompt = buildPrompt(debt, tone, level);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
      
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 200,
          }
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || '';
        
        // Check for quota exceeded
        if (errorMessage.includes('quota') || errorMessage.includes('429')) {
          console.warn('API quota exceeded, using fallback message');
          return generateFallbackMessage(debt, tone, level);
        }
        
        throw new Error(getFriendlyErrorMessage(errorMessage));
      }

      const data = await response.json();
      
      // Check for blocked content
      if (data.candidates?.[0]?.finishReason === 'SAFETY') {
        console.warn('Content blocked by safety filters, using fallback');
        return generateFallbackMessage(debt, tone, level);
      }
      
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!text) {
        throw new Error('La IA no generó mensaje. Intenta de nuevo.');
      }

      // Save to history
      console.log('📝 Intentando guardar mensaje API exitosa:', text.substring(0, 50) + '...');
      await saveToHistory(debt, tone, level, text, userId);
      console.log('✅ Mensaje API guardado en historial');

      return {
        text,
        tone: tone.name,
        level,
        timestamp: Date.now()
      };
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError(language === 'es' ? 'La IA tardó mucho en responder. Intenta de nuevo.' : 'AI took too long to respond. Try again.');
        const fallback = generateFallbackMessage(debt, tone, level, language);
        await saveToHistory(debt, tone, level, fallback.text, userId);
        return fallback;
      }
      
      // Check for API key errors
      const errorMessage = err instanceof Error ? err.message : '';
      if (errorMessage.includes('API key') || errorMessage.includes('not valid')) {
        console.log('🔑 API Key inválida, usando fallback...');
        const fallback = generateFallbackMessage(debt, tone, level, language);
        await saveToHistory(debt, tone, level, fallback.text, userId);
        return fallback;
      }
      
      const friendlyError = err instanceof Error ? err.message : 'Error desconocido';
      setError(friendlyError);
      
      // Return fallback instead of null
      const fallback = generateFallbackMessage(debt, tone, level, language);
      await saveToHistory(debt, tone, level, fallback.text, userId);
      return fallback;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateFallbackMessage = (debt: Debt, tone: Tone, level: HumorLevel, lang: 'es' | 'en' = 'es'): GeneratedMessage => {
    console.log('🔄 Generando mensaje fallback...');
    const messages = lang === 'en' ? fallbackMessagesEN : fallbackMessagesES;
    // Map tone names for English fallback
    const toneName = lang === 'en' ? (tone.name === 'Corporativo' ? 'Corporate' : tone.name === 'Mafioso' ? 'Mob Boss' : tone.name) : tone.name;
    const toneMessages = messages[toneName] || messages['default'];
    const levelMessages = toneMessages[level] || toneMessages['balanced'];
    const template = levelMessages[Math.floor(Math.random() * levelMessages.length)];
    
    const text = template
      .replace('{deudor}', debt.debtor)
      .replace('{debtor}', debt.debtor)
      .replace('{amount}', `${debt.currency === 'MXN' ? '$' : 'USD '}${debt.amount.toLocaleString()}`);

    console.log('✅ Mensaje fallback generado:', text.substring(0, 50) + '...');
    // Note: saveToHistory is called after this function returns, in generateMessage

    return {
      text,
      tone: tone.name,
      level,
      timestamp: Date.now()
    };
  };

  return { generateMessage, loading, error };
}

function getFriendlyErrorMessage(errorMessage: string): string {
  if (errorMessage.includes('quota') || errorMessage.includes('429')) {
    return 'Límite de uso alcanzado. Intenta más tarde.';
  }
  if (errorMessage.includes('key') || errorMessage.includes('unauthorized')) {
    return 'Problema con la API key. Usando mensaje alternativo.';
  }
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return 'Sin conexión a internet. Usando mensaje local.';
  }
  return 'Error al generar mensaje. Intenta de nuevo.';
}

async function saveToHistory(debt: Debt, tone: Tone, level: HumorLevel, text: string, userId?: string) {
  try {
    const newItem = {
      id: Date.now().toString(),
      message: {
        text,
        tone: tone.name,
        level,
        timestamp: Date.now()
      },
      debt,
      date: new Date().toISOString()
    };
    
    // Save to localStorage
    const history = JSON.parse(localStorage.getItem('el-cobrador-history') || '[]');
    history.unshift(newItem);
    // Keep only last 50
    const trimmed = history.slice(0, 50);
    localStorage.setItem('el-cobrador-history', JSON.stringify(trimmed));
    console.log('✅ Historial guardado:', newItem);
    console.log('📊 Total items:', trimmed.length);
    
    // If user is authenticated, also save to Supabase and create reminder
    if (userId) {
      try {
        const { supabase } = await import('../lib/supabase');
        if (supabase) {
          // Save to user_history
          const { data, error } = await supabase
            .from('user_history')
            .insert({
              user_id: userId,
              message_text: text,
              tone: tone.name,
              level: level,
              debtor: debt.debtor,
              amount: debt.amount,
              currency: debt.currency,
              reason: debt.reason || '',
              created_at: newItem.date
            })
            .select()
            .single();
          
          if (error) throw error;
          
          // Create auto reminder (day 3)
          if (data) {
            const reminder3Date = new Date();
            reminder3Date.setDate(reminder3Date.getDate() + 3);
            
            await supabase.from('debt_reminders').insert({
              user_id: userId,
              history_item_id: data.id,
              debtor_name: debt.debtor,
              amount: debt.amount,
              currency: debt.currency,
              next_reminder_date: reminder3Date.toISOString().split('T')[0],
              paid_status: 'pending'
            });
            console.log('✅ Recordatorio automático creado para:', debt.debtor);
          }
        }
      } catch (err) {
        console.error('Error syncing to cloud:', err);
      }
    }
  } catch (error) {
    console.error('❌ Error guardando historial:', error);
  }
}

function buildPrompt(debt: Debt, tone: Tone, level: HumorLevel): string {
  const levelInstructions = {
    light: '- Amable, sin presión, casi un recordatorio amigable\n- Chiste suave, nadie se ofende\n- Tono: inocente y divertido',
    balanced: '- Sarcástico pero divertido\n- Enganche viral: que el receptor quiera saber qué app se usó\n- Tono: gracioso, gif-worthy',
    spicy: '- Ácido, roast suave\n- Para amigos que aguantan broma pesada\n- Tono: casi amenazante pero entre broma'
  };

  return `Genera un mensaje de WhatsApp para cobrar una deuda.

DATOS:
- Deudor: ${debt.debtor}
- Monto: ${debt.currency === 'MXN' ? '$' : 'USD '}${debt.amount}
- Concepto: ${debt.reason}
- Personalidad/Tono: ${tone.name}
- Descripción del tono: ${tone.description}
- Nivel de humor: ${level}

INSTRUCCIONES DEL TONO:
${tone.prompts[level]}

REQUISITOS POR NIVEL ${level.toUpperCase()}:
${levelInstructions[level]}

FORMATO OBLIGATORIO:
- Máximo 4 oraciones cortas
- Incluir 1-2 emojis relevantes al personaje
- Listo para copiar y pegar en WhatsApp
- No uses comillas al inicio ni al final
- No agregues explicaciones, SOLO el mensaje

RESPUESTA (solo el mensaje):`;
}
