export type FavStructure = {
    fav_structure_id: number;
    im_id: number;
    structure_id: number;
    structure_name: string;
    mandate_name: string;
}

export type FavAssetClass = {
    fav_asset_class_id: number;
    im_id: number;
    asset_class_id: number;
    asset_class_name: string;
    mandate_name: string;
}

export type FavCategory = {
    fav_category_id: number;
    im_id: number;
    category_id: number;
    cat_name: string;
    mandate_name: string;
    one_yr: number;
    three_yr: number;
    five_yr: number;
    cy_1: number;
    cy_2: number;
    cy_3: number;
    cy_4: number;
    cy_5: number;
    cy_6: number;
    cy_7: number;
    cy_8: number;
    cy_9: number;
    cy_10: number;
}

export type FavFunds = {
    fav_fund_id: number;    
    im_id: number;
    fund_id: number;
    fund_name: string;
    mandate_name: string;
    one_yr: number;
    three_yr: number;
    five_yr: number;
    since_inception: number;
    fund_rating: number;
    fund_performance_rating: number;
    amc_name: string;
    amc_rating: number;
    cat_long_name: string;
    cat_name: string;
    structure_name: string;
}