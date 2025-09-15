-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create interview_questions table
CREATE TABLE public.interview_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  question TEXT NOT NULL,
  expected_answer_points TEXT[] NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create interview_sessions table
CREATE TABLE public.interview_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'abandoned')) DEFAULT 'pending',
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  total_questions INTEGER NOT NULL DEFAULT 0,
  current_question_index INTEGER NOT NULL DEFAULT 0,
  overall_score DECIMAL(5,2),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create interview_responses table
CREATE TABLE public.interview_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.interview_questions(id) ON DELETE CASCADE,
  response_text TEXT NOT NULL,
  score DECIMAL(5,2),
  feedback TEXT,
  answered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_responses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- Create RLS policies for interview_questions (public read access)
CREATE POLICY "Anyone can view active questions"
ON public.interview_questions
FOR SELECT
USING (is_active = true);

-- Create RLS policies for interview_sessions
CREATE POLICY "Users can view their own sessions"
ON public.interview_sessions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions"
ON public.interview_sessions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
ON public.interview_sessions
FOR UPDATE
USING (auth.uid() = user_id);

-- Create RLS policies for interview_responses
CREATE POLICY "Users can view responses from their sessions"
ON public.interview_responses
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.interview_sessions 
    WHERE id = session_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create responses for their sessions"
ON public.interview_responses
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.interview_sessions 
    WHERE id = session_id AND user_id = auth.uid()
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_interview_sessions_updated_at
BEFORE UPDATE ON public.interview_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample Excel interview questions
INSERT INTO public.interview_questions (category, difficulty, question, expected_answer_points) VALUES
('Basic Formulas', 'beginner', 'Can you explain the difference between relative and absolute cell references in Excel? When would you use each type?', 
 ARRAY['Relative references change when copied', 'Absolute references stay fixed', 'Use $ symbol for absolute', 'Examples of use cases']),

('Data Analysis', 'intermediate', 'Walk me through how you would use VLOOKUP to find customer information from a large dataset. What are some limitations of VLOOKUP?',
 ARRAY['VLOOKUP syntax', 'Table array concept', 'Column index number', 'Exact/approximate match', 'Limitations: left to right only', 'Alternative: INDEX-MATCH']),

('Pivot Tables', 'intermediate', 'Describe how you would create a pivot table to analyze sales data by region and product category. What insights could this provide?',
 ARRAY['Data preparation', 'Creating pivot table', 'Rows, columns, values setup', 'Filtering options', 'Business insights', 'Drill-down capabilities']),

('Advanced Functions', 'advanced', 'How would you use array formulas or dynamic arrays to solve complex data problems? Can you give me an example scenario?',
 ARRAY['Array formula concept', 'Dynamic arrays in Excel 365', 'FILTER, SORT, UNIQUE functions', 'Practical examples', 'Performance considerations']),

('Chart Creation', 'intermediate', 'What factors do you consider when choosing the right chart type for data visualization? Can you walk through creating a dashboard?',
 ARRAY['Chart type selection criteria', 'Data story telling', 'Dashboard design principles', 'Interactive elements', 'Best practices for clarity']),

('Conditional Formatting', 'beginner', 'How would you use conditional formatting to highlight important data trends in a large spreadsheet?',
 ARRAY['Conditional formatting basics', 'Rule types', 'Color scales', 'Data bars', 'Icon sets', 'Custom formulas']),

('Data Validation', 'intermediate', 'Explain how you would set up data validation to ensure data quality in a shared Excel workbook.',
 ARRAY['Data validation purpose', 'Validation criteria', 'Input messages', 'Error alerts', 'List validation', 'Custom validation formulas']),

('Financial Functions', 'advanced', 'How would you calculate loan payments, present value, and future value using Excel financial functions?',
 ARRAY['PMT function', 'PV function', 'FV function', 'NPV function', 'IRR function', 'Practical applications']);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();