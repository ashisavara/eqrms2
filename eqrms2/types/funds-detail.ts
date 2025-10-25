export type RmsFundAmc = {
    fund_id: number;
    fund_name: string | null;
    amc_id: number | null;
    fund_rating: number | null;
    fund_strategy_rating: number | null;
    fund_performance_rating: number | null;
    strategy_tag: string | null;
    strategy_name: string | null;
    recommendation_tag: string | null;
    investment_view: string | null;
    oth_salient_points: string | null;
    strategy_view: string | null;
    trailing_perf_html: string | null;
    ann_perf_html: string | null;
    port_comp_html: string | null;
    fee_structure_html: string | null;
    perf_tag_5yr: string | null;
    perf_tag_consistent: string | null;
    asset_class_id: number | null;
    category_id: number | null;
    structure_id: number | null;
    fund_aum: number | null;
    performance_view: string | null;
    additional_performance_view: string | null;
    issue_tracker: string | null;
    issue_reponsibility: string | null;
    issue_urgency: string | null;
    open_for_subscription: string | null;
    slug: string | null;
    us_investors: string | null;
    estate_duty_exposure: string | null;
    one_yr: number | null;
    three_yr: number | null;
    five_yr: number | null;
    since_inception: number | null;
    fund_commission: number | null;
    fund_body: string | null;
  
    amc_name: string | null;
    amc_rating: number | null;
    amc_team_rating: number | null;
    amc_philosophy_rating: number | null;
    amc_pedigree_rating: number | null;
    amc_size_rating: number | null;
    amc_fm_html: string | null;
    amc_pedigree: string | null;
    team_pedigree: string | null;
    inv_team_risk: string | null;
    amc_maturity: string | null;
    inv_philosophy_followed: string | null;
    inv_phil_name: string | null;
    core_amc_team: string | null;
    amc_view: string | null;
    amc_pedigree_desc: string | null;
    team_pedigree_desc: string | null;
    inv_phil_desc: string | null;
    salient_points: string | null;
  
    category_name: string | null;
    category_long_name: string | null;
    asset_class_name: string | null;
    structure_name: string | null;
  
    amc_slug: string | null;
    structure_slug: string | null;
    asset_class_slug: string | null;
    category_slug: string | null;
    mkt_material_link: string | null;
    show_public_website: boolean | null;
    // Optional SEO fields
    seo_title?: string | null;
    seo_description?: string | null;
    og_title?: string | null;
    og_description?: string | null;
    og_image?: string | null;
};


export type RmsFundsScreener = {
    fund_id: number;
    fund_name: string | null;
    asset_class_id: number | null;
    category_id: number | null;
    structure_id: number | null;
    amc_id: number | null;
    slug : string | null;
  
    fund_rating: number | null;
    fund_strategy_rating: number | null;
    fund_performance_rating: number | null;
    fund_commission: number | null;
  
    one_yr: number | null;
    three_yr: number | null;
    five_yr: number | null;
    since_inception: number | null;
  
    open_for_subscription: string | null;
    estate_duty_exposure: string | null;
    us_investors: string | null;
  
    asset_class_name: string | null;
    category_name: string | null;
    cat_long_name: string | null;
    structure_name: string | null;
  
    amc_name: string | null;
    amc_rating: number | null;
    amc_team_rating: number | null;
  };