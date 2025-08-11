import { DashboardState } from "@/hooks/DashboardHooks/DashboardHooks";
import { CardHeader, Card, CardTitle, CardContent,  } from "../ui/card";
import { useDashboard } from "@/context/DashboardContext";

export default function ReportTab() {

  const { services } = useDashboard();
  const { appointments } = DashboardState();

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Agendamentos</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agendamentos Confirmados</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">
              {appointments.filter(a => a.status === 'confirmed').length}
              </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Serviços Ativos</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">{services.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">
              R$ {appointments
                  .filter(a => a.status === 'confirmed' && a.service_price)
                  .reduce((sum, a) => sum + (a.service_price || 0), 0)
                  .toFixed(2)}
              </div>
          </CardContent>
        </Card>
      </div> 
    </div>
  );
}
