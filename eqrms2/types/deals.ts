export type Deals = {
    deal_id: number;
    created_at: Date;
    rel_lead_id: number;
    deal_name?: string;
    est_closure?: string;
    deal_likelihood?: number;
    deal_stage?: string;
    deal_segment?: string;
    total_deal_aum?: number;
    total_deal_likely?: number;
};
