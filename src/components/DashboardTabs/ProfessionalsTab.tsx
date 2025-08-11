import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Users, Calendar, Clock } from 'lucide-react';
import { useProfessionals, Professional } from '@/hooks/DashboardHooks/ProfessionalsHooks';
import { useDashboard } from '@/context/DashboardContext';
import ProfessionalServicesManager from './ProfessionalsTab/ProfessionalServicesManager';
import ProfessionalAvailabilityManager from './ProfessionalsTab/ProfessionalAvailabilityManager';

export default function ProfessionalsTab() {
  const { establishment, services } = useDashboard();
  const {
    professionals,
    loading,
    createProfessional,
    updateProfessional,
    deleteProfessional
  } = useProfessionals(establishment?.id);

  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Profissionais</CardTitle>
            <CardDescription>
              Gerencie os profissionais do seu estabelecimento
            </CardDescription>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Profissional
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Profissional</DialogTitle>
              </DialogHeader>
              <CreateProfessionalForm 
                onSuccess={() => setIsCreateModalOpen(false)} 
                createProfessional={createProfessional}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        
        <CardContent>
          {professionals.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum profissional cadastrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {professionals.map((professional) => (
                <Card key={professional.id} className="relative">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src={professional.avatar_url} />
                        <AvatarFallback>
                          {professional.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold truncate">{professional.name}</h3>
                          <div className="flex space-x-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedProfessional(professional);
                                setIsEditModalOpen(true);
                              }}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => deleteProfessional(professional.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mt-2">
                          {professional.email && (
                            <p className="text-sm text-muted-foreground truncate">{professional.email}</p>
                          )}
                          {professional.phone && (
                            <p className="text-sm text-muted-foreground">{professional.phone}</p>
                          )}
                          
                          <div className="flex items-center space-x-2">
                            <Badge variant={professional.is_active ? "default" : "secondary"}>
                              {professional.is_active ? "Ativo" : "Inativo"}
                            </Badge>
                            <Badge variant="outline">
                              {professional.serves_all_services ? "Todos serviços" : "Serviços específicos"}
                            </Badge>
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {professional.work_hours_start} às {professional.work_hours_end}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Professional Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gerenciar Profissional: {selectedProfessional?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedProfessional && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Informações</TabsTrigger>
                <TabsTrigger value="services">Serviços</TabsTrigger>
                <TabsTrigger value="availability">Disponibilidade</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="space-y-4">
                <EditProfessionalForm 
                  professional={selectedProfessional}
                  onSuccess={() => setIsEditModalOpen(false)}
                  updateProfessional={updateProfessional}
                />
              </TabsContent>
              
              <TabsContent value="services">
                <ProfessionalServicesManager 
                  professional={selectedProfessional}
                  services={services}
                />
              </TabsContent>
              
              <TabsContent value="availability">
                <ProfessionalAvailabilityManager 
                  professional={selectedProfessional}
                />
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Create Professional Form Component
function CreateProfessionalForm({ onSuccess, createProfessional }: any) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    work_hours_start: '09:00',
    work_hours_end: '18:00',
    serves_all_services: true,
    is_active: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProfessional(formData);
      onSuccess();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start_time">Horário início</Label>
          <Input
            id="start_time"
            type="time"
            value={formData.work_hours_start}
            onChange={(e) => setFormData({ ...formData, work_hours_start: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="end_time">Horário fim</Label>
          <Input
            id="end_time"
            type="time"
            value={formData.work_hours_end}
            onChange={(e) => setFormData({ ...formData, work_hours_end: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="serves_all"
          checked={formData.serves_all_services}
          onCheckedChange={(checked) => setFormData({ ...formData, serves_all_services: checked })}
        />
        <Label htmlFor="serves_all">Atende todos os serviços</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active">Profissional ativo</Label>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="submit">Criar Profissional</Button>
      </div>
    </form>
  );
}

// Edit Professional Form Component
function EditProfessionalForm({ professional, onSuccess, updateProfessional }: any) {
  const [formData, setFormData] = useState({
    name: professional.name,
    email: professional.email || '',
    phone: professional.phone || '',
    work_hours_start: professional.work_hours_start,
    work_hours_end: professional.work_hours_end,
    serves_all_services: professional.serves_all_services,
    is_active: professional.is_active
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfessional(professional.id, formData);
      onSuccess();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start_time">Horário início</Label>
          <Input
            id="start_time"
            type="time"
            value={formData.work_hours_start}
            onChange={(e) => setFormData({ ...formData, work_hours_start: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="end_time">Horário fim</Label>
          <Input
            id="end_time"
            type="time"
            value={formData.work_hours_end}
            onChange={(e) => setFormData({ ...formData, work_hours_end: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="serves_all"
          checked={formData.serves_all_services}
          onCheckedChange={(checked) => setFormData({ ...formData, serves_all_services: checked })}
        />
        <Label htmlFor="serves_all">Atende todos os serviços</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active">Profissional ativo</Label>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="submit">Salvar Alterações</Button>
      </div>
    </form>
  );
}