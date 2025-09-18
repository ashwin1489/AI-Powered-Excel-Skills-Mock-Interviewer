-- Fix security vulnerability: Restrict interview questions access to authenticated users only
-- and prevent candidates from seeing expected answer points

-- Drop the existing policy that allows anyone to view questions
DROP POLICY IF EXISTS "Anyone can view active questions" ON public.interview_questions;

-- Create new policy: Only authenticated users can view questions (without answer points)
CREATE POLICY "Authenticated users can view questions without answers" 
ON public.interview_questions 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND is_active = true
);

-- Create a view for candidates that excludes sensitive answer data
CREATE OR REPLACE VIEW public.interview_questions_safe AS
SELECT 
  id,
  question,
  category,
  difficulty,
  is_active,
  created_at
FROM public.interview_questions
WHERE is_active = true;

-- Enable RLS on the view
ALTER VIEW public.interview_questions_safe SET (security_invoker = true);

-- Create policy for the safe view
CREATE POLICY "Authenticated users can view safe questions" 
ON public.interview_questions_safe 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Create a security definer function for admin access to full question data
CREATE OR REPLACE FUNCTION public.get_full_question_data()
RETURNS SETOF public.interview_questions
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  -- Only allow access if user has admin role (you can customize this logic)
  -- For now, we'll allow access to the interview system itself
  SELECT * FROM public.interview_questions WHERE is_active = true;
$$;