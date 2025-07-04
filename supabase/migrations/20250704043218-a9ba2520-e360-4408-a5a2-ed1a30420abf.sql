-- Add visual customization fields to establishments table
ALTER TABLE public.establishments 
ADD COLUMN IF NOT EXISTS body_background_type VARCHAR(20) DEFAULT 'solid',
ADD COLUMN IF NOT EXISTS body_background_color VARCHAR(7) DEFAULT '#ffffff',
ADD COLUMN IF NOT EXISTS body_gradient_color1 VARCHAR(7),
ADD COLUMN IF NOT EXISTS body_gradient_color2 VARCHAR(7),
ADD COLUMN IF NOT EXISTS body_gradient_angle INTEGER DEFAULT 45,

ADD COLUMN IF NOT EXISTS header_background_type VARCHAR(20) DEFAULT 'solid',
ADD COLUMN IF NOT EXISTS header_background_color VARCHAR(7) DEFAULT '#ffffff',
ADD COLUMN IF NOT EXISTS header_gradient_color1 VARCHAR(7),
ADD COLUMN IF NOT EXISTS header_gradient_color2 VARCHAR(7),
ADD COLUMN IF NOT EXISTS header_gradient_angle INTEGER DEFAULT 45,
ADD COLUMN IF NOT EXISTS header_position VARCHAR(10) DEFAULT 'relative',

ADD COLUMN IF NOT EXISTS hero_background_color VARCHAR(7),
ADD COLUMN IF NOT EXISTS hero_title_font_family VARCHAR(100),
ADD COLUMN IF NOT EXISTS hero_title_font_size VARCHAR(10) DEFAULT '4xl',

ADD COLUMN IF NOT EXISTS services_background_type VARCHAR(20) DEFAULT 'solid',
ADD COLUMN IF NOT EXISTS services_background_color VARCHAR(7),
ADD COLUMN IF NOT EXISTS services_background_image VARCHAR(500),
ADD COLUMN IF NOT EXISTS services_title_font_family VARCHAR(100),
ADD COLUMN IF NOT EXISTS services_title_font_size VARCHAR(10) DEFAULT '3xl',

ADD COLUMN IF NOT EXISTS section2_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS section2_content TEXT,

ADD COLUMN IF NOT EXISTS footer_background_color VARCHAR(7) DEFAULT '#f8f9fa',
ADD COLUMN IF NOT EXISTS footer_font_family VARCHAR(100),
ADD COLUMN IF NOT EXISTS footer_font_size VARCHAR(10) DEFAULT 'sm',
ADD COLUMN IF NOT EXISTS footer_text_align VARCHAR(10) DEFAULT 'center';