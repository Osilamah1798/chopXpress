import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ChefHat, AlertCircle, UserPlus, LogIn } from 'lucide-react';

type View = 'login' | 'signup';

const LoginPage: React.FC = () => {
  const [view, setView] = useState<View>('login');
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Signup State
  const [signupEmail, setSignupEmail] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [signupError, setSignupError] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
        setLoginError('Both email and password are required.');
        return;
    }
    const result = await login(loginEmail, loginPassword);
    if (!result.success) {
      setLoginError(result.message);
    } else {
      navigate(from, { replace: true });
    }
  };
  
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    if (!signupEmail || !signupUsername || !signupPassword || !signupConfirm) {
        setSignupError('All fields are required.');
        return;
    }
    if (signupPassword !== signupConfirm) {
        setSignupError('Passwords do not match.');
        return;
    }
    if (signupPassword.length < 6) {
        setSignupError('Password must be at least 6 characters long.');
        return;
    }
    
    const result = await register(signupEmail, signupPassword, signupUsername);

    if (result.success) {
        navigate(from, { replace: true });
    } else {
        setSignupError(result.message);
    }
  };
  
  const TabButton: React.FC<{ currentView: View, targetView: View, setView: (view: View) => void, children: React.ReactNode }> = ({ currentView, targetView, setView, children }) => (
    <button
        onClick={() => setView(targetView)}
        className={`w-1/2 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-4 transition-colors ${
            currentView === targetView 
            ? 'border-primary text-primary' 
            : 'border-transparent text-gray-500 hover:text-secondary'
        }`}
    >
        {children}
    </button>
  );

  return (
    <div className="max-w-sm mx-auto text-center py-10">
      <ChefHat className="mx-auto h-20 w-20 text-primary mb-4" />
      <h1 className="text-4xl font-black text-secondary mb-2">
        {view === 'login' ? 'Welcome Back!' : 'Create Your Account'}
      </h1>
      <p className="text-gray-600 mb-8">
        {view === 'login' ? 'Log in to continue to ChopXpress.' : 'Sign up to start ordering. The first account created will be the Super Admin.'}
      </p>
      
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex mb-6">
            <TabButton currentView={view} targetView='login' setView={setView}><LogIn size={16}/> Login</TabButton>
            <TabButton currentView={view} targetView='signup' setView={setView}><UserPlus size={16}/> Sign Up</TabButton>
        </div>

        {view === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <div>
            <label htmlFor="login-email" className="sr-only">Email</label>
            <input
                type="email"
                id="login-email"
                value={loginEmail}
                onChange={(e) => { setLoginEmail(e.target.value); if (loginError) setLoginError(''); }}
                placeholder="Email"
                className={`w-full px-4 py-3 border ${loginError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-primary focus:border-primary`}
            />
            </div>
            <div>
            <label htmlFor="login-password" className="sr-only">Password</label>
            <input
                type="password"
                id="login-password"
                value={loginPassword}
                onChange={(e) => { setLoginPassword(e.target.value); if (loginError) setLoginError(''); }}
                placeholder="Password"
                className={`w-full px-4 py-3 border ${loginError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-primary focus:border-primary`}
            />
            </div>
            {loginError && <p className="text-red-500 text-sm text-left flex items-center gap-1"><AlertCircle size={16}/>{loginError}</p>}
            <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300">
            Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="signup-email" className="sr-only">Email</label>
              <input type="email" id="signup-email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="Enter your email"
                className={`w-full px-4 py-3 border ${signupError ? 'border-red-500' : 'border-gray-300'} rounded-lg`}/>
            </div>
             <div>
              <label htmlFor="signup-username" className="sr-only">Username</label>
              <input type="text" id="signup-username" value={signupUsername} onChange={(e) => setSignupUsername(e.target.value)} placeholder="Choose a username"
                className={`w-full px-4 py-3 border ${signupError ? 'border-red-500' : 'border-gray-300'} rounded-lg`}/>
            </div>
            <div>
              <label htmlFor="signup-password" className="sr-only">Password</label>
              <input type="password" id="signup-password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} placeholder="Create a password"
                className={`w-full px-4 py-3 border ${signupError ? 'border-red-500' : 'border-gray-300'} rounded-lg`}/>
            </div>
             <div>
              <label htmlFor="signup-confirm" className="sr-only">Confirm Password</label>
              <input type="password" id="signup-confirm" value={signupConfirm} onChange={(e) => setSignupConfirm(e.target.value)} placeholder="Confirm your password"
                className={`w-full px-4 py-3 border ${signupError ? 'border-red-500' : 'border-gray-300'} rounded-lg`}/>
            </div>
            {signupError && <p className="text-red-500 text-sm text-left flex items-center gap-1"><AlertCircle size={16}/>{signupError}</p>}
            <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-300">
              Create Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;