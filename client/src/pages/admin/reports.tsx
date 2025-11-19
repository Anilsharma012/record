import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useLocation } from 'wouter';

export default function AdminReports() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [form, setForm] = useState({ id: '', name: '', slug: '', isActive: true });

  const { data: reports } = useQuery({ queryKey: ['/api/admin/reports'] });
  const { data: reasons } = useQuery({ queryKey: ['/api/admin/reports/reasons'] });

  const saveReason = useMutation({
    mutationFn: async () => {
      const payload = { name: form.name, slug: form.slug, isActive: form.isActive };
      const res = await apiRequest(form.id ? 'PUT' : 'POST', form.id ? `/api/admin/reports/reasons/${form.id}` : '/api/admin/reports/reasons', payload);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Reason saved' });
      setForm({ id: '', name: '', slug: '', isActive: true });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reports/reasons'] });
    }
  });

  const deleteReason = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest('DELETE', `/api/admin/reports/reasons/${id}`);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Deleted' });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reports/reasons'] });
    }
  });

  const updateReport = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiRequest('PUT', `/api/admin/reports/${id}`, { status });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Report updated' });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reports'] });
    }
  });

  const deleteReport = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest('DELETE', `/api/admin/reports/${id}`);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Report deleted' });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reports'] });
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

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Reasons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {(reasons?.data || []).map((r: any) => (
                    <div key={r._id} className="p-3 border rounded flex items-center justify-between">
                      <div>
                        <div className="font-medium">{r.name}</div>
                        <div className="text-xs text-muted-foreground">/{r.slug} • {r.isActive ? 'Active' : 'Inactive'}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setForm({ id: r._id, name: r.name, slug: r.slug, isActive: r.isActive })}>Edit</Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteReason.mutate(r._id)}>Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  <Input placeholder="Slug" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => saveReason.mutate()}>{form.id ? 'Update' : 'Create'}</Button>
                  <Button variant="outline" onClick={() => setForm({ id: '', name: '', slug: '', isActive: true })}>Clear</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(reports?.data || []).map((rep: any) => (
                  <div key={rep._id} className="p-3 border rounded">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Listing: {rep.listingId}</div>
                      <div className="text-xs text-muted-foreground">{new Date(rep.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="text-sm">Reason: {rep.reason}</div>
                    <div className="text-xs text-muted-foreground mb-2">Status: {rep.status}</div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => updateReport.mutate({ id: rep._id, status: 'reviewing' })}>Mark Reviewing</Button>
                      <Button size="sm" onClick={() => updateReport.mutate({ id: rep._id, status: 'resolved' })}>Resolve</Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteReport.mutate(rep._id)}>Delete</Button>
                    </div>
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
