
-- Create songs table
CREATE TABLE public.songs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT NOT NULL DEFAULT 'Unknown',
  genre TEXT NOT NULL DEFAULT 'Other',
  duration INTEGER NOT NULL DEFAULT 0,
  audio_url TEXT NOT NULL,
  cover_url TEXT DEFAULT '',
  plays INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

-- Everyone can read songs
CREATE POLICY "Songs are viewable by everyone" ON public.songs
  FOR SELECT TO public USING (true);

-- Admins can insert songs
CREATE POLICY "Admins can insert songs" ON public.songs
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update songs
CREATE POLICY "Admins can update songs" ON public.songs
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete songs
CREATE POLICY "Admins can delete songs" ON public.songs
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Updated at trigger
CREATE TRIGGER update_songs_updated_at
  BEFORE UPDATE ON public.songs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('audio-files', 'audio-files', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('cover-art', 'cover-art', true);

-- Storage policies - anyone can read
CREATE POLICY "Public read audio" ON storage.objects FOR SELECT TO public USING (bucket_id = 'audio-files');
CREATE POLICY "Public read covers" ON storage.objects FOR SELECT TO public USING (bucket_id = 'cover-art');

-- Admins can upload
CREATE POLICY "Admins upload audio" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'audio-files' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins upload covers" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'cover-art' AND public.has_role(auth.uid(), 'admin'));

-- Admins can delete
CREATE POLICY "Admins delete audio" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'audio-files' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete covers" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'cover-art' AND public.has_role(auth.uid(), 'admin'));
