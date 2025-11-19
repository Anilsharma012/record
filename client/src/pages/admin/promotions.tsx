import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useLocation } from 'wouter';

export default function AdminPromotions() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('active');

  const { data } = useQuery({
    queryKey: ['/api/admin/listings', { q, status }],
    queryFn: async () => {
      const url = new URL('/api/admin/listings', window.location.origin);
      if (q) url.searchParams.set('q', q);
      if (status) url.searchParams.set('status', status);
      const res = await apiRequest('GET', url.pathname + url.search);
      return res.json();
    }
  });

  const moderate = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: 'feature' | 'urgent' | 'bump' | 'approve' | 'reject' }) => {
      const res = await apiRequest('POST', '/api/admin/listings/moderate', { id, action });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Updated' });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/listings'] });
    }
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-4">You need admin privileges to access this page.</p>
            <Button onClick={() => setLocation('/')}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const listings = data?.data?.listings || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Promotions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input placeholder="Search ads" value={q} onChange={e => setQ(e.target.value)} />
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  {listings.map((l: any) => (
                    <div key={l._id} className="p-3 border rounded flex items-center justify-between">
                      <div>
                        <div className="font-medium">{l.title}</div>
                        <div className="text-xs text-muted-foreground">₹{l.price} • {l.status} • {l.isFeatured ? 'Featured' : 'Standard'} {l.isUrgent ? '• Urgent' : ''}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => moderate.mutate({ id: l._id, action: 'feature' })}>Mark Featured</Button>
                        <Button variant="outline" size="sm" onClick={() => moderate.mutate({ id: l._id, action: 'urgent' })}>Mark Urgent</Button>
                        <Button variant="secondary" size="sm" onClick={() => moderate.mutate({ id: l._id, action: 'bump' })}>Bump</Button>
                        {l.status !== 'active' && <Button size="sm" onClick={() => moderate.mutate({ id: l._id, action: 'approve' })}>Approve</Button>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
