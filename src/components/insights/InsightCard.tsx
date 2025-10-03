import { TrendingUp, AlertCircle, Lightbulb, Target, Bell } from 'lucide-react';
import { Insight } from '../../lib/supabase';

export const InsightCard = ({ insight }: { insight: Insight }) => {
  const getInsightIcon = (type: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      spending_pattern: <TrendingUp className="w-5 h-5" />,
      trigger_detected: <AlertCircle className="w-5 h-5" />,
      savings_opportunity: <Lightbulb className="w-5 h-5" />,
      goal_progress: <Target className="w-5 h-5" />,
      budget_alert: <Bell className="w-5 h-5" />,
    };
    return icons[type] || <Lightbulb className="w-5 h-5" />;
  };

  const getInsightColor = (priority: string) => {
    const colors: { [key: string]: { bg: string; text: string; border: string } } = {
      high: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
      medium: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
      low: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    };
    return colors[priority] || colors.medium;
  };

  const colors = getInsightColor(insight.priority);

  return (
    <div className={`${colors.bg} rounded-xl p-5 border ${colors.border} hover:shadow-md transition-all`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center ${colors.text} border ${colors.border}`}>
          {getInsightIcon(insight.insight_type)}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className={`font-bold ${colors.text}`}>{insight.title}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${colors.bg} ${colors.text} border ${colors.border} capitalize`}>
              {insight.priority}
            </span>
          </div>

          <p className="text-sm text-slate-700 mb-3">{insight.message}</p>

          {insight.explanation && (
            <div className="bg-white/60 rounded-lg p-3 mb-3">
              <p className="text-xs font-semibold text-slate-600 mb-1">Why this matters:</p>
              <p className="text-xs text-slate-600">{insight.explanation}</p>
            </div>
          )}

          {insight.action_recommended && (
            <div className="bg-white/80 rounded-lg p-3">
              <p className="text-xs font-semibold text-slate-700 mb-1">Recommended Action:</p>
              <p className="text-sm text-slate-700">{insight.action_recommended}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
