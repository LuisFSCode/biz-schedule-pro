import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Professional {
  id: string;
  establishment_id: string;
  name: string;
  email?: string;
  phone?: string;
  serves_all_services: boolean;
  default_start_time: string;
  default_end_time: string;
  created_at: string;
  updated_at: string;
}

export interface ProfessionalService {
  id: string;
  professional_id: string;
  service_id: string;
}

export interface ProfessionalAvailability {
  id: string;
  professional_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export const useProfessionals = (establishmentId: string) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [professionalServices, setProfessionalServices] = useState<ProfessionalService[]>([]);
  const [availability, setAvailability] = useState<ProfessionalAvailability[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all data
  const loadData = async () => {
    if (!establishmentId) return;
    
    try {
      // Load professionals using raw query since types aren't updated
      const { data: professionalsData, error: profError } = await supabase
        .from('professionals' as any)
        .select('*')
        .eq('establishment_id', establishmentId)
        .order('created_at', { ascending: false });

      if (profError) throw profError;

      // Load professional services
      const { data: servicesData, error: servError } = await supabase
        .from('professional_services' as any)
        .select('*');

      if (servError) throw servError;

      // Load availability (next 6 months)
      const today = new Date();
      const sixMonthsLater = new Date(today.getFullYear(), today.getMonth() + 6, today.getDate());
      
      const { data: availabilityData, error: availError } = await supabase
        .from('professional_availability' as any)
        .select('*')
        .gte('date', today.toISOString().split('T')[0])
        .lte('date', sixMonthsLater.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (availError) throw availError;

      setProfessionals((professionalsData as unknown as Professional[]) || []);
      setProfessionalServices((servicesData as unknown as ProfessionalService[]) || []);
      setAvailability((availabilityData as unknown as ProfessionalAvailability[]) || []);
    } catch (error) {
      console.error('Error loading professionals data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados dos profissionais",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Setup realtime subscriptions
  useEffect(() => {
    loadData();

    // Subscribe to professionals changes
    const professionalsChannel = supabase
      .channel('professionals-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'professionals',
          filter: `establishment_id=eq.${establishmentId}`
        },
        () => {
          loadData();
        }
      )
      .subscribe();

    // Subscribe to professional_services changes
    const servicesChannel = supabase
      .channel('professional-services-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'professional_services'
        },
        () => {
          loadData();
        }
      )
      .subscribe();

    // Subscribe to availability changes
    const availabilityChannel = supabase
      .channel('availability-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'professional_availability'
        },
        () => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(professionalsChannel);
      supabase.removeChannel(servicesChannel);
      supabase.removeChannel(availabilityChannel);
    };
  }, [establishmentId]);

  // CRUD operations for professionals
  const createProfessional = async (data: Partial<Professional>) => {
    try {
      const { data: newProfessional, error } = await supabase
        .from('professionals' as any)
        .insert([{
          ...data,
          establishment_id: establishmentId,
          serves_all_services: true,
          // default_start_time: '09:00:00',
          // default_end_time: '18:00:00'
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Profissional adicionado com sucesso!"
      });

      return newProfessional;
    } catch (error) {
      console.error('Error creating professional:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar profissional",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateProfessional = async (id: string, updates: Partial<Professional>) => {
    try {
      const { error } = await supabase
        .from('professionals' as any)
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Profissional atualizado com sucesso!"
      });
    } catch (error) {
      console.error('Error updating professional:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar profissional",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteProfessional = async (id: string) => {
    try {
      const { error } = await supabase
        .from('professionals' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Profissional removido com sucesso!"
      });
    } catch (error) {
      console.error('Error deleting professional:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover profissional",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Service permissions
  const updateProfessionalServices = async (professionalId: string, serviceIds: string[]) => {
    try {
      // Remove existing services
      await supabase
        .from('professional_services' as any)
        .delete()
        .eq('professional_id', professionalId);

      // Add new services
      if (serviceIds.length > 0) {
        const { error } = await supabase
          .from('professional_services' as any)
          .insert(
            serviceIds.map(serviceId => ({
              professional_id: professionalId,
              service_id: serviceId
            }))
          );

        if (error) throw error;
      }

      toast({
        title: "Sucesso",
        description: "Serviços do profissional atualizados!"
      });
    } catch (error) {
      console.error('Error updating professional services:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar serviços do profissional",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Availability management
  const setAvailabilityForDates = async (
    professionalId: string, 
    dates: string[], 
    startTime: string, 
    endTime: string
  ) => {
    try {
      // Remove existing availability for these dates
      await supabase
        .from('professional_availability' as any)
        .delete()
        .eq('professional_id', professionalId)
        .in('date', dates);

      // Add new availability
      const availabilityEntries = dates.map(date => ({
        professional_id: professionalId,
        date,
        start_time: startTime,
        end_time: endTime,
        is_available: true
      }));

      const { error } = await supabase
        .from('professional_availability' as any)
        .insert(availabilityEntries);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Disponibilidade configurada para ${dates.length} dia(s)!`
      });
    } catch (error) {
      console.error('Error setting availability:', error);
      toast({
        title: "Erro",
        description: "Erro ao configurar disponibilidade",
        variant: "destructive"
      });
      throw error;
    }
  };

  const setAvailabilityForDateRange = async (
    professionalId: string,
    startDate: string,
    endDate: string,
    startTime: string,
    endTime: string
  ) => {
    const dates = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }

    await setAvailabilityForDates(professionalId, dates, startTime, endTime);
  };

  const removeAvailability = async (professionalId: string, dates: string[]) => {
    try {
      const { error } = await supabase
        .from('professional_availability' as any)
        .delete()
        .eq('professional_id', professionalId)
        .in('date', dates);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Disponibilidade removida para ${dates.length} dia(s)!`
      });
    } catch (error) {
      console.error('Error removing availability:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover disponibilidade",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Get professional services
  const getProfessionalServices = (professionalId: string): string[] => {
    return professionalServices
      .filter(ps => ps.professional_id === professionalId)
      .map(ps => ps.service_id);
  };

  // Get professional availability for specific dates
  const getProfessionalAvailability = (professionalId: string, date: string) => {
    return availability.find(a => 
      a.professional_id === professionalId && 
      a.date === date &&
      a.is_available
    );
  };

  // Get available professionals for service and date/time
  const getAvailableProfessionals = (serviceId: string, date: string, time: string) => {
    return professionals.filter(prof => {
      // All professionals are considered active (no is_active field)

      // Check if professional serves this service
      if (!prof.serves_all_services) {
        const profServices = getProfessionalServices(prof.id);
        if (!profServices.includes(serviceId)) return false;
      }

      // Check availability for the date
      const availability = getProfessionalAvailability(prof.id, date);
      if (!availability) return false;

      // Check if time is within availability window
      const requestTime = time;
      if (requestTime < availability.start_time || requestTime > availability.end_time) {
        return false;
      }

      return true;
    });
  };

  return {
    professionals,
    professionalServices,
    availability,
    loading,
    createProfessional,
    updateProfessional,
    deleteProfessional,
    updateProfessionalServices,
    setAvailabilityForDates,
    setAvailabilityForDateRange,
    removeAvailability,
    getProfessionalServices,
    getProfessionalAvailability,
    getAvailableProfessionals,
    refreshData: loadData
  };
};