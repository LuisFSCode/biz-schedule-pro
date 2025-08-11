import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import React, { useState } from "react";

export default function SettingsAcountTab(establishment, onUpdate) {

 const [formData, setFormData] = useState({
		name_businessPerson: establishment?.name_businessPerson || "",
		twoName_businessPerson: establishment?.twoName_businessPerson || "",
		imageProfile_businessPerson: establishment?.imageProfile_businessPerson || "",
		mailProfile_businessPerson:
			establishment?.mailProfile_businessPerson ||
			"Agende seus serviços de forma rápida e fácil",
		security_pass_businessPerson:
			establishment?.security_pass_businessPerson || "",
		payment_method: establishment?.payment_method || "Cartão Credito",
	});

 const handleSubmit = (e) => {
		e.preventDefault();
		onUpdate({ ...establishment, ...formData });
		console.log("botão clicado");
	};

	const [image, setImage] = useState<File | null>(null);
	const [imagePreviewURL, setImagePreviewURL ] = useState<string | null>(null);

	const handleImageProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const fileImageProfile = e.target.files?.[0];
		if(fileImageProfile) {
			setImagePreviewURL(URL.createObjectURL(fileImageProfile));
		};
	}

	return (
		<TabsContent
			value="AcountConfig"
			className="flex-1 px-2 py-4 w-full h-full overflow-auto"
		>
			<Card className="shadow-lg  flex-1 px-0 py-0  w-full ">
				<CardHeader>
					<CardTitle>Configurações do Perfil</CardTitle>
					<CardDescription>Atualize as suas informações de perfil</CardDescription>
				</CardHeader>
				<CardContent className="p-2">
					{/* <form className="space-y-6"> */}
						<div className="flex flex-col gap-2">
							<div className="grid grid-cols-1 gap-2 ">
								<Card className="px-2 py-6 flex flex-col gap-4">
									<CardTitle>Informações Pessoais</CardTitle>
									<form onSubmit={handleSubmit} className={`flex flex-col gap-2 ${imagePreviewURL ? 'flex gap-6 items-start' : 'flex flex-col gap-4' }`}>
										{imagePreviewURL ? (
											<div className="flex lg:flex lg:flex-col border border-red-600 w-full items-center">
												<div className="flex flex-1 w-full border border-red-600">
													<div className=" relative w-32 h-32 items-center justify-center">
														<img 
																src={imagePreviewURL}
																alt='Image Profile User'
																className="absolute w-full h-full rounded-full object-cover"
														/>
														<div className="relative rounded-full flex  items-end justify-center h-full  border right-0 left-0">
															<Label htmlFor="ImageProfile" className=" w-full h-2/4 flex items-center uppercase justify-center  text-center bg-black bg-opacity-60 text-white px-2 py-1 rounded-b-full cursor-pointer">
																Editar
															</Label>
															<Input id='ImageProfile' type="file" accept="image/*" onChange={handleImageProfileChange} className="absolute w-2 left-0 bottom-5 text-wrap text-left p-0 hidden z-0" />
														</div>
													</div>
												</div>
												<div className="grid grid-cols-1" >
													<div className="flex w-full flex-1 gap-2">
														<div className="w-full">
															<Label htmlFor="name_businessPerson">Nome</Label>
															<Input
																id="nameEmpresario"
																// value={}
																// onChange={(e) => setFormData({ ...formData, name: e.target.value })}
															/>
														</div>
														<div className="w-full">
															<Label htmlFor="twoName_businessPerson">Sobrenome</Label>
															<Input
																id="phone"
																// value={}
																// onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
															/>
														</div>
													</div>
													<div>
														<Label htmlFor="mailProfile_businessPerson">Email</Label>
														<Input
															id="mail"
															// value={}
															// onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
														/>
													</div>
												</div>
											</div>
										
										) : (
											<div className="bg-red-600 flex flex-col">
												<div className="flex w-full flex-1 gap-2">
													<div className="w-full">
														<Label htmlFor="name_businessPerson">Nome</Label>
														<Input
															id="nameEmpresario"
															// value={}
															// onChange={(e) => setFormData({ ...formData, name: e.target.value })}
														/>
													</div>
													<div className="w-full">
														<Label htmlFor="twoName_businessPerson">Sobrenome</Label>
														<Input
															id="phone"
															// value={}
															// onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
														/>
													</div>
												</div>
												<div>
													<Label htmlFor="imageProfile_businessPerson">
														Adicionar Foto de Perfil
													</Label>
													<Input type="file" onChange={handleImageProfileChange}/>
												</div>
												<div>
													<Label htmlFor="mailProfile_businessPerson">Email</Label>
													<Input
														id="mail"
														// value={}
														// onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
													/>
												</div>
											</div>
										)}
									<Button type="submit">Salvar</Button>
									</form>
								</Card>
								<Card className="px-4 py-6">
									<CardTitle>Segurança</CardTitle>
									<div>
										<Label htmlFor="mailProfile_businessPerson">Alterar Senha</Label>
										<Input
											id="mail"
											// value={}
											// onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
										/>
									</div>
									<div>
										<Label htmlFor="mailProfile_businessPerson">
											Verificação em duas etapas (2FA)
										</Label>
										<Input
											id="mail"
											// value={}
											// onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
										/>
									</div>
								</Card>
								<Card className="px-4 py-6">
									<CardTitle>Permissões e Acesso de Equipe</CardTitle>
									<div>
										<Label>Lista de Colaborades com acesso</Label>
										<Label>Nivel de Permissão</Label>
										<Label>Convidar Colaborador</Label>
									</div>
								</Card>
								<Card>
									<CardTitle>Extras</CardTitle>
									<div>
										<Label>Idioma</Label>
										<Label>Fuso Horário</Label>
									</div>
								</Card>
							</div>
						</div>

						<Button type="submit" className="w-full">
							Salvar Configurações
						</Button>
					{/* </form> */}
				</CardContent>
			</Card>
		</TabsContent>
	);
}
