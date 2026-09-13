-- =======================================================
-- TripG Database Schema for Supabase (PostgreSQL)
-- Execute this script in your Supabase Dashboard SQL Editor
-- =======================================================

-- 1. Create table
CREATE TABLE IF NOT EXISTS public.destinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stop_number INTEGER NOT NULL DEFAULT 1,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  distance TEXT DEFAULT '',
  description TEXT DEFAULT '',
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  image_url TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'other',
  visited BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create index on stop_number for fast route sorting
CREATE INDEX IF NOT EXISTS idx_destinations_stop_number ON public.destinations (stop_number ASC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies for public access (allow reading and updating)
DROP POLICY IF EXISTS "Allow public read access" ON public.destinations;
CREATE POLICY "Allow public read access"
  ON public.destinations
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow public insert access" ON public.destinations;
CREATE POLICY "Allow public insert access"
  ON public.destinations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update access" ON public.destinations;
CREATE POLICY "Allow public update access"
  ON public.destinations
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete access" ON public.destinations;
CREATE POLICY "Allow public delete access"
  ON public.destinations
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- 5. Seed the 11 Vadodara Tour Stops
INSERT INTO public.destinations (stop_number, name, location, distance, description, latitude, longitude, image_url, category, visited)
VALUES
  (1, 'Parul University (Start Point)', 'Waghodia Road, Vadodara', 'Tour Origin (~17–19 km to Manjalpur)', 'Starting point of the Vadodara Darshan tour. Head southwest toward Manjalpur to begin the sacred journey.', 22.2887, 73.3634, 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80', 'other', false),
  (2, 'Manjalpur Na Raja', 'Manjalpur, Vadodara', '~17–19 km from Parul University', 'Iconic and magnificent Ganesh idol in Manjalpur, known for grand decorations and spiritual ambiance.', 22.2612, 73.1895, 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=900&q=80', 'manjalpur', false),
  (3, 'Mangal Bazar Yuvak Mandal', 'Mangal Bazar, Old City, Vadodara', '~5–6 km from Manjalpur', 'Historical heart of Vadodara old city market, celebrated for festive traditions and vibrant street gatherings.', 22.3008, 73.2045, 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=900&q=80', 'old-city', false),
  (4, 'Nava Bazar Yuvak Mandal', 'Nava Bazar, Old City, Vadodara', '~500 m – 1 km from Mangal Bazar', 'Adjacent to Mangal Bazar, renowned for creative theme-based pandals and traditional artistic decorations.', 22.3032, 73.2061, 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=900&q=80', 'old-city', false),
  (5, 'Khanderao Market / Amba Mata Temple (Near)', 'Khanderao Market area, Vadodara', '~1–1.5 km from Nava Bazar', 'Near the majestic architectural marvel built by Maharaja Sayajirao Gaekwad III, full of cultural heritage.', 22.2964, 73.2031, 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=900&q=80', 'old-city', false),
  (6, 'Bajwada na Raja', 'Bajwada, Vadodara', '~1–1.5 km from Khanderao Market', 'Legendary Bajwada Ganesh idol, deeply revered by the city with remarkable artistic styling each year.', 22.3055, 73.2088, 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=900&q=80', 'bajwada', false),
  (7, 'Dandia Bazar na Raja (Near Babajipura)', 'Dandia Bazar / Babajipura, Vadodara', '~1.5–2 km from Bajwada', 'Centrally located sacred idol in the Dandia Bazar heritage corridor, surrounded by classical Baroda architecture.', 22.2982, 73.1975, 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=900&q=80', 'old-city', false),
  (8, 'Navapura Yuvak Mandal', 'Navapura, Vadodara', '~1–1.5 km from Dandia Bazar', 'Famous for exceptional community celebrations, music, illumination, and warm devotional gatherings.', 22.2941, 73.1952, 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=900&q=80', 'navapura', false),
  (9, 'Raopura na Raja', 'Raopura Road, Vadodara', '~1.5–2 km from Navapura', 'Situated on the bustling historical Raopura thoroughfare, celebrated for royal heritage and stunning lighting.', 22.3039, 73.2012, 'https://images.unsplash.com/photo-1524492417192-2b638f294f92?auto=format&fit=crop&w=900&q=80', 'old-city', false),
  (10, 'Kishanwadi Yuvak Mandal (Darshan 1)', 'Kishanwadi Main Road, Vadodara', '~3.5–4.5 km from Raopura', 'Dynamic neighborhood darshan with high footfall, spiritual devotion, and magnificent cultural presentations.', 22.3168, 73.2284, 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80', 'kishanwadi', false),
  (11, 'Kishanwadi na Raja (Darshan 2)', 'Kishanwadi, Vadodara', 'Nearby Stop #10 (~500 m – 1 km)', 'Grand final darshan stop of the circuit, featuring an awe-inspiring royal murti and devotional celebration.', 22.3185, 73.2312, 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80', 'kishanwadi', false)
ON CONFLICT DO NOTHING;
