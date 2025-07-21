-- Create budget categories table
CREATE TABLE public.budget_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  color TEXT DEFAULT '#3B82F6',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create budget subcategories table
CREATE TABLE public.budget_subcategories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.budget_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_recurring BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create budget transactions table
CREATE TABLE public.budget_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subcategory_id UUID NOT NULL REFERENCES public.budget_subcategories(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(subcategory_id, month, year)
);

-- Enable Row Level Security
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for budget_categories
CREATE POLICY "Users can view their own categories" 
ON public.budget_categories 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categories" 
ON public.budget_categories 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" 
ON public.budget_categories 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" 
ON public.budget_categories 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for budget_subcategories
CREATE POLICY "Users can view subcategories of their categories" 
ON public.budget_subcategories 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.budget_categories bc 
    WHERE bc.id = budget_subcategories.category_id 
    AND bc.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create subcategories for their categories" 
ON public.budget_subcategories 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.budget_categories bc 
    WHERE bc.id = budget_subcategories.category_id 
    AND bc.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update subcategories of their categories" 
ON public.budget_subcategories 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.budget_categories bc 
    WHERE bc.id = budget_subcategories.category_id 
    AND bc.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete subcategories of their categories" 
ON public.budget_subcategories 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.budget_categories bc 
    WHERE bc.id = budget_subcategories.category_id 
    AND bc.user_id = auth.uid()
  )
);

-- Create policies for budget_transactions
CREATE POLICY "Users can view their own transactions" 
ON public.budget_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions" 
ON public.budget_transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" 
ON public.budget_transactions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" 
ON public.budget_transactions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_budget_categories_updated_at
  BEFORE UPDATE ON public.budget_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_budget_subcategories_updated_at
  BEFORE UPDATE ON public.budget_subcategories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_budget_transactions_updated_at
  BEFORE UPDATE ON public.budget_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories for new users
INSERT INTO public.budget_categories (user_id, name, type, color, sort_order) VALUES
(auth.uid(), 'Home Expenses', 'expense', '#EF4444', 1),
(auth.uid(), 'Trasporti', 'expense', '#F97316', 2),
(auth.uid(), 'Subscriptions', 'expense', '#8B5CF6', 3),
(auth.uid(), 'Health & Doctors', 'expense', '#06B6D4', 4),
(auth.uid(), 'Carta di Credito', 'expense', '#EC4899', 5),
(auth.uid(), 'Pleasure', 'expense', '#F59E0B', 6),
(auth.uid(), 'Income', 'income', '#10B981', 7),
(auth.uid(), 'Savings', 'income', '#3B82F6', 8);