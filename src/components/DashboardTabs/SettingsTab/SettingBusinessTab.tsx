import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { useState } from "react";

export default function SettingsBusiness({ establishment, onUpdate }){
 const [formData, setFormData] = useState({
   name: establishment?.name || "",
   phone: establishment?.phone || "",
   address: establishment?.address || "",
   whatsapp: establishment?.whatsapp || "",
   instagram_url: establishment?.instagram_url || "",
   facebook_url: establishment?.facebook_url || "",
 });

 const handleSubmit = (e) => {
  e.preventDefault();
  onUpdate({...establishment, ...formData});
  console.log('botão clicado')
 };

 return (
  <TabsContent value="BusinessConfig" className="flex-1 px-4 py-4 w-full h-full overflow-auto">
   <Card className="shadow-lg  flex-1 px-4 py-4  w-full ">
    <CardHeader>
        <CardTitle>Configurações do Estabelecimento</CardTitle>
        <CardDescription>
        Atualize as informações do seu negócio
        </CardDescription>
    </CardHeader>
    <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
         <div className="space-y-4">
             <h3 className="text-lg font-semibold">Informações do Estabelecimento</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                 <Label htmlFor="name">Nome do Estabelecimento</Label>
                 <Input
                 id="name"
                 value={formData.name}
                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                 />
             </div>
             <div>
                 <Label htmlFor="phone">Telefone</Label>
                 <Input
                 id="phone"
                 value={formData.phone}
                 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                 />
             </div>
             <div>
                 <Label htmlFor="whatsapp">WhatsApp</Label>
                 <Input
                 id="whatsapp"
                 value={formData.whatsapp}
                 onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                 />
             </div>
             <div>
                 <Label htmlFor="address">Endereço</Label>
                 <Input
                 id="address"
                 value={formData.address}
                 onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                 />
             </div>
             <div>
                 <Label htmlFor="instagram_url">Instagram</Label>
                 <Input
                 id="instagram_url"
                 placeholder="https://instagram.com/seuusuario"
                 value={formData.instagram_url}
                 onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                 />
             </div>
             <div>
                 <Label htmlFor="facebook_url">Facebook</Label>
                 <Input
                 id="facebook_url"
                 placeholder="https://facebook.com/suapagina"
                 value={formData.facebook_url}
                 onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                 />
             </div>
             </div>
         </div>
         
         <Button type="submit" className="w-full">
             Salvar Configurações
         </Button>
        </form>
    </CardContent>
   </Card>
  </TabsContent>
 )
};


