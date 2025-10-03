import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { supabase, Challenge } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ChallengeCard } from './ChallengeCard';

export const ChallengesList = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadChallenges();
    }
  }, [user]);

  const loadChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChallenges(data || []);
    } catch (error) {
      console.error('Error loading challenges:', error);
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

  if (challenges.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-slate-600">No challenges yet</p>
        <p className="text-sm text-slate-500 mt-1">Start a challenge to earn rewards and build better habits</p>
      </div>
    );
  }

  const activeChallenges = challenges.filter(c => c.status === 'active');
  const completedChallenges = challenges.filter(c => c.status === 'completed');

  return (
    <div className="space-y-8">
      {activeChallenges.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4">Active Challenges</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {activeChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </div>
      )}

      {completedChallenges.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4">Completed</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {completedChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
