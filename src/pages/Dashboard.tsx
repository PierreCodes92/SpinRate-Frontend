import { useEffect, useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Search, Gift, TrendingUp, Users, UserCheck, BarChart2, Scan, User, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthContext } from "@/hooks/useAuthContext";
import { API_BASE_URL } from "@/config/api";
import { Badge } from "@/components/ui/badge";

interface DashboardData {
  scans: number;
  prizesGiven: number;
  usersCount?: number;
  wheelsCount?: number;
  customersCount: number;
  enrichmentCount: number;
  users?: any[];
  wheels?: any[];
  customers?: any[];
}

export default function Dashboard() {
  const { t } = useLanguage();
  const { user, isInitialized } = useAuthContext();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check if user is admin
  const isAdmin = user?.user?.role === "admin";
  
  // Tab and search states
  const [activeTab, setActiveTab] = useState(isAdmin ? "users" : "customers");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [wheelSearchTerm, setWheelSearchTerm] = useState("");
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");

  useEffect(() => {
    if (!isInitialized) return;
    if (!user?.user?._id) return;

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Check if user is admin
        const isAdmin = user.user.role === "admin";
        const endpoint = isAdmin
          ? `${API_BASE_URL}/adminData/adminData`
          : `${API_BASE_URL}/adminData/userData/${user.user._id}`;
        
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [isInitialized, user?.user?._id]);

  // Calculate claim rate (redemption rate)
  const calculateClaimRate = () => {
    if (!dashboardData?.customers || dashboardData.customers.length === 0) return 0;
    const claimedCount = dashboardData.customers.filter((customer: any) => customer.status).length;
    return Math.round((claimedCount / dashboardData.customers.length) * 100);
  };

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!dashboardData?.users) return [];
    return dashboardData.users.filter((user: any) =>
      user.fullName.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
    );
  }, [dashboardData?.users, userSearchTerm]);

  // Filter wheels based on search term
  const filteredWheels = useMemo(() => {
    if (!dashboardData?.wheels) return [];
    return dashboardData.wheels.filter((wheel: any) =>
      wheel._id.toLowerCase().includes(wheelSearchTerm.toLowerCase()) ||
      wheel.userId.toLowerCase().includes(wheelSearchTerm.toLowerCase()) ||
      (wheel.businessName || '').toLowerCase().includes(wheelSearchTerm.toLowerCase()) ||
      wheel.customerInstruction.toLowerCase().includes(wheelSearchTerm.toLowerCase())
    );
  }, [dashboardData?.wheels, wheelSearchTerm]);

  // Filter customers based on search term
  const filteredCustomers = useMemo(() => {
    if (!dashboardData?.customers) return [];
    return dashboardData.customers.filter((customer: any) =>
      customer.email.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
      (customer.prize || '').toLowerCase().includes(customerSearchTerm.toLowerCase())
    );
  }, [dashboardData?.customers, customerSearchTerm]);

  // Helper function to calculate remaining days
  const calculateRemainingDays = (user: any) => {
    if (!user.lastPaymentDate || !user.subscriptionRemaining) return 0;
    
    const today = new Date();
    const lastPaymentDate = new Date(user.lastPaymentDate);
    
    // Calculate difference in days
    const diffInMs = today.getTime() - lastPaymentDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    // Remaining days = max(0, subscriptionRemaining - diff)
    const remainingDays = Math.max(0, user.subscriptionRemaining - diffInDays);
    
    return remainingDays;
  };

  // Helper function to get subscription status
  const getSubscriptionStatus = (user: any) => {
    if (!user.subscriptionRemaining) return { status: 'none', type: 'none' };
    
    // Calculate actual remaining days
    const remainingDays = calculateRemainingDays(user);
    
    // If remaining days is 0 or less, subscription is expired
    if (remainingDays <= 0) {
      return { status: 'expired', type: 'expired' };
    }
    
    if (user.subscriptionRemaining === 7) {
      return { status: 'freeTrial', type: 'freeTrial' };
    } else if (user.subscriptionRemaining === 30) {
      return { status: 'active', type: 'monthly' };
    } else if (user.subscriptionRemaining === 365) {
      return { status: 'active', type: 'yearly' };
    } else {
      return { status: 'expired', type: 'expired' };
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-destructive text-lg mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-primary hover:underline"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-3">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground text-lg">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Admin Stats - First Row */}
        {isAdmin && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-border hover:border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground">{t('dashboard.totalUsers')}</h3>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <p className="text-4xl font-bold text-foreground">{dashboardData?.usersCount || 0}</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-border hover:border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground">{t('dashboard.totalWheels')}</h3>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <BarChart2 className="h-6 w-6 text-indigo-500" />
                </div>
              </div>
              <p className="text-4xl font-bold text-foreground">{dashboardData?.wheelsCount || 0}</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-border hover:border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground">{t('dashboard.totalScans')}</h3>
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Scan className="h-6 w-6 text-success" />
                </div>
              </div>
              <p className="text-4xl font-bold text-foreground">{dashboardData?.scans || 0}</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-border hover:border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground">{t('dashboard.prizesAwarded')}</h3>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Gift className="h-6 w-6 text-purple-500" />
                </div>
              </div>
              <p className="text-4xl font-bold text-foreground">{dashboardData?.prizesGiven || 0}</p>
            </Card>
          </div>
        )}

        {/* Regular User Stats OR Admin Second Row */}
        <div className={`grid gap-6 md:grid-cols-2 ${isAdmin ? 'lg:grid-cols-3' : 'lg:grid-cols-5'}`}>
          {!isAdmin && (
            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-border hover:border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground">{t('dashboard.totalScans')}</h3>
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Scan className="h-6 w-6 text-success" />
                </div>
              </div>
              <p className="text-4xl font-bold text-foreground">{dashboardData?.scans || 0}</p>
            </Card>
          )}

          {!isAdmin && (
            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-border hover:border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground">{t('dashboard.prizesAwarded')}</h3>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Gift className="h-6 w-6 text-purple-500" />
                </div>
              </div>
              <p className="text-4xl font-bold text-foreground">{dashboardData?.prizesGiven || 0}</p>
            </Card>
          )}

          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-border hover:border-primary/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">{t('dashboard.claimRate')}</h3>
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-warning" />
              </div>
            </div>
            <p className="text-4xl font-bold text-foreground">{calculateClaimRate()}%</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-border hover:border-primary/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">{t('dashboard.customerDatabase')}</h3>
              <div className="w-12 h-12 rounded-xl bg-danger/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-danger" />
              </div>
            </div>
            <p className="text-4xl font-bold text-foreground">{dashboardData?.customersCount || 0}</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-border hover:border-primary/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">{t('dashboard.enrichedProfiles')}</h3>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-4xl font-bold text-foreground">{dashboardData?.enrichmentCount || 0}</p>
          </Card>
        </div>

        {/* Tables with Tabs */}
        <Card className="overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-border">
            {isAdmin && (
              <button
                onClick={() => setActiveTab("users")}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === "users"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <User className="h-4 w-4" />
                <span>{t('dashboard.usersTab')}</span>
                <Badge variant="secondary">{dashboardData?.usersCount || 0}</Badge>
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => setActiveTab("wheels")}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === "wheels"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <BarChart2 className="h-4 w-4" />
                <span>{t('dashboard.wheelsTab')}</span>
                <Badge variant="secondary">{dashboardData?.wheelsCount || 0}</Badge>
              </button>
            )}
            <button
              onClick={() => setActiveTab("customers")}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === "customers"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="h-4 w-4" />
              <span>{t('dashboard.customersTab')}</span>
              <Badge variant="secondary">{dashboardData?.customersCount || 0}</Badge>
            </button>

            {/* Search Input */}
            <div className="ml-auto p-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                {activeTab === "users" && (
                  <input
                    type="text"
                    placeholder={t('dashboard.searchUsers')}
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-64"
                  />
                )}
                {activeTab === "wheels" && (
                  <input
                    type="text"
                    placeholder={t('dashboard.searchWheels')}
                    value={wheelSearchTerm}
                    onChange={(e) => setWheelSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-64"
                  />
                )}
                {activeTab === "customers" && (
                  <input
                    type="text"
                    placeholder={t('dashboard.searchCustomers')}
                    value={customerSearchTerm}
                    onChange={(e) => setCustomerSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-64"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Users Table */}
          {activeTab === "users" && isAdmin && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="text-xs text-muted-foreground uppercase tracking-wider">
                    <th className="px-6 py-3 text-left">#</th>
                    <th className="px-6 py-3 text-left">{t('dashboard.name')}</th>
                    <th className="px-6 py-3 text-left">{t('dashboard.email')}</th>
                    <th className="px-6 py-3 text-left">{t('dashboard.role')}</th>
                    <th className="px-6 py-3 text-left">{t('dashboard.phone')}</th>
                    <th className="px-6 py-3 text-center">{t('dashboard.subscription')}</th>
                    <th className="px-6 py-3 text-center">{t('dashboard.remainingDays')}</th>
                    <th className="px-6 py-3 text-center">{t('dashboard.lastPayment')}</th>
                    <th className="px-6 py-3 text-center">{t('dashboard.status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.map((user: any, index: number) => {
                    const subscriptionInfo = getSubscriptionStatus(user);
                    const remainingDays = calculateRemainingDays(user);
                    return (
                      <tr key={user._id} className="hover:bg-muted/30">
                        <td className="px-6 py-4 text-sm text-muted-foreground">{index + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                              <User className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <span className="text-sm font-medium">{user.fullName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                        <td className="px-6 py-4">
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role === 'admin' ? t('dashboard.admin') : t('dashboard.user')}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{user.phoneNumber || 'N/A'}</td>
                        <td className="px-6 py-4 text-center">
                          <Badge variant={
                            subscriptionInfo.status === 'active' ? 'default' :
                            subscriptionInfo.status === 'freeTrial' ? 'secondary' : 'destructive'
                          }>
                            {subscriptionInfo.type === 'monthly' ? t('dashboard.monthly') :
                             subscriptionInfo.type === 'yearly' ? t('dashboard.yearly') :
                             subscriptionInfo.type === 'freeTrial' ? t('dashboard.freeTrial') :
                             t('dashboard.expired')}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge variant={
                            remainingDays > 7 ? 'default' :
                            remainingDays > 0 ? 'secondary' : 'destructive'
                          }>
                            {remainingDays} {remainingDays === 1 ? t('dashboard.day') : t('dashboard.days')}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-muted-foreground">
                          {formatDate(user.lastPaymentDate)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge variant={
                            subscriptionInfo.status === 'active' ? 'default' :
                            subscriptionInfo.status === 'freeTrial' ? 'secondary' : 'destructive'
                          }>
                            {subscriptionInfo.status === 'active' ? t('dashboard.active') :
                             subscriptionInfo.status === 'freeTrial' ? t('dashboard.freeTrial') :
                             t('dashboard.expired')}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Wheels Table */}
          {activeTab === "wheels" && isAdmin && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="text-xs text-muted-foreground uppercase tracking-wider">
                    <th className="px-6 py-3 text-left">#</th>
                    <th className="px-6 py-3 text-left">{t('dashboard.businessName')}</th>
                    <th className="px-6 py-3 text-left">{t('dashboard.instructions')}</th>
                    <th className="px-6 py-3 text-left">{t('dashboard.createdDate')}</th>
                    <th className="px-6 py-3 text-center">{t('dashboard.scans')}</th>
                    <th className="px-6 py-3 text-center">{t('dashboard.lots')}</th>
                    <th className="px-6 py-3 text-center">{t('dashboard.reviewLink')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredWheels.map((wheel: any, index: number) => (
                    <tr key={wheel._id} className="hover:bg-muted/30">
                      <td className="px-6 py-4 text-sm text-muted-foreground">{index + 1}</td>
                      <td className="px-6 py-4 text-sm font-medium">{wheel.businessName || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {wheel.customerInstruction.length > 40
                          ? `${wheel.customerInstruction.substring(0, 40)}...`
                          : wheel.customerInstruction}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatDate(wheel.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant="secondary">{wheel.scans || 0}</Badge>
                      </td>
                      <td className="px-6 py-4 text-center text-sm">{wheel.lots.length}</td>
                      <td className="px-6 py-4 text-center">
                        {wheel.googleReviewLink ? (
                          <a
                            href={wheel.googleReviewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-primary hover:text-primary/80"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Customers Table */}
          {activeTab === "customers" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="text-xs text-muted-foreground uppercase tracking-wider">
                    <th className="px-6 py-3 text-left">#</th>
                    <th className="px-6 py-3 text-left">{t('dashboard.email')}</th>
                    <th className="px-6 py-3 text-left">{t('dashboard.phone')}</th>
                    <th className="px-6 py-3 text-left">{t('dashboard.prize')}</th>
                    <th className="px-6 py-3 text-center">{t('dashboard.status')}</th>
                    <th className="px-6 py-3 text-center">{t('dashboard.enriched')}</th>
                    <th className="px-6 py-3 text-center">{t('dashboard.date')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredCustomers.map((customer: any, index: number) => (
                    <tr key={customer._id} className="hover:bg-muted/30">
                      <td className="px-6 py-4 text-sm text-muted-foreground">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{customer.email}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{customer.phone}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {customer.prize && customer.prize.length > 25
                          ? `${customer.prize.substring(0, 25)}...`
                          : customer.prize || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={customer.status ? "default" : "secondary"}>
                          {customer.status ? t('dashboard.claimed') : t('dashboard.pending')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={customer.enriched ? "default" : "outline"}>
                          {customer.enriched ? t('dashboard.yes') : t('dashboard.no')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-muted-foreground">
                        {formatDate(customer.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}