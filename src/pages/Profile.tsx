import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, LogOut, Plus, Trash2, UserCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import type { PaymentMethod } from '@/types/auth';

function detectBrand(cardNumber: string): PaymentMethod['brand'] {
  if (cardNumber.startsWith('4')) return 'Visa';
  if (/^5[1-5]/.test(cardNumber)) return 'Mastercard';
  return 'Card';
}

export default function Profile() {
  const { currentUser, updateProfile, addPaymentMethod, removePaymentMethod, logOut } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(currentUser?.fullName ?? '');
  const [email, setEmail] = useState(currentUser?.email ?? '');
  const [profileError, setProfileError] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cardError, setCardError] = useState('');
  const [showCardForm, setShowCardForm] = useState(false);

  if (!currentUser) return null;

  const handleProfileSubmit = (e: FormEvent) => {
    e.preventDefault();
    setProfileSaved(false);
    if (!fullName.trim()) return setProfileError('Full name is required.');
    if (!/^\S+@\S+\.\S+$/.test(email)) return setProfileError('Enter a valid email.');
    const result = updateProfile({ fullName, email });
    if (!result.ok) {
      setProfileError(result.error);
      return;
    }
    setProfileError('');
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleAddCard = (e: FormEvent) => {
    e.preventDefault();
    setCardError('');
    const digits = cardNumber.replace(/\s/g, '');
    if (!cardholderName.trim()) return setCardError('Enter the name on the card.');
    if (!/^\d{16}$/.test(digits)) return setCardError('Enter a valid 16-digit card number.');
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) return setCardError('Use MM/YY format for expiry.');

    addPaymentMethod({
      cardholderName: cardholderName.trim(),
      brand: detectBrand(digits),
      last4: digits.slice(-4),
      expiry,
    });
    setCardholderName('');
    setCardNumber('');
    setExpiry('');
    setShowCardForm(false);
  };

  const handleLogOut = () => {
    logOut();
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-brand-50 dark:bg-brand-950 flex items-center justify-center flex-shrink-0">
            <UserCircle size={28} className="text-brand-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{currentUser.fullName}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm text-slate-500 dark:text-slate-400">{currentUser.email}</span>
              {currentUser.role === 'admin' && (
                <Badge variant="indigo">
                  <ShieldCheck size={11} /> Admin
                </Badge>
              )}
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" icon={<LogOut size={14} />} onClick={handleLogOut}>
          Log out
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Profile Details</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {profileError && <p className="text-sm text-rose-600 bg-rose-50 dark:bg-rose-950 rounded-lg px-3 py-2">{profileError}</p>}
          {profileSaved && (
            <p className="text-sm text-emerald-700 bg-emerald-50 dark:bg-emerald-950 rounded-lg px-3 py-2">
              Profile updated.
            </p>
          )}
          <Button type="submit" variant="primary">
            Save Changes
          </Button>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Payment Methods</h2>
          {!showCardForm && (
            <Button variant="outline" size="sm" icon={<Plus size={14} />} onClick={() => setShowCardForm(true)}>
              Add card
            </Button>
          )}
        </div>

        {currentUser.paymentMethods.length === 0 && !showCardForm && (
          <p className="text-sm text-slate-500 dark:text-slate-400">No payment methods saved yet.</p>
        )}

        {currentUser.paymentMethods.length > 0 && (
          <div className="space-y-2.5 mb-4">
            {currentUser.paymentMethods.map((pm) => (
              <div
                key={pm.id}
                className="flex items-center gap-3 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3"
              >
                <div className="w-10 h-7 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <CreditCard size={15} className="text-slate-500 dark:text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {pm.brand} •••• {pm.last4}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {pm.cardholderName} · Expires {pm.expiry}
                  </p>
                </div>
                <button
                  onClick={() => removePaymentMethod(pm.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition-colors flex-shrink-0"
                  aria-label="Remove card"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {showCardForm && (
          <form onSubmit={handleAddCard} className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
            <Input
              label="Name on Card"
              placeholder="Jane Doe"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
            />
            <Input
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              maxLength={19}
            />
            <Input
              label="Expiry (MM/YY)"
              placeholder="08/28"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              maxLength={5}
            />
            {cardError && <p className="text-sm text-rose-600 bg-rose-50 dark:bg-rose-950 rounded-lg px-3 py-2">{cardError}</p>}
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setShowCardForm(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" fullWidth>
                Save Card
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
