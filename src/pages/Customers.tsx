import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, UserPlus, MoreVertical, Gift, Eye, UserPlus2, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthContext } from "@/hooks/useAuthContext";
import { API_BASE_URL } from "@/config/api";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientPopup } from "@/components/ClientPopup";

// Backend customer type
interface BackendCustomer {
  _id: string;
  userId: string;
  wheelId: string;
  email: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  prize: string;
  status: boolean;
  enriched: boolean;
  createdAt: string;
  updatedAt: string;
  birthDate?: string;
  address?: string;
}

// Frontend customer type (for UI compatibility)
type Customer = {
  id: string;
  date: string;
  email: string;
  prenom: string;
  phone: string;
  prix: string;
  codePromo?: string;
  statut: "Non réclamé" | "Réclamé";
  enrichi: "Oui" | "Non";
  nom: string;
  dateNaissance: string;
  adresse: string;
  _id: string; // Keep backend ID
  createdAt: string; // Store raw createdAt for filtering
};

// Helper to convert backend customer to frontend format
const convertBackendToFrontend = (backendCustomer: BackendCustomer): Customer => {
  return {
    id: backendCustomer._id,
    _id: backendCustomer._id,
    date: new Date(backendCustomer.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
    email: backendCustomer.email,
    prenom: backendCustomer.firstName || "",
    phone: backendCustomer.phone,
    prix: backendCustomer.prize,
    codePromo: "", // Not in backend model
    statut: backendCustomer.status ? "Réclamé" as const : "Non réclamé" as const,
    enrichi: backendCustomer.enriched ? "Oui" as const : "Non" as const,
    nom: backendCustomer.lastName || "",
    dateNaissance: backendCustomer.birthDate || "",
    adresse: backendCustomer.address || "",
    createdAt: backendCustomer.createdAt, // Store raw date for filtering
  };
};

export default function Customers() {
  const { t } = useLanguage();
  const { user, isInitialized } = useAuthContext();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [enrichOpen, setEnrichOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const months = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => new Date(2000, i).toLocaleDateString('fr-FR', { month: 'long' })),
  []);
  const years = useMemo(() => {
    const y = new Date().getFullYear();
    return [y - 1, y, y + 1];
  }, []);
  const [enrichFormData, setEnrichFormData] = useState({
    prenom: "",
    nom: "",
    dateNaissance: "",
    adresse: "",
  });
  const [addFormData, setAddFormData] = useState({
    email: "",
    prenom: "",
    phone: "",
    prix: "",
    codePromo: "",
  });

  // Fetch customers from API
  const fetchCustomers = useCallback(async () => {
    if (!user?.user?._id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/customer/getCustomerByUserId/${user.user._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const data = await response.json();
      if (data.customers) {
        const convertedCustomers = data.customers.map(convertBackendToFrontend);
        setCustomers(convertedCustomers);
      } else {
        setCustomers([]);
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError(err instanceof Error ? err.message : "Failed to load customers");
      toast.error(t('customers.fetchError') || "Failed to load customers");
    } finally {
      setIsLoading(false);
    }
  }, [user?.user?._id, t]);

  useEffect(() => {
    if (!isInitialized) return;
    if (!user?.user?._id) return;

    fetchCustomers();
  }, [isInitialized, user?.user?._id, fetchCustomers]);

  // Close dropdown when any dialog opens
  useEffect(() => {
    if (detailsOpen || enrichOpen || addOpen) {
      setOpenDropdownId(null);
    }
  }, [detailsOpen, enrichOpen, addOpen]);

  const handleMarkAsRecovered = async (customerId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customer/updateStatus/${customerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Refetch customers to get latest data
      await fetchCustomers();
      toast.success(t('customers.statusUpdated') || "Status updated successfully");
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error(t('customers.updateError') || "Failed to update status");
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (!window.confirm(t('customers.deleteConfirm') || "Are you sure you want to delete this customer?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/customer/delete/${customerId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete customer");
      }

      // Refetch customers to get latest data
      await fetchCustomers();
      toast.success(t('customers.deletedSuccess') || "Customer deleted successfully");
    } catch (err) {
      console.error("Error deleting customer:", err);
      toast.error(t('customers.deleteError') || "Failed to delete customer");
    }
  };

  const handleEnrichSave = async () => {
    if (!selectedCustomer) return;

    try {
      const response = await fetch(`${API_BASE_URL}/customer/enrichCustomer/${selectedCustomer._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: enrichFormData.prenom,
          lastName: enrichFormData.nom,
          birthDate: enrichFormData.dateNaissance,
          address: enrichFormData.adresse,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to enrich customer");
      }

      // Refetch customers to get latest data
      await fetchCustomers();
      setEnrichOpen(false);
      toast.success(t('customers.enrichedSuccess') || "Customer information enriched successfully");
    } catch (err) {
      console.error("Error enriching customer:", err);
      toast.error(t('customers.enrichError') || "Failed to enrich customer");
    }
  };

  const handleAddClient = async () => {
    // Note: Adding customer requires a wheelId. For now, we'll skip this or get it from user's wheels
    toast.error(t('customers.addRequiresWheel') || "Adding customers requires a wheel. Please use the wheel game to create customers.");
    setAddOpen(false);
    // TODO: Implement customer creation with wheelId selection
  };

  // Filtrer et paginer les clients
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      // Search query filter
      const query = searchQuery.toLowerCase();
      const matchesSearch = (
        customer.prenom.toLowerCase().includes(query) ||
        customer.date.toLowerCase().includes(query) ||
        customer.prix.toLowerCase().includes(query) ||
        customer.statut.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query)
      );
      
      // Month and year filter
      const matchesDate = (() => {
        if (!customer.createdAt) return true; // If no date, include by default
        const customerDate = new Date(customer.createdAt);
        return customerDate.getMonth() === selectedMonth && 
               customerDate.getFullYear() === selectedYear;
      })();
      
      return matchesSearch && matchesDate;
    });
  }, [customers, searchQuery, selectedMonth, selectedYear]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCustomers, currentPage, itemsPerPage]);

  // Calculate monthly count (based on createdAt from backend)
  const monthlyCount = useMemo(() => {
    return customers.filter(customer => {
      if (!customer.createdAt) return false;
      const customerDate = new Date(customer.createdAt);
      return customerDate.getMonth() === selectedMonth && 
             customerDate.getFullYear() === selectedYear;
    }).length;
  }, [customers, selectedMonth, selectedYear]);


  const handleDownloadCSV = () => {
    const headers = ["Date", "E-mail", "Prénom", "Téléphone", "Prix", "Code Promo", "Statut", "Enrichi", "Nom", "Date de Naissance", "Adresse"];
    const csvContent = [
      headers.join(","),
      ...customers.map(customer => [
        customer.date,
        customer.email,
        customer.prenom,
        customer.phone,
        `"${customer.prix}"`,
        customer.codePromo || "",
        customer.statut,
        customer.enrichi,
        customer.nom || "",
        customer.dateNaissance || "",
        `"${customer.adresse || ""}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `clients_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  if (error && customers.length === 0) {
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-3">{t('customers.title')}</h1>
            <p className="text-muted-foreground text-lg">
              {t('customers.subtitle')}
            </p>
          </div>
          <Button className="gap-2 shadow-md hover:shadow-lg transition-all" onClick={() => setAddOpen(true)}>
            <UserPlus className="h-4 w-4" />
            {t('customers.addClient')}
          </Button>
        </div>

        {monthlyCount > 0 && <ClientPopup count={monthlyCount} />}

        <Card className="border-border shadow-lg">
          <CardHeader className="border-b border-border bg-muted/30">
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground text-2xl">{t('customers.listTitle')}</CardTitle>
              <div className="flex gap-3 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={t('customers.search')}
                    className="pl-10 w-72 border-border focus:border-primary"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Mois</span>
                  <Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(Number(v))}>
                    <SelectTrigger className="w-[140px] h-9">
                      <SelectValue placeholder="Mois" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((m, idx) => (
                        <SelectItem key={idx} value={idx.toString()}>
                          {m.charAt(0).toUpperCase() + m.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Année</span>
                  <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(Number(v))}>
                    <SelectTrigger className="w-[110px] h-9">
                      <SelectValue placeholder="Année" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((y) => (
                        <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">{t('customers.perPage')}</span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[80px] h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" size="icon" onClick={handleDownloadCSV} className="border-border hover:border-primary">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-visible">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="min-w-[120px]">{t('customers.date')}</TableHead>
                    <TableHead className="min-w-[200px]">{t('customers.email')}</TableHead>
                    <TableHead className="min-w-[120px]">{t('customers.firstName')}</TableHead>
                    <TableHead className="min-w-[150px]">{t('customers.phone')}</TableHead>
                    <TableHead className="min-w-[150px]">{t('customers.price')}</TableHead>
                    <TableHead className="min-w-[120px]">Code Promo</TableHead>
                    <TableHead className="min-w-[120px]">{t('customers.status')}</TableHead>
                    <TableHead className="min-w-[100px]">{t('customers.enriched')}</TableHead>
                    <TableHead className="min-w-[80px]">{t('customers.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
              <TableBody>
                {paginatedCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      {t('customers.noCustomers') || "No customers found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCustomers.map((customer, index) => (
                  <TableRow key={customer.id}>
                    <TableCell className="text-muted-foreground">
                      {customer.date}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {customer.email}
                    </TableCell>
                    <TableCell className="font-medium">
                      {customer.prenom}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {customer.phone}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {customer.prix}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {customer.codePromo || "-"}
                    </TableCell>
                    <TableCell>
                      {customer.statut === "Réclamé" ? (
                        <Badge className="bg-green-600 hover:bg-green-700 text-white">
                          {t('customers.claimed')}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-slate-200 text-slate-700">
                          {t('customers.notClaimed')}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={customer.enrichi === "Oui" ? "default" : "secondary"}
                        className={customer.enrichi === "Oui" ? "bg-primary" : ""}
                      >
                        {customer.enrichi === "Oui" ? t('customers.yes') : t('customers.no')}
                      </Badge>
                    </TableCell>
                    <TableCell data-onboarding={index === 0 ? "client-actions-cell" : undefined}>
                      <DropdownMenu
                        open={openDropdownId === customer.id}
                        onOpenChange={(isOpen) => {
                          setOpenDropdownId(isOpen ? customer.id : null);
                        }}
                      >
                        <DropdownMenuTrigger 
                          asChild
                          onTouchStart={(e) => e.stopPropagation()}
                          onPointerDown={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="focus:outline-none"
                            type="button"
                            aria-label="Actions"
                            data-onboarding={index === 0 ? "client-menu-marie" : undefined}
                          >
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          data-onboarding={index === 0 ? "client-actions" : undefined}
                          align="end" 
                          className="w-48 z-[9999]" 
                          sideOffset={8}
                          side="bottom"
                          onTouchStart={(e) => e.stopPropagation()}
                          onPointerDown={(e) => e.stopPropagation()}
                        >
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault();
                              setOpenDropdownId(null);
                              handleMarkAsRecovered(customer.id);
                            }}
                          >
                            <Gift className="h-4 w-4 mr-2" />
                            {customer.statut === "Réclamé" 
                              ? t('customers.markAsNotClaimed') || "Mark as Not Claimed"
                              : t('customers.markAsClaimed') || "Mark as Claimed"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault();
                              setOpenDropdownId(null);
                              setSelectedCustomer(customer);
                              setDetailsOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            {t('customers.viewDetails')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault();
                              setOpenDropdownId(null);
                              setSelectedCustomer(customer);
                              setEnrichFormData({
                                prenom: customer.prenom,
                                nom: customer.nom,
                                dateNaissance: customer.dateNaissance,
                                adresse: customer.adresse,
                              });
                              setEnrichOpen(true);
                            }}
                          >
                            <UserPlus2 className="h-4 w-4 mr-2" />
                            {t('customers.enrichClient')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onSelect={(e) => {
                              e.preventDefault();
                              setOpenDropdownId(null);
                              handleDeleteCustomer(customer.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t('customers.delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  ))
                )}
              </TableBody>
              </Table>
            </div>
            
            {/* Pagination Controls */}
            <div className="flex items-center justify-end px-4 py-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  {t('customers.previous')}
                </Button>
                <span className="text-sm text-muted-foreground px-2">
                  {t('customers.page')} {currentPage} {t('customers.of')} {totalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  {t('customers.next')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog Détails */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('customers.detailsTitle')}</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">{t('customers.date')}</Label>
                <p className="text-foreground font-medium">{selectedCustomer.date}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">{t('customers.email')}</Label>
                <p className="text-foreground font-medium">{selectedCustomer.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">{t('customers.firstName')}</Label>
                <p className="text-foreground font-medium">{selectedCustomer.prenom}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">{t('customers.phone')}</Label>
                <p className="text-foreground font-medium">{selectedCustomer.phone}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">{t('customers.price')}</Label>
                <p className="text-foreground font-medium">{selectedCustomer.prix}</p>
              </div>
              {selectedCustomer.codePromo && (
                <div>
                  <Label className="text-muted-foreground">Code Promo</Label>
                  <p className="text-foreground font-medium">{selectedCustomer.codePromo}</p>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">{t('customers.status')}</Label>
                <p className="text-foreground font-medium">{selectedCustomer.statut === "Réclamé" ? t('customers.claimed') : t('customers.notClaimed')}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">{t('customers.enriched')}</Label>
                <p className="text-foreground font-medium">{selectedCustomer.enrichi === "Oui" ? t('customers.yes') : t('customers.no')}</p>
              </div>
              {selectedCustomer.nom && (
                <div>
                  <Label className="text-muted-foreground">{t('customers.lastName')}</Label>
                  <p className="text-foreground font-medium">{selectedCustomer.nom}</p>
                </div>
              )}
              {selectedCustomer.dateNaissance && (
                <div>
                  <Label className="text-muted-foreground">{t('customers.birthDate')}</Label>
                  <p className="text-foreground font-medium">{selectedCustomer.dateNaissance}</p>
                </div>
              )}
              {selectedCustomer.adresse && (
                <div>
                  <Label className="text-muted-foreground">{t('customers.address')}</Label>
                  <p className="text-foreground font-medium">{selectedCustomer.adresse}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Enrichir */}
      <Dialog open={enrichOpen} onOpenChange={setEnrichOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('customers.enrichTitle')}</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prenom">{t('customers.firstName')}</Label>
                <Input 
                  id="prenom" 
                  value={enrichFormData.prenom}
                  onChange={(e) => setEnrichFormData(prev => ({ ...prev, prenom: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom">{t('customers.lastName')}</Label>
                <Input 
                  id="nom" 
                  value={enrichFormData.nom}
                  onChange={(e) => setEnrichFormData(prev => ({ ...prev, nom: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateNaissance">{t('customers.birthDate')}</Label>
                <Input 
                  id="dateNaissance" 
                  placeholder="jj/mm/aaaa" 
                  value={enrichFormData.dateNaissance}
                  onChange={(e) => setEnrichFormData(prev => ({ ...prev, dateNaissance: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adresse">{t('customers.address')}</Label>
                <Input 
                  id="adresse" 
                  value={enrichFormData.adresse}
                  onChange={(e) => setEnrichFormData(prev => ({ ...prev, adresse: e.target.value }))}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEnrichOpen(false)}>{t('customers.cancel')}</Button>
                <Button onClick={handleEnrichSave}>{t('customers.save')}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Ajouter */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('customers.addTitle')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="addEmail">{t('customers.email')}</Label>
              <Input 
                id="addEmail" 
                type="email"
                value={addFormData.email}
                onChange={(e) => setAddFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addPrenom">{t('customers.firstName')}</Label>
              <Input 
                id="addPrenom" 
                value={addFormData.prenom}
                onChange={(e) => setAddFormData(prev => ({ ...prev, prenom: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addPhone">{t('customers.phone')}</Label>
              <Input 
                id="addPhone" 
                value={addFormData.phone}
                onChange={(e) => setAddFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addPrix">{t('customers.price')}</Label>
              <Input 
                id="addPrix" 
                value={addFormData.prix}
                onChange={(e) => setAddFormData(prev => ({ ...prev, prix: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addCodePromo">Code Promo</Label>
              <Input 
                id="addCodePromo" 
                value={addFormData.codePromo}
                onChange={(e) => setAddFormData(prev => ({ ...prev, codePromo: e.target.value }))}
                placeholder="Optionnel"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setAddOpen(false)}>{t('customers.cancel')}</Button>
              <Button onClick={handleAddClient}>{t('customers.add')}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
