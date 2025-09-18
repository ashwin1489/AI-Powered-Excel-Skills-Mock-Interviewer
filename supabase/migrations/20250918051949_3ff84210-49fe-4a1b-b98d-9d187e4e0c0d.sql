-- Fix security vulnerability: Restrict interview questions access to authenticated users only

-- Drop the existing policy that allows anyone to view questions
DROP POLICY IF EXISTS "Anyone can view active questions" ON public.interview_questions;

-- Create new policy: Only authenticated users can view active questions
CREATE POLICY "Authenticated users can view active questions" 
ON public.interview_questions 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND is_active = true
);