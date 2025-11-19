import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { useState } from 'react';

export default function AdminBanners() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [form, setForm] = useState({ id: '', title: '', imageUrl: '', linkUrl: '', position: 'homepage', isActive: true });

  const { data: list } = useQuery({ queryKey: ['/api/admin/banners'] });

  const createMutation = useMutation({
    mutationFn: async () => {
      const payload = { title: form.title, imageUrl: form.imageUrl, linkUrl: form.linkUrl, position: form.position, isActive: form.isActive };
      const res = await apiRequest('POST', '/api/admin/banners', payload);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Banner created' });
      setForm({ id: '', title: '', imageUrl: '', linkUrl: '', position: 'homepage', isActive: true });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/banners'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      const payload = { title: form.title, imageUrl: form.imageUrl, linkUrl: form.linkUrl, position: form.position, isActive: form.isActive };
      const res = await apiRequest('PUT', `/api/admin/banners/${form.id}`, payload);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Banner updated' });
      setForm({ id: '', title: '', imageUrl: '', linkUrl: '', position: 'homepage', isActive: true });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/banners'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest('DELETE', `/api/admin/banners/${id}`);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Deleted' });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/banners'] });
    }
  });

  const handleEdit = (b: any) => {
    setForm({ id: b._id, title: b.title, imageUrl: b.imageUrl, linkUrl: b.linkUrl || '', position: b.position || 'homepage', isActive: !!b.isActive });
  };

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
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Banners</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(list?.data || []).map((b: any) => (
                    <div key={b._id} className="p-3 border rounded flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={b.imageUrl} alt={b.title} className="w-16 h-10 object-cover rounded" />
                        <div>
                          <div className="font-medium">{b.title}</div>
                          <div className="text-xs text-muted-foreground">{b.position} • {b.isActive ? 'Active' : 'Inactive'}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(b)}>Edit</Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate(b._id)}>Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{form.id ? 'Edit Banner' : 'Create Banner'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                <Input placeholder="Image URL" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
                <Input placeholder="Link URL (optional)" value={form.linkUrl} onChange={e => setForm({ ...form, linkUrl: e.target.value })} />
                <Input placeholder="Position (e.g., homepage)" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} />
                <div className="flex items-center gap-2">
                  <Checkbox id="active" checked={form.isActive} onCheckedChange={(v: any) => setForm({ ...form, isActive: Boolean(v) })} />
                  <label htmlFor="active" className="text-sm">Active</label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => (form.id ? updateMutation.mutate() : createMutation.mutate())}>{form.id ? 'Update' : 'Create'}</Button>
                  <Button variant="outline" onClick={() => setForm({ id: '', title: '', imageUrl: '', linkUrl: '', position: 'homepage', isActive: true })}>Clear</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
