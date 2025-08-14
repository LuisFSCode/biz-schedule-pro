import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SmartBookingFlow from '@/components/SmartBookingFlow';

const ClientBooking = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [establishment, setEstablishment] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadEstablishment();
    checkAuth();
  }, [slug]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
    }
  };

  const loadEstablishment = async () => {
    try {
      const { data, error } = await supabase
        .from('establishments')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;

      setEstablishment(data);
      setServices(Array.isArray(data.services) ? data.services : []);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Estabelecimento não encontrado",
        variant: "destructive"
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingComplete = async (bookingData: any) => {
    if (!user) {
      // Redirect to login with booking data stored
      localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
      navigate(`/${slug}/login-cliente`);
      return;
    }

    try {
      // Create customer record if doesn't exist
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('email', user.email)
        .eq('establishment_id', establishment.id)
        .single();

      let customerId = customer?.id;

      if (!customer) {
        const { data: newCustomer, error: createError } = await supabase
          .from('customers')
          .insert([{
            id: user.id,
            establishment_id: establishment.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.email
          }])
          .select()
          .single();

        if (createError) throw createError;
        customerId = newCustomer.id;
      }

      // Create appointment with customer ID
      const finalBookingData = {
        ...bookingData,
        customer_id: customerId
      };

      const { error: appointmentError } = await supabase
        .from('appointments')
        .insert([finalBookingData]);

      if (appointmentError) throw appointmentError;

      toast({
        title: "Sucesso!",
        description: "Agendamento realizado com sucesso!"
      });

      // Navigate to appointments page
      navigate(`/${slug}/meus-agendamentos`);

    } catch (error: any) {
      console.error('Error completing booking:', error);
      toast({
        title: "Erro",
        description: "Erro ao finalizar agendamento",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!establishment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Estabelecimento não encontrado</h1>
          <Link to="/">
            <Button>Voltar ao início</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to={`/${slug}`} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xl font-bold">Voltar </span>
          </Link>
          {establishment.logo_url ? (
            <img
              src={establishment.logo_url}
              alt={establishment.name}
              className="h-8 w-8 rounded-lg"
            />
          ) : (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">
                {establishment.name?.[0]} 
              </span>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{establishment.name}</h1>
          <p className="text-muted-foreground">Agende seu serviço</p>
        </div>

        <SmartBookingFlow
          establishmentId={establishment.id}
          services={services}
          onBookingComplete={handleBookingComplete}
        />
      </div>
    </div>
  );
};

export default ClientBooking;