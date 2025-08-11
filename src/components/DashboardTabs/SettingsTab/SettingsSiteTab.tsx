import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";

export default function SettingsSite({establishment, onUpdate}) {
 const [formData, setFormData] = useState({
  favicon_url: establishment?.favicon_url || "",
		logo_url: establishment?.logo_url || "",
		hero_title: establishment?.hero_title || "Bem-vindos ao nosso estabelecimento",
		hero_description: establishment?.hero_description || "Agende seus serviços de forma rápida e fácil",
		hero_image_url: establishment?.hero_image_url || "",
		color_primary: establishment?.color_primary || "#3B82F6",
		footer_text: establishment?.footer_text || "Desenvolvido com SchedulePro",
 });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...establishment, ...formData });
  };

  return(
   <TabsContent value="ConfigSite" className="flex-1 absolute px-4 py-4 w-full h-full overflow-auto">
     <Card>
      <CardHeader>
      <h3 className="text-lg font-semibold">Personalização da Landing Page</h3>
      </CardHeader>
      <CardContent className="space-y-4">
       <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
            <Label htmlFor="favicon_url">Favicon (URL)</Label>
            <Input
                id="favicon_url"
                placeholder="https://exemplo.com/favicon.png"
                value={formData.favicon_url}
                onChange={(e) => setFormData({ ...formData, favicon_url: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">Ícone que aparece na aba do navegador</p>
            </div>
            <div>
            <Label htmlFor="logo_url">Logo (URL)</Label>
            <Input
                id="logo_url"
                placeholder="https://exemplo.com/logo.png"
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">Logo que aparece no header</p>
            </div>
        </div>

        <div>
            <Label htmlFor="color_primary">Cor Principal</Label>
            <Input
            id="color_primary"
            type="color"
            value={formData.color_primary}
            onChange={(e) => setFormData({ ...formData, color_primary: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">Cor principal do tema da landing page</p>
        </div>
        
        <div>
            <Label htmlFor="hero_image_url">Imagem do Hero (URL)</Label>
            <Input
            id="hero_image_url"
            placeholder="https://exemplo.com/hero-image.jpg"
            value={formData.hero_image_url}
            onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">Imagem de fundo da seção principal</p>
        </div>
        
        <div>
            <Label htmlFor="hero_title">Título Principal</Label>
            <Input
            id="hero_title"
            value={formData.hero_title}
            onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">Título que aparece na seção hero</p>
        </div>
        
        <div>
            <Label htmlFor="hero_description">Descrição Principal</Label>
            <Textarea
            id="hero_description"
            value={formData.hero_description}
            onChange={(e) => setFormData({ ...formData, hero_description: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">Descrição que aparece abaixo do título</p>
        </div>
        
        <div>
            <Label htmlFor="footer_text">Texto do Rodapé</Label>
            <Input
            id="footer_text"
            value={formData.footer_text}
            onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">Texto que aparece no rodapé da página</p>
        </div>
        <Button type="submit" className="w-full">
            Salvar Configurações
        </Button>
       </form>
      </CardContent>
     </Card>
   </TabsContent>
  )

}