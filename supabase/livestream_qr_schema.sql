-- Livestream QR Commerce Database Schema

-- Create livestream_qr_scans table
CREATE TABLE IF NOT EXISTS public.livestream_qr_scans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  merchant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  scanned_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  converted BOOLEAN DEFAULT FALSE,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  referrer TEXT,  -- Which platform? (tiktok, instagram, facebook)
  session_duration INTEGER,  -- How long on product page (seconds)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create livestream_overlay_state table
CREATE TABLE IF NOT EXISTS public.livestream_overlay_state (
  merchant_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  qr_code_data_url TEXT,  -- Base64 data URL of QR code image
  product_name TEXT,  -- Cache for overlay display
  product_price TEXT,  -- Cache for overlay display
  show_qr BOOLEAN DEFAULT FALSE,  -- Visibility toggle
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_livestream_qr_scans_merchant ON public.livestream_qr_scans(merchant_id);
CREATE INDEX IF NOT EXISTS idx_livestream_qr_scans_product ON public.livestream_qr_scans(product_id);
CREATE INDEX IF NOT EXISTS idx_livestream_qr_scans_converted ON public.livestream_qr_scans(converted);
CREATE INDEX IF NOT EXISTS idx_livestream_qr_scans_date ON public.livestream_qr_scans(scanned_at DESC);

-- Enable Row Level Security (RLS) policies

-- Enable RLS
ALTER TABLE public.livestream_qr_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.livestream_overlay_state ENABLE ROW LEVEL SECURITY;

-- RLS Policies for livestream_qr_scans
CREATE POLICY "Livestream QR scans are viewable by merchant" 
  ON public.livestream_qr_scans FOR SELECT
  USING (auth.uid() = (SELECT id FROM public.profiles WHERE id = merchant_id));

CREATE POLICY "Merchants can insert their own QR scans" 
  ON public.livestream_qr_scans FOR INSERT
  WITH CHECK (auth.uid() = merchant_id);

CREATE POLICY "Merchants can update their own QR scans" 
  ON public.livestream_qr_scans FOR UPDATE
  USING (auth.uid() = merchant_id);

-- RLS Policies for livestream_overlay_state
CREATE POLICY "Overlay state is viewable by merchant" 
  ON public.livestream_overlay_state FOR SELECT
  USING (auth.uid() = merchant_id);

CREATE POLICY "Merchants can update their own overlay state" 
  ON public.livestream_overlay_state FOR ALL
  USING (auth.uid() = merchant_id);

-- Enable real-time updates for overlay state
-- This allows Supabase Realtime to broadcast changes
ALTER PUBLICATION supabase_realtime ADD TABLE public.livestream_overlay_state;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update overlay state timestamp
CREATE TRIGGER update_livestream_overlay_state_updated_at 
  BEFORE UPDATE ON public.livestream_overlay_state
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default overlay state for existing merchants
-- This ensures all merchants have an overlay state record
INSERT INTO public.livestream_overlay_state (merchant_id, show_qr)
SELECT id, false
FROM public.profiles
WHERE is_merchant = true
ON CONFLICT (merchant_id) DO NOTHING;