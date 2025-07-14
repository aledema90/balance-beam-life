-- Create a table to store allowed emails for app access
CREATE TABLE public.allowed_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.allowed_users ENABLE ROW LEVEL SECURITY;

-- Create policies - only authenticated users can read, no one can insert/update/delete via API
CREATE POLICY "Anyone can view allowed users" 
ON public.allowed_users 
FOR SELECT 
USING (true);

-- Insert your email (you'll need to replace this with your actual email)
-- INSERT INTO public.allowed_users (email) VALUES ('your-email@domain.com');

-- Create function to check if user email is allowed
CREATE OR REPLACE FUNCTION public.is_user_allowed(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.allowed_users 
    WHERE email = user_email
  );
$$;