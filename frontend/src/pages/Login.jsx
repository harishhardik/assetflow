import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

function Login({ theme, setTheme }) {
  const { handleLogin, handleSignUp, employees } = useContext(AppContext);
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('admin@assetflow.com');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState('Admin'); // Simulated role selectors
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success' | 'error'
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (isSignUp) {
      if (!name) {
        setMessage({ text: 'Name is required.', type: 'error' });
        return;
      }
      const res = handleSignUp(name, email, password);
      if (res.success) {
        setMessage({ text: 'Account created successfully! You can now log in. Default role is Employee.', type: 'success' });
        setIsSignUp(false);
        setPassword('');
      } else {
        setMessage({ text: res.message, type: 'error' });
      }
    } else {
      const res = handleLogin(email, password);
      if (res.success) {
        // Logged in successfully
      } else {
        setMessage({ text: res.message, type: 'error' });
      }
    }
  };

  const handleSimulateRole = (role) => {
    setSelectedRole(role);
    // Find matching employee email from state or fall back to default
    const matchingEmp = employees.find(e => e.role === role);
    if (matchingEmp) {
      setEmail(matchingEmp.email);
    } else {
      setEmail(`${role.toLowerCase().replace(' ', '')}@company.com`);
    }
    setPassword('password123');
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setShowForgot(false);
    setMessage({ text: `Password recovery instructions sent to ${forgotEmail || email}!`, type: 'success' });
  };

  const getRoleHint = () => {
    switch (selectedRole) {
      case 'Admin':
        return 'System administration, manages organization setup, departments, user roles, and global ERP configurations.';
      case 'Asset Manager':
        return 'Registers and allocates hardware, checks in/out assets, processes transfer requests, and schedules safety audits.';
      case 'Department Head':
        return 'Approves allocation/transfer requests for their department and books shared facilities and equipment.';
      case 'Employee':
      default:
        return 'Initiates maintenance requests, views assigned assets, books rooms, and requests returns.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-on-surface relative overflow-hidden transition-colors duration-300">
      {/* Background Decorative Blurs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[40%] bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[35%] h-[35%] bg-secondary-container/5 blur-[100px] rounded-full"></div>
      </div>

      {/* Floating Theme Switcher on Login */}
      <div className="absolute top-6 right-6">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-3 bg-surface-container border border-outline-variant/60 rounded-xl hover:bg-surface-bright text-on-surface-variant hover:text-on-surface transition-all shadow-md"
        >
          <span className="material-symbols-outlined">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
      </div>

      <main className="w-full max-w-[500px] animate-fade-in z-10">
        <div className="glass-card rounded-[24px] p-8 md:p-12 soft-glow relative overflow-hidden">
          
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-3 mb-6 group transition-transform duration-300 hover:scale-105">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-on-primary font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
              </div>
              <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">AssetFlow</span>
            </div>
            <h1 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-bold">
              {isSignUp ? 'Create Employee Account' : 'Welcome back'}
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant text-center leading-relaxed">
              {isSignUp 
                ? 'Sign up to register as an Employee. Administrative roles can be assigned by system managers.'
                : 'Sign in to access your assets, resource bookings, and logs.'}
            </p>
          </div>

          {/* Alert Message */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-xl border flex gap-3 animate-fade-in ${
              message.type === 'success' 
                ? 'bg-primary-container/10 border-primary/30 text-primary' 
                : 'bg-error/10 border-error/20 text-error'
            }`}>
              <span className="material-symbols-outlined shrink-0">
                {message.type === 'success' ? 'check_circle' : 'error'}
              </span>
              <p className="font-body-sm text-[13px] font-semibold">{message.text}</p>
            </div>
          )}

          {/* Form Tabs */}
          <div className="flex gap-4 mb-6 border-b border-outline-variant/30">
            <button
              onClick={() => { setIsSignUp(false); setMessage({ text: '', type: '' }); }}
              className={`pb-3 text-sm font-bold border-b-2 transition-all ${
                !isSignUp ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsSignUp(true); setMessage({ text: '', type: '' }); }}
              className={`pb-3 text-sm font-bold border-b-2 transition-all ${
                isSignUp ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant ml-1" htmlFor="name">Full Name</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">person</span>
                  <input 
                    type="text" 
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-13 pl-12 pr-4 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-on-surface font-body-md placeholder:text-outline focus:border-primary outline-none transition-all duration-200"
                    placeholder="John Doe" 
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant ml-1" htmlFor="email">Email address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
                <input 
                  type="email" 
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-13 pl-12 pr-4 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-on-surface font-body-md placeholder:text-outline focus:border-primary outline-none transition-all duration-200"
                  placeholder="name@company.com" 
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="password">Password</label>
                {!isSignUp && (
                  <button 
                    type="button"
                    className="font-label-sm text-label-sm text-primary hover:text-primary/80 transition-colors"
                    onClick={() => { setForgotEmail(email); setShowForgot(true); }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-13 pl-12 pr-12 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-on-surface font-body-md placeholder:text-outline focus:border-primary outline-none transition-all duration-200"
                  placeholder="••••••••" 
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Simulated Role Quick-Login Widget */}
            {!isSignUp && (
              <div className="space-y-2.5 pt-2">
                <label className="font-label-md text-label-md text-on-surface-variant ml-1 font-semibold">
                  Quick Simulate Persona
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Admin', 'Asset Manager', 'Department Head', 'Employee'].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleSimulateRole(role)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all duration-200 ${
                        selectedRole === role
                          ? 'bg-primary/10 border-primary text-primary shadow-sm shadow-primary/5'
                          : 'bg-surface-container border-outline-variant/40 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full h-13 bg-primary text-on-primary font-label-md text-label-md font-bold rounded-xl shadow-lg shadow-primary/10 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              {isSignUp ? 'Create Employee Account' : `Sign In`}
              <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
          </form>

          {/* Role descriptive disclaimer */}
          {!isSignUp && (
            <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl flex gap-3 animate-fade-in">
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0" style={{ fontVariationSettings: "'opsz' 20" }}>info</span>
              <div>
                <p className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">Simulated Persona Access</p>
                <p className="font-body-sm text-[12px] text-on-surface-variant leading-relaxed mt-1">
                  {getRoleHint()}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForgot(false)}></div>
          <div className="bg-surface-container-high border border-outline-variant/60 rounded-2xl w-full max-w-[400px] p-6 relative z-10 animate-fade-in shadow-2xl">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">Reset Password</h3>
            <p className="text-xs text-on-surface-variant mb-4 font-semibold">Enter your email and we'll simulate sending recovery instructions.</p>
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider block mb-1.5">Email address</label>
                <input 
                  type="email" 
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:brightness-110 transition-all">
                  Send Recovery Link
                </button>
                <button type="button" onClick={() => setShowForgot(false)} className="px-4 py-2.5 border border-outline-variant rounded-xl text-xs font-bold hover:bg-surface-bright text-on-surface-variant transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
