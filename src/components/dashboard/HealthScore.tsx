import { TrendingUp, Shield, Target, PiggyBank } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type ScoreBreakdown = {
  spending_discipline: number;
  savings_rate: number;
  debt_management: number;
  goal_progress: number;
};

export const HealthScore = ({ breakdown }: { breakdown: ScoreBreakdown }) => {
  const { profile } = useAuth();
  const score = profile?.financial_health_score || 50;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-blue-500 to-cyan-600';
    if (score >= 40) return 'from-amber-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const getScoreStatus = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Attention';
  };

  const metrics = [
    { label: 'Spending Discipline', value: breakdown.spending_discipline, icon: Shield, color: 'text-blue-600' },
    { label: 'Savings Rate', value: breakdown.savings_rate, icon: PiggyBank, color: 'text-green-600' },
    { label: 'Debt Management', value: breakdown.debt_management, icon: TrendingUp, color: 'text-purple-600' },
    { label: 'Goal Progress', value: breakdown.goal_progress, icon: Target, color: 'text-orange-600' },
  ];

  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Financial Health Score</h2>

      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <svg className="transform -rotate-90" width="180" height="180">
            <circle cx="90" cy="90" r="70" stroke="#e2e8f0" strokeWidth="12" fill="none" />
            <circle
              cx="90"
              cy="90"
              r="70"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className={`stop-color-${getScoreColor(score).split('-')[1]}`} stopColor="#3b82f6" />
                <stop offset="100%" className={`stop-color-${getScoreColor(score).split('-')[3]}`} stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-slate-800">{score}</span>
            <span className="text-sm text-slate-500">out of 100</span>
          </div>
        </div>

        <div className="flex-1 w-full space-y-4">
          <div>
            <div className={`inline-flex px-4 py-2 rounded-full bg-gradient-to-r ${getScoreColor(score)} text-white font-semibold text-sm`}>
              {getScoreStatus(score)}
            </div>
          </div>

          <div className="space-y-3">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${metric.color}`} />
                      <span className="text-sm text-slate-600">{metric.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-800">{metric.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getScoreColor(metric.value)} transition-all duration-500`}
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
