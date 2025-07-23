export type RmsChangelog = {
    id: number;
    created_at: Date;
    amc_id: number;
    fund_id: number;
    change_type: string;
    change_desc: string;
    team_discussed: boolean;
    fund_slug:string;
    amc_slug:string;
    fund_name:string;
    amc_name:string;
};