import { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Dashboard } from './components/dashboard/Dashboard';
import { TransactionList } from './components/transactions/TransactionList';
import { GoalsList } from './components/goals/GoalsList';
import { ChallengesList } from './components/challenges/ChallengesList';
import { BadgesList } from './components/badges/BadgesList';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar currentView={currentView} onViewChange={setCurrentView} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'transactions' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Transactions</h2>
            <TransactionList />
          </div>
        )}
        {currentView === 'goals' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Financial Goals</h2>
            <GoalsList />
          </div>
        )}
        {currentView === 'challenges' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Challenges</h2>
            <ChallengesList />
          </div>
        )}
        {currentView === 'badges' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Badges & Achievements</h2>
            <BadgesList />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
