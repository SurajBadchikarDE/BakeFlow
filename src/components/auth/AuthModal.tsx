import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Store 
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { setActiveRole, setBakerTab, settings } = useBakery();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('chef.ananya@vanillaandcocoa.in');
  const [password, setPassword] = useState('••••••••••');
  const [name, setName] = useState('Chef Ananya Sharma');
  const [bakeryName, setBakeryName] = useState(settings.businessName);
  const [submittedMessage, setSubmittedMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'forgot') {
      setSubmittedMessage(`Password reset link sent to ${email}! Check your inbox.`);
      setTimeout(() => {
        setSubmittedMessage('');
        setMode('login');
      }, 2500);
      return;
    }

    // Success login/signup
    setActiveRole('baker');
    if (mode === 'signup') {
      setBakerTab('onboarding');
    } else {
      setBakerTab('dashboard');
    }
    onClose();
  };

  const handleDemoBypass = () => {
    setActiveRole('baker');
    setBakerTab('dashboard');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-cocoa-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-cream-200 max-w-md w-full p-6 sm:p-8 shadow-elevated relative animate-in fade-in zoom-in-95 duration-150">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cocoa-400 hover:text-cocoa-600 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-1.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-peach-100 text-peach-600 mx-auto flex items-center justify-center text-xl shadow-xs">
            🎂
          </div>
          <h3 className="font-serif font-bold text-xl text-cocoa-900">
            {mode === 'login' ? 'Baker Sign In' : mode === 'signup' ? 'Create Baker Account' : 'Reset Password'}
          </h3>
          <p className="text-xs text-cocoa-500">
            {mode === 'login' 
              ? 'Sign in to access your orders, inventory & kitchen schedule' 
              : mode === 'signup'
              ? 'Launch your home bakery online business today'
              : 'Enter your email to receive recovery instructions'}
          </p>
        </div>

        {submittedMessage ? (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs text-center font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            {submittedMessage}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            
            {mode === 'signup' && (
              <>
                <div>
                  <label className="font-bold text-cocoa-700 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
                  />
                </div>

                <div>
                  <label className="font-bold text-cocoa-700 block mb-1">Bakery Name</label>
                  <input
                    type="text"
                    value={bakeryName}
                    onChange={(e) => setBakeryName(e.target.value)}
                    required
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
                  />
                </div>
              </>
            )}

            <div>
              <label className="font-bold text-cocoa-700 block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
              />
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-cocoa-700">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-peach-600 hover:text-peach-700 font-semibold"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-cocoa-900 font-sans"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-cocoa-900 hover:bg-cocoa-800 text-cream-50 rounded-xl font-bold text-xs shadow-soft transition-all"
            >
              {mode === 'login' ? 'Sign In to Workspace' : mode === 'signup' ? 'Create Account & Start' : 'Send Reset Link'}
            </button>

            {/* Demo Quick Explore Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleDemoBypass}
                className="w-full py-2.5 bg-peach-50 hover:bg-peach-100 text-peach-900 border border-peach-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-peach-600" />
                <span>Instant Demo Mode (Chef Ananya)</span>
              </button>
            </div>

            {/* Switch Mode Links */}
            <div className="text-center pt-2 text-[11px] text-cocoa-500">
              {mode === 'login' ? (
                <p>
                  New home baker?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="font-bold text-peach-600 hover:text-peach-700 underline"
                  >
                    Sign up here
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="font-bold text-peach-600 hover:text-peach-700 underline"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
