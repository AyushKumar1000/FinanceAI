import { AlertTriangle, Lightbulb, Trophy, TrendingUp, Brain } from 'lucide-react';

export const getInsightIcon = (type: string) => {
  switch (type) {
    case 'warning': return AlertTriangle;
    case 'tip': return Lightbulb;
    case 'achievement': return Trophy;
    case 'recommendation': return TrendingUp;
    default: return Brain;
  }
};

export const getInsightColor = (type: string) => {
  switch (type) {
    case 'warning': return 'border-yellow-500/30 bg-yellow-500/10';
    case 'tip': return 'border-blue-500/30 bg-blue-500/10';
    case 'achievement': return 'border-green-500/30 bg-green-500/10';
    case 'recommendation': return 'border-purple-500/30 bg-purple-500/10';
    default: return 'border-green-500/30 bg-green-500/10';
  }
};
