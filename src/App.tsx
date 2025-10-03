import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthForm } from './components/auth/AuthForm';
import { Onboarding } from './components/onboarding/Onboarding';
import { Navbar } from './components/layout/Navbar';
import { Dashboard } from './components/dashboard/Dashboard';
import { TransactionList } from './components/transactions/TransactionList';
import { GoalsList } from './components/goals/GoalsList';
import { ChallengesList } from './components/challenges/ChallengesList';
import { BadgesList } from './components/badges/BadgesList';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  if (profile && !profile.onboarding_completed) {
    return <Onboarding onComplete={() => window.location.reload()} />;
  }

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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
