import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';

export default function AdminCategories() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [catForm, setCatForm] = useState({ id: '', name: '', slug: '', icon: '' });
  const [subForm, setSubForm] = useState({ id: '', categoryId: '', name: '', slug: '' });
  const { data: categories = [] } = useQuery({ queryKey: ['/api/categories'] });
  const { data: subcategories = [] } = useQuery({ queryKey: ['/api/categories/' + (subForm.categoryId || 'none') + '/subcategories'], enabled: !!subForm.categoryId });

  const saveCategory = useMutation({
    mutationFn: async () => {
      const payload = { name: catForm.name, slug: catForm.slug, icon: catForm.icon };
      const res = await apiRequest(catForm.id ? 'PUT' : 'POST', catForm.id ? `/api/admin/categories/${catForm.id}` : '/api/admin/categories', payload);
      return res.json();
    },
    onSuccess: () => {
      setCatForm({ id: '', name: '', slug: '', icon: '' });
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
    }
  });

  const saveSubcategory = useMutation({
    mutationFn: async () => {
      const payload = { categoryId: subForm.categoryId, name: subForm.name, slug: subForm.slug };
      const res = await apiRequest(subForm.id ? 'PUT' : 'POST', subForm.id ? `/api/admin/subcategories/${subForm.id}` : '/api/admin/subcategories', payload);
      return res.json();
    },
    onSuccess: () => {
      setSubForm({ id: '', categoryId: '', name: '', slug: '' });
      queryClient.invalidateQueries({ queryKey: ['/api/categories/' + (subForm.categoryId || 'none') + '/subcategories'] });
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
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {(categories as any[]).map(c => (
                    <div key={c._id} className="p-3 border rounded flex items-center justify-between">
                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground">/{c.slug} • {c.icon}</div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setCatForm({ id: c._id, name: c.name, slug: c.slug, icon: c.icon })}>Edit</Button>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input placeholder="Name" value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} />
                  <Input placeholder="Slug" value={catForm.slug} onChange={e => setCatForm({ ...catForm, slug: e.target.value })} />
                  <Input placeholder="Icon (e.g., fas fa-car)" value={catForm.icon} onChange={e => setCatForm({ ...catForm, icon: e.target.value })} />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => saveCategory.mutate()}>{catForm.id ? 'Update' : 'Create'}</Button>
                  <Button variant="outline" onClick={() => setCatForm({ id: '', name: '', slug: '', icon: '' })}>Clear</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subcategories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input placeholder="Category Id" value={subForm.categoryId} onChange={e => setSubForm({ ...subForm, categoryId: e.target.value })} />
                  <Input placeholder="Name" value={subForm.name} onChange={e => setSubForm({ ...subForm, name: e.target.value })} />
                  <Input placeholder="Slug" value={subForm.slug} onChange={e => setSubForm({ ...subForm, slug: e.target.value })} />
                </div>
                <div className="space-y-2">
                  {(subcategories as any[]).map(s => (
                    <div key={s._id} className="p-3 border rounded flex items-center justify-between">
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-muted-foreground">/{s.slug}</div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setSubForm({ id: s._id, categoryId: s.categoryId, name: s.name, slug: s.slug })}>Edit</Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => saveSubcategory.mutate()}>{subForm.id ? 'Update' : 'Create'}</Button>
                  <Button variant="outline" onClick={() => setSubForm({ id: '', categoryId: '', name: '', slug: '' })}>Clear</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
