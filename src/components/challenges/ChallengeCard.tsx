import { Trophy, Flame, Target, Calendar } from 'lucide-react';
import { Challenge } from '../../lib/supabase';

export const ChallengeCard = ({ challenge }: { challenge: Challenge }) => {
  const progressPercentage = challenge.target_value
    ? Math.min((challenge.current_value / challenge.target_value) * 100, 100)
    : 0;

  const daysLeft = Math.ceil(
    (new Date(challenge.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const getChallengeIcon = (type: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      no_spend: <Target className="w-5 h-5" />,
      savings_streak: <Flame className="w-5 h-5" />,
      budget_limit: <Trophy className="w-5 h-5" />,
      custom: <Target className="w-5 h-5" />,
    };
    return icons[type] || <Target className="w-5 h-5" />;
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      active: 'from-blue-500 to-indigo-600',
      completed: 'from-green-500 to-emerald-600',
      failed: 'from-red-500 to-orange-600',
    };
    return colors[status] || colors.active;
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getStatusColor(challenge.status)} flex items-center justify-center text-white`}>
            {getChallengeIcon(challenge.challenge_type)}
          </div>
          <div>
            <h3 className="font-bold text-slate-800">{challenge.title}</h3>
            {challenge.description && <p className="text-sm text-slate-500 mt-1">{challenge.description}</p>}
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
          challenge.status === 'active' ? 'bg-blue-100 text-blue-700' :
          challenge.status === 'completed' ? 'bg-green-100 text-green-700' :
          'bg-red-100 text-red-700'
        }`}>
          {challenge.status}
        </span>
      </div>

      {challenge.target_value && (
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Progress</span>
            <span className="font-semibold text-slate-800">
              ₹{challenge.current_value.toLocaleString()} / ₹{challenge.target_value.toLocaleString()}
            </span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${getStatusColor(challenge.status)} transition-all duration-500`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="w-4 h-4" />
          <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}</span>
        </div>
        {challenge.reward_points > 0 && (
          <div className="flex items-center gap-1 text-sm font-semibold text-amber-600">
            <Trophy className="w-4 h-4" />
            <span>{challenge.reward_points} pts</span>
          </div>
        )}
      </div>
    </div>
  );
};
