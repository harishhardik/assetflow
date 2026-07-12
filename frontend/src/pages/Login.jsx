import React, { useState } from 'react';

function Login({ onLogin, theme, setTheme }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('admin@company.com');
  const [password, setPassword] = useState('••••••••');
  const [confirmPassword, setConfirmPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignUp) {
      alert('Employee account created successfully! Please sign in with your credentials.');
      setIsSignUp(false);
      return;
    }

    // Determine simulated role based on email keyword
    let role = 'Admin';
    const emailLower = email.toLowerCase();

    if (emailLower.includes('manager')) {
      role = 'Asset Manager';
    } else if (emailLower.includes('head')) {
      role = 'Department Head';
    } else if (emailLower.includes('employee') || emailLower.includes('staff')) {
      role = 'Employee';
    }

    onLogin(role);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background text-on-surface transition-colors duration-300">

      {/* LEFT PANEL: SaaS Product Showcase */}
      <div
        className="w-[55%] hidden md:flex flex-col justify-between p-12 bg-surface-container border-r border-outline-variant/30 relative overflow-hidden transition-colors duration-300"
        style={{
          backgroundImage: 'radial-gradient(var(--outline-variant) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      >
        {/* Colorful Gradients over the dots */}
        <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-primary/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 right-[20%] w-[35%] h-[35%] bg-secondary-container/10 blur-[100px] rounded-full"></div>

        {/* Top bar on left panel */}
        <div className="flex items-center justify-between z-10">
          <span className="text-xs uppercase tracking-widest font-black text-on-surface-variant flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            AssetFlow Enterprise ERP V2.0
          </span>
        </div>

        {/* Center: System Details Showcase */}
        <div className="max-w-[580px] w-full my-auto z-10 space-y-8">
          <div>
            <h2 className="text-[52px] font-black tracking-tight leading-none text-on-surface">
              AssetFlow
            </h2>
            <p className="text-xl font-bold text-primary mt-2">
              Enterprise Asset & Resource Management System
            </p>
            <p className="text-on-surface-variant text-sm font-semibold uppercase tracking-wider mt-4">
              Manage. Allocate. Maintain.
            </p>
          </div>

          {/* Feature Grid / Cards layout */}
          <div className="grid grid-cols-2 gap-4">

            {/* Feature 1 */}
            <div className="p-4 bg-surface/50 border border-outline-variant/60 rounded-xl hover:border-primary/40 hover:bg-surface/75 transition-all group backdrop-blur-sm">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
              </div>
              <h4 className="text-sm font-bold text-on-surface mb-1">Asset Lifecycle</h4>
              <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                Track full lifecycle value, SN, warranties, and allocations of physical assets.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-4 bg-surface/50 border border-outline-variant/60 rounded-xl hover:border-primary/40 hover:bg-surface/75 transition-all group backdrop-blur-sm">
              <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary mb-3">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>event_available</span>
              </div>
              <h4 className="text-sm font-bold text-on-surface mb-1">Resource Booking</h4>
              <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                Coordinate facility meeting rooms, high-end equipment, and timeline schedules.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-4 bg-surface/50 border border-outline-variant/60 rounded-xl hover:border-primary/40 hover:bg-surface/75 transition-all group backdrop-blur-sm">
              <div className="w-9 h-9 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary mb-3">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>build</span>
              </div>
              <h4 className="text-sm font-bold text-on-surface mb-1">Maintenance</h4>
              <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                Track incidents using operators Kanban board and assign service technicians.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-4 bg-surface/50 border border-outline-variant/60 rounded-xl hover:border-primary/40 hover:bg-surface/75 transition-all group backdrop-blur-sm">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
              </div>
              <h4 className="text-sm font-bold text-on-surface mb-1">Role-Based Access</h4>
              <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                Secure visibility scopes customized for Admin, Managers, Department Heads, and Staff.
              </p>
            </div>

          </div>
        </div>

        {/* Bottom Panel: Statistics Widgets (Bento Stats) */}
        <div className="grid grid-cols-2 gap-4 border-t border-outline-variant/40 pt-8 z-10 flex-shrink-0">
          <div className="flex gap-4">
            <div>
              <p className="text-2xl font-black text-on-surface leading-none">5,000+</p>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mt-1.5">Assets Tracked</p>
            </div>
            <div className="h-8 w-[1px] bg-outline-variant/60 my-auto"></div>
            <div>
              <p className="text-2xl font-black text-on-surface leading-none">250+</p>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mt-1.5">Organizations</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div>
              <p className="text-2xl font-black text-on-surface leading-none">99.9%</p>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mt-1.5">Audit Accuracy</p>
            </div>
            <div className="h-8 w-[1px] bg-outline-variant/60 my-auto"></div>
            <div>
              <p className="text-2xl font-black text-on-surface leading-none">24/7</p>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mt-1.5">Live Visibility</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Login / Signup Form Card */}
      <div className="w-full md:w-[45%] flex flex-col justify-between p-8 bg-surface relative">
        {/* Floating Blurs for Right Panel */}
        <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[80px] rounded-full"></div>
        </div>

        {/* Top Header Row on Right */}
        <div className="flex justify-between items-center w-full z-10">
          <div className="flex items-center gap-2 group transition-transform duration-300 hover:scale-105">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md shadow-primary/20">
              <span className="material-symbols-outlined text-on-primary font-bold text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
            </div>
            <span className="font-headline-sm text-lg font-black text-primary tracking-tight">AssetFlow</span>
          </div>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 bg-surface-container border border-outline-variant/60 rounded-xl hover:bg-surface-bright text-on-surface-variant hover:text-on-surface transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>

        {/* Center: Sign In / Sign Up Form */}
        <div className="max-w-[420px] w-full mx-auto my-10 z-10 animate-fade-in">

          {!isSignUp ? (
            /* SIGN IN VIEW */
            <div className="space-y-6">
              <div>
                <h1 className="font-headline-sm text-headline-sm text-on-surface font-black tracking-tight mb-1.5">Welcome back</h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Log in to your workspace to manage enterprise assets.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="font-label-md text-label-md text-on-surface-variant ml-1 font-semibold" htmlFor="email">Email address</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 pl-12 pr-4 bg-surface-container border border-outline-variant/60 rounded-xl text-on-surface font-body-md placeholder:text-outline focus:border-primary outline-none transition-all duration-200 text-sm"
                      placeholder="name@company.com"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="font-label-md text-label-md text-on-surface-variant font-semibold" htmlFor="password">Password</label>
                    <a className="font-label-sm text-label-sm text-primary hover:text-primary/80 transition-colors" href="#" onClick={(e) => e.preventDefault()}>Forgot?</a>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-11 pl-12 pr-12 bg-surface-container border border-outline-variant/60 rounded-xl text-on-surface font-body-md placeholder:text-outline focus:border-primary outline-none transition-all duration-200 text-sm"
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

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full h-12 bg-primary text-on-primary font-label-md text-label-md font-bold rounded-xl shadow-lg shadow-primary/10 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-2"
                >
                  Sign In
                  <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                </button>
              </form>

              {/* Simulation tip under sign in */}
              <p className="text-[11px] text-on-surface-variant/80 text-center">
                💡 Tip: Use <code className="text-primary font-semibold">admin</code>, <code className="text-primary font-semibold">manager</code>, <code className="text-primary font-semibold">head</code>, or <code className="text-primary font-semibold">employee</code> in email to test role-specific dashboards.
              </p>

              {/* Sign up toggle section */}
              <div className="pt-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-[1px] flex-1 bg-outline-variant/20"></div>
                  <span className="font-label-sm text-[10px] text-outline font-bold tracking-wider uppercase">New User?</span>
                  <div className="h-[1px] flex-1 bg-outline-variant/20"></div>
                </div>
                <button
                  onClick={() => setIsSignUp(true)}
                  className="w-full h-12 bg-transparent border border-outline-variant text-on-surface font-label-md text-label-md font-bold rounded-xl hover:bg-surface-container transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-[20px] text-primary">person_add</span>
                  Sign up
                </button>
              </div>
            </div>
          ) : (
            /* SIGN UP VIEW */
            <div className="space-y-6">
              <div>
                <h1 className="font-headline-sm text-headline-sm text-on-surface font-black tracking-tight mb-1.5">Create Account</h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Register for an employee account. Administrative roles are assigned later by system administrators.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="font-label-md text-label-md text-on-surface-variant ml-1 font-semibold" htmlFor="name">Full Name</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">person</span>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-11 pl-12 pr-4 bg-surface-container border border-outline-variant/60 rounded-xl text-on-surface font-body-md placeholder:text-outline focus:border-primary outline-none transition-all duration-200 text-sm"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="font-label-md text-label-md text-on-surface-variant ml-1 font-semibold" htmlFor="signup-email">Email address</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
                    <input
                      type="email"
                      id="signup-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 pl-12 pr-4 bg-surface-container border border-outline-variant/60 rounded-xl text-on-surface font-body-md placeholder:text-outline focus:border-primary outline-none transition-all duration-200 text-sm"
                      placeholder="name@company.com"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label className="font-label-md text-label-md text-on-surface-variant ml-1 font-semibold" htmlFor="signup-password">Password</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="signup-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-11 pl-12 pr-12 bg-surface-container border border-outline-variant/60 rounded-xl text-on-surface font-body-md placeholder:text-outline focus:border-primary outline-none transition-all duration-200 text-sm"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1.5">
                  <label className="font-label-md text-label-md text-on-surface-variant ml-1 font-semibold" htmlFor="confirm-password">Confirm Password</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-11 pl-12 pr-12 bg-surface-container border border-outline-variant/60 rounded-xl text-on-surface font-body-md placeholder:text-outline focus:border-primary outline-none transition-all duration-200 text-sm"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full h-12 bg-primary text-on-primary font-label-md text-label-md font-bold rounded-xl shadow-lg shadow-primary/10 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-2"
                >
                  Create Account
                  <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                </button>
              </form>

              {/* Toggle back to Sign In */}
              <div className="text-center pt-2">
                <p className="text-xs text-on-surface-variant font-semibold">
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsSignUp(false)}
                    className="text-primary hover:underline font-bold"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Bottom links on Right */}
        <footer className="flex justify-center gap-4 text-xs font-semibold text-on-surface-variant/80 border-t border-outline-variant/20 pt-4 z-10">
          <a className="hover:text-primary transition-colors" href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
          <span>•</span>
          <a className="hover:text-primary transition-colors" href="#" onClick={(e) => e.preventDefault()}>Terms</a>
          <span>•</span>
          <a className="hover:text-primary transition-colors" href="#" onClick={(e) => e.preventDefault()}>Support</a>
        </footer>
      </div>

    </div>
  );
}

export default Login;
