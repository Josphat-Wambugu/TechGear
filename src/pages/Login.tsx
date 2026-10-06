import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Cpu, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import RoleToggle from '@/components/auth/RoleToggle';
import type { UserRole } from '@/types/auth';

export default function Login() {
  const { logIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const initialRole: UserRole = searchParams.get('role') === 'admin' ? 'admin' : 'customer';
  const [role, setRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    const result = logIn(email, password, role);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname;
    navigate(from || (role === 'admin' ? '/admin' : '/profile'), { replace: true });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="flex flex-col items-center mb-8">
        <Link to="/" className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-sm">
            <Cpu size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">TechGear</span>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sign in</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Welcome back — pick up where you left off.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 rounded-xl p-6 shadow-sm space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Signing in as</label>
          <RoleToggle value={role} onChange={setRole} />
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="jane@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-sm text-rose-600 bg-rose-50 dark:bg-rose-950 rounded-lg px-3 py-2">{error}</p>}

        <Button type="submit" variant="primary" size="lg" fullWidth icon={<LogIn size={16} />}>
          Sign in {role === 'admin' ? 'as Admin' : 'as Customer'}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
        Don't have an account?{' '}
        <Link to={`/signup?role=${role}`} className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">
          Sign up
        </Link>
      </p>
    </div>
  );
}
