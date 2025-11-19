import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useLocation } from 'wouter';

export default function AdminStaff() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [filters, setFilters] = useState({ search: '', role: 'admin' });

  const { data } = useQuery({
    queryKey: ['/api/admin/users', { role: filters.role, q: filters.search }],
    enabled: user?.role === 'admin'
  });

  const updateUser = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: 'admin' | 'user' | 'seller' }) => {
      const res = await apiRequest('PUT', `/api/admin/users/${id}`, { role });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Updated' });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
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

  const users = (data as any)?.data || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Staff & Roles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input placeholder="Search by name/email" value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} />
                  <Select value={filters.role} onValueChange={(v: any) => setFilters({ ...filters, role: v })}>
                    <SelectTrigger className="w-48"><SelectValue placeholder="Role" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admins</SelectItem>
                      <SelectItem value="all">All Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  {users.map((u: any) => (
                    <div key={u._id} className="p-3 border rounded flex items-center justify-between">
                      <div>
                        <div className="font-medium">{u.name} <Badge className="ml-2" variant={u.role === 'admin' ? 'default' : 'secondary'}>{u.role}</Badge></div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </div>
                      <div className="flex gap-2">
                        {u.role !== 'admin' && (
                          <Button size="sm" onClick={() => updateUser.mutate({ id: u._id, role: 'admin' })}>Make Admin</Button>
                        )}
                        {u.role === 'admin' && u._id !== user._id && (
                          <Button size="sm" variant="outline" onClick={() => updateUser.mutate({ id: u._id, role: 'user' })}>Remove Admin</Button>
                        )}
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
