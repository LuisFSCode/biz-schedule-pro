import { useState, useEffect } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Settings, Users, BarChart3, LogOut, Plus, Edit, Trash2, LayoutDashboard, BriefcaseBusiness, PanelLeftClose, PanelRightClose, Settings2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VisualSettingsForm } from "@/components/VisualSettingsForm";

// Componente para renderização condicional do conteúdo das tabs
const ConditionalTabsContent = ({ value, activeTab, children, ...props }: any) => {
  if (value !== activeTab) return null;
  return <TabsContent value={value} {...props}>{children}</TabsContent>;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [establishment, setEstablishment] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("appointments");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return;
    }
    
    await loadEstablishmentData();
  };

  const loadEstablishmentData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Carregar dados do estabelecimento
      const { data: establishmentData, error: establishmentError } = await supabase
        .from('establishments')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (establishmentError) throw establishmentError;

      setEstablishment(establishmentData);
      setServices(Array.isArray(establishmentData.services) ? establishmentData.services : []);

      // Carregar agendamentos
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          *,
          customers(name, email, phone)
        `)
        .eq('establishment_id', session.user.id)
        .order('appointment_date', { ascending: true });

      if (appointmentsError) throw appointmentsError;
      setAppointments(appointmentsData || []);

    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const addService = async () => {
    const newService = {
      id: Date.now().toString(),
      name: "Novo Serviço",
      duration: 60,
      price: 0,
      description: ""
    };

    const updatedServices = [...services, newService];
    setServices(updatedServices);

    const { error } = await supabase
      .from('establishments')
      .update({ services: updatedServices })
      .eq('id', establishment.id);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar serviço",
        variant: "destructive"
      });
    }
  };

  const updateService = async (serviceId: string, updates: any) => {
    const updatedServices = services.map(service => 
      service.id === serviceId ? { ...service, ...updates } : service
    );
    setServices(updatedServices);

    const { error } = await supabase
      .from('establishments')
      .update({ services: updatedServices })
      .eq('id', establishment.id);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar serviço",
        variant: "destructive"
      });
    }
  };

  const deleteService = async (serviceId: string) => {
    const updatedServices = services.filter(service => service.id !== serviceId);
    setServices(updatedServices);

    const { error } = await supabase
      .from('establishments')
      .update({ services: updatedServices })
      .eq('id', establishment.id);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover serviço",
        variant: "destructive"
      });
    }
  };

  const updateEstablishment = async (updates: any) => {
    const { error } = await supabase
      .from('establishments')
      .update(updates)
      .eq('id', establishment.id);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar estabelecimento",
        variant: "destructive"
      });
    } else {
      setEstablishment({ ...establishment, ...updates });
      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso!"
      });
    }
  };

  if (loading) {
    return (
      <div className=" flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden h-screen flex flex-col bg-gradient-to-b from-primary/5 to-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Dashboard - {establishment?.name}</h1>
              <p className="text-sm text-muted-foreground">schedulepro.com/{establishment?.slug}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <div className="flex h-full w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex w-full h-full">
          {/* sidebar lateral */}
          <div className={`relative flex-shrink-0 ${sidebarOpen ? 'w-40' : 'w-14'} transition-all duration-200 ease-in-out`}>
            <div className="absolute flex justify-center border-r-1 border-white items-center -right-2 bg-gray-200/40 top-1 m-0" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <PanelLeftClose className="w-4 h-4 p-0" /> : <PanelRightClose className="p-0 w-4 h-4" />}
            </div>
            <TabsList className={`bg-gray-200/40 flex flex-col items-center justify-start h-full py-4 gap-2 px-2 rounded-none border border-r-2`}>
              <div className="h-4"></div>
              <TabsTrigger value="appointments" className={`transition-all duration-1000 ease-in-out w-full min-w-6 h-8 flex items-center ${sidebarOpen ?  'justify-start' : 'justify-center'} cursor-pointer text-sm font-medium`}>   
                {sidebarOpen ? (
                  <div className={`transition-all duration-1000 ease-in-out flex items-center justify-center gap-2`}>
                    <Calendar className={`w-6 h-6`}/>
                    <p className={`transition-all duration-1000 flex items-center justify-center ${sidebarOpen ? 'opacity-100' : 'opacity-0'} `}>Agendamentos</p>
                  </div> 
                    
                ) : <div className={`transition-all duration-1000 ease-in-out flex items-center justify-center gap-0 w-6 h-6`}>
                      <Calendar className={`w-6 h-6 items-center`}/>
                  </div> 
                }
              </TabsTrigger>

             
              <TabsTrigger value="services" className={`transition-all duration-1000 ease-in-out w-full min-w-6 h-8 flex items-center ${sidebarOpen ?  'justify-start' : 'justify-center'} cursor-pointer text-sm font-medium`}>   
                {sidebarOpen ? (
                  <div className={`transition-all duration-1000 ease-in-out flex items-center gap-2`}>
                    <BriefcaseBusiness className={`w-6 h-6`}/>
                    <p className={`transition-all duration-1000 flex items-center justify-center ${sidebarOpen ? 'opacity-100' : 'opacity-0'} `}>Serviços</p>
                  </div> 
                    
                ) : <div className={`transition-all duration-1000 ease-in-out flex items-center gap-2`}>
                      <BriefcaseBusiness className={'w-6 h-6'}/>
                  </div>
                }
              </TabsTrigger>

              <TabsTrigger value="analytics" className={`transition-all duration-1000 ease-in-out w-full min-w-6 h-8 flex items-center ${sidebarOpen ?  'justify-start' : 'justify-center'} cursor-pointer text-sm font-medium`}>   
                {sidebarOpen ? (
                  <div className={`transition-all duration-1000 ease-in-out flex items-center gap-2`}>
                    <BarChart3 className={`w-6 h-6`}/>
                    <p className={`transition-all duration-1000 flex items-center justify-center ${sidebarOpen ? 'opacity-100' : 'opacity-0'} `}>Relatórios</p>
                  </div> 
                    
                ) : 
                <div className={`transition-all duration-1000 ease-in-out flex items-center gap-2`}>
                      <BarChart3 className={'w-6 h-6'}/>
                  </div>
                }
              </TabsTrigger>

              <TabsTrigger value="settings" className={`transition-all duration-1000 ease-in-out w-full min-w-6 h-8 flex items-center ${sidebarOpen ?  'justify-start' : 'justify-center'} cursor-pointer text-sm font-medium`}>   
                {sidebarOpen ? (
                  <div className={`transition-all duration-1000 ease-in-out flex items-center gap-2`}>
                    <Settings className={`w-6 h-6`}/>
                    <p className={`transition-all duration-1000 flex items-center justify-center ${sidebarOpen ? 'opacity-100' : 'opacity-0'} `}>Configurações</p>
                  </div> 
                    
                ) : <div className={`transition-all duration-1000 ease-in-out flex items-center gap-2`}>
                      <Settings className={'w-6 h-6'}/>
                  </div>}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* main content area */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Agendamentos */}
            <ConditionalTabsContent value="appointments" activeTab={activeTab} className="flex-1 px-4 py-4 overflow-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Próximos Agendamentos</CardTitle>
                  <CardDescription>
                    {appointments.length} agendamento(s) encontrado(s)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {appointments.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Nenhum agendamento encontrado</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {appointments.map((appointment) => (
                        <div key={appointment.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{appointment.service_name}</h3>
                              <p className="text-sm text-muted-foreground">
                                Cliente: {appointment.customers?.name || 'N/A'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(appointment.appointment_date).toLocaleDateString('pt-BR')} às {appointment.appointment_time}
                              </p>
                              {appointment.notes && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  Observações: {appointment.notes}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {appointment.status === 'confirmed' ? 'Confirmado' :
                                 appointment.status === 'pending' ? 'Pendente' : appointment.status}
                              </span>
                              {appointment.service_price && (
                                <p className="text-sm font-semibold mt-1">
                                  R$ {appointment.service_price.toFixed(2)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </ConditionalTabsContent>

            {/* Serviços */}
            <ConditionalTabsContent value="services" activeTab={activeTab} className="flex-1 px-4 py-4 overflow-auto">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Serviços Oferecidos</CardTitle>
                    <CardDescription>
                      Gerencie os serviços do seu estabelecimento
                    </CardDescription>
                  </div>
                  <Button onClick={addService}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Serviço
                  </Button>
                </CardHeader>
                <CardContent>
                  {services.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Nenhum serviço cadastrado</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {services.map((service) => (
                        <ServiceCard 
                          key={service.id} 
                          service={service} 
                          onUpdate={updateService}
                          onDelete={deleteService}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </ConditionalTabsContent>

            {/* Relatórios */}
            <ConditionalTabsContent value="analytics" activeTab={activeTab} className="flex-1 px-4 py-4 overflow-auto">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Agendamentos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{appointments.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Agendamentos Confirmados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {appointments.filter(a => a.status === 'confirmed').length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Serviços Ativos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{services.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      R$ {appointments
                        .filter(a => a.status === 'confirmed' && a.service_price)
                        .reduce((sum, a) => sum + (a.service_price || 0), 0)
                        .toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ConditionalTabsContent>

            {/* Configurações */}
            <ConditionalTabsContent value="settings" activeTab={activeTab} className="flex-1 px-4 py-4 overflow-auto">
              <div className="space-y-6">
                <SettingsForm establishment={establishment} onUpdate={updateEstablishment} />
                <VisualSettingsForm establishment={establishment} onUpdate={updateEstablishment} />
              </div>
            </ConditionalTabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

const ServiceCard = ({ service, onUpdate, onDelete }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(service);

  const handleSave = () => {
    onUpdate(service.id, editData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Serviço</Label>
              <Input
                id="name"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duração (minutos)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={editData.duration}
                  onChange={(e) => setEditData({ ...editData, duration: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={editData.price}
                  onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>Salvar</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{service.name}</h3>
            <p className="text-sm text-muted-foreground">
              {service.duration} min • R$ {service.price?.toFixed(2) || '0.00'}
            </p>
            {service.description && (
              <p className="text-sm text-muted-foreground mt-2">{service.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => onDelete(service.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SettingsForm = ({ establishment, onUpdate }: any) => {
  const [formData, setFormData] = useState({
    // Dados do estabelecimento
    name: establishment?.name || '',
    phone: establishment?.phone || '',
    address: establishment?.address || '',
    whatsapp: establishment?.whatsapp || '',
    instagram_url: establishment?.instagram_url || '',
    facebook_url: establishment?.facebook_url || '',
    
    // Personalização da Landing Page
    favicon_url: establishment?.favicon_url || '',
    logo_url: establishment?.logo_url || '',
    hero_title: establishment?.hero_title || 'Bem-vindos ao nosso estabelecimento',
    hero_description: establishment?.hero_description || 'Agende seus serviços de forma rápida e fácil',
    hero_image_url: establishment?.hero_image_url || '',
    color_primary: establishment?.color_primary || '#3B82F6',
    footer_text: establishment?.footer_text || 'Desenvolvido com SchedulePro',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <Card className='border-2 border-violet-800 '>
      <CardHeader>
        <CardTitle>Configurações do Estabelecimento</CardTitle>
        <CardDescription>
          Atualize as informações do seu negócio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações do Estabelecimento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome do Estabelecimento</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="instagram_url">Instagram</Label>
                <Input
                  id="instagram_url"
                  placeholder="https://instagram.com/seuusuario"
                  value={formData.instagram_url}
                  onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="facebook_url">Facebook</Label>
                <Input
                  id="facebook_url"
                  placeholder="https://facebook.com/suapagina"
                  value={formData.facebook_url}
                  onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personalização da Landing Page</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="favicon_url">Favicon (URL)</Label>
                <Input
                  id="favicon_url"
                  placeholder="https://exemplo.com/favicon.png"
                  value={formData.favicon_url}
                  onChange={(e) => setFormData({ ...formData, favicon_url: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">Ícone que aparece na aba do navegador</p>
              </div>
              <div>
                <Label htmlFor="logo_url">Logo (URL)</Label>
                <Input
                  id="logo_url"
                  placeholder="https://exemplo.com/logo.png"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">Logo que aparece no header</p>
              </div>
            </div>

            <div>
              <Label htmlFor="color_primary">Cor Principal</Label>
              <Input
                id="color_primary"
                type="color"
                value={formData.color_primary}
                onChange={(e) => setFormData({ ...formData, color_primary: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">Cor principal do tema da landing page</p>
            </div>
            
            <div>
              <Label htmlFor="hero_image_url">Imagem do Hero (URL)</Label>
              <Input
                id="hero_image_url"
                placeholder="https://exemplo.com/hero-image.jpg"
                value={formData.hero_image_url}
                onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">Imagem de fundo da seção principal</p>
            </div>
            
            <div>
              <Label htmlFor="hero_title">Título Principal</Label>
              <Input
                id="hero_title"
                value={formData.hero_title}
                onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">Título que aparece na seção hero</p>
            </div>
            
            <div>
              <Label htmlFor="hero_description">Descrição Principal</Label>
              <Textarea
                id="hero_description"
                value={formData.hero_description}
                onChange={(e) => setFormData({ ...formData, hero_description: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">Descrição que aparece abaixo do título</p>
            </div>
            
            <div>
              <Label htmlFor="footer_text">Texto do Rodapé</Label>
              <Input
                id="footer_text"
                value={formData.footer_text}
                onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">Texto que aparece no rodapé da página</p>
            </div>
          </div>
          
          <Button type="submit" className="w-full">
            Salvar Configurações
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Dashboard;