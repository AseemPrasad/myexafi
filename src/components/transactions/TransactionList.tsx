import { useEffect, useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, Calendar, CreditCard } from 'lucide-react';
import { supabase, Transaction } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export const TransactionList = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user!.id)
        .order('transaction_date', { ascending: false })
        .limit(50);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Food: 'bg-orange-100 text-orange-700',
      Transport: 'bg-blue-100 text-blue-700',
      Entertainment: 'bg-purple-100 text-purple-700',
      Bills: 'bg-red-100 text-red-700',
      Shopping: 'bg-pink-100 text-pink-700',
      Health: 'bg-green-100 text-green-700',
      Education: 'bg-indigo-100 text-indigo-700',
    };
    return colors[category] || 'bg-slate-100 text-slate-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-slate-600">No transactions yet</p>
        <p className="text-sm text-slate-500 mt-1">Add your first transaction to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-md transition-all"
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                transaction.transaction_type === 'expense' ? 'bg-red-100' : 'bg-green-100'
              }`}
            >
              {transaction.transaction_type === 'expense' ? (
                <ArrowUpCircle className="w-5 h-5 text-red-600" />
              ) : (
                <ArrowDownCircle className="w-5 h-5 text-green-600" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 truncate">{transaction.description}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(transaction.category)}`}>
                      {transaction.category}
                    </span>
                    {transaction.merchant && (
                      <span className="text-xs text-slate-500">{transaction.merchant}</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold text-lg ${
                      transaction.transaction_type === 'expense' ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {transaction.transaction_type === 'expense' ? '-' : '+'}₹{transaction.amount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(transaction.transaction_date)}</span>
                </div>
                {transaction.payment_method && (
                  <div className="flex items-center gap-1">
                    <CreditCard className="w-3 h-3" />
                    <span>{transaction.payment_method}</span>
                  </div>
                )}
                {transaction.emotional_trigger && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded">
                    {transaction.emotional_trigger}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
