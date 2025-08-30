import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, FileText, TrendingUp, Eye, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useLocation } from 'wouter';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['/api/admin/dashboard'],
    enabled: user?.role === 'admin'
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-4">
              You need admin privileges to access this page.
            </p>
            <Button onClick={() => setLocation('/')} data-testid="button-go-home">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    totalUsers: 0,
    totalAds: 0,
    activeAds: 0,
    pendingAds: 0
  };

  const recentAds = dashboardData?.recentAds || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AdminSidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-dashboard-title">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome back, {user.name}! Here's what's happening with your marketplace.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                      <p className="text-2xl font-bold text-foreground" data-testid="text-total-users">
                        {isLoading ? '-' : stats.totalUsers.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Ads</p>
                      <p className="text-2xl font-bold text-foreground" data-testid="text-total-ads">
                        {isLoading ? '-' : stats.totalAds.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Ads</p>
                      <p className="text-2xl font-bold text-foreground" data-testid="text-active-ads">
                        {isLoading ? '-' : stats.activeAds.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Ads</p>
                      <p className="text-2xl font-bold text-foreground" data-testid="text-pending-ads">
                        {isLoading ? '-' : stats.pendingAds.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Ads */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Advertisements</span>
                  <Button variant="outline" size="sm" onClick={() => setLocation('/admin/ads')} data-testid="button-view-all-ads">
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="w-16 h-16 bg-muted animate-pulse rounded"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted animate-pulse rounded w-1/3"></div>
                          <div className="h-3 bg-muted animate-pulse rounded w-1/2"></div>
                          <div className="h-3 bg-muted animate-pulse rounded w-1/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentAds.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground" data-testid="text-no-recent-ads">
                      No recent advertisements
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentAds.map((ad: any) => (
                      <div key={ad._id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <img 
                          src={ad.images[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop'} 
                          alt={ad.title}
                          className="w-16 h-16 object-cover rounded"
                          data-testid={`img-ad-${ad._id}`}
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1" data-testid={`text-ad-title-${ad._id}`}>
                            {ad.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-1">
                            by {ad.userId.name} • {ad.categoryId.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-primary">
                              ₹{ad.price.toLocaleString()}
                            </span>
                            <Badge 
                              variant={
                                ad.status === 'active' ? 'default' :
                                ad.status === 'draft' ? 'secondary' :
                                ad.status === 'sold' ? 'outline' : 'destructive'
                              }
                              data-testid={`badge-status-${ad._id}`}
                            >
                              {ad.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <Eye className="w-3 h-3 mr-1" />
                            {ad.views} views
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(ad.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
