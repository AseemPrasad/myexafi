import { Target, TrendingUp, Calendar, Zap } from 'lucide-react';
import { FinancialGoal } from '../../lib/supabase';

export const GoalCard = ({ goal }: { goal: FinancialGoal }) => {
  const daysLeft = Math.ceil(
    (new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      savings: 'from-blue-500 to-cyan-600',
      debt_payoff: 'from-red-500 to-orange-600',
      investment: 'from-green-500 to-emerald-600',
      emergency_fund: 'from-purple-500 to-pink-600',
    };
    return colors[category] || 'from-slate-500 to-slate-600';
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      savings: <Target className="w-5 h-5" />,
      debt_payoff: <TrendingUp className="w-5 h-5" />,
      investment: <Zap className="w-5 h-5" />,
      emergency_fund: <Target className="w-5 h-5" />,
    };
    return icons[category] || <Target className="w-5 h-5" />;
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getCategoryColor(goal.category)} flex items-center justify-center text-white`}>
            {getCategoryIcon(goal.category)}
          </div>
          <div>
            <h3 className="font-bold text-slate-800">{goal.title}</h3>
            <p className="text-sm text-slate-500 capitalize">{goal.category.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Progress</span>
            <span className="text-sm font-semibold text-slate-800">{goal.progress_percentage}%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${getCategoryColor(goal.category)} transition-all duration-500`}
              style={{ width: `${goal.progress_percentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-500 mb-1">Current</p>
            <p className="font-bold text-slate-800">₹{goal.current_amount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Target</p>
            <p className="font-bold text-slate-800">₹{goal.target_amount.toLocaleString()}</p>
          </div>
        </div>

        {goal.weekly_plan_amount && (
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">Weekly Plan</span>
            </div>
            <p className="text-sm text-blue-700">
              Save ₹{goal.weekly_plan_amount.toLocaleString()} per week to reach your goal
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="w-4 h-4" />
          <span>
            {daysLeft > 0 ? `${daysLeft} days left` : 'Goal date passed'}
          </span>
        </div>
      </div>
    </div>
  );
};
