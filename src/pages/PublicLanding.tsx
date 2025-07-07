import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Clock, MapPin, Phone, Instagram, Facebook } from "lucide-react";

const PublicLanding = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const [establishment, setEstablishment] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEstablishment();
  }, [slug]);

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
      
      // Set dynamic favicon if available
      if (data.favicon_url) {
        const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
        link.type = 'image/png';
        link.rel = 'icon';
        link.href = data.favicon_url;
        document.getElementsByTagName('head')[0].appendChild(link);
      }

      // Set dynamic title
      document.title = data.name || 'SchedulePro';

    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Estabelecimento não encontrado",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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

  const primaryColor = establishment.color_primary || '#3B82F6';

  // Generate dynamic styles based on establishment settings
  const getBodyStyles = () => {
    if (establishment.body_background_type === 'gradient') {
      return {
        background: `linear-gradient(${establishment.body_gradient_angle || 45}deg, ${establishment.body_gradient_color1 || '#3B82F6'}, ${establishment.body_gradient_color2 || '#8B5CF6'})`
      };
    }
    return {
      backgroundColor: establishment.body_background_color || '#ffffff'
    };
  };

  const getHeaderStyles = () => {
    let styles: any = {
      position: establishment.header_position || 'relative'
    };

    if (establishment.header_background_type === 'gradient') {
      styles.background = `linear-gradient(${establishment.header_gradient_angle || 45}deg, ${establishment.header_gradient_color1 || '#3B82F6'}, ${establishment.header_gradient_color2 || '#8B5CF6'})`;
    } else {
      styles.backgroundColor = establishment.header_background_color || '#ffffff';
    }

    return styles;
  };

  const getServicesStyles = () => {
    if (establishment.services_background_type === 'image' && establishment.services_background_image) {
      return {
        backgroundImage: `url(${establishment.services_background_image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    return {
      backgroundColor: establishment.services_background_color || '#ffffff'
    };
  };

  return (
    <div className="min-h-screen" style={{ ...getBodyStyles(), ['--primary-color' as any]: primaryColor }}>
      {/* Header */}
      <header 
        className={`border-b ${establishment.header_position === 'fixed' ? 'fixed top-0 left-0 right-0 z-50' : 'relative'}`}
        style={getHeaderStyles()}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {establishment.logo_url ? (
              <img src={establishment.logo_url} alt={establishment.name} className="h-8 w-8 rounded-lg" />
            ) : (
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">{establishment.name?.[0]}</span>
              </div>
            )}
            <span className="text-xl font-bold">{establishment.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link to={`/${slug}/login-cliente`}>Entrar</Link>
            </Button>
            <Button asChild>
              <Link to={`/${slug}/cadastro-cliente`}>Agendar</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className={`py-20 px-4 text-center text-white relative overflow-hidden ${establishment.header_position === 'fixed' ? 'pt-32' : ''}`}
        style={{
          backgroundColor: establishment.hero_background_color || primaryColor,
          backgroundImage: establishment.hero_image_url ? `url(${establishment.hero_image_url})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {establishment.hero_image_url && (
          <div className="absolute inset-0 bg-black/50"></div>
        )}
        <div className="container mx-auto relative z-10">
          <h1 
            className={`text-${establishment.hero_title_font_size || '4xl'} md:text-${establishment.hero_title_font_size || '6xl'} font-bold mb-6`}
            style={{ fontFamily: establishment.hero_title_font_family || 'inherit' }}
          >
            {establishment.hero_title || 'Bem-vindos ao nosso estabelecimento'}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            {establishment.hero_description || 'Agende seus serviços de forma rápida e fácil'}
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to={`/${slug}/cadastro-cliente`}>Agendar Agora</Link>
          </Button>
        </div>
      </section>

      {/* Services Section */}
      {services.length > 0 && (
        <section className="py-16 px-4" style={getServicesStyles()}>
          <div className="container mx-auto">
            <h2 
              className={`text-${establishment.services_title_font_size || '3xl'} font-bold text-center mb-12`}
              style={{ fontFamily: establishment.services_title_font_family || 'inherit' }}
            >
              Nossos Serviços
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{service.name}</CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {service.duration} min
                      </span>
                      <span className="font-semibold">R$ {service.price?.toFixed(2) || '0.00'}</span>
                    </CardDescription>
                  </CardHeader>
                  {service.description && (
                    <CardContent>
                      <p className="text-muted-foreground">{service.description}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Sobre {establishment.name}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                {establishment.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>{establishment.address}</span>
                  </div>
                )}
                {establishment.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-primary" />
                    <span>{establishment.phone}</span>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex justify-center gap-4">
                  {establishment.instagram_url && (
                    <a href={establishment.instagram_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <Instagram className="w-4 h-4 mr-2" />
                        Instagram
                      </Button>
                    </a>
                  )}
                  {establishment.facebook_url && (
                    <a href={establishment.facebook_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <Facebook className="w-4 h-4 mr-2" />
                        Facebook
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Custom Section 2 */}
        {establishment.section2_enabled && establishment.section2_content && (
          <div dangerouslySetInnerHTML={{ __html: establishment.section2_content }} />
        )}
      </section>

      {/* Footer */}
      <footer 
        className="border-t py-8 px-4"
        style={{ backgroundColor: establishment.footer_background_color || '#f8f9fa' }}
      >
        <div className="container mx-auto">
          <p 
            className={`text-${establishment.footer_font_size || 'sm'} text-${establishment.footer_text_align || 'center'}`}
            style={{ fontFamily: establishment.footer_font_family || 'inherit' }}
          >
            {establishment.footer_text || 'Desenvolvido com SchedulePro'}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLanding;