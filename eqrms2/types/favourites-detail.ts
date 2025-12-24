// Types for the favouriting system

export type EntityType = 'categories' | 'funds' | 'asset_class' | 'structure';

export type FavouritesData = {
  categories: number[];
  funds: number[];
  asset_class: number[];
  structure: number[];
};

export type FavouritesStorage = {
  groupId: number;
  favourites: FavouritesData;
  lastSync: string; // ISO date string
};

// Database table and column mapping
export const FAVOURITES_CONFIG = {
  categories: {
    table: 'im_fav_categories',
    column: 'cat_id'
  },
  funds: {
    table: 'im_fav_funds', 
    column: 'fund_id'
  },
  asset_class: {
    table: 'im_fav_assetclass',
    column: 'asset_class_id'
  },
  structure: {
    table: 'im_fav_structure',
    column: 'structure_id'
  }
} as const;

// Helper type for the config
export type FavouritesConfig = typeof FAVOURITES_CONFIG;