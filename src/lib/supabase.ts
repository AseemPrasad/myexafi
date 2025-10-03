import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  coach_persona: 'tough_accountant' | 'chill_friend' | 'data_nerd';
  stress_spender: boolean;
  primary_goal: string | null;
  onboarding_completed: boolean;
  financial_health_score: number;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  subcategory: string | null;
  description: string;
  transaction_date: string;
  transaction_type: 'expense' | 'income';
  payment_method: string | null;
  merchant: string | null;
  is_recurring: boolean;
  tags: string[] | null;
  emotional_trigger: string | null;
  weather_condition: string | null;
  day_of_week: string | null;
  created_at: string;
};

export type FinancialGoal = {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  category: 'savings' | 'debt_payoff' | 'investment' | 'emergency_fund';
  weekly_plan_amount: number | null;
  is_active: boolean;
  progress_percentage: number;
  created_at: string;
  updated_at: string;
};

export type Challenge = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  challenge_type: 'no_spend' | 'savings_streak' | 'budget_limit' | 'custom';
  target_value: number | null;
  current_value: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'failed';
  reward_points: number;
  is_community: boolean;
  created_at: string;
};

export type Badge = {
  id: string;
  user_id: string;
  badge_type: string;
  title: string;
  description: string | null;
  icon: string | null;
  earned_at: string;
};

export type Insight = {
  id: string;
  user_id: string;
  insight_type: 'spending_pattern' | 'trigger_detected' | 'savings_opportunity' | 'goal_progress' | 'budget_alert';
  title: string;
  message: string;
  explanation: string | null;
  action_recommended: string | null;
  priority: 'high' | 'medium' | 'low';
  is_read: boolean;
  created_at: string;
};

export type Nudge = {
  id: string;
  user_id: string;
  nudge_type: 'payment_reminder' | 'savings_prompt' | 'spending_alert' | 'goal_milestone' | 'challenge_update';
  title: string;
  message: string;
  action_url: string | null;
  is_dismissed: boolean;
  scheduled_for: string;
  created_at: string;
};
