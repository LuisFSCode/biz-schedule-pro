import { DashboardProvider } from "@/context/DashboardContext";
import { IntegrationsProvider } from "@/context/IntegrationsContext";
import { DashboardState } from "@/hooks/DashboardHooks/DashboardHooks";
import DashboardContent from "@/components/DashboardTabs/DashboardContent";

const Dashboard = () => {
  const {
    loading, setLoading,
    sidebarOpen, setSidebarOpen,
    toast,
    activeTab, setActiveTab,
    services, setServices,
    appointments, setAppointments,
    establishment, setEstablishment,
    settingsTab, setSettingsTab,
    handleLogout,
    updateEstablishment,
  } = DashboardState();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardProvider >
      <IntegrationsProvider>
        <DashboardContent
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          toast={toast}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          services={services}
          setServices={setServices}
          appointments={appointments}
          setAppointments={setAppointments}
          establishment={establishment}
          setEstablishment={setEstablishment}
          settingsTab={settingsTab}
          setSettingsTab={setSettingsTab}
          handleLogout={handleLogout}
          updateEstablishment={updateEstablishment} // Removed because it's not defined
        />
      </IntegrationsProvider>
    </DashboardProvider>
  );
};

export default Dashboard;


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
//       <div className="flex h-full w-full ">
//         <Tabs value={tabValue} onValueChange={setTabValue} className="flex flex-col w-full h-full ">
//           <div className='transition-all duration-400 ease-in-out '>
//             <TabsList className="rounded-none px-4 flex gap-5">
              
//               <TabsTrigger value="*" className={`border transition-all duration-1000 ease-in-out w-full min-w-6 h-8 flex items-center cursor-pointer text-sm font-medium`}>   
//                 <div className={`transition-all duration-1000 ease-in-out flex items-center justify-center gap-2`}>
//                   <Calendar className={`w-6 h-6`}/>
//                   <p className={`transition-all duration-1000 flex items-center justify-center`}>Config. De Conta</p>
//                 </div> 
//               </TabsTrigger>

//               <TabsTrigger value="AcountConfig" className={`border transition-all duration-1000 ease-in-out w-full min-w-6 h-8 flex items-center cursor-pointer text-sm font-medium`}>   
//                 <div className={`transition-all duration-1000 ease-in-out flex items-center justify-center gap-2`}>
//                   <Calendar className={`w-6 h-6`}/>
//                   <p className={`transition-all duration-1000 flex items-center justify-center`}>Config. de Negócio</p>
//                 </div> 
//               </TabsTrigger>



//               <TabsTrigger value="ConfigSite" className={`border transition-all duration-1000 ease-in-out w-full min-w-6 h-8 flex items-center cursor-pointer text-sm font-medium`}>   
//                 <div className={`transition-all duration-1000 ease-in-out flex items-center justify-center gap-2`}>
//                   <Calendar className={`w-6 h-6`}/>
//                   <p className={`transition-all duration-1000 flex items-center justify-center`}>Config. De Site</p>
//                 </div> 
//               </TabsTrigger>

//               <TabsTrigger value="VisualSettingForm" className={`border transition-all duration-1000 ease-in-out w-full min-w-6 h-8 flex items-center cursor-pointer text-sm font-medium`}>   
//                 <div className={`transition-all duration-1000 ease-in-out flex items-center justify-center gap-2`}>
//                   <Calendar className={`w-6 h-6`}/>
//                   <p className={`transition-all duration-1000 flex items-center justify-center`}>Configs. Extras</p>
//                 </div> 
//               </TabsTrigger>

//             </TabsList>
//           </div>
//           <div className="flex-1 flex flex-col  relative h-full ">
//             <div className="relative flex h-full overflow-hidden">
//               <TabsContent value="AcountConfig" className="flex-1 absolute px-4 py-4 w-full h-full overflow-auto">
//                 <Card className="shadow-lg  flex-1 px-4 py-4 h-full w-full ">
//                   <CardHeader>
//                     <CardTitle>Configurações do Estabelecimento</CardTitle>
//                     <CardDescription>
//                       Atualize as informações do seu negócio
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <form onSubmit={handleSubmit} className="space-y-6">
//                       <div className="space-y-4">
//                         <h3 className="text-lg font-semibold">Informações do Estabelecimento</h3>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <div>
//                             <Label htmlFor="name">Nome do Estabelecimento</Label>
//                             <Input
//                               id="name"
//                               value={formData.name}
//                               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                             />
//                           </div>
//                           <div>
//                             <Label htmlFor="phone">Telefone</Label>
//                             <Input
//                               id="phone"
//                               value={formData.phone}
//                               onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                             />
//                           </div>
//                           <div>
//                             <Label htmlFor="whatsapp">WhatsApp</Label>
//                             <Input
//                               id="whatsapp"
//                               value={formData.whatsapp}
//                               onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
//                             />
//                           </div>
//                           <div>
//                             <Label htmlFor="address">Endereço</Label>
//                             <Input
//                               id="address"
//                               value={formData.address}
//                               onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//                             />
//                           </div>
//                           <div>
//                             <Label htmlFor="instagram_url">Instagram</Label>
//                             <Input
//                               id="instagram_url"
//                               placeholder="https://instagram.com/seuusuario"
//                               value={formData.instagram_url}
//                               onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
//                             />
//                           </div>
//                           <div>
//                             <Label htmlFor="facebook_url">Facebook</Label>
//                             <Input
//                               id="facebook_url"
//                               placeholder="https://facebook.com/suapagina"
//                               value={formData.facebook_url}
//                               onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
//                             />
//                           </div>
//                         </div>
//                       </div>
                      
//                       <Button type="submit" className="w-full">
//                         Salvar Configurações
//                       </Button>
//                     </form>
//                   </CardContent>
//                 </Card>
//               </TabsContent>
//               <form onSubmit={handleSubmit}>
//                 <TabsContent value="ConfigSite" className="flex-1 absolute px-4 py-4 w-full h-full overflow-auto">
//                   <Card>
//                     <CardHeader>
//                       <h3 className="text-lg font-semibold">Personalização da Landing Page</h3>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <Label htmlFor="favicon_url">Favicon (URL)</Label>
//                           <Input
//                             id="favicon_url"
//                             placeholder="https://exemplo.com/favicon.png"
//                             value={formData.favicon_url}
//                             onChange={(e) => setFormData({ ...formData, favicon_url: e.target.value })}
//                           />
//                           <p className="text-xs text-muted-foreground mt-1">Ícone que aparece na aba do navegador</p>
//                         </div>
//                         <div>
//                           <Label htmlFor="logo_url">Logo (URL)</Label>
//                           <Input
//                             id="logo_url"
//                             placeholder="https://exemplo.com/logo.png"
//                             value={formData.logo_url}
//                             onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
//                           />
//                           <p className="text-xs text-muted-foreground mt-1">Logo que aparece no header</p>
//                         </div>
//                       </div>

//                       <div>
//                         <Label htmlFor="color_primary">Cor Principal</Label>
//                         <Input
//                           id="color_primary"
//                           type="color"
//                           value={formData.color_primary}
//                           onChange={(e) => setFormData({ ...formData, color_primary: e.target.value })}
//                         />
//                         <p className="text-xs text-muted-foreground mt-1">Cor principal do tema da landing page</p>
//                       </div>
                      
//                       <div>
//                         <Label htmlFor="hero_image_url">Imagem do Hero (URL)</Label>
//                         <Input
//                           id="hero_image_url"
//                           placeholder="https://exemplo.com/hero-image.jpg"
//                           value={formData.hero_image_url}
//                           onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
//                         />
//                         <p className="text-xs text-muted-foreground mt-1">Imagem de fundo da seção principal</p>
//                       </div>
                      
//                       <div>
//                         <Label htmlFor="hero_title">Título Principal</Label>
//                         <Input
//                           id="hero_title"
//                           value={formData.hero_title}
//                           onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
//                         />
//                         <p className="text-xs text-muted-foreground mt-1">Título que aparece na seção hero</p>
//                       </div>
                      
//                       <div>
//                         <Label htmlFor="hero_description">Descrição Principal</Label>
//                         <Textarea
//                           id="hero_description"
//                           value={formData.hero_description}
//                           onChange={(e) => setFormData({ ...formData, hero_description: e.target.value })}
//                         />
//                         <p className="text-xs text-muted-foreground mt-1">Descrição que aparece abaixo do título</p>
//                       </div>
                      
//                       <div>
//                         <Label htmlFor="footer_text">Texto do Rodapé</Label>
//                         <Input
//                           id="footer_text"
//                           value={formData.footer_text}
//                           onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
//                         />
//                         <p className="text-xs text-muted-foreground mt-1">Texto que aparece no rodapé da página</p>
//                       </div>
//                       <Button type="submit" className="w-full">
//                         Salvar Configurações
//                       </Button>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>
//               </form>

//               <TabsContent value="VisualSettingForm" className="flex-1 absolute px-4 py-4 w-full h-full overflow-auto"> 
//                 <VisualSettingsForm establishment={establishment} onUpdate={onUpdate} />
//               </TabsContent>
//             </div>
//           </div>
          
//         </Tabs>
//       </div>
//     </div>
//   );
// };