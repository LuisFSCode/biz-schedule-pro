import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useParams } from 'react-router-dom';

export function DashboardState(){
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("appointments");
  const [services, setServices] = useState<any[]>([]);
  const [settingsTab, setSettingsTab] = useState("AcountConfig");
  const [establishment, setEstablishment] = useState<any>(null);
  const { toast } = useToast();

  const navigate = useNavigate();
  const { slug } = useParams();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate(`/${slug}/admin/login`);
      return;
    }
    
    // Verificar se o usuário é dono do estabelecimento
    const { data: establishmentData } = await supabase
      .from('establishments')
      .select('id, slug')
      .eq('slug', slug)
      .eq('id', session.user.id)
      .single();

    if (!establishmentData) {
      await supabase.auth.signOut();
      toast({
        title: "Estabelecimento não encontrado",
        description: "Você não tem permissão para acessar este painel.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
    
    await loadEstablishmentData();
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate(`/${slug}`);
  };

  const loadEstablishmentData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Carregar dados do estabelecimento
      const { data: establishmentData, error: establishmentError } = await supabase
        .from('establishments')
        .select('*')
        .eq('slug', slug)
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
    handleLogout,
    updateEstablishment
  };


}

