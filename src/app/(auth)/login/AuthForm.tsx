'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { login, register } from '@/lib/auth';

type Tab = 'login' | 'register';

export default function AuthForm() {
  const [activeTab, setActiveTab] = useState<Tab>('login');

  const [termsChecked, setTermsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState({
    login: false,
    register: false
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; icon: string; message: string }>({
    show: false,
    icon: '',
    message: ''
  });

  // Estados de formulario login
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({ email: '', password: '' });

  // Estados de formulario registro
  const [accountType, setAccountType] = useState<'school' | 'parent'>('school');
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', schoolName: '', position: '' });
  const [registerErrors, setRegisterErrors] = useState({ name: '', email: '', password: '', terms: '', schoolName: '', position: '' });
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '', width: '' });

  const isEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const calculatePasswordStrength = (pw: string) => {
    if (!pw) return { score: 0, label: '', color: '', width: '' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    const levels = [
      { width: '25%', color: '#EF4444', label: 'Weak' },
      { width: '50%', color: '#FF6B35', label: 'Fair' },
      { width: '75%', color: '#FFD54F', label: 'Good' },
      { width: '100%', color: '#4CAF8A', label: 'Strong ✓' },
    ];
    const level = levels[Math.max(0, score - 1)];
    return { score, ...level };
  };

  const showToast = (icon: string, message: string) => {
    setToast({ show: true, icon, message });
    setTimeout(() => setToast({ show: false, icon: '', message: '' }), 3500);
  };

  const handleLogin = async () => {
    console.log('🔵 HANDLE LOGIN CALLED');
    
    let valid = true;
    const errors = { email: '', password: '' };

    if (!isEmail(loginForm.email)) {
      errors.email = 'Please enter a valid email';
      valid = false;
    }
    if (!loginForm.password) {
      errors.password = 'Password is required';
      valid = false;
    }

    setLoginErrors(errors);
    if (!valid) return;

    setLoading(true);
    
    try {
      const response = await login(loginForm.email, loginForm.password);
      
      setLoading(false);
      
      if (response.success) {
        console.log('✅ LOGIN SUCCESS - User:', response.user);
        console.log('✅ LOGIN SUCCESS - Role:', response.user?.role);
        
        const destination = response.user?.role === 'admin' ? '/admin' : '/dashboard';
        console.log('🎯 REDIRECT TO:', destination);
        
        showToast('✅', response.message || 'Signed in successfully!');
        
        // Esperar a que Supabase guarde la sesión en cookies antes de navegar
        setTimeout(() => {
          console.log('🚀 NAVIGATING TO:', destination);
          window.location.href = destination;
        }, 1500);
      } else {
        showToast('❌', response.message || 'Login failed');
      }
    } catch (error) {
      console.error('❌ LOGIN ERROR:', error);
      setLoading(false);
      showToast('❌', 'An error occurred');
    }
  };

  const handleRegister = async () => {
    let valid = true;
    const errors = { name: '', email: '', password: '', terms: '', schoolName: '', position: '' };

    if (registerForm.name.length < 3) {
      errors.name = accountType === 'school' ? 'Name must be at least 3 characters' : 'Full name must be at least 3 characters';
      valid = false;
    }
    if (!isEmail(registerForm.email)) {
      errors.email = 'Please enter a valid email';
      valid = false;
    }
    if (registerForm.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
      valid = false;
    }
    if (accountType === 'school') {
      if (registerForm.schoolName.length < 2) {
        errors.schoolName = 'School name is required';
        valid = false;
      }
      if (registerForm.position.length < 2) {
        errors.position = 'Position is required';
        valid = false;
      }
    }
    if (!termsChecked) {
      errors.terms = 'You must accept the terms';
      valid = false;
    }

    setRegisterErrors(errors);
    if (!valid) return;

    setLoading(true);
    
    try {
      const response = await register(
        accountType,
        registerForm.name,
        registerForm.email,
        registerForm.password,
        accountType === 'school' ? registerForm.schoolName : undefined,
        accountType === 'school' ? registerForm.position : undefined
      );
      
      setLoading(false);
      
      if (response.success) {
        showToast('🎉', response.message || 'Account created successfully!');
        
        // Redirigir según el rol del usuario desde la respuesta del registro
        const destination = response.user?.role === 'admin' ? '/admin' : '/dashboard';
        
        // Navegar después del toast
        setTimeout(() => {
          window.location.href = destination;
        }, 100);
      } else {
        showToast('❌', response.message || 'Registration failed');
      }
    } catch {
      setLoading(false);
      showToast('❌', 'An error occurred');
    }
  };

  return (
    <>
      {/* Toast */}
      <div 
        className={`fixed top-6 left-1/2 z-50 -translate-x-1/2 flex items-center gap-3 bg-ink text-white text-sm font-medium px-5 py-3.5 rounded-2xl shadow-xl max-w-xs w-[calc(100%-48px)] border-l-4 border-[#4CAF8A] pointer-events-none transition-all duration-300 ${
          toast.show ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0'
        }`}
      >
        <span>{toast.icon}</span>
        <span>{toast.message}</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-10">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2.5 mb-8 self-start">
          <Image 
            src="/images/logo-sel-story-lessons.png" 
            alt="SEL Story Lessons Logo" 
            width={140} 
            height={42}
            quality={100}
            priority
            className="h-7 w-auto object-contain brightness-0 invert"
          />
        </div>

        <div className="w-full max-w-105">
          {/* TABS */}
          <div className="relative flex bg-cream2 rounded-full p-1 mb-9">
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] left-1 bg-white rounded-full shadow-[0_2px_8px_rgba(52,78,122,.07)] z-1 transition-transform duration-350 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                activeTab === 'register' ? 'translate-x-[calc(100%+0px)]' : ''
              }`}
            />
            <button
              onClick={() => setActiveTab('login')}
              className={`relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-full transition-colors ${
                activeTab === 'login' ? 'text-ink' : 'text-inkm'
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-full transition-colors ${
                activeTab === 'register' ? 'text-ink' : 'text-inkm'
              }`}
            >
              Create account
            </button>
          </div>

          {/* PANELS CONTAINER */}
          <div className="relative">
            {/* LOGIN PANEL */}
            <div 
              className={`transition-all duration-350 ease-in-out ${
                activeTab === 'login' ? 'opacity-100 relative' : 'opacity-0 absolute top-0 left-0 right-0 pointer-events-none translate-x-7'
              }`}
            >
              <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(52,78,122,.08)] p-8 border border-cream2">
                <div className="text-center mb-8">
                  <h2 className="font-display text-3xl font-bold text-ink mb-2">Welcome back!</h2>
                  <p className="text-sm text-inkm">Sign in to continue your stories</p>
                </div>

                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  {/* Email */}
                  <div>
                    <label htmlFor="loginEmail" className="block text-sm font-semibold text-ink mb-2.5">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-inkm" />
                      <input
                        type="email"
                        id="loginEmail"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleLogin();
                          }
                        }}
                        onBlur={() => {
                          if (loginForm.email && !isEmail(loginForm.email)) {
                            setLoginErrors({ ...loginErrors, email: 'Invalid email' });
                          } else {
                            setLoginErrors({ ...loginErrors, email: '' });
                          }
                        }}
                        className={`w-full py-3 pl-10.5 pr-3.5 border-2 rounded-[14px] text-[.95rem] text-ink bg-white outline-none transition-all duration-200 font-body placeholder:text-inkl ${
                          loginErrors.email 
                            ? 'border-[#EF4444] shadow-[0_0_0_4px_rgba(239,68,68,.08)]'
                            : loginForm.email && !loginErrors.email
                            ? 'border-[#4CAF8A] shadow-[0_0_0_4px_rgba(76,175,138,.08)]'
                            : 'border-cream2 focus:border-orange focus:shadow-[0_0_0_4px_rgba(255,107,53,.10)]'
                        }`}
                        placeholder="hello@magicalstory.app"
                      />
                    </div>
                    {loginErrors.email && (
                      <div className="flex items-center gap-1.5 text-xs text-[#EF4444] mt-2">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{loginErrors.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex justify-between items-center mb-2.5">
                      <label htmlFor="loginPassword" className="text-sm font-semibold text-ink">
                        Password
                      </label>
                      <a href="#" className="text-xs text-orange hover:text-oranged transition-colors">
                        Forgot?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-inkm" />
                      <input
                        type={showPassword.login ? 'text' : 'password'}
                        id="loginPassword"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleLogin();
                          }
                        }}
                        className={`w-full py-3 pl-10.5 pr-10.5 border-2 rounded-[14px] text-[.95rem] text-ink bg-white outline-none transition-all duration-200 font-body placeholder:text-inkl ${
                          loginErrors.password 
                            ? 'border-[#EF4444] shadow-[0_0_0_4px_rgba(239,68,68,.08)]'
                            : 'border-cream2 focus:border-orange focus:shadow-[0_0_0_4px_rgba(255,107,53,.10)]'
                        }`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword({ ...showPassword, login: !showPassword.login })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform text-inkm hover:text-ink"
                      >
                        {showPassword.login ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {loginErrors.password && (
                      <div className="flex items-center gap-1.5 text-xs text-[#EF4444] mt-2">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{loginErrors.password}</span>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full bg-orange hover:bg-oranged text-white font-semibold py-3.5 rounded-[14px] shadow-[0_4px_0_#E05520] hover:shadow-[0_2px_0_#E05520] hover:translate-y-0.5 transition-all duration-150 relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      'Sign in →'
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* REGISTER PANEL */}
            <div 
              className={`transition-all duration-350 ease-in-out ${
                activeTab === 'register' ? 'opacity-100 relative' : 'opacity-0 absolute top-0 left-0 right-0 pointer-events-none -translate-x-7'
              }`}
            >
              <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(52,78,122,.08)] p-8 border border-cream2">
                <div className="text-center mb-8">
                  <h2 className="font-display text-3xl font-bold text-ink mb-2">Create account</h2>
                  <p className="text-sm text-inkm">Join thousands of happy readers</p>
                </div>

                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  {/* Account Type Selection */}
                  <div className="flex gap-4 mb-2">
                    <label className={`flex-1 flex items-center justify-center gap-2 py-3 border-2 rounded-[14px] cursor-pointer transition-all ${accountType === 'school' ? 'border-orange bg-orange/5 text-orange' : 'border-cream2 text-inkm hover:border-orange/30'}`}>
                      <input type="radio" name="accountType" value="school" checked={accountType === 'school'} onChange={() => setAccountType('school')} className="hidden" />
                      <span className="font-semibold text-sm">School</span>
                    </label>
                    <label className={`flex-1 flex items-center justify-center gap-2 py-3 border-2 rounded-[14px] cursor-pointer transition-all ${accountType === 'parent' ? 'border-orange bg-orange/5 text-orange' : 'border-cream2 text-inkm hover:border-orange/30'}`}>
                      <input type="radio" name="accountType" value="parent" checked={accountType === 'parent'} onChange={() => setAccountType('parent')} className="hidden" />
                      <span className="font-semibold text-sm">Parent</span>
                    </label>
                  </div>

                  {/* School-specific fields */}
                  {accountType === 'school' && (
                    <div>
                      <label htmlFor="regSchoolName" className="block text-sm font-semibold text-ink mb-2.5">
                        School Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="regSchoolName"
                          value={registerForm.schoolName}
                          onChange={(e) => setRegisterForm({ ...registerForm, schoolName: e.target.value })}
                          className={`w-full py-3 px-4 border-2 rounded-[14px] text-[.95rem] text-ink bg-white outline-none transition-all duration-200 font-body placeholder:text-inkl ${
                            registerErrors.schoolName 
                              ? 'border-[#EF4444] shadow-[0_0_0_4px_rgba(239,68,68,.08)]'
                              : 'border-cream2 focus:border-orange focus:shadow-[0_0_0_4px_rgba(255,107,53,.10)]'
                          }`}
                          placeholder="Springfield Elementary"
                        />
                      </div>
                      {registerErrors.schoolName && (
                        <div className="flex items-center gap-1.5 text-xs text-[#EF4444] mt-2">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{registerErrors.schoolName}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className={accountType === 'school' ? 'flex flex-col sm:flex-row gap-5' : ''}>
                    {/* Name */}
                    <div className={accountType === 'school' ? 'flex-1' : ''}>
                      <label htmlFor="regName" className="block text-sm font-semibold text-ink mb-2.5">
                        {accountType === 'school' ? 'Your Name' : 'Full name'}
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-inkm" />
                        <input
                          type="text"
                          id="regName"
                          value={registerForm.name}
                          onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                          onBlur={() => {
                            if (registerForm.name && registerForm.name.length < 3) {
                              setRegisterErrors({ ...registerErrors, name: 'At least 3 characters' });
                            } else {
                              setRegisterErrors({ ...registerErrors, name: '' });
                            }
                          }}
                          className={`w-full py-3 pl-10.5 pr-3.5 border-2 rounded-[14px] text-[.95rem] text-ink bg-white outline-none transition-all duration-200 font-body placeholder:text-inkl ${
                            registerErrors.name 
                              ? 'border-[#EF4444] shadow-[0_0_0_4px_rgba(239,68,68,.08)]'
                              : registerForm.name && !registerErrors.name
                              ? 'border-[#4CAF8A] shadow-[0_0_0_4px_rgba(76,175,138,.08)]'
                              : 'border-cream2 focus:border-orange focus:shadow-[0_0_0_4px_rgba(255,107,53,.10)]'
                          }`}
                          placeholder="John Doe"
                        />
                      </div>
                      {registerErrors.name && (
                        <div className="flex items-center gap-1.5 text-xs text-[#EF4444] mt-2">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{registerErrors.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Position (Only for School) */}
                    {accountType === 'school' && (
                      <div className="flex-1 mt-5 sm:mt-0">
                        <label htmlFor="regPosition" className="block text-sm font-semibold text-ink mb-2.5">
                          Your Position
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="regPosition"
                            value={registerForm.position}
                            onChange={(e) => setRegisterForm({ ...registerForm, position: e.target.value })}
                            className={`w-full py-3 px-4 border-2 rounded-[14px] text-[.95rem] text-ink bg-white outline-none transition-all duration-200 font-body placeholder:text-inkl ${
                              registerErrors.position 
                                ? 'border-[#EF4444] shadow-[0_0_0_4px_rgba(239,68,68,.08)]'
                                : 'border-cream2 focus:border-orange focus:shadow-[0_0_0_4px_rgba(255,107,53,.10)]'
                            }`}
                            placeholder="e.g. Teacher"
                          />
                        </div>
                        {registerErrors.position && (
                          <div className="flex items-center gap-1.5 text-xs text-[#EF4444] mt-2">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{registerErrors.position}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="regEmail" className="block text-sm font-semibold text-ink mb-2.5">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-inkm" />
                      <input
                        type="email"
                        id="regEmail"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        onBlur={() => {
                          if (registerForm.email && !isEmail(registerForm.email)) {
                            setRegisterErrors({ ...registerErrors, email: 'Invalid email' });
                          } else {
                            setRegisterErrors({ ...registerErrors, email: '' });
                          }
                        }}
                        className={`w-full py-3 pl-10.5 pr-3.5 border-2 rounded-[14px] text-[.95rem] text-ink bg-white outline-none transition-all duration-200 font-body placeholder:text-inkl ${
                          registerErrors.email 
                            ? 'border-[#EF4444] shadow-[0_0_0_4px_rgba(239,68,68,.08)]'
                            : registerForm.email && !registerErrors.email
                            ? 'border-[#4CAF8A] shadow-[0_0_0_4px_rgba(76,175,138,.08)]'
                            : 'border-cream2 focus:border-orange focus:shadow-[0_0_0_4px_rgba(255,107,53,.10)]'
                        }`}
                        placeholder="hello@magicalstory.app"
                      />
                    </div>
                    {registerErrors.email && (
                      <div className="flex items-center gap-1.5 text-xs text-[#EF4444] mt-2">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{registerErrors.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="regPassword" className="block text-sm font-semibold text-ink mb-2.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-inkm" />
                      <input
                        type={showPassword.register ? 'text' : 'password'}
                        id="regPassword"
                        value={registerForm.password}
                        onChange={(e) => {
                          setRegisterForm({ ...registerForm, password: e.target.value });
                          setPasswordStrength(calculatePasswordStrength(e.target.value));
                        }}
                        className={`w-full py-3 pl-10.5 pr-10.5 border-2 rounded-[14px] text-[.95rem] text-ink bg-white outline-none transition-all duration-200 font-body placeholder:text-inkl ${
                          registerErrors.password 
                            ? 'border-[#EF4444] shadow-[0_0_0_4px_rgba(239,68,68,.08)]'
                            : 'border-cream2 focus:border-orange focus:shadow-[0_0_0_4px_rgba(255,107,53,.10)]'
                        }`}
                        placeholder="Choose a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword({ ...showPassword, register: !showPassword.register })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform text-inkm hover:text-ink"
                      >
                        {showPassword.register ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {registerErrors.password && (
                      <div className="flex items-center gap-1.5 text-xs text-[#EF4444] mt-2">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{registerErrors.password}</span>
                      </div>
                    )}
                    
                    {/* Password Strength */}
                    {registerForm.password && (
                      <div className="mt-3">
                        <div className="h-1.5 bg-cream2 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-400"
                            style={{ 
                              width: passwordStrength.width, 
                              backgroundColor: passwordStrength.color 
                            }}
                          />
                        </div>
                        <p 
                          className="text-xs font-semibold mt-1.5" 
                          style={{ color: passwordStrength.color }}
                        >
                          {passwordStrength.label}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Terms Checkbox */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative mt-0.5">
                        <div 
                          onClick={() => setTermsChecked(!termsChecked)}
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                            termsChecked 
                              ? 'bg-orange border-orange' 
                              : 'bg-white border-cream2 group-hover:border-orange/50'
                          }`}
                        >
                          <span 
                            className={`text-white text-xs transition-transform duration-200 ${
                              termsChecked ? 'scale-100' : 'scale-0'
                            }`}
                          >
                            ✓
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-inkm leading-relaxed">
                        I agree to the{' '}
                        <a href="#" className="text-orange hover:text-oranged underline">
                          Terms
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-orange hover:text-oranged underline">
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                    {registerErrors.terms && (
                      <div className="flex items-center gap-1.5 text-xs text-[#EF4444] mt-2">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{registerErrors.terms}</span>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={handleRegister}
                    disabled={loading}
                    className="w-full bg-orange hover:bg-oranged text-white font-semibold py-3.5 rounded-[14px] shadow-[0_4px_0_#E05520] hover:shadow-[0_2px_0_#E05520] hover:translate-y-0.5 transition-all duration-150 relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      'Create free account ✨'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Back to site */}
          <Link 
            href="/" 
            className="flex items-center justify-center gap-1.5 text-xs text-inkm mt-8 hover:text-orange transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </>
  );
}
