TABLES & NULL COLUMN EXPLANATIONS
- fin_goals TABLE: stores only unchanging information on the fin goal .. this is the (a) goal_date, (b) fv_goals (the future value of the goal on the goal date), (c) inflation_rate (used to calculate the PV of goal from the FV) and (d) exp_returns (used in the calculations of lumpsum_req and sip_req) ... all the other columns are just there as null and data never comes and sits in supabase 
- null columns in fin_goals table ... all the data in the other  columns are calculated and shown on the front-end .. we can in the future figure if we need these columns on supabase at all .. these were created since in flutterflow we needed these to enforce the column structure we wanted 
- investments & sip tables have a similar null column for the FV ... this again is calculated dynamically on the front-end
- effectively this is structured so that supabase only has unchanging data, while all data that requires to be calculated dynamically is calculated on the fly in a client component


STEP BY STEP ON HOW FINANCIAL PLANNING HAPPENS IN THE CLIENT COMPONENT
Step 1) All data is pulled in via page.tsx (server component) and passed in as a prop to the client component that handles financial planning

Step 2) CALCULATE yrs_to_goal
        yrs_to_goal = Max(0,goal_date - today())

Step 3) CALCULATE pv_goals
        pv_goal = fv_goals/((1+inflation_rate)^(yrs_to_goal))

Step 4) CALCULATE fv_inv based on allocated goal
    - investments can be related to a goal (via goal_id table) .. some investments may not have a goal linked ... if a goal is linked,we can pull in the yrs_to_goal calculated in Step 2)
    - all investments are related to a category_id ... this category_id has a exp_return associated which is used in calculating the fv_inv
    - fv_inv is accordingly calculated on the basis of the following formula
      fv_inv = cur_amt * ((1+ exp_return) ^ yrs_to_goal)

Step 5) CALCULATE fv_sip based on allocated goal
    - this is a bit of a complicated formula due to some nuances
    - fv_sip is based on the sip future value formula -- will provide later
    - Situation 1) Months to Goal < SIP months left .... calculate fv_sip with time based driven by months_to_goal
        fv_sip = SIP_amount * ((1 + r)^n - 1) / r * (1 + r)
    - Situation 2) SIP months left < Months to left .... calculate fv_sip with time based driven by sip_months_left & then compound that value for the balance period (i.e Months to Goal less SIP months left)
        fv_sip = SIP_amount * ((1 + r)^n - 1) / r * (1 + r)
        fv_sip = fv_sip * (1 + annual_return)^(remaining_months / 12)
    - r in these formulas is monthly return = annual return/12/100



Step 6) CALCULATE pv_inv and fv_inv in the fin_goals table for each goal 
    - pv_inv is a sum of the cur_amt of all investments linked to this goal (based on goal_id)
    - fv_inv is the sum of (a) fv_inv of all investments linked to the goal and (b) fv_sip for all sips linked to the goal

Step 7) CALCULATE pending_amt
    - pending_amt = max(0,fv_goals - fv_inv)

Step 8) CALCULATE goal_ach
    - goal_ach = fv_inv / fv_goals * 100

Step 9) CALCULATE lumpsum_req
    - lumpsum_req = pending_amt / ((1+exp_returns)^(yrs_to_goal))

Step 10) CALCULATE sip_req
    - sip_req = formula to backcalculate sip required based on pending_amt, exp_returns, yrs_to_goal

    example code to calculate this
    const monthly_return = Math.pow(1 + exp_returns / 100, 1 / 12);
    const inverse_monthly_return = Math.pow(1 + exp_returns / 100, -1 / 12);
    const numerator = (monthly_return - 1) * inverse_monthly_return * pending_amt;
    const denominator = Math.pow(monthly_return, 12 * yrs_to_goal) - 1;

    let sip_req = (numerator / denominator) * Math.pow(10, 5);
    sip_req = Math.round(sip_req * 10) / 10;

Step 11) CALCULATE total lumpsum required & sip required
    - this is shown on cards on the top
