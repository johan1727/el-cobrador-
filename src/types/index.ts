export type HumorLevel = 'light' | 'balanced' | 'spicy';

export interface Tone {
  id: string;
  name: string;
  icon: string;
  description: string;
  tagline: string;
  prompts: {
    light: string;
    balanced: string;
    spicy: string;
  };
  isPremium?: boolean;
}

export interface Debt {
  debtor: string;
  amount: number;
  currency: 'MXN' | 'USD';
  reason: string;
}

export interface GeneratedMessage {
  text: string;
  tone: string;
  level: HumorLevel;
  timestamp: number;
}

export interface UserPlan {
  type: 'free' | 'pro';
  dailyMessages: number;
  maxDailyMessages: number;
  lastResetDate: string;
}
