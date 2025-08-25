-- ✨ CRM Aggregations SQL Function
-- This function calculates aggregations and pie chart distributions for the CRM system
-- Replicates the exact same logic as TableCrm.tsx but on the server side for performance

CREATE OR REPLACE FUNCTION get_crm_aggregations(
  p_importance text[] DEFAULT NULL,
  p_lead_progression text[] DEFAULT NULL,
  p_lead_source text[] DEFAULT NULL,
  p_lead_type text[] DEFAULT NULL,
  p_wealth_level text[] DEFAULT NULL,
  p_rm_name text[] DEFAULT NULL,
  p_search text DEFAULT NULL
) RETURNS json AS $$
DECLARE
  result json;
  base_where_clause text := '1=1';
  search_clause text := '';
BEGIN
  -- ✅ Build dynamic WHERE clause based on provided filters
  IF p_importance IS NOT NULL AND array_length(p_importance, 1) > 0 THEN
    base_where_clause := base_where_clause || ' AND importance = ANY($1)';
  END IF;
  
  IF p_lead_progression IS NOT NULL AND array_length(p_lead_progression, 1) > 0 THEN
    base_where_clause := base_where_clause || ' AND lead_progression = ANY($2)';
  END IF;
  
  IF p_lead_source IS NOT NULL AND array_length(p_lead_source, 1) > 0 THEN
    base_where_clause := base_where_clause || ' AND lead_source = ANY($3)';
  END IF;
  
  IF p_lead_type IS NOT NULL AND array_length(p_lead_type, 1) > 0 THEN
    base_where_clause := base_where_clause || ' AND lead_type = ANY($4)';
  END IF;
  
  IF p_wealth_level IS NOT NULL AND array_length(p_wealth_level, 1) > 0 THEN
    base_where_clause := base_where_clause || ' AND wealth_level = ANY($5)';
  END IF;
  
  IF p_rm_name IS NOT NULL AND array_length(p_rm_name, 1) > 0 THEN
    base_where_clause := base_where_clause || ' AND rm_name = ANY($6)';
  END IF;
  
  -- ✅ Build search clause if search term provided
  IF p_search IS NOT NULL AND p_search != '' THEN
    search_clause := ' AND (
      lead_name ILIKE ''%' || p_search || '%'' OR
      lead_summary ILIKE ''%' || p_search || '%'' OR
      rm_name ILIKE ''%' || p_search || '%'' OR
      lead_source ILIKE ''%' || p_search || '%'' OR
      lead_type ILIKE ''%' || p_search || '%'' OR
      lead_progression ILIKE ''%' || p_search || '%''
    )';
  END IF;

  -- ✅ Execute comprehensive aggregations + distributions query
  -- This replicates the exact same aggregations as TableCrm.tsx
  EXECUTE 'SELECT json_build_object(
    -- 🔢 Aggregation Cards (same as TableCrm.tsx)
    ''totalLeads'', COUNT(*),
    ''hotLeads'', COUNT(*) FILTER (WHERE importance IN (''3) High'', ''4) Urgent'')),
    ''overdueFollowups'', COUNT(*) FILTER (WHERE days_followup < 0),
    ''advancedLeads'', COUNT(*) FILTER (WHERE lead_progression IN (''5) Documenation'', ''4) Deal Indicated'', ''3) Inv Consultation'')),
    ''newLeads'', COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL ''30 days''),
    
    -- 📊 Pie Chart Distributions (same charts as TableCrm.tsx)
    ''importanceDistribution'', COALESCE((
      SELECT json_agg(json_build_object(''name'', importance, ''value'', count))
      FROM (
        SELECT importance, COUNT(*) as count
        FROM view_leads_tagcrm 
        WHERE ' || base_where_clause || search_clause || ' AND importance IS NOT NULL
        GROUP BY importance
        ORDER BY count DESC
      ) t
    ), ''[]''::json),
    
    ''leadProgressionDistribution'', COALESCE((
      SELECT json_agg(json_build_object(''name'', lead_progression, ''value'', count))
      FROM (
        SELECT lead_progression, COUNT(*) as count
        FROM view_leads_tagcrm 
        WHERE ' || base_where_clause || search_clause || ' AND lead_progression IS NOT NULL
        GROUP BY lead_progression
        ORDER BY count DESC
      ) t
    ), ''[]''::json),
    
    ''wealthLevelDistribution'', COALESCE((
      SELECT json_agg(json_build_object(''name'', wealth_level, ''value'', count))
      FROM (
        SELECT wealth_level, COUNT(*) as count
        FROM view_leads_tagcrm 
        WHERE ' || base_where_clause || search_clause || ' AND wealth_level IS NOT NULL
        GROUP BY wealth_level
        ORDER BY count DESC
      ) t
    ), ''[]''::json),
    
    ''leadSourceDistribution'', COALESCE((
      SELECT json_agg(json_build_object(''name'', lead_source, ''value'', count))
      FROM (
        SELECT lead_source, COUNT(*) as count
        FROM view_leads_tagcrm 
        WHERE ' || base_where_clause || search_clause || ' AND lead_source IS NOT NULL
        GROUP BY lead_source
        ORDER BY count DESC
      ) t
    ), ''[]''::json)
    
  ) FROM view_leads_tagcrm 
  WHERE ' || base_where_clause || search_clause
  USING p_importance, p_lead_progression, p_lead_source, p_lead_type, p_wealth_level, p_rm_name
  INTO result;
  
  RETURN result;
  
EXCEPTION
  WHEN OTHERS THEN
    -- ✅ Graceful error handling - return empty aggregations
    RETURN json_build_object(
      'totalLeads', 0,
      'hotLeads', 0,
      'overdueFollowups', 0,
      'advancedLeads', 0,
      'newLeads', 0,
      'importanceDistribution', '[]'::json,
      'leadProgressionDistribution', '[]'::json,
      'wealthLevelDistribution', '[]'::json,
      'leadSourceDistribution', '[]'::json,
      'error', SQLERRM
    );
    
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- ✅ Grant permissions (adjust as needed for your setup)
-- GRANT EXECUTE ON FUNCTION get_crm_aggregations TO authenticated;

-- ✅ Example usage:
-- SELECT get_crm_aggregations(
--   p_importance := ARRAY['3) High', '4) Urgent'],
--   p_lead_progression := NULL,
--   p_search := 'john'
-- );
