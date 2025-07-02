-- Create establishments table (empresários)
CREATE TABLE public.establishments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  hero_image_url TEXT,
  hero_title TEXT DEFAULT 'Bem-vindos ao nosso estabelecimento',
  hero_description TEXT DEFAULT 'Agende seus serviços de forma rápida e fácil',
  color_primary TEXT DEFAULT '#3B82F6',
  services JSONB DEFAULT '[]',
  feedbacks JSONB DEFAULT '[]',
  footer_text TEXT DEFAULT 'Desenvolvido com AgendaPro',
  address TEXT,
  phone TEXT,
  instagram_url TEXT,
  facebook_url TEXT,
  whatsapp TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create customers table (usuários finais)
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  password_hash TEXT,
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(email, establishment_id)
);

-- Create appointments table (agendamentos)
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  service_price DECIMAL(10,2),
  service_duration INTEGER DEFAULT 60, -- minutes
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.establishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for establishments
CREATE POLICY "Establishments can view their own data" 
ON public.establishments 
FOR SELECT 
USING (auth.uid()::text = id::text OR true); -- Public read for now

CREATE POLICY "Establishments can update their own data" 
ON public.establishments 
FOR UPDATE 
USING (auth.uid()::text = id::text);

CREATE POLICY "Anyone can create establishments" 
ON public.establishments 
FOR INSERT 
WITH CHECK (true);

-- RLS Policies for customers
CREATE POLICY "Customers can view their own data" 
ON public.customers 
FOR SELECT 
USING (auth.uid()::text = id::text);

CREATE POLICY "Customers can update their own data" 
ON public.customers 
FOR UPDATE 
USING (auth.uid()::text = id::text);

CREATE POLICY "Anyone can create customers" 
ON public.customers 
FOR INSERT 
WITH CHECK (true);

-- RLS Policies for appointments
CREATE POLICY "Users can view appointments related to them" 
ON public.appointments 
FOR SELECT 
USING (
  auth.uid()::text = customer_id::text OR 
  auth.uid()::text = establishment_id::text
);

CREATE POLICY "Customers can create appointments for themselves" 
ON public.appointments 
FOR INSERT 
WITH CHECK (auth.uid()::text = customer_id::text);

CREATE POLICY "Establishments can update appointments for their business" 
ON public.appointments 
FOR UPDATE 
USING (auth.uid()::text = establishment_id::text);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_establishments_updated_at
  BEFORE UPDATE ON public.establishments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_establishments_slug ON public.establishments(slug);
CREATE INDEX idx_customers_establishment_id ON public.customers(establishment_id);
CREATE INDEX idx_appointments_establishment_id ON public.appointments(establishment_id);
CREATE INDEX idx_appointments_customer_id ON public.appointments(customer_id);
CREATE INDEX idx_appointments_date_time ON public.appointments(appointment_date, appointment_time);