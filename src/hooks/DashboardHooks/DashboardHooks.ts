import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export function DashboardState(){
  const [loading, setLoading] = useState(true);
//   const [establishment, setEstablishment] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("appointments");
  const [services, setServices] = useState<any[]>([]);
  const [settingsTab, setSettingsTab] = useState("ConfigSite");
  const [establishment, setEstablishment] = useState<any>(null);
  const { toast } = useToast();

  const navigate = useNavigate();

  

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
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
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

  useEffect(() => {
    loadEstablishmentData();
  }, []);

  return {
    loading, setLoading,
    sidebarOpen, setSidebarOpen,
    toast,
    activeTab, setActiveTab,
    services, setServices,
    establishment, setEstablishment,
    appointments, setAppointments,
    settingsTab, setSettingsTab,
    handleLogout
  };


}

