import React, { useState } from 'react';

function Login({ onLogin, theme, setTheme }) {
  const [email, setEmail] = useState('admin@assetflow.com');
  const [password, setPassword] = useState('••••••••');
  const [selectedRole, setSelectedRole] = useState('Admin'); // Admin, Asset Manager, Department Head, Employee
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(selectedRole);
  };

  // Helper info based on selected role
  const getRoleHint = () => {
    switch (selectedRole) {
      case 'Admin':
        return 'System administration, manages organization setup, departments, user roles, and global ERP configurations.';
      case 'Asset Manager':
        return 'Registers and allocates hardware, checks in/out assets, processes transfer requests, and schedules safety audits.';
      case 'Department Head':
        return 'Approves allocation/transfer requests for their department and books shared facilities and equipment.';
      case 'Employee':
        return 'Initiates maintenance requests, views assigned assets, books rooms, and requests returns.';
      default:
        return '';
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
            <h1 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-bold">Welcome back</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant text-center leading-relaxed">
              Please choose a role persona to simulate, or sign in using enterprise SSO.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Simulation Role Selector Widget */}
            <div className="space-y-2.5">
              <label className="font-label-md text-label-md text-on-surface-variant ml-1 font-semibold">
                Simulate User Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Admin', 'Asset Manager', 'Department Head', 'Employee'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role);
                      // Update mock email prefix for visual realism
                      setEmail(`${role.toLowerCase().replace(' ', '')}@company.com`);
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold text-center transition-all duration-200 ${
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
                <a className="font-label-sm text-label-sm text-primary hover:text-primary/80 transition-colors" href="#" onClick={(e) => e.preventDefault()}>Forgot password?</a>
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

            {/* Remember Me */}
            <div className="flex items-center gap-3 px-1">
              <div className="relative flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  id="remember"
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-outline-variant bg-surface-container-lowest transition-all checked:bg-primary checked:border-primary outline-none focus:ring-0 focus:ring-offset-0"
                />
                <span className="material-symbols-outlined absolute text-[14px] text-on-primary font-bold opacity-0 peer-checked:opacity-100 pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">check</span>
              </div>
              <label className="font-label-md text-label-md text-on-surface-variant cursor-pointer select-none" htmlFor="remember">Remember me for 30 days</label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full h-13 bg-primary text-on-primary font-label-md text-label-md font-bold rounded-xl shadow-lg shadow-primary/10 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              Sign In as {selectedRole}
              <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
          </form>

          {/* Role descriptive disclaimer */}
          <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl flex gap-3 animate-fade-in">
            <span className="material-symbols-outlined text-primary text-[20px] shrink-0" style={{ fontVariationSettings: "'opsz' 20" }}>info</span>
            <div>
              <p className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">Simulated Access Info</p>
              <p className="font-body-sm text-[12px] text-on-surface-variant leading-relaxed mt-1">
                {getRoleHint()}
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer Links */}
        <footer className="mt-8 flex justify-center gap-6">
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#" onClick={(e) => e.preventDefault()}>Support</a>
        </footer>
      </main>
    </div>
  );
}

export default Login;
