import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Transactions() {
  const { user } = useAuth();
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const status = params.get('status');
  const message = status === 'success' ? 'Payment successful. Subscription activated.' : status === 'failed' ? 'Payment failed. Please try again.' : status === 'error' ? 'Payment processing error.' : '';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {message && <div className={`mb-4 ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message}</div>}
            {user ? 'Your transactions will show here.' : 'Please login to view transactions.'}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
