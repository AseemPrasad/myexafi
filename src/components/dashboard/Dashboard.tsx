import { useState, useEffect } from 'react';
import { Plus, TrendingDown, TrendingUp, DollarSign } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { HealthScore } from './HealthScore';
import { InsightsList } from '../insights/InsightsList';
import { TransactionForm } from '../transactions/TransactionForm';

export const Dashboard = () => {
  const { profile } = useAuth();
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [stats, setStats] = useState({
    totalExpense: 0,
    totalIncome: 0,
    savings: 0,
  });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (profile) {
      loadStats();
    }
  }, [profile, refreshKey]);

  const loadStats = async () => {
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('transactions')
        .select('amount, transaction_type')
        .eq('user_id', profile!.id)
        .gte('transaction_date', startOfMonth.toISOString().split('T')[0]);

      if (error) throw error;

      const expenses = data?.filter(t => t.transaction_type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const income = data?.filter(t => t.transaction_type === 'income').reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      setStats({
        totalExpense: expenses,
        totalIncome: income,
        savings: income - expenses,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const getCoachMessage = () => {
    const persona = profile?.coach_persona;
    const name = profile?.full_name?.split(' ')[0] || 'there';

    if (persona === 'tough_accountant') {
      return `${name}, let's get your finances in order. No excuses!`;
    } else if (persona === 'chill_friend') {
      return `Hey ${name}! Ready to crush some financial goals today?`;
    } else {
      return `${name}, here's your data-driven financial snapshot.`;
    }
  };

  const scoreBreakdown = {
    spending_discipline: 75,
    savings_rate: 65,
    debt_management: 80,
    goal_progress: 70,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{getCoachMessage()}</h1>
        <p className="text-slate-600">Here's your financial overview for this month</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-red-100 text-sm font-medium">Total Expenses</span>
            <TrendingDown className="w-5 h-5 text-red-200" />
          </div>
          <p className="text-3xl font-bold mb-1">₹{stats.totalExpense.toLocaleString()}</p>
          <p className="text-red-100 text-xs">This month</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-100 text-sm font-medium">Total Income</span>
            <TrendingUp className="w-5 h-5 text-green-200" />
          </div>
          <p className="text-3xl font-bold mb-1">₹{stats.totalIncome.toLocaleString()}</p>
          <p className="text-green-100 text-xs">This month</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-100 text-sm font-medium">Net Savings</span>
            <DollarSign className="w-5 h-5 text-blue-200" />
          </div>
          <p className="text-3xl font-bold mb-1">₹{stats.savings.toLocaleString()}</p>
          <p className="text-blue-100 text-xs">This month</p>
        </div>
      </div>

      <HealthScore breakdown={scoreBreakdown} />

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Smart Insights</h2>
          <button
            onClick={() => setShowTransactionForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Transaction
          </button>
        </div>
        <InsightsList />
      </div>

      {showTransactionForm && (
        <TransactionForm
          onClose={() => setShowTransactionForm(false)}
          onSuccess={() => setRefreshKey(prev => prev + 1)}
        />
      )}
    </div>
  );
};
