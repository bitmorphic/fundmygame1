
-- =============================================
-- FundMyGame Database Schema
-- =============================================

-- 1. Enum types
CREATE TYPE public.app_role AS ENUM ('athlete', 'sponsor', 'admin');

-- 2. Timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 3. User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- 4. Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  bio TEXT DEFAULT '',
  city TEXT DEFAULT '',
  state TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Athlete profiles
CREATE TABLE public.athlete_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  sport TEXT NOT NULL DEFAULT '',
  age INTEGER,
  achievements TEXT[] DEFAULT '{}',
  stats JSONB DEFAULT '[]',
  timeline JSONB DEFAULT '[]',
  funding_goal INTEGER DEFAULT 100000,
  funds_received INTEGER DEFAULT 0,
  athlete_score INTEGER DEFAULT 0,
  underdog_score INTEGER DEFAULT 0,
  trending_score INTEGER DEFAULT 0,
  impact_score INTEGER DEFAULT 0,
  growth_prediction INTEGER DEFAULT 0,
  video_urls TEXT[] DEFAULT '{}',
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.athlete_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athlete profiles viewable by everyone" ON public.athlete_profiles FOR SELECT USING (true);
CREATE POLICY "Athletes can update own profile" ON public.athlete_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Athletes can insert own profile" ON public.athlete_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_athlete_profiles_updated_at BEFORE UPDATE ON public.athlete_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Sponsor profiles
CREATE TABLE public.sponsor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT NOT NULL DEFAULT '',
  industry TEXT DEFAULT '',
  logo_url TEXT,
  budget_min INTEGER DEFAULT 0,
  budget_max INTEGER DEFAULT 0,
  preferred_sports TEXT[] DEFAULT '{}',
  athletes_sponsored INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.sponsor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sponsor profiles viewable by everyone" ON public.sponsor_profiles FOR SELECT USING (true);
CREATE POLICY "Sponsors can update own profile" ON public.sponsor_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Sponsors can insert own profile" ON public.sponsor_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_sponsor_profiles_updated_at BEFORE UPDATE ON public.sponsor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Sponsorships (posted by sponsors)
CREATE TABLE public.sponsorships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  sport TEXT DEFAULT '',
  budget INTEGER DEFAULT 0,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'filled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.sponsorships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sponsorships viewable by everyone" ON public.sponsorships FOR SELECT USING (true);
CREATE POLICY "Sponsors can create sponsorships" ON public.sponsorships FOR INSERT WITH CHECK (auth.uid() = sponsor_id);
CREATE POLICY "Sponsors can update own sponsorships" ON public.sponsorships FOR UPDATE USING (auth.uid() = sponsor_id);

-- 8. Applications
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sponsorship_id UUID REFERENCES public.sponsorships(id) ON DELETE CASCADE NOT NULL,
  message TEXT DEFAULT '',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (athlete_id, sponsorship_id)
);
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes can view own applications" ON public.applications
  FOR SELECT USING (auth.uid() = athlete_id);
CREATE POLICY "Sponsors can view applications to their sponsorships" ON public.applications
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.sponsorships WHERE id = sponsorship_id AND sponsor_id = auth.uid())
  );
CREATE POLICY "Athletes can create applications" ON public.applications
  FOR INSERT WITH CHECK (auth.uid() = athlete_id);
CREATE POLICY "Sponsors can update application status" ON public.applications
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.sponsorships WHERE id = sponsorship_id AND sponsor_id = auth.uid())
  );

-- 9. Messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can mark messages as read" ON public.messages
  FOR UPDATE USING (auth.uid() = receiver_id);

-- 10. Payments
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  athlete_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  tier TEXT DEFAULT 'custom',
  message TEXT DEFAULT '',
  anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes can view received payments" ON public.payments
  FOR SELECT USING (auth.uid() = athlete_id);
CREATE POLICY "Donors can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = donor_id);
CREATE POLICY "Authenticated users can create payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 11. AI Scores
CREATE TABLE public.ai_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  score_type TEXT NOT NULL CHECK (score_type IN ('athlete', 'underdog', 'trending', 'impact', 'growth', 'sponsor_match')),
  score INTEGER NOT NULL,
  explanation TEXT DEFAULT '',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ai_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "AI scores viewable by everyone" ON public.ai_scores FOR SELECT USING (true);
CREATE POLICY "System can insert scores" ON public.ai_scores FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 12. Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('athlete-media', 'athlete-media', true);

CREATE POLICY "Anyone can view athlete media" ON storage.objects
  FOR SELECT USING (bucket_id = 'athlete-media');
CREATE POLICY "Authenticated users can upload athlete media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'athlete-media' AND auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own athlete media" ON storage.objects
  FOR UPDATE USING (bucket_id = 'athlete-media' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own athlete media" ON storage.objects
  FOR DELETE USING (bucket_id = 'athlete-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 13. Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );

  IF NEW.raw_user_meta_data->>'role' = 'athlete' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'athlete');
    INSERT INTO public.athlete_profiles (user_id) VALUES (NEW.id);
  ELSIF NEW.raw_user_meta_data->>'role' = 'sponsor' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'sponsor');
    INSERT INTO public.sponsor_profiles (user_id) VALUES (NEW.id);
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'athlete');
    INSERT INTO public.athlete_profiles (user_id) VALUES (NEW.id);
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
