import { Tabs, TabsContent, TabsList, TabsTrigger, } from "../ui/tabs";
import { Calendar } from "lucide-react";
import { VisualSettingsForm } from "../VisualSettingsForm";
import SettingsBusiness from "./SettingsTab/SettingBusinessTab";
import SettingsSite from "./SettingsTab/SettingsSiteTab";
import SettingsAcountTab from "./SettingsTab/SettingsAcountTab";

interface SettingsFormProps {
	establishment: any;
	onUpdate: (data: any) => void;
	tabValue: string;
	setTabValue: (value: string) => void;
}

export default function SettingsForm({
	establishment,
	onUpdate,
	tabValue,
	setTabValue,
}: SettingsFormProps) {
	

return (
	<div className="h-full">
		<div className="flex h-full w-full ">
			<Tabs
				value={tabValue}
				onValueChange={setTabValue}
				className="flex flex-col w-full h-full "
			>
				<div className="transition-all duration-400 ease-in-out ">
					<TabsList className="rounded-none px-4 flex gap-5">
						<TabsTrigger
							value="AcountConfig"
							className={`border transition-all duration-1000 ease-in-out w-full min-w-6 h-8 flex items-center cursor-pointer text-sm font-medium`}
						>
							<div
								className={`transition-all duration-1000 ease-in-out flex items-center justify-center gap-2`}
							>
								<Calendar className={`w-6 h-6`} />
								<p
									className={`transition-all duration-1000 flex items-center justify-center`}
								>
									Config. De Conta
								</p>
							</div>
						</TabsTrigger>

						<TabsTrigger
							value="BusinessConfig"
							className={`border transition-all duration-1000 ease-in-out w-full min-w-6 h-8 flex items-center cursor-pointer text-sm font-medium`}
						>
							<div
								className={`transition-all duration-1000 ease-in-out flex items-center justify-center gap-2`}
							>
								<Calendar className={`w-6 h-6`} />
								<p
									className={`transition-all duration-1000 flex items-center justify-center`}
								>
									Config. de Negócio
								</p>
							</div>
						</TabsTrigger>

						<TabsTrigger
							value="ConfigSite"
							className={`border transition-all duration-1000 ease-in-out w-full min-w-6 h-8 flex items-center cursor-pointer text-sm font-medium`}
						>
							<div
								className={`transition-all duration-1000 ease-in-out flex items-center justify-center gap-2`}
							>
								<Calendar className={`w-6 h-6`} />
								<p
									className={`transition-all duration-1000 flex items-center justify-center`}
								>
									Config. De Site
								</p>
							</div>
						</TabsTrigger>

						<TabsTrigger
							value="VisualSettingForm"
							className={`border transition-all duration-1000 ease-in-out w-full min-w-6 h-8 flex items-center cursor-pointer text-sm font-medium`}
						>
							<div
								className={`transition-all duration-1000 ease-in-out flex items-center justify-center gap-2`}
							>
								<Calendar className={`w-6 h-6`} />
								<p
									className={`transition-all duration-1000 flex items-center justify-center`}
								>
									Configs. Extras
								</p>
							</div>
						</TabsTrigger>
					</TabsList>
				</div>
				<div className="flex-1   relative overflow-hidden ">
					<div className=" h-full  border border-red-600">
						<TabsContent value="AcountConfig" className="flex-1 w-full h-full">
							<div className="border border-black overflow-auto h-full">
								<SettingsAcountTab
								// establishment={establishment}
								// onUpdate={onUpdate}
								/>
							</div>
						</TabsContent>

						<TabsContent value="BusinessConfig" className="flex-1 w-full h-full">
							<div className="border border-black overflow-auto h-full">
								<SettingsBusiness establishment={establishment} onUpdate={onUpdate} />
							</div>
						</TabsContent>

						<TabsContent value="ConfigSite" className="flex-1 w-full h-full">
							<div className="border border-black overflow-auto h-full">
								<SettingsSite establishment={establishment} onUpdate={onUpdate} />
							</div>
						</TabsContent>

						<TabsContent value="VisualSettingForm" className="flex-1 w-full h-full ">
							<div className="border border-black overflow-auto h-full py-4 px-4">
								<VisualSettingsForm establishment={establishment} onUpdate={onUpdate} />
							</div>
						</TabsContent>
					</div>
				</div>
			</Tabs>
		</div>
	</div>
);
}
