import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminGateways() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [form, setForm] = useState<any>({ id: '', provider: 'razorpay', name: '', enabled: true, isDefault: true, credentials: {}, pub: {} });

  const { data: list } = useQuery({ queryKey: ['/api/admin/gateways'] });

  const save = useMutation({
    mutationFn: async () => {
      const res = await apiRequest(form.id ? 'PUT' : 'POST', form.id ? `/api/admin/gateways/${form.id}` : '/api/admin/gateways', {
        provider: form.provider,
        name: form.name,
        enabled: form.enabled,
        isDefault: form.isDefault,
        credentials: form.credentials,
        pub: form.pub
      });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Saved' });
      setForm({ id: '', provider: 'razorpay', name: '', enabled: true, isDefault: true, credentials: {}, pub: {} });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/gateways'] });
    }
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest('DELETE', `/api/admin/gateways/${id}`);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Deleted' });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/gateways'] });
    }
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card><CardContent className="p-8 text-center"><h1 className="text-2xl font-bold">Access Denied</h1><Button onClick={() => setLocation('/')}>Go Home</Button></CardContent></Card>
      </div>
    );
  }

  const providerFields = () => {
    switch (form.provider) {
      case 'razorpay':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Input placeholder="Key ID" value={form.credentials.keyId || ''} onChange={e => setForm({ ...form, credentials: { ...form.credentials, keyId: e.target.value } })} />
            <Input placeholder="Key Secret" value={form.credentials.keySecret || ''} onChange={e => setForm({ ...form, credentials: { ...form.credentials, keySecret: e.target.value } })} />
            <Input placeholder="Webhook Secret (optional)" value={form.credentials.webhookSecret || ''} onChange={e => setForm({ ...form, credentials: { ...form.credentials, webhookSecret: e.target.value } })} />
          </div>
        );
      case 'phonepe':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Input placeholder="Merchant ID" value={form.credentials.merchantId || ''} onChange={e => setForm({ ...form, credentials: { ...form.credentials, merchantId: e.target.value } })} />
            <Input placeholder="Salt Key" value={form.credentials.saltKey || ''} onChange={e => setForm({ ...form, credentials: { ...form.credentials, saltKey: e.target.value } })} />
            <Input placeholder="Salt Index" value={form.credentials.saltIndex || ''} onChange={e => setForm({ ...form, credentials: { ...form.credentials, saltIndex: e.target.value } })} />
            <Select value={form.credentials.env || 'sandbox'} onValueChange={(v) => setForm({ ...form, credentials: { ...form.credentials, env: v } })}>
              <SelectTrigger><SelectValue placeholder="Environment" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sandbox">Sandbox</SelectItem>
                <SelectItem value="prod">Production</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      default:
        return <div className="text-sm text-muted-foreground">No special fields</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Configured Gateways</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {(list?.data || []).map((g: any) => (
                    <div key={g._id} className="p-3 border rounded flex items-center justify-between">
                      <div>
                        <div className="font-medium">{g.name} • {g.provider}</div>
                        <div className="text-xs text-muted-foreground">{g.enabled ? 'Enabled' : 'Disabled'} • {g.isDefault ? 'Default' : 'Secondary'}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setForm({ id: g._id, provider: g.provider, name: g.name, enabled: g.enabled, isDefault: g.isDefault, credentials: {}, pub: g.public })}>Edit</Button>
                        <Button variant="destructive" size="sm" onClick={() => del.mutate(g._id)}>Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>New / Edit Gateway</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Select value={form.provider} onValueChange={(v) => setForm({ ...form, provider: v })}>
                    <SelectTrigger><SelectValue placeholder="Provider" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="razorpay">Razorpay</SelectItem>
                      <SelectItem value="phonepe">PhonePe</SelectItem>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="paytm">Paytm</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Display Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2"><Switch checked={form.enabled} onCheckedChange={(v) => setForm({ ...form, enabled: v })} /> <span>Enabled</span></div>
                  <div className="flex items-center gap-2"><Switch checked={form.isDefault} onCheckedChange={(v) => setForm({ ...form, isDefault: v })} /> <span>Default</span></div>
                </div>
                <div className="space-y-2">
                  {providerFields()}
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => save.mutate()}>{form.id ? 'Update' : 'Create'}</Button>
                  <Button variant="outline" onClick={() => setForm({ id: '', provider: 'razorpay', name: '', enabled: true, isDefault: true, credentials: {}, pub: {} })}>Clear</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
