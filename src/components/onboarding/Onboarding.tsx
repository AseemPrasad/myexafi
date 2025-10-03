import { useState } from 'react';
import { Brain, Heart, BarChart3, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type PersonaType = 'tough_accountant' | 'chill_friend' | 'data_nerd';

type OnboardingData = {
  fullName: string;
  coachPersona: PersonaType | null;
  stressSpender: boolean | null;
  primaryGoal: string;
};

const personas = [
  {
    id: 'tough_accountant' as PersonaType,
    icon: BarChart3,
    title: 'Tough Accountant',
    description: 'Direct, no-nonsense financial guidance. Keeps you accountable.',
    color: 'from-slate-600 to-slate-800',
  },
  {
    id: 'chill_friend' as PersonaType,
    icon: Heart,
    title: 'Chill Friend',
    description: 'Supportive and understanding. Encourages positive habits gently.',
    color: 'from-teal-500 to-emerald-600',
  },
  {
    id: 'data_nerd' as PersonaType,
    icon: Brain,
    title: 'Data Nerd',
    description: 'Analytics-driven insights. Shows you the numbers behind every decision.',
    color: 'from-blue-600 to-indigo-700',
  },
];

export const Onboarding = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    fullName: '',
    coachPersona: null,
    stressSpender: null,
    primaryGoal: '',
  });
  const { updateProfile } = useAuth();

  const handlePersonaSelect = (persona: PersonaType) => {
    setData({ ...data, coachPersona: persona });
  };

  const handleStressSpenderSelect = (value: boolean) => {
    setData({ ...data, stressSpender: value });
  };

  const handleComplete = async () => {
    if (!data.coachPersona || data.stressSpender === null) return;

    try {
      await updateProfile({
        full_name: data.fullName,
        coach_persona: data.coachPersona,
        stress_spender: data.stressSpender,
        primary_goal: data.primaryGoal,
        onboarding_completed: true,
      });
      onComplete();
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Smart Expense Advisor+
          </h1>
          <p className="text-slate-600 text-lg">Your AI-powered financial copilot</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-2 w-16 rounded-full transition-all ${
                    s <= step ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-slate-500">Step {step} of 4</span>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-3">Welcome! Let's get started</h2>
                <p className="text-slate-600">First, tell us your name so we can personalize your experience.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={data.fullName}
                  onChange={(e) => setData({ ...data, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your name"
                />
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!data.fullName.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-3">Choose your AI coach</h2>
                <p className="text-slate-600">Pick the coaching style that resonates with you.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {personas.map((persona) => {
                  const Icon = persona.icon;
                  return (
                    <button
                      key={persona.id}
                      onClick={() => handlePersonaSelect(persona.id)}
                      className={`p-6 rounded-xl border-2 transition-all text-left ${
                        data.coachPersona === persona.id
                          ? 'border-blue-600 shadow-lg scale-105'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${persona.color} flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-slate-800 mb-2">{persona.title}</h3>
                      <p className="text-sm text-slate-600">{persona.description}</p>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-lg border border-slate-300 font-medium hover:bg-slate-50 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!data.coachPersona}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Continue <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-3">Understanding your habits</h2>
                <p className="text-slate-600">Do you tend to spend when stressed or emotional?</p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => handleStressSpenderSelect(true)}
                  className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                    data.stressSpender === true
                      ? 'border-blue-600 shadow-lg bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <h3 className="font-bold text-slate-800 mb-2">Yes, I do stress-spend</h3>
                  <p className="text-sm text-slate-600">
                    I often make purchases when feeling stressed, bored, or emotional.
                  </p>
                </button>
                <button
                  onClick={() => handleStressSpenderSelect(false)}
                  className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                    data.stressSpender === false
                      ? 'border-blue-600 shadow-lg bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <h3 className="font-bold text-slate-800 mb-2">No, I'm usually mindful</h3>
                  <p className="text-sm text-slate-600">
                    I make planned purchases and rarely buy things impulsively.
                  </p>
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-lg border border-slate-300 font-medium hover:bg-slate-50 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={data.stressSpender === null}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Continue <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-3">What's your main financial goal?</h2>
                <p className="text-slate-600">This helps us prioritize insights and recommendations for you.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Primary Goal</label>
                <textarea
                  value={data.primaryGoal}
                  onChange={(e) => setData({ ...data, primaryGoal: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="e.g., Save for a trip to Goa, Pay off credit card debt, Build an emergency fund..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-lg border border-slate-300 font-medium hover:bg-slate-50 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={!data.primaryGoal.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Complete Setup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
