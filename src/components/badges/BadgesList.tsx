import { useEffect, useState } from 'react';
import { Award } from 'lucide-react';
import { supabase, Badge } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export const BadgesList = () => {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadBadges();
    }
  }, [user]);

  const loadBadges = async () => {
    try {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .eq('user_id', user!.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      setBadges(data || []);
    } catch (error) {
      console.error('Error loading badges:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (badges.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Award className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-slate-600">No badges earned yet</p>
        <p className="text-sm text-slate-500 mt-1">Complete challenges and goals to earn badges</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all text-center"
        >
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-bold text-slate-800 mb-1">{badge.title}</h3>
          {badge.description && <p className="text-xs text-slate-500">{badge.description}</p>}
        </div>
      ))}
    </div>
  );
};
