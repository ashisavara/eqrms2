-- ============================================
-- RISK PROFILER - DATABASE SETUP
-- ============================================
-- Create the risk_profile_responses table for the risk profiler form

CREATE TABLE risk_profile_responses (
  risk_profile_id SERIAL PRIMARY KEY,
  
  -- Link to group or mandate
  group_id INTEGER,
  im_id INTEGER,
  
  -- Risk Tolerance Questions (RT1-RT5) - Stored as numeric scores (0, 2.5, 5, 7.5, 10)
  age_bracket NUMERIC(4,2),
  investment_horizon NUMERIC(4,2),
  income_stability NUMERIC(4,2),
  liquidity_needs NUMERIC(4,2),
  market_experience NUMERIC(4,2),
  
  -- Risk Appetite Questions (RA1-RA5) - Stored as numeric scores (0, 2.5, 5, 7.5, 10)
  drawdown_tolerance NUMERIC(4,2),
  risk_attitude NUMERIC(4,2),
  return_expectation NUMERIC(4,2),
  return_drawdown_profile NUMERIC(4,2),
  fixed_income_preference NUMERIC(4,2),
  
  -- Calculated scores
  risk_tolerance_score NUMERIC(6,2) GENERATED ALWAYS AS (
    COALESCE(age_bracket, 0) + 
    COALESCE(investment_horizon, 0) + 
    COALESCE(income_stability, 0) + 
    COALESCE(liquidity_needs, 0) + 
    COALESCE(market_experience, 0)
  ) STORED,
  risk_appetite_score NUMERIC(6,2) GENERATED ALWAYS AS (
    COALESCE(drawdown_tolerance, 0) + 
    COALESCE(risk_attitude, 0) + 
    COALESCE(return_expectation, 0) + 
    COALESCE(return_drawdown_profile, 0) + 
    COALESCE(fixed_income_preference, 0)
  ) STORED,
  total_risk_score NUMERIC(6,2) GENERATED ALWAYS AS (
    COALESCE(age_bracket, 0) + 
    COALESCE(investment_horizon, 0) + 
    COALESCE(income_stability, 0) + 
    COALESCE(liquidity_needs, 0) + 
    COALESCE(market_experience, 0) +
    COALESCE(drawdown_tolerance, 0) + 
    COALESCE(risk_attitude, 0) + 
    COALESCE(return_expectation, 0) + 
    COALESCE(return_drawdown_profile, 0) + 
    COALESCE(fixed_income_preference, 0)
  ) STORED,
  risk_category TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN (
        COALESCE(age_bracket, 0) + 
        COALESCE(investment_horizon, 0) + 
        COALESCE(income_stability, 0) + 
        COALESCE(liquidity_needs, 0) + 
        COALESCE(market_experience, 0) +
        COALESCE(drawdown_tolerance, 0) + 
        COALESCE(risk_attitude, 0) + 
        COALESCE(return_expectation, 0) + 
        COALESCE(return_drawdown_profile, 0) + 
        COALESCE(fixed_income_preference, 0)
      ) <= 30 THEN 'Conservative'
      WHEN (
        COALESCE(age_bracket, 0) + 
        COALESCE(investment_horizon, 0) + 
        COALESCE(income_stability, 0) + 
        COALESCE(liquidity_needs, 0) + 
        COALESCE(market_experience, 0) +
        COALESCE(drawdown_tolerance, 0) + 
        COALESCE(risk_attitude, 0) + 
        COALESCE(return_expectation, 0) + 
        COALESCE(return_drawdown_profile, 0) + 
        COALESCE(fixed_income_preference, 0)
      ) <= 60 THEN 'Moderate'
      ELSE 'Aggressive'
    END
  ) STORED,
  
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
-- Reuse the existing update_updated_at_column function

CREATE TRIGGER update_risk_profile_responses_updated_at
  BEFORE UPDATE ON risk_profile_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INDEXES
-- ============================================
-- Index for querying drafts vs submitted forms
CREATE INDEX idx_risk_profile_status ON risk_profile_responses(form_status);

-- Index for group lookup
CREATE INDEX idx_risk_profile_group ON risk_profile_responses(group_id);

-- Index for mandate lookup
CREATE INDEX idx_risk_profile_mandate ON risk_profile_responses(im_id);

-- ============================================
-- EXAMPLE QUERIES
-- ============================================

-- Get all risk profiles for a specific group
-- SELECT * FROM risk_profile_responses WHERE group_id = 1 ORDER BY created_at DESC;

-- Get the latest submitted risk profile for a mandate
-- SELECT * FROM risk_profile_responses 
-- WHERE im_id = 1 AND form_status = 'submitted' 
-- ORDER BY created_at DESC 
-- LIMIT 1;

-- Get all draft risk profiles
-- SELECT * FROM risk_profile_responses WHERE form_status = 'draft';

