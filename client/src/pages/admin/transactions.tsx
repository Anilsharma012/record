import { useQuery, useMutation } from '@tanstack/react-query';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';

export default function AdminTransactions() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data } = useQuery({ queryKey: ['/api/admin/transactions'] });

  const markPaid = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest('PUT', `/api/admin/transactions/${id}/mark-paid`);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Marked paid' });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/transactions'] });
    }
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card><CardContent className="p-8 text-center"><h1 className="text-2xl font-bold">Access Denied</h1><Button onClick={() => setLocation('/')}>Go Home</Button></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <Card>
              <CardHeader><CardTitle>Transactions</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {(data?.data || []).map((t: any) => (
                  <div key={t._id} className="p-3 border rounded flex items-center justify-between">
                    <div>
                      <div className="font-medium">{t.method?.toUpperCase()} • ₹{t.amount} • {t.currency}</div>
                      <div className="text-xs text-muted-foreground">Status: {t.status} • Order: {t.orderId}</div>
                    </div>
                    {t.status !== 'paid' && (
                      <Button size="sm" onClick={() => markPaid.mutate(t._id)}>Mark Paid</Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
