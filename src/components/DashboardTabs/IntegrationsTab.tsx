import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Cable, Edit, Plus, Settings, Trash2 } from 'lucide-react';
// import {IntegrationsHooks} from '@/hooks/DashboardHooks/IntegrationsHooks';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useIntegrations } from '@/context/IntegrationsContext';

export default function IntegrationsTab() {

  const {
    
    integrations, setIntegrations,
   
    setShowIntegrationSelector,
   
    
  } = useIntegrations();

  const updateIntegration = (integrationId: string, updates: any) => {
      const updatedIntegrations = integrations.map(integration =>
        integration.id === integrationId ? { ...integration, ...updates } : integration
      );
      setIntegrations(updatedIntegrations);
      // Optionally, persist to backend here if needed
  };
  
  const deleteIntegration = (integrationId: string) => {
      const filterIntegrations = integrations.filter(
        (integration) => integration.id !== integrationId);
        setIntegrations(filterIntegrations);
  }
  

  const IntegrationCard = ({ integration, onUpdate, onDelete }: any) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(integration);
    const [isDeleteIntegration, setIsDeleteIntegration] = useState(false);
    const handleSave = () => {
      onUpdate(integration.id, editData);
      setIsEditing(false);
    };
  
    // Renderização condicional do cartão de integração quando clicado em editar integração
    if (isEditing) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da integração</Label>
                <Input
                  id="name"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
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
    // fim da renderização condicional do cartão de integração quando editado
  
     // Renderização condicional do card de confirmação de exclusão
    if (isDeleteIntegration) {
      return (
        <Card className=" w-full flex items-center justify-center ">
          <CardContent className="py-1 px-2 w-full justify-between flex">
            <div className=" flex items-center ">
              <p className="text-red-600 md:text-xl md:font-semibold">Deseja deletar a integração {integration.name} ?</p>
            </div>
            <div className="p-0 h-full flex flex-col md:flex-row justify-center items-center gap-2">
              <Button className="w-full" onClick={() => onDelete(integration.id)}>Sim</Button>
              <Button variant="outline" onClick={() => setIsDeleteIntegration(false)}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      );
    }
  
    // Renderização do cartão de integração quando esta sendo exibido para o usuario
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3 justify-between items-center ">
            <div className="flex-1 items-center justify-center">
              <h3 className="font-semibold items-center justify-center">{integration.name}</h3>
            </div>
            <div className=" w-full flex flex-1 gap-1 items-end justify-end">
              <Button size="sm" variant="outline" >
                <Settings className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsDeleteIntegration(true)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
    // fim da renderização do cartão de integração quando exibido para o usuario
  };

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Integre Apps e Sistemas</CardTitle>
            <CardDescription>
              Adicione Suas automações e Sistemas
            </CardDescription>
          </div>
          <Button onClick={() =>  setShowIntegrationSelector(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Integração
          </Button>
        </CardHeader>
        <CardContent>
          {integrations.length === 0 ? (
            <div className="text-center py-8">
              <Cable className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhuma integração adicionada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {integrations.map((integration) => (
                <IntegrationCard 
                  key={integration.id} 
                  integration={integration} 
                  onUpdate={updateIntegration}
                  onDelete={deleteIntegration}
                />
              ))}
            </div>
          )}
          
        </CardContent>
      </Card>
    </div>
  )
}
