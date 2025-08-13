import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, addMonths, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Clock, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProfessionals, Professional } from '@/hooks/DashboardHooks/ProfessionalsHooks';
import { useDashboard } from '@/context/DashboardContext';

interface ProfessionalAvailabilityManagerProps {
  professional: Professional;
}

export default function ProfessionalAvailabilityManager({ 
  professional 
}: ProfessionalAvailabilityManagerProps) {
  const { establishment } = useDashboard();
  const { 
    availability,
    setAvailabilityForDates,
    setAvailabilityForDateRange,
    removeAvailability
  } = useProfessionals(establishment?.id);

  // State for multiple dates selection
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [multipleStartTime, setMultipleStartTime] = useState(professional.default_start_time);
  const [multipleEndTime, setMultipleEndTime] = useState(professional.default_end_time);

  // State for date range selection
  const [rangeStartDate, setRangeStartDate] = useState<Date>();
  const [rangeEndDate, setRangeEndDate] = useState<Date>();
  const [rangeStartTime, setRangeStartTime] = useState(professional.default_start_time);
  const [rangeEndTime, setRangeEndTime] = useState(professional.default_end_time);

  // State for calendar navigation (6 months from now)
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const maxDate = addMonths(new Date(), 6);

  // Get professional's availability
  const professionalAvailability = availability.filter(a => a.professional_id === professional.id);

  // Handle multiple dates selection
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const isSelected = selectedDates.some(d => isSameDay(d, date));
    if (isSelected) {
      setSelectedDates(selectedDates.filter(d => !isSameDay(d, date)));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  // Handle setting availability for selected dates
  const handleSetMultipleDatesAvailability = async () => {
    if (selectedDates.length === 0) return;

    const dateStrings = selectedDates.map(date => format(date, 'yyyy-MM-dd'));
    await setAvailabilityForDates(
      professional.id,
      dateStrings,
      multipleStartTime,
      multipleEndTime
    );
    setSelectedDates([]);
  };

  // Handle setting availability for date range
  const handleSetRangeAvailability = async () => {
    if (!rangeStartDate || !rangeEndDate) return;

    await setAvailabilityForDateRange(
      professional.id,
      format(rangeStartDate, 'yyyy-MM-dd'),
      format(rangeEndDate, 'yyyy-MM-dd'),
      rangeStartTime,
      rangeEndTime
    );
    setRangeStartDate(undefined);
    setRangeEndDate(undefined);
  };

  // Handle removing availability
  const handleRemoveAvailability = async (date: string) => {
    await removeAvailability(professional.id, [date]);
  };

  // Check if date has availability
  const hasAvailability = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return professionalAvailability.some(a => a.date === dateString && a.is_available);
  };

  // Check if date is in selected dates
  const isDateSelected = (date: Date) => {
    return selectedDates.some(d => isSameDay(d, date));
  };

  // Generate time slots (every 30 minutes)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="multiple" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="multiple">Múltiplas Datas</TabsTrigger>
          <TabsTrigger value="range">Período</TabsTrigger>
          <TabsTrigger value="current">Disponibilidade Atual</TabsTrigger>
        </TabsList>

        {/* Multiple Dates Tab */}
        <TabsContent value="multiple" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Selecionar Múltiplas Datas</CardTitle>
              <CardDescription>
                Clique em várias datas para aplicar o mesmo horário a todas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={undefined}
                  onSelect={handleDateSelect}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const compareDate = new Date(date);
                    compareDate.setHours(0, 0, 0, 0);
                    return compareDate < today || date > maxDate;
                  }}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  locale={ptBR}
                  className="rounded-md border"
                  modifiers={{
                    selected: isDateSelected
                  }}
                  modifiersStyles={{
                    selected: { backgroundColor: 'hsl(var(--primary))', color: 'white' }
                  }}
                />
              </div>

              {selectedDates.length > 0 && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                  <div>
                    <Label className="text-sm font-medium">
                      Datas selecionadas ({selectedDates.length}):
                    </Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedDates.map((date, index) => (
                        <Badge key={index} variant="outline">
                          {format(date, 'dd/MM/yyyy', { locale: ptBR })}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="multiple-start">Horário início</Label>
                      <Select value={multipleStartTime} onValueChange={setMultipleStartTime}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="multiple-end">Horário fim</Label>
                      <Select value={multipleEndTime} onValueChange={setMultipleEndTime}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setSelectedDates([])}>
                      Limpar Seleção
                    </Button>
                    <Button onClick={handleSetMultipleDatesAvailability}>
                      <Plus className="w-4 h-4 mr-2" />
                      Aplicar Horário às Datas
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Date Range Tab */}
        <TabsContent value="range" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurar Período</CardTitle>
              <CardDescription>
                Selecione um período de datas para aplicar o mesmo horário
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data início</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !rangeStartDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {rangeStartDate ? format(rangeStartDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={rangeStartDate}
                        onSelect={setRangeStartDate}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const compareDate = new Date(date);
                          compareDate.setHours(0, 0, 0, 0);
                          return compareDate < today || date > maxDate;
                        }}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Data fim</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !rangeEndDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {rangeEndDate ? format(rangeEndDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={rangeEndDate}
                        onSelect={setRangeEndDate}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const compareDate = new Date(date);
                          compareDate.setHours(0, 0, 0, 0);
                          return compareDate < today || date > maxDate || (rangeStartDate && date < rangeStartDate);
                        }}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="range-start">Horário início</Label>
                  <Select value={rangeStartTime} onValueChange={setRangeStartTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="range-end">Horário fim</Label>
                  <Select value={rangeEndTime} onValueChange={setRangeEndTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleSetRangeAvailability}
                disabled={!rangeStartDate || !rangeEndDate}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Aplicar Horário ao Período
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Current Availability Tab */}
        <TabsContent value="current" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Disponibilidade Configurada</CardTitle>
              <CardDescription>
                Visualize e gerencie a disponibilidade atual do profissional
              </CardDescription>
            </CardHeader>
            <CardContent>
              {professionalAvailability.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhuma disponibilidade configurada</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Use as abas acima para configurar a disponibilidade
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {professionalAvailability
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .map((avail) => (
                      <div 
                        key={avail.id} 
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium">
                            {format(parseISO(avail.date), 'EEEE, dd/MM/yyyy', { locale: ptBR })}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {avail.start_time} às {avail.end_time}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveAvailability(avail.date)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}