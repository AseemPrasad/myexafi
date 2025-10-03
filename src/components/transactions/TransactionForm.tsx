import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

type TransactionFormData = {
  amount: string;
  category: string;
  description: string;
  transaction_type: 'expense' | 'income';
  payment_method: string;
  merchant: string;
  emotional_trigger: string;
};

const categories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Health', 'Education', 'Other'];
const paymentMethods = ['Card', 'Cash', 'UPI', 'Bank Transfer'];
const emotionalTriggers = ['None', 'Stress', 'Boredom', 'Celebration', 'Social Pressure', 'Tired', 'Angry'];

export const TransactionForm = ({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: '',
    category: 'Food',
    description: '',
    transaction_type: 'expense',
    payment_method: 'Card',
    merchant: '',
    emotional_trigger: 'None',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const now = new Date();
      const { error } = await supabase.from('transactions').insert({
        user_id: user.id,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        transaction_type: formData.transaction_type,
        payment_method: formData.payment_method,
        merchant: formData.merchant || null,
        emotional_trigger: formData.emotional_trigger !== 'None' ? formData.emotional_trigger : null,
        day_of_week: now.toLocaleDateString('en-US', { weekday: 'long' }),
        transaction_date: now.toISOString().split('T')[0],
      });

      if (error) throw error;
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Add Transaction</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, transaction_type: 'expense' })}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                formData.transaction_type === 'expense'
                  ? 'bg-red-100 text-red-700 border-2 border-red-500'
                  : 'bg-slate-100 text-slate-600 border-2 border-transparent'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, transaction_type: 'income' })}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                formData.transaction_type === 'income'
                  ? 'bg-green-100 text-green-700 border-2 border-green-500'
                  : 'bg-slate-100 text-slate-600 border-2 border-transparent'
              }`}
            >
              Income
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-slate-500 text-lg">₹</span>
              <input
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method</label>
              <select
                value={formData.payment_method}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., Lunch at cafe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Merchant (Optional)</label>
            <input
              type="text"
              value={formData.merchant}
              onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., Starbucks"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Emotional Trigger (Optional)</label>
            <select
              value={formData.emotional_trigger}
              onChange={(e) => setFormData({ ...formData, emotional_trigger: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {emotionalTriggers.map((trigger) => (
                <option key={trigger} value={trigger}>
                  {trigger}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg border border-slate-300 font-medium hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
