import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Cadastro = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [slugChecked, setSlugChecked] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === "slug") {
      setSlugChecked(false);
      setSlugAvailable(false);
    }
  };

  const checkSlugAvailability = async () => {
    if (!formData.slug) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('establishments')
        .select('slug')
        .eq('slug', formData.slug)
        .maybeSingle();
      
      if (error) throw error;
      
      setSlugChecked(true);
      setSlugAvailable(!data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao verificar disponibilidade da URL",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }
    
    if (!slugAvailable) {
      toast({
        title: "Erro",
        description: "Verifique a disponibilidade da URL primeiro",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Criar usuário no auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        // Criar estabelecimento
        const { error: establishmentError } = await supabase
          .from('establishments')
          .insert({
            id: authData.user.id,
            name: formData.name,
            slug: formData.slug,
            email: formData.email
          });
        
        if (establishmentError) throw establishmentError;
        
        toast({
          title: "Sucesso!",
          description: "Sua página foi criada com sucesso!"
        });
        
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar conta",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">A</span>
              </div>
              <span className="text-xl font-bold">AgendaPro</span>
            </div>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Criar sua página</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para criar sua página de agendamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do seu negócio</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ex: Salão da Maria"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL da sua página</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="flex">
                      <span className="bg-muted px-3 py-2 border border-r-0 rounded-l-md text-sm text-muted-foreground">
                        agendapro.com/
                      </span>
                      <Input
                        id="slug"
                        name="slug"
                        placeholder="meu-negocio"
                        value={formData.slug}
                        onChange={handleInputChange}
                        className="rounded-l-none"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={checkSlugAvailability}
                    disabled={!formData.slug || isLoading}
                  >
                    {isLoading ? "Verificando..." : "Verificar"}
                  </Button>
                </div>
                {slugChecked && (
                  <div className={`flex items-center gap-2 text-sm ${slugAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    <CheckCircle className="w-4 h-4" />
                    {slugAvailable ? 'URL disponível!' : 'URL já está em uso'}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={!slugAvailable || isLoading}
              >
                {isLoading ? "Criando..." : "Criar Minha Página"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Fazer login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cadastro;