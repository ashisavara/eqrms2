-- ============================================
-- CONVERSATIONAL FORMS - DATABASE SETUP
-- ============================================
-- Run this SQL in your Supabase SQL Editor to create the example survey table
-- For production forms, adapt this template to your specific needs

-- Survey responses table
CREATE TABLE survey_responses (
  survey_id SERIAL PRIMARY KEY,
  respondent_name TEXT,
  email TEXT,
  satisfaction_level TEXT,
  would_recommend BOOLEAN,
  improvement_suggestions TEXT,
  likelihood_rating INTEGER,
  
  -- Required columns for conversational forms
  form_status TEXT DEFAULT 'draft' CHECK (form_status IN ('draft', 'submitted')),
  submission_data JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AUTO-UPDATE TIMESTAMP TRIGGER
-- ============================================
-- This trigger automatically updates the updated_at column

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_survey_responses_updated_at
  BEFORE UPDATE ON survey_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INDEXES
-- ============================================
-- Index for querying drafts vs submitted forms
CREATE INDEX idx_survey_responses_status ON survey_responses(form_status);

-- Index for user lookup by email
CREATE INDEX idx_survey_responses_email ON survey_responses(email);

-- ============================================
-- EXAMPLE QUERIES
-- ============================================

-- Get all draft (incomplete) surveys
-- SELECT * FROM survey_responses WHERE form_status = 'draft' ORDER BY created_at DESC;

-- Get all submitted surveys
-- SELECT * FROM survey_responses WHERE form_status = 'submitted' ORDER BY created_at DESC;

-- Get a specific survey by ID
-- SELECT * FROM survey_responses WHERE survey_id = 1;

-- Query the JSONB audit data
-- SELECT 
--   survey_id,
--   respondent_name,
--   submission_data->'formTitle' as form_title,
--   submission_data->'submittedAt' as submitted_at,
--   jsonb_array_length(submission_data->'entries') as questions_answered
-- FROM survey_responses
-- WHERE form_status = 'submitted';

-- ============================================
-- TEMPLATE FOR YOUR CUSTOM FORMS
-- ============================================
-- When creating your own conversational form, use this template:

/*
CREATE TABLE your_table_name (
  your_id_column SERIAL PRIMARY KEY,
  
  -- Add your form-specific columns here
  field1 TEXT,
  field2 INTEGER,
  field3 DATE,
  -- ... more fields
  
  -- Required: Form status column
  form_status TEXT DEFAULT 'draft' CHECK (form_status IN ('draft', 'submitted')),
  
  -- Required: JSONB audit trail column
  submission_data JSONB,
  
  -- Optional: Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Apply the update trigger
CREATE TRIGGER update_your_table_updated_at
  BEFORE UPDATE ON your_table_name
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes
CREATE INDEX idx_your_table_status ON your_table_name(form_status);
*/

-- ============================================
-- NOTES
-- ============================================
-- 1. The form_status column tracks whether the form is 'draft' or 'submitted'
-- 2. The submission_data JSONB column stores the complete audit trail
-- 3. Each form field should have its own column for easy querying
-- 4. The JSONB column preserves historical data even if form questions change
-- 5. Use the CHECK constraint to ensure form_status only contains valid values

