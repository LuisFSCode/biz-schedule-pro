import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ElementorEditor } from "@/components/ElementorEditor";
import { CodeEditor } from "@/components/CodeEditor";

interface VisualSettingsFormProps {
  establishment: any;
  onUpdate: (updates: any) => void;
}

export const VisualSettingsForm = ({ establishment, onUpdate }: VisualSettingsFormProps) => {
  const [activeTab, setActiveTab] = useState("body");
  const [formData, setFormData] = useState({
    // Body settings
    body_background_type: establishment?.body_background_type || 'solid',
    body_background_color: establishment?.body_background_color || '#ffffff',
    body_gradient_color1: establishment?.body_gradient_color1 || '#3B82F6',
    body_gradient_color2: establishment?.body_gradient_color2 || '#8B5CF6',
    body_gradient_angle: establishment?.body_gradient_angle || 45,

    // Header settings
    header_background_type: establishment?.header_background_type || 'solid',
    header_background_color: establishment?.header_background_color || '#ffffff',
    header_gradient_color1: establishment?.header_gradient_color1 || '#3B82F6',
    header_gradient_color2: establishment?.header_gradient_color2 || '#8B5CF6',
    header_gradient_angle: establishment?.header_gradient_angle || 45,
    header_position: establishment?.header_position || 'relative',

    // Hero settings
    hero_background_color: establishment?.hero_background_color || establishment?.color_primary || '#3B82F6',
    hero_title_font_family: establishment?.hero_title_font_family || 'Inter',
    hero_title_font_size: establishment?.hero_title_font_size || '4xl',

    // Services settings
    services_background_type: establishment?.services_background_type || 'solid',
    services_background_color: establishment?.services_background_color || '#ffffff',
    services_background_image: establishment?.services_background_image || '',
    services_title_font_family: establishment?.services_title_font_family || 'Inter',
    services_title_font_size: establishment?.services_title_font_size || '3xl',

    // Section 2 settings
    section2_enabled: establishment?.section2_enabled || false,
    section2_content: establishment?.section2_content || `<section id="aboutEmpresa" class="py-16 px-4">
  <div class="container mx-auto">
    <!-- Empresário, insira seu conteúdo aqui. Se tiver dúvidas, veja o tutorial: link.editarsection.com -->
    <h2 class="text-3xl font-bold text-center mb-8">Sobre Nós</h2>
    <p class="text-center max-w-2xl mx-auto">Adicione aqui o conteúdo personalizado do seu estabelecimento.</p>
  </div>
</section>`,

    // Footer settings
    footer_background_color: establishment?.footer_background_color || '#f8f9fa',
    footer_font_family: establishment?.footer_font_family || 'Inter',
    footer_font_size: establishment?.footer_font_size || 'sm',
    footer_text_align: establishment?.footer_text_align || 'center',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const fontSizes = [
    { value: 'xs', label: 'Extra Pequeno' },
    { value: 'sm', label: 'Pequeno' },
    { value: 'base', label: 'Normal' },
    { value: 'lg', label: 'Grande' },
    { value: 'xl', label: 'Extra Grande' },
    { value: '2xl', label: '2X Grande' },
    { value: '3xl', label: '3X Grande' },
    { value: '4xl', label: '4X Grande' },
    { value: '5xl', label: '5X Grande' },
    { value: '6xl', label: '6X Grande' },
  ];

  const textAlignOptions = [
    { value: 'left', label: 'Esquerda' },
    { value: 'center', label: 'Centro' },
    { value: 'right', label: 'Direita' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações Visuais da Landing Page</CardTitle>
        <CardDescription>
          Personalize a aparência visual da sua página de agendamento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="w-full">
            <div className="grid w-full grid-cols-6 bg-muted p-1 rounded-lg">
              {[
                { value: "body", label: "Body" },
                { value: "header", label: "Header" },
                { value: "hero", label: "Hero" },
                { value: "services", label: "Serviços" },
                { value: "section2", label: "Seção 2" },
                { value: "footer", label: "Footer" }
              ].map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md transition-all",
                    activeTab === tab.value
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Body Settings */}
            {activeTab === "body" && (
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold">Plano de Fundo do Site</h3>
              
              <div>
                <Label htmlFor="body_background_type">Tipo de Fundo</Label>
                <Select value={formData.body_background_type} onValueChange={(value) => setFormData({ ...formData, body_background_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Cor Sólida</SelectItem>
                    <SelectItem value="gradient">Degradê</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.body_background_type === 'solid' ? (
                <div>
                  <Label htmlFor="body_background_color">Cor de Fundo</Label>
                  <Input
                    id="body_background_color"
                    type="color"
                    value={formData.body_background_color}
                    onChange={(e) => setFormData({ ...formData, body_background_color: e.target.value })}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="body_gradient_color1">Primeira Cor</Label>
                      <Input
                        id="body_gradient_color1"
                        type="color"
                        value={formData.body_gradient_color1}
                        onChange={(e) => setFormData({ ...formData, body_gradient_color1: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="body_gradient_color2">Segunda Cor</Label>
                      <Input
                        id="body_gradient_color2"
                        type="color"
                        value={formData.body_gradient_color2}
                        onChange={(e) => setFormData({ ...formData, body_gradient_color2: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="body_gradient_angle">Ângulo do Degradê (graus)</Label>
                    <Input
                      id="body_gradient_angle"
                      type="number"
                      min="0"
                      max="360"
                      value={formData.body_gradient_angle}
                      onChange={(e) => setFormData({ ...formData, body_gradient_angle: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              )}
            </div>
            )}

            {/* Header Settings */}
            {activeTab === "header" && (
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold">Configurações do Header</h3>
              
              <div>
                <Label htmlFor="header_position">Posição do Header</Label>
                <Select value={formData.header_position} onValueChange={(value) => setFormData({ ...formData, header_position: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relative">Relativo</SelectItem>
                    <SelectItem value="fixed">Fixo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="header_background_type">Tipo de Fundo</Label>
                <Select value={formData.header_background_type} onValueChange={(value) => setFormData({ ...formData, header_background_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Cor Sólida</SelectItem>
                    <SelectItem value="gradient">Degradê</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.header_background_type === 'solid' ? (
                <div>
                  <Label htmlFor="header_background_color">Cor de Fundo</Label>
                  <Input
                    id="header_background_color"
                    type="color"
                    value={formData.header_background_color}
                    onChange={(e) => setFormData({ ...formData, header_background_color: e.target.value })}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="header_gradient_color1">Primeira Cor</Label>
                      <Input
                        id="header_gradient_color1"
                        type="color"
                        value={formData.header_gradient_color1}
                        onChange={(e) => setFormData({ ...formData, header_gradient_color1: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="header_gradient_color2">Segunda Cor</Label>
                      <Input
                        id="header_gradient_color2"
                        type="color"
                        value={formData.header_gradient_color2}
                        onChange={(e) => setFormData({ ...formData, header_gradient_color2: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="header_gradient_angle">Ângulo do Degradê (graus)</Label>
                    <Input
                      id="header_gradient_angle"
                      type="number"
                      min="0"
                      max="360"
                      value={formData.header_gradient_angle}
                      onChange={(e) => setFormData({ ...formData, header_gradient_angle: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              )}
            </div>
            )}

            {/* Hero Settings */}
            {activeTab === "hero" && (
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold">Seção Hero</h3>
              
              <div>
                <Label htmlFor="hero_background_color">Cor de Fundo</Label>
                <Input
                  id="hero_background_color"
                  type="color"
                  value={formData.hero_background_color}
                  onChange={(e) => setFormData({ ...formData, hero_background_color: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="hero_title_font_family">Fonte do Título</Label>
                <Input
                  id="hero_title_font_family"
                  value={formData.hero_title_font_family}
                  onChange={(e) => setFormData({ ...formData, hero_title_font_family: e.target.value })}
                  placeholder="Ex: Inter, Arial, serif"
                />
              </div>

              <div>
                <Label htmlFor="hero_title_font_size">Tamanho do Título</Label>
                <Select value={formData.hero_title_font_size} onValueChange={(value) => setFormData({ ...formData, hero_title_font_size: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>{size.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            )}

            {/* Services Settings */}
            {activeTab === "services" && (
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold">Seção de Serviços</h3>
              
              <div>
                <Label htmlFor="services_background_type">Tipo de Fundo</Label>
                <Select value={formData.services_background_type} onValueChange={(value) => setFormData({ ...formData, services_background_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Cor Sólida</SelectItem>
                    <SelectItem value="image">Imagem</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.services_background_type === 'solid' ? (
                <div>
                  <Label htmlFor="services_background_color">Cor de Fundo</Label>
                  <Input
                    id="services_background_color"
                    type="color"
                    value={formData.services_background_color}
                    onChange={(e) => setFormData({ ...formData, services_background_color: e.target.value })}
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="services_background_image">URL da Imagem</Label>
                  <Input
                    id="services_background_image"
                    value={formData.services_background_image}
                    onChange={(e) => setFormData({ ...formData, services_background_image: e.target.value })}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="services_title_font_family">Fonte do Título</Label>
                <Input
                  id="services_title_font_family"
                  value={formData.services_title_font_family}
                  onChange={(e) => setFormData({ ...formData, services_title_font_family: e.target.value })}
                  placeholder="Ex: Inter, Arial, serif"
                />
              </div>

              <div>
                <Label htmlFor="services_title_font_size">Tamanho do Título</Label>
                <Select value={formData.services_title_font_size} onValueChange={(value) => setFormData({ ...formData, services_title_font_size: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>{size.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            )}

            {/* Section 2 Settings */}
            {activeTab === "section2" && (
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold">Seção Personalizada</h3>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="section2_enabled"
                  checked={formData.section2_enabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, section2_enabled: checked })}
                />
                <Label htmlFor="section2_enabled">Exibir esta seção na landing page</Label>
              </div>

              {formData.section2_enabled && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">✨ Editor Avançado</h4>
                    <p className="text-sm text-blue-700">
                      Escolha entre o editor visual (drag-and-drop como Elementor) ou editor de código (estilo VSCode)
                    </p>
                  </div>

                  <Tabs defaultValue="visual" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="visual">🎨 Editor Visual (Elementor)</TabsTrigger>
                      <TabsTrigger value="code">💻 Editor de Código (VSCode)</TabsTrigger>
                    </TabsList>

                    <TabsContent value="visual" className="space-y-4">
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <h4 className="text-sm font-semibold mb-3">Editor Visual - Arraste e Solte</h4>
                        <ElementorEditor
                          initialContent={formData.section2_content}
                          onChange={(htmlContent) => 
                            setFormData({ ...formData, section2_content: htmlContent })
                          }
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="code" className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Editor de Código - Modo Profissional</h4>
                        <p className="text-xs text-muted-foreground">
                          Editor com syntax highlighting, autocompletar e todas as funcionalidades do VSCode.
                          Use classes do Tailwind CSS para estilização.
                        </p>
                        <CodeEditor
                          value={formData.section2_content}
                          onChange={(value) => setFormData({ ...formData, section2_content: value })}
                          language="html"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
            )}

            {/* Footer Settings */}
            {activeTab === "footer" && (
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold">Configurações do Footer</h3>
              
              <div>
                <Label htmlFor="footer_background_color">Cor de Fundo</Label>
                <Input
                  id="footer_background_color"
                  type="color"
                  value={formData.footer_background_color}
                  onChange={(e) => setFormData({ ...formData, footer_background_color: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="footer_font_family">Fonte</Label>
                <Input
                  id="footer_font_family"
                  value={formData.footer_font_family}
                  onChange={(e) => setFormData({ ...formData, footer_font_family: e.target.value })}
                  placeholder="Ex: Inter, Arial, serif"
                />
              </div>

              <div>
                <Label htmlFor="footer_font_size">Tamanho da Fonte</Label>
                <Select value={formData.footer_font_size} onValueChange={(value) => setFormData({ ...formData, footer_font_size: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizes.slice(0, 6).map((size) => (
                      <SelectItem key={size.value} value={size.value}>{size.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="footer_text_align">Alinhamento do Texto</Label>
                <Select value={formData.footer_text_align} onValueChange={(value) => setFormData({ ...formData, footer_text_align: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {textAlignOptions.map((align) => (
                      <SelectItem key={align.value} value={align.value}>{align.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            )}
          </div>
          
          <Separator />
          <Button type="submit" className="w-full">
            Salvar Configurações Visuais
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};