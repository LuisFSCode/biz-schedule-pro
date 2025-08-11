import { DashboardState } from "@/hooks/DashboardHooks/DashboardHooks";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Edit, Plus, Trash2, Users } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

import { useDashboard } from "@/context/DashboardContext";

export default function ServicesTab() {
  const {services, setServices, establishment} = useDashboard();

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

  return (
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
  )
};
