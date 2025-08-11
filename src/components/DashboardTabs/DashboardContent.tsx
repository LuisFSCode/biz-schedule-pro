import { useIntegrations } from "@/context/IntegrationsContext";
import AppointmentsTab from "@/components/DashboardTabs/AppointmentsTab";
import ServicesTab from "@/components/DashboardTabs/ServicesTab";
import ProfessionalsTab from "@/components/DashboardTabs/ProfessionalsTab";
import IntegrationsTab from "@/components/DashboardTabs/IntegrationsTab";
// import SettingsForm from "@/components/SettingsForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Settings, Users, UserCheck, BarChart3, LogOut, BriefcaseBusiness, Cable, PanelLeftClose, PanelRightClose } from "lucide-react";
import { useState } from "react";
import { CardDescription } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { VisualSettingsForm } from "../VisualSettingsForm";
import ReportTab from "./ReportsTab";
import SettingsForm from "./SettingsTab";

interface tabsProps { activeTab: string; value: string; className?: string; children?: React.ReactNode; };

export default function DashboardContent(props) {
  const {
    integrations, setIntegrations,
    integrationTypeToAdd, setIntegrationTypeToAdd,
    showIntegrationSelector, setShowIntegrationSelector,
    integrationWarning, setIntegrationWarning,
    integrationToAdd, setIntegrationToAdd,
    integrationOptions
  } = useIntegrations();

  // Você pode acessar os props do DashboardState normalmente:
  const {
    sidebarOpen, setSidebarOpen,
    toast,
    activeTab, setActiveTab,
    services, setServices,
    appointments, setAppointments,
    establishment, setEstablishment,
    settingsTab, setSettingsTab,
    handleLogout,
    updateEstablishment,
  } = props;

  const ConditionalTabsContent = ({ activeTab, value, className, children }: tabsProps) => {
      return (
        <TabsContent value={value} className={className}>
          {activeTab === value ? children : null}
        </TabsContent>
      );
    };

  function addIntegrationByName(name: string, type: string, isCopy = false) {
    const newIntegration = {
      id: Date.now().toString() + (isCopy ? '-copy' : 'copia'),
      name,
      type,
      isActive: false,
      credentials: {},
      created_at: Date.now().toString(),
    };
    setIntegrations(prev => [...prev, newIntegration]);
  }

  return (
   <div className=" min-h-dvh h-dvh border border-red-600 overflow-y-hidden flex flex-col bg-gradient-to-b from-primary/5 to-background">
    <div className="border border-green-600 h-full overflow-hidden flex flex-col">
        {showIntegrationSelector && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Escolha uma integração</h3>
            <div className="space-y-2">
                {integrationOptions.map(opt => {
                const alreadyExists = integrations.some(i => i.type === opt.type);
                
                return (
                    <div key={opt.id} className="flex items-center justify-between border rounded p-2">
                    <span>{opt.name} </span>
                    <Button
                        variant="outline"
                        onClick={() => {
                        if (alreadyExists) {
                            setIntegrationWarning(opt.name);
                            setIntegrationToAdd(opt.type);
                            let copyIndex = integrations.filter(i => i.type === opt.type || i.name.startsWith(`${opt.name} - copia`)).length;
                            setIntegrationToAdd(`${opt.name} - copia (${copyIndex})`);
                        } else {
                            addIntegrationByName(opt.name, opt.type);
                            setShowIntegrationSelector(false);
                        }
                        }}
                    >
                        {alreadyExists ? 'Adicionar Cópia' : 'Adicionar'}
                    </Button>
                    </div>
                );
                })}
            </div>
            <Button className="mt-4 w-full" variant="secondary" onClick={() => setShowIntegrationSelector(false)}>
                Cancelar
            </Button>
            {integrationWarning && (
                <div className="mt-4 p-2 bg-yellow-100 text-yellow-800 rounded">
                {integrationWarning} já está em uso, deseja adicionar uma cópia?
                <div className="flex gap-2 mt-2">
                    <Button
                    size="sm"
                    onClick={() => {
                        addIntegrationByName(integrationToAdd, integrationTypeToAdd, true);
                        setIntegrationWarning(null);
                        setShowIntegrationSelector(false);
                    }}
                    >
                    Sim
                    </Button>
                    <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIntegrationWarning(null)}
                    >
                    Não
                    </Button>
                </div>
                </div>
            )}
            </div>
        </div>
        )}

        {/* Header */}
        <div className="h-fit" >
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-auto ">
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
        </div>

     <div className="flex w-full h-full overflow-hidden  ">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex w-full h-full border border-blue-600 ">
            {/* sidebar lateral */}
            <div className={`relative h-auto flex-shrink-0 ${sidebarOpen ? 'w-40' : 'w-14'} border-r-2 border-gray-400/20 transition-all duration-400 ease-in-out`}>
            <div className="absolute z-10 flex justify-center border-r-1 rounded-full border-none items-center -right-3 bg-gray-200 p-1 top-1 m-0" onClick={() =>  setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <PanelLeftClose className="w-4 h-4 p-0" /> : <PanelRightClose className="w-4 h-4 p-0" />}
            </div>
            <TabsList className={` flex flex-col items-center justify-start h-full py-4 gap-2 px-2 rounded-none   transition-all duration-200 ease-in-out`}>
                <div className="h-4"></div>
                <TabsTrigger value="appointments" className={`transition-all duration-1000 ease-in-out w-full min-w-6 h-8 flex items-center ${sidebarOpen ?  'justify-start' : 'justify-center'} cursor-pointer text-sm font-medium`}>   
                {sidebarOpen ? (
                    <div className={`transition-all duration-1000 ease-in-out flex items-center justify-center gap-2`}>
                    <Calendar className={`w-6 h-6`}/>
                    <p className={`transition-all duration-1000 flex items-center justify-center ${sidebarOpen ? 'opacity-100' : 'opacity-0'} `}>Agendamentos</p>
                    </div> 
                    
                ) : 
                    <div className={`transition-all duration-1000 ease-in-out flex items-center justify-center gap-0 w-6 h-6`}>
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
                    
                ) : 
                    <div className={`transition-all duration-1000 ease-in-out flex items-center gap-2`}>
                    <BriefcaseBusiness className={'w-6 h-6'}/>
                    </div>
                }
                </TabsTrigger>

                <TabsTrigger value="professionals" className={`transition-all duration-1000 ease-in-out w-full min-w-6 h-8 flex items-center ${sidebarOpen ?  'justify-start' : 'justify-center'} cursor-pointer text-sm font-medium`}>   
                {sidebarOpen ? (
                    <div className={`transition-all duration-1000 ease-in-out flex items-center gap-2`}>
                    <UserCheck className={`w-6 h-6`}/>
                    <p className={`transition-all duration-1000 flex items-center justify-center ${sidebarOpen ? 'opacity-100' : 'opacity-0'} `}>Profissionais</p>
                    </div> 
                    
                ) : 
                    <div className={`transition-all duration-1000 ease-in-out flex items-center gap-2`}>
                    <UserCheck className={'w-6 h-6'}/>
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
                <TabsTrigger value="integrations" className={`transition-all duration-1000 ease-in-out w-full min-w-6 h-8 flex items-center ${sidebarOpen ?  'justify-start' : 'justify-center'} cursor-pointer text-sm font-medium`}>   
                {sidebarOpen ? (
                    <div className={`transition-all duration-1000 ease-in-out flex items-center gap-2`}>
                    <Cable className={`w-6 h-6`}/>
                    <p className={`transition-all duration-1000 flex items-center justify-center ${sidebarOpen ? 'opacity-100' : 'opacity-0'} `}>Integrações</p>
                    </div> 
                    
                ) : 
                    <div className={`transition-all duration-1000 ease-in-out flex items-center gap-2`}>
                    <Cable className={'w-6 h-6'}/>
                    </div>
                }
                </TabsTrigger>

                <TabsTrigger value="settings" className={`transition-all duration-1000 ease-in-out w-full min-w-6 h-10 flex items-center ${sidebarOpen ?  'justify-start' : 'justify-center'} cursor-pointer text-sm font-medium`}>   
                {sidebarOpen ? (
                
                    <div className={`transition-all duration-1000 ease-in-out flex items-center gap-2`}>
                    <Settings className={`w-6 h-6`}/>
                    <p className={`transition-all duration-1000 flex items-center justify-center ${sidebarOpen ? 'opacity-100' : 'opacity-0'} flex text-wrap leading-4 text-left`}>Configurações</p>
                    </div> 
                    
                ) : 
                    <div className={`transition-all duration-1000 ease-in-out flex items-center gap-2`}>
                    <Settings className={'w-6 h-6'}/>
                    </div>}
                </TabsTrigger>
                
            </TabsList>
            </div>

            {/* main content */}
            <div className="flex-1 flex relative overflow-hidden ">
                {/* Agendamentos */}
                <ConditionalTabsContent value="appointments" activeTab={activeTab} className=" flex-1 px-4 py-4 h-full absolute w-full overflow-auto">
                    <AppointmentsTab />
                </ConditionalTabsContent>
                
                {/* Serviços */}
                <ConditionalTabsContent value="services" activeTab={activeTab} className=" flex-1 px-4 py-4 h-full absolute w-full overflow-auto">
                    <ServicesTab />
                </ConditionalTabsContent>

                {/* Profissionais */}
                <ConditionalTabsContent value="professionals" activeTab={activeTab} className=" flex-1 px-4 py-4 h-full absolute w-full overflow-auto">
                    <ProfessionalsTab />
                </ConditionalTabsContent>

                {/* Relatórios */}
                <ConditionalTabsContent value="analytics" activeTab={activeTab} className=" flex-1 px-4 py-4 h-full absolute w-full overflow-auto">
                    <ReportTab/>
                </ConditionalTabsContent>
                
                {/* Integrations */}
                <ConditionalTabsContent value='integrations' activeTab={activeTab} className="border border-red-600 flex-1 px-4 py-4 h-full absolute w-full overflow-auto">
                    <IntegrationsTab/>
                </ConditionalTabsContent>

                {/* Configurações */}
                <ConditionalTabsContent value="settings" activeTab={activeTab} className="flex-1 absolute w-full h-full">
                    <div className="space-y-6 w-full h-full">
                        <SettingsForm
                            establishment={establishment}
                            onUpdate={updateEstablishment}
                            tabValue={settingsTab}
                            setTabValue={setSettingsTab}
                        />
                    </div>
                </ConditionalTabsContent>
            </div>
            {/* end content main */}
        </Tabs>
     </div>
    </div>         
   </div>
  )
  
}

// const SettingsForm = ({ establishment, onUpdate,  tabValue, setTabValue }: any) => {

//   const [formData, setFormData] = useState({
//     // Dados do estabelecimento
//     name: establishment?.name || '',
//     phone: establishment?.phone || '',
//     address: establishment?.address || '',
//     whatsapp: establishment?.whatsapp || '',
//     instagram_url: establishment?.instagram_url || '',
//     facebook_url: establishment?.facebook_url || '',
    
//     // Personalização da Landing Page
//     favicon_url: establishment?.favicon_url || '',
//     logo_url: establishment?.logo_url || '',
//     hero_title: establishment?.hero_title || 'Bem-vindos ao nosso estabelecimento',
//     hero_description: establishment?.hero_description || 'Agende seus serviços de forma rápida e fácil',
//     hero_image_url: establishment?.hero_image_url || '',
//     color_primary: establishment?.color_primary || '#3B82F6',
//     footer_text: establishment?.footer_text || 'Desenvolvido com SchedulePro',
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onUpdate({formData});
//   };

//   return (
//     <div className="h-full">
//     <div className="flex h-full w-full ">
//       <Tabs value={tabValue} onValueChange={setTabValue} className="flex flex-col w-full h-full ">
//         <div className='transition-all duration-400 ease-in-out '>
//             <TabsList className="rounded-none px-4 flex gap-5">
            
//                 <TabsTrigger value="*" className={`border transition-all duration-1000 ease-in-out w-full min-w-6 h-8 flex items-center cursor-pointer text-sm font-medium`}>   
//                     <div className={`transition-all duration-1000 ease-in-out flex items-center justify-center gap-2`}>
//                     <Calendar className={`w-6 h-6`}/>
//                     <p className={`transition-all duration-1000 flex items-center justify-center`}>Config. De Conta</p>
//                     </div> 
//                 </TabsTrigger>

//                 <TabsTrigger value="AcountConfig" className={`border transition-all duration-1000 ease-in-out w-full min-w-6 h-8 flex items-center cursor-pointer text-sm font-medium`}>   
//                     <div className={`transition-all duration-1000 ease-in-out flex items-center justify-center gap-2`}>
//                     <Calendar className={`w-6 h-6`}/>
//                     <p className={`transition-all duration-1000 flex items-center justify-center`}>Config. de Negócio</p>
//                     </div> 
//                 </TabsTrigger>



//                 <TabsTrigger value="ConfigSite" className={`border transition-all duration-1000 ease-in-out w-full min-w-6 h-8 flex items-center cursor-pointer text-sm font-medium`}>   
//                     <div className={`transition-all duration-1000 ease-in-out flex items-center justify-center gap-2`}>
//                     <Calendar className={`w-6 h-6`}/>
//                     <p className={`transition-all duration-1000 flex items-center justify-center`}>Config. De Site</p>
//                     </div> 
//                 </TabsTrigger>

//                 <TabsTrigger value="VisualSettingForm" className={`border transition-all duration-1000 ease-in-out w-full min-w-6 h-8 flex items-center cursor-pointer text-sm font-medium`}>   
//                     <div className={`transition-all duration-1000 ease-in-out flex items-center justify-center gap-2`}>
//                     <Calendar className={`w-6 h-6`}/>
//                     <p className={`transition-all duration-1000 flex items-center justify-center`}>Configs. Extras</p>
//                     </div> 
//                 </TabsTrigger>

//             </TabsList>
//         </div>
//         <div className="flex-1 flex flex-col  relative h-full ">
//             <div className="relative flex h-full overflow-hidden">
//                 <TabsContent value="AcountConfig" className="flex-1 absolute px-4 py-4 w-full h-full overflow-auto">
//                     <Card className="shadow-lg  flex-1 px-4 py-4 h-full w-full ">
//                     <CardHeader>
//                         <CardTitle>Configurações do Estabelecimento</CardTitle>
//                         <CardDescription>
//                         Atualize as informações do seu negócio
//                         </CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                         <form onSubmit={handleSubmit} className="space-y-6">
//                         <div className="space-y-4">
//                             <h3 className="text-lg font-semibold">Informações do Estabelecimento</h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                                 <Label htmlFor="name">Nome do Estabelecimento</Label>
//                                 <Input
//                                 id="name"
//                                 value={formData.name}
//                                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                                 />
//                             </div>
//                             <div>
//                                 <Label htmlFor="phone">Telefone</Label>
//                                 <Input
//                                 id="phone"
//                                 value={formData.phone}
//                                 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                                 />
//                             </div>
//                             <div>
//                                 <Label htmlFor="whatsapp">WhatsApp</Label>
//                                 <Input
//                                 id="whatsapp"
//                                 value={formData.whatsapp}
//                                 onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
//                                 />
//                             </div>
//                             <div>
//                                 <Label htmlFor="address">Endereço</Label>
//                                 <Input
//                                 id="address"
//                                 value={formData.address}
//                                 onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//                                 />
//                             </div>
//                             <div>
//                                 <Label htmlFor="instagram_url">Instagram</Label>
//                                 <Input
//                                 id="instagram_url"
//                                 placeholder="https://instagram.com/seuusuario"
//                                 value={formData.instagram_url}
//                                 onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
//                                 />
//                             </div>
//                             <div>
//                                 <Label htmlFor="facebook_url">Facebook</Label>
//                                 <Input
//                                 id="facebook_url"
//                                 placeholder="https://facebook.com/suapagina"
//                                 value={formData.facebook_url}
//                                 onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
//                                 />
//                             </div>
//                             </div>
//                         </div>
                        
//                         <Button type="submit" className="w-full">
//                             Salvar Configurações
//                         </Button>
//                         </form>
//                     </CardContent>
//                     </Card>
//                 </TabsContent>
//                 <form onSubmit={handleSubmit}>
//                     <TabsContent value="ConfigSite" className="flex-1 absolute px-4 py-4 w-full h-full overflow-auto">
//                     <Card>
//                         <CardHeader>
//                         <h3 className="text-lg font-semibold">Personalização da Landing Page</h3>
//                         </CardHeader>
//                         <CardContent className="space-y-4">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                             <Label htmlFor="favicon_url">Favicon (URL)</Label>
//                             <Input
//                                 id="favicon_url"
//                                 placeholder="https://exemplo.com/favicon.png"
//                                 value={formData.favicon_url}
//                                 onChange={(e) => setFormData({ ...formData, favicon_url: e.target.value })}
//                             />
//                             <p className="text-xs text-muted-foreground mt-1">Ícone que aparece na aba do navegador</p>
//                             </div>
//                             <div>
//                             <Label htmlFor="logo_url">Logo (URL)</Label>
//                             <Input
//                                 id="logo_url"
//                                 placeholder="https://exemplo.com/logo.png"
//                                 value={formData.logo_url}
//                                 onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
//                             />
//                             <p className="text-xs text-muted-foreground mt-1">Logo que aparece no header</p>
//                             </div>
//                         </div>

//                         <div>
//                             <Label htmlFor="color_primary">Cor Principal</Label>
//                             <Input
//                             id="color_primary"
//                             type="color"
//                             value={formData.color_primary}
//                             onChange={(e) => setFormData({ ...formData, color_primary: e.target.value })}
//                             />
//                             <p className="text-xs text-muted-foreground mt-1">Cor principal do tema da landing page</p>
//                         </div>
                        
//                         <div>
//                             <Label htmlFor="hero_image_url">Imagem do Hero (URL)</Label>
//                             <Input
//                             id="hero_image_url"
//                             placeholder="https://exemplo.com/hero-image.jpg"
//                             value={formData.hero_image_url}
//                             onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
//                             />
//                             <p className="text-xs text-muted-foreground mt-1">Imagem de fundo da seção principal</p>
//                         </div>
                        
//                         <div>
//                             <Label htmlFor="hero_title">Título Principal</Label>
//                             <Input
//                             id="hero_title"
//                             value={formData.hero_title}
//                             onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
//                             />
//                             <p className="text-xs text-muted-foreground mt-1">Título que aparece na seção hero</p>
//                         </div>
                        
//                         <div>
//                             <Label htmlFor="hero_description">Descrição Principal</Label>
//                             <Textarea
//                             id="hero_description"
//                             value={formData.hero_description}
//                             onChange={(e) => setFormData({ ...formData, hero_description: e.target.value })}
//                             />
//                             <p className="text-xs text-muted-foreground mt-1">Descrição que aparece abaixo do título</p>
//                         </div>
                        
//                         <div>
//                             <Label htmlFor="footer_text">Texto do Rodapé</Label>
//                             <Input
//                             id="footer_text"
//                             value={formData.footer_text}
//                             onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
//                             />
//                             <p className="text-xs text-muted-foreground mt-1">Texto que aparece no rodapé da página</p>
//                         </div>
//                         <Button type="submit" className="w-full">
//                             Salvar Configurações
//                         </Button>
//                         </CardContent>
//                     </Card>
//                     </TabsContent>
//                 </form>

//                 <TabsContent value="VisualSettingForm" className="flex-1 absolute px-4 py-4 w-full h-full overflow-auto"> 
//                     <VisualSettingsForm establishment={establishment} onUpdate={onUpdate} />
//                 </TabsContent>
//             </div>
//         </div>
    
//       </Tabs>
//     </div>
//     </div>
//   );
// };