import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Cpu, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import RoleToggle from '@/components/auth/RoleToggle';
import type { UserRole } from '@/types/auth';

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRole: UserRole = searchParams.get('role') === 'admin' ? 'admin' : 'customer';
  const [role, setRole] = useState<UserRole>(initialRole);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim()) return setError('Enter your full name.');
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirmPassword) return setError('Passwords do not match.');

    const result = signUp({ fullName, email, password, role });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate(role === 'admin' ? '/admin' : '/profile', { replace: true });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="flex flex-col items-center mb-8">
        <Link to="/" className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
            <Cpu size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">TechGear</span>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create an account</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Set up your profile in a few seconds.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 rounded-xl p-6 shadow-sm space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Account type</label>
          <RoleToggle value={role} onChange={setRole} />
        </div>

        <Input label="Full Name" placeholder="Jane Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} />
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
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <p className="text-sm text-rose-600 bg-rose-50 dark:bg-rose-950 rounded-lg px-3 py-2">{error}</p>}

        <Button type="submit" variant="primary" size="lg" fullWidth icon={<UserPlus size={16} />}>
          Create {role === 'admin' ? 'Admin' : 'Customer'} Account
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
        Already have an account?{' '}
        <Link to={`/login?role=${role}`} className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
          Sign in
        </Link>
      </p>
    </div>
  );
}
