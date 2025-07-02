import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, MapPin, Phone, Star } from "lucide-react";

const Demo = () => {
  const mockServices = [
    { name: "Corte Masculino", duration: "30 min", price: "R$ 25,00" },
    { name: "Barba", duration: "20 min", price: "R$ 15,00" },
    { name: "Corte + Barba", duration: "45 min", price: "R$ 35,00" },
    { name: "Sobrancelha", duration: "15 min", price: "R$ 10,00" }
  ];

  const mockFeedbacks = [
    { name: "João Silva", rating: 5, comment: "Excelente atendimento, sempre saio satisfeito!" },
    { name: "Pedro Santos", rating: 5, comment: "Melhor barbearia da região, super recomendo." },
    { name: "Carlos Lima", rating: 4, comment: "Ótimo profissional, ambiente agradável." }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header de demonstração */}
      <div className="bg-primary/5 p-4 text-center border-b">
        <div className="flex items-center justify-center gap-2 text-sm">
          <span>🚀 Esta é uma demonstração da página de agendamentos</span>
          <Link to="/" className="text-primary hover:underline font-medium">
            Criar minha página
          </Link>
        </div>
      </div>

      {/* Header da página do estabelecimento */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Voltar</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">B</span>
            </div>
            <span className="text-xl font-bold">Barbearia do João</span>
          </div>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-amber-900">
            Bem-vindos à Barbearia do João
          </h1>
          <p className="text-xl text-amber-700 mb-8 max-w-2xl mx-auto">
            Mais de 20 anos cuidando do seu visual com excelência e tradição. 
            Agende seu horário de forma rápida e fácil.
          </p>
          <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white">
            Agendar Agora
          </Button>
        </div>
      </section>

      {/* Informações */}
      <section className="py-8 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <MapPin className="w-5 h-5 text-amber-600" />
              <span>Rua das Flores, 123 - Centro</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Phone className="w-5 h-5 text-amber-600" />
              <span>(11) 99999-9999</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span>Seg-Sáb: 8h às 18h</span>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Nossos Serviços</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {mockServices.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">{service.name}</h3>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-3">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="text-2xl font-bold text-amber-600 mb-4">
                    {service.price}
                  </div>
                  <Button className="w-full bg-amber-600 hover:bg-amber-700">
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feedbacks */}
      <section className="py-16 px-4 bg-amber-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">O que nossos clientes dizem</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {mockFeedbacks.map((feedback, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < feedback.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{feedback.comment}"</p>
                  <p className="font-semibold">{feedback.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t bg-background">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Desenvolvido com AgendaPro - © 2024 Barbearia do João
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Demo;