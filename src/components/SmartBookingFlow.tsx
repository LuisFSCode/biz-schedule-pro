import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, addMonths, isSameDay, parseISO, addMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, User, CheckCircle, AlertTriangle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useProfessionals } from '@/hooks/DashboardHooks/ProfessionalsHooks';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SmartBookingFlowProps {
  establishmentId: string;
  services: any[];
  onBookingComplete?: (booking: any) => void;
}

export default function SmartBookingFlow({ 
  establishmentId, 
  services, 
  onBookingComplete 
}: SmartBookingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isBooking, setIsBooking] = useState(false);

  const {
    professionals,
    getAvailableProfessionals,
    getProfessionalAvailability
  } = useProfessionals(establishmentId);

  // Step 1: Get available professionals for selected service
  const getAvailableProfessionalsForService = () => {
    if (!selectedService) return [];
    
    return professionals.filter(prof => {
      // All professionals are considered active
      
      if (!prof.serves_all_services) {
        // Check if professional serves this specific service
        // This would need to be implemented in the hook
        return true; // Simplified for now
      }
      
      return true;
    });
  };

  // Step 2: Get available dates for selected professional and service
  const getAvailableDates = () => {
    if (!selectedProfessional || !selectedService) return [];
    
    const today = new Date();
    const sixMonthsLater = addMonths(today, 6);
    const availableDates = [];
    
    // Get all availability for this professional
    const professionalAvailability = getProfessionalAvailability(selectedProfessional.id, '');
    
    // Generate dates with availability (simplified)
    for (let d = new Date(today); d <= sixMonthsLater; d.setDate(d.getDate() + 1)) {
      const dateString = format(d, 'yyyy-MM-dd');
      const availability = getProfessionalAvailability(selectedProfessional.id, dateString);
      
      if (availability) {
        availableDates.push(new Date(d));
      }
    }
    
    return availableDates;
  };

  // Step 3: Get available time slots for selected date and professional
  const generateTimeSlots = () => {
    if (!selectedDate || !selectedProfessional || !selectedService) return [];
    
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const availability = getProfessionalAvailability(selectedProfessional.id, dateString);
    
    if (!availability) return [];
    
    const slots = [];
    const startTime = availability.start_time;
    const endTime = availability.end_time;
    const serviceDuration = selectedService.duration || 60;
    
    // Generate 30-minute slots
    let currentTime = startTime;
    
    while (currentTime < endTime) {
      // Check if there's enough time for the service
      const [hours, minutes] = currentTime.split(':').map(Number);
      const currentDate = new Date();
      currentDate.setHours(hours, minutes, 0, 0);
      
      const serviceEndTime = addMinutes(currentDate, serviceDuration);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      const availabilityEndDate = new Date();
      availabilityEndDate.setHours(endHours, endMinutes, 0, 0);
      
      if (serviceEndTime <= availabilityEndDate) {
        slots.push(currentTime);
      }
      
      // Move to next 30-minute slot
      const nextSlot = addMinutes(currentDate, 30);
      currentTime = format(nextSlot, 'HH:mm');
    }
    
    return slots;
  };

  // Update available slots when date or professional changes
  useEffect(() => {
    if (selectedDate && selectedProfessional && selectedService) {
      const slots = generateTimeSlots();
      setAvailableSlots(slots);
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate, selectedProfessional, selectedService]);

  // Handle booking confirmation
  const handleBooking = async () => {
    if (!selectedService || !selectedProfessional || !selectedDate || !selectedTime) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsBooking(true);
    
    try {
      const bookingData = {
        establishment_id: establishmentId,
        professional_id: selectedProfessional.id,
        service_name: selectedService.name,
        service_price: selectedService.price,
        service_duration: selectedService.duration,
        appointment_date: format(selectedDate, 'yyyy-MM-dd'),
        appointment_time: selectedTime,
        status: 'pending',
        customer_id: null // Will be set by parent component
      };

      // Pass booking data to parent for authentication handling
      onBookingComplete?.(bookingData);
      
      // Reset form
      setCurrentStep(1);
      setSelectedService(null);
      setSelectedProfessional(null);
      setSelectedDate(undefined);
      setSelectedTime('');
      
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Erro",
        description: "Erro ao realizar agendamento",
        variant: "destructive"
      });
    } finally {
      setIsBooking(false);
    }
  };

  // Check if date has availability
  const hasAvailability = (date: Date) => {
    if (!selectedProfessional) return false;
    const dateString = format(date, 'yyyy-MM-dd');
    return !!getProfessionalAvailability(selectedProfessional.id, dateString);
  };

  const availableProfessionals = getAvailableProfessionalsForService();
  const availableDates = getAvailableDates();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Novo Agendamento</CardTitle>
          <CardDescription>
            Siga os passos para realizar um agendamento
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  {step}
                </div>
                {step < 4 && <div className={`h-0.5 w-16 ${
                  currentStep > step ? 'bg-primary' : 'bg-muted'
                }`} />}
              </div>
            ))}
          </div>

          <Tabs value={currentStep.toString()} className="w-full">
            {/* Step 1: Select Service */}
            <TabsContent value="1" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">1. Selecione o Serviço</h3>
                {services.length === 0 ? (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Nenhum serviço cadastrado. Configure os serviços primeiro.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <Card 
                        key={service.id} 
                        className={`cursor-pointer transition-all ${
                          selectedService?.id === service.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => {
                          setSelectedService(service);
                          setSelectedProfessional(null);
                          setSelectedDate(undefined);
                          setSelectedTime('');
                        }}
                      >
                        <CardContent className="pt-4">
                          <h4 className="font-medium">{service.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {service.duration} min • R$ {service.price?.toFixed(2) || '0.00'}
                          </p>
                          {service.description && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {service.description}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                
                {selectedService && (
                  <div className="flex justify-end mt-4">
                    <Button onClick={() => setCurrentStep(2)}>
                      Próximo <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Step 2: Select Professional */}
            <TabsContent value="2" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">2. Selecione o Profissional</h3>
                {availableProfessionals.length === 0 ? (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Nenhum profissional disponível para este serviço.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableProfessionals.map((professional) => (
                      <Card 
                        key={professional.id} 
                        className={`cursor-pointer transition-all ${
                          selectedProfessional?.id === professional.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => {
                          setSelectedProfessional(professional);
                          setSelectedDate(undefined);
                          setSelectedTime('');
                        }}
                      >
                        <CardContent className="pt-4">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>
                                {professional.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{professional.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {professional.default_start_time} às {professional.default_end_time}
                              </p>
                              <Badge variant="outline" className="mt-1">
                                {professional.serves_all_services ? "Todos serviços" : "Serviços específicos"}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                  </Button>
                  {selectedProfessional && (
                    <Button onClick={() => setCurrentStep(3)}>
                      Próximo <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Step 3: Select Date */}
            <TabsContent value="3" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">3. Selecione a Data</h3>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setSelectedTime('');
                    }}
                    disabled={(date) => 
                      date < new Date() || 
                      date > addMonths(new Date(), 6) ||
                      !hasAvailability(date)
                    }
                    locale={ptBR}
                    className="rounded-md border"
                    modifiers={{
                      available: hasAvailability
                    }}
                    modifiersStyles={{
                      available: { 
                        backgroundColor: 'hsl(var(--secondary))', 
                        color: 'hsl(var(--secondary-foreground))' 
                      }
                    }}
                  />
                </div>
                
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                  </Button>
                  {selectedDate && (
                    <Button onClick={() => setCurrentStep(4)}>
                      Próximo <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Step 4: Select Time */}
            <TabsContent value="4" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">4. Selecione o Horário</h3>
                {availableSlots.length === 0 ? (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Nenhum horário disponível para esta data.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={selectedTime === slot ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(slot)}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                )}

                {/* Booking Summary */}
                {selectedService && selectedProfessional && selectedDate && selectedTime && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Resumo do Agendamento</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Serviço:</span>
                        <span className="font-medium">{selectedService.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Profissional:</span>
                        <span className="font-medium">{selectedProfessional.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Data:</span>
                        <span className="font-medium">
                          {format(selectedDate, 'EEEE, dd/MM/yyyy', { locale: ptBR })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Horário:</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duração:</span>
                        <span className="font-medium">{selectedService.duration} min</span>
                      </div>
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Valor:</span>
                        <span>R$ {selectedService.price?.toFixed(2) || '0.00'}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={() => setCurrentStep(3)}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                  </Button>
                  {selectedTime && (
                    <Button onClick={handleBooking} disabled={isBooking}>
                      {isBooking ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Agendando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirmar Agendamento
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}