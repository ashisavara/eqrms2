# Risk Profiler - Setup Complete ✅

## Summary

The Risk Profiler conversational form has been successfully integrated into your mandate page with numeric scoring.

## What Was Done

### 1. Updated Risk Profiler Config
- **File**: `lib/conversational-forms/configs/riskProfiler.config.ts`
- All 10 questions now use numeric scores: `"0"`, `"2.5"`, `"5"`, `"7.5"`, `"10"`
- Scores increase with higher risk tolerance/appetite
- The JSONB audit trail preserves the original question labels

### 2. Created Mandate Page Integration
- **File**: `app/mandate/RiskProfilerButton.tsx`
- Opens Risk Profiler in a sheet/modal
- Automatically saves `group_id` and `im_id` with the response
- Displays success message and refreshes page on completion

### 3. Updated SQL Table Structure
- **File**: `lib/conversational-forms/SQL_RISK_PROFILER.sql`
- All score fields are `NUMERIC(4,2)` type (supports decimals like 2.5, 7.5)
- **Automatic calculated columns**:
  - `risk_tolerance_score` - Sum of RT1-RT5 (max 50)
  - `risk_appetite_score` - Sum of RA1-RA5 (max 50)
  - `total_risk_score` - Sum of all 10 questions (max 100)
  - `risk_category` - Auto-categorized as:
    - "Conservative" (score ≤ 30)
    - "Moderate" (score 31-60)
    - "Aggressive" (score > 60)

### 4. Added Initial Values Support
- Enhanced conversational form system to support `initialValues` prop
- Allows passing hidden values (like `group_id`, `im_id`) without showing them as questions

## Setup Instructions

### Step 1: Run the SQL
Execute the contents of `SQL_RISK_PROFILER.sql` in your Supabase SQL Editor.

This will create:
- `risk_profile_responses` table with numeric score columns
- Auto-calculated score columns (computed on each save)
- Auto-categorization into Conservative/Moderate/Aggressive
- Indexes for performance

### Step 2: Test the Risk Profiler

1. Navigate to the Mandate page
2. Click the "Risk Profiler" button
3. Answer the 10 questions
4. Check your database:

```sql
SELECT 
  risk_profile_id,
  group_id,
  im_id,
  risk_tolerance_score,  -- RT1-RT5 sum
  risk_appetite_score,   -- RA1-RA5 sum
  total_risk_score,      -- Total (0-100)
  risk_category,         -- Conservative/Moderate/Aggressive
  form_status
FROM risk_profile_responses
ORDER BY created_at DESC;
```

## Scoring System

### Individual Questions (Each worth 0-10 points)
- **0 points**: Most conservative/risk-averse option
- **2.5 points**: Second level
- **5 points**: Middle/moderate option
- **7.5 points**: Higher risk tolerance
- **10 points**: Most aggressive/risk-seeking option

### Category Thresholds
- **Conservative**: Total score 0-30 (Low risk tolerance)
- **Moderate**: Total score 31-60 (Balanced approach)
- **Aggressive**: Total score 61-100 (High risk tolerance)

### Score Breakdown
- **Risk Tolerance (RT1-RT5)**: Max 50 points
  - Age bracket
  - Investment horizon
  - Income stability
  - Liquidity needs
  - Market experience

- **Risk Appetite (RA1-RA5)**: Max 50 points
  - Drawdown tolerance
  - Risk attitude
  - Return expectation
  - Return/drawdown tradeoff
  - Fixed income preference

## Benefits of Numeric Scoring

✅ **Easy Calculations**: Simply sum the scores  
✅ **Database Performance**: Use SQL `SUM()`, `AVG()` functions  
✅ **No Mapping Required**: Scores are already numbers  
✅ **Audit Trail Preserved**: JSONB stores original labels  
✅ **Automatic Categorization**: Database computes risk category  
✅ **Future-Proof**: Change labels without breaking calculations  

## Example Usage

### Display Risk Profile
```tsx
const riskProfile = await supabaseSingleRead({
  table: 'risk_profile_responses',
  columns: '*',
  filters: [(query) => query.eq('im_id', mandateId)]
});

// Access computed scores
console.log(riskProfile.total_risk_score);      // e.g., 67.5
console.log(riskProfile.risk_category);         // "Aggressive"
console.log(riskProfile.risk_tolerance_score);  // e.g., 35.0
console.log(riskProfile.risk_appetite_score);   // e.g., 32.5
```

### Query by Risk Category
```sql
-- Find all aggressive investors
SELECT * FROM risk_profile_responses 
WHERE risk_category = 'Aggressive' 
AND form_status = 'submitted';

-- Average scores by category
SELECT 
  risk_category,
  AVG(total_risk_score) as avg_score,
  COUNT(*) as count
FROM risk_profile_responses
WHERE form_status = 'submitted'
GROUP BY risk_category;
```

## Next Steps

1. **Run the SQL** in Supabase
2. **Test the form** in the mandate page
3. **Use the scores** to:
   - Show risk profile summary on mandate page
   - Recommend appropriate investment products
   - Filter fund recommendations by risk level
   - Generate risk reports

## Files Modified/Created

1. ✅ `lib/conversational-forms/configs/riskProfiler.config.ts` - Updated with numeric scores
2. ✅ `lib/conversational-forms/SQL_RISK_PROFILER.sql` - Table with auto-calculations
3. ✅ `app/mandate/RiskProfilerButton.tsx` - Integration component
4. ✅ `app/mandate/page.tsx` - Added button to mandate page
5. ✅ `lib/conversational-forms/types.ts` - Added initialValues support
6. ✅ `components/conversational-form/*` - Updated all wrappers

---

**The Risk Profiler is ready to use! 🎯**

