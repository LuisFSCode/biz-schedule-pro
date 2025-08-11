import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useProfessionals, Professional } from '@/hooks/DashboardHooks/ProfessionalsHooks';
import { useDashboard } from '@/context/DashboardContext';

interface ProfessionalServicesManagerProps {
  professional: Professional;
  services: any[];
}

export default function ProfessionalServicesManager({ 
  professional, 
  services 
}: ProfessionalServicesManagerProps) {
  const { establishment } = useDashboard();
  const { 
    updateProfessional, 
    updateProfessionalServices, 
    getProfessionalServices 
  } = useProfessionals(establishment?.id);

  const [servesAllServices, setServesAllServices] = useState(professional.serves_all_services);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    // Load professional's specific services
    const profServices = getProfessionalServices(professional.id);
    setSelectedServices(profServices);
  }, [professional.id, getProfessionalServices]);

  const handleServesAllToggle = async (checked: boolean) => {
    setServesAllServices(checked);
    try {
      await updateProfessional(professional.id, { serves_all_services: checked });
      
      // If switching to "serves all", clear specific services
      if (checked) {
        setSelectedServices([]);
        await updateProfessionalServices(professional.id, []);
      }
    } catch (error) {
      // Revert on error
      setServesAllServices(!checked);
    }
  };

  const handleServiceToggle = (serviceId: string, checked: boolean) => {
    let newSelection;
    if (checked) {
      newSelection = [...selectedServices, serviceId];
    } else {
      newSelection = selectedServices.filter(id => id !== serviceId);
    }
    setSelectedServices(newSelection);
  };

  const handleSaveServices = async () => {
    try {
      await updateProfessionalServices(professional.id, selectedServices);
    } catch (error) {
      // Error handled in hook
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Permissões de Serviços</CardTitle>
          <CardDescription>
            Configure quais serviços este profissional pode atender
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="serves-all"
              checked={servesAllServices}
              onCheckedChange={handleServesAllToggle}
            />
            <Label htmlFor="serves-all" className="text-sm font-medium">
              Este profissional atende todos os serviços
            </Label>
          </div>

          {servesAllServices ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ Este profissional pode atender todos os serviços disponíveis ({services.length} serviços)
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {services.map(service => (
                  <Badge key={service.id} variant="secondary">
                    {service.name}
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ Selecione os serviços específicos que este profissional pode atender
                </p>
              </div>

              {services.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhum serviço cadastrado. Adicione serviços primeiro.
                </p>
              ) : (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Serviços disponíveis:</Label>
                  <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                    {services.map(service => (
                      <div key={service.id} className="flex items-center space-x-2 p-2 rounded border">
                        <Checkbox
                          id={`service-${service.id}`}
                          checked={selectedServices.includes(service.id)}
                          onCheckedChange={(checked) => 
                            handleServiceToggle(service.id, checked as boolean)
                          }
                        />
                        <Label 
                          htmlFor={`service-${service.id}`} 
                          className="flex-1 cursor-pointer"
                        >
                          <div>
                            <div className="font-medium">{service.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {service.duration} min • R$ {service.price?.toFixed(2) || '0.00'}
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      {selectedServices.length} de {services.length} serviços selecionados
                    </p>
                    <Button onClick={handleSaveServices}>
                      Salvar Serviços
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}