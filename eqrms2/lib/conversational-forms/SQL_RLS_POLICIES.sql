-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================
-- If you have RLS enabled on your tables, you'll need to add policies
-- Run this SQL if you're getting permission errors

-- Check if RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'survey_responses';

-- If RLS is enabled, add these policies:

-- Policy 1: Allow authenticated users to insert their own responses
CREATE POLICY "Users can insert survey responses"
ON survey_responses
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy 2: Allow authenticated users to read their own responses
CREATE POLICY "Users can read survey responses"
ON survey_responses
FOR SELECT
TO authenticated
USING (true);

-- Policy 3: Allow authenticated users to update their own responses
CREATE POLICY "Users can update survey responses"
ON survey_responses
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Optional: If you want to allow anonymous users (not logged in)
-- Uncomment these policies:

/*
CREATE POLICY "Anonymous users can insert survey responses"
ON survey_responses
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Anonymous users can read survey responses"
ON survey_responses
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Anonymous users can update survey responses"
ON survey_responses
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);
*/

-- ============================================
-- DISABLE RLS (Alternative Solution)
-- ============================================
-- If you don't need RLS for this table, you can disable it:
-- ALTER TABLE survey_responses DISABLE ROW LEVEL SECURITY;

-- ============================================
-- VERIFY POLICIES
-- ============================================
-- Check what policies exist:
-- SELECT * FROM pg_policies WHERE tablename = 'survey_responses';

