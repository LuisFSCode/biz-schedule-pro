import { DashboardState } from "@/hooks/DashboardHooks/DashboardHooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Calendar } from "lucide-react";

export default function AppointmentsTab() {
  const { appointments } = DashboardState();

  return (
      <Card className='flex flex-col w-full h-full overflow-auto '>
        <CardHeader>
        <CardTitle>Próximos Agendamentos</CardTitle>
        <CardDescription>
            {appointments.length} agendamento(s) encontrado(s)
        </CardDescription>
        </CardHeader>
        <CardContent>
        {appointments.length === 0 ? (
            <div className="text-center py-8">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum agendamento encontrado</p>
            </div>
        ) : (
            <div className="space-y-4">
            {appointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                    <div>
                    <h3 className="font-semibold">{appointment.service_name} 123</h3>
                    <p className="text-sm text-muted-foreground">
                        Cliente: {appointment.customers?.name || 'N/A'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {new Date(appointment.appointment_date).toLocaleDateString('pt-BR')} às {appointment.appointment_time}
                    </p>
                    {appointment.notes && (
                        <p className="text-sm text-muted-foreground mt-2">
                        Observações: {appointment.notes}
                        </p>
                    )}
                    </div>
                    <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                        appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                        {appointment.status === 'confirmed' ? 'Confirmado' :
                        appointment.status === 'pending' ? 'Pendente' : appointment.status}
                    </span>
                    {appointment.service_price && (
                        <p className="text-sm font-semibold mt-1">
                        R$ {appointment.service_price.toFixed(2)}
                        </p>
                    )}
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}
        </CardContent>
      </Card>

  )
}