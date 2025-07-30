"use server";

import { getCurrentMandateId } from "@/lib/auth/serverGroupMandate";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { createClient } from "@/lib/supabase/server";
import { EntityType, FavouritesData, FAVOURITES_CONFIG } from "@/types/favourites-detail";

/**
 * Load all favourites for the current mandate
 */
export async function loadMandateFavourites(): Promise<FavouritesData> {
  const mandateId = await getCurrentMandateId();
  
  if (!mandateId) {
    // Return empty favourites if no mandate selected
    return {
      categories: [],
      funds: [],
      asset_class: [],
      structure: []
    };
  }

  try {
    // Load favourites for all entity types in parallel
    const [categories, funds, assetClasses, structures] = await Promise.all([
      supabaseListRead<{ cat_id: number }>({
        table: "im_fav_categories",
        columns: "cat_id",
        filters: [(query) => query.eq("im_id", mandateId)]
      }),
      supabaseListRead<{ fund_id: number }>({
        table: "im_fav_funds", 
        columns: "fund_id",
        filters: [(query) => query.eq("im_id", mandateId)]
      }),
      supabaseListRead<{ asset_class_id: number }>({
        table: "im_fav_assetclass",
        columns: "asset_class_id", 
        filters: [(query) => query.eq("im_id", mandateId)]
      }),
      supabaseListRead<{ structure_id: number }>({
        table: "im_fav_structure",
        columns: "structure_id",
        filters: [(query) => query.eq("im_id", mandateId)]
      })
    ]);

    return {
      categories: categories.map(item => item.cat_id),
      funds: funds.map(item => item.fund_id),
      asset_class: assetClasses.map(item => item.asset_class_id),
      structure: structures.map(item => item.structure_id)
    };
  } catch (error) {
    console.error("Error loading mandate favourites:", error);
    // Return empty favourites on error
    return {
      categories: [],
      funds: [],
      asset_class: [],
      structure: []
    };
  }
}

/**
 * Add a favourite for the current mandate
 */
export async function addFavourite(entityType: EntityType, entityId: number): Promise<void> {
  const mandateId = await getCurrentMandateId();
  
  if (!mandateId) {
    throw new Error("No mandate selected");
  }

  const config = FAVOURITES_CONFIG[entityType];
  const supabase = await createClient();

  const insertData = {
    im_id: mandateId,
    [config.column]: entityId
  };

  const { error } = await supabase
    .from(config.table)
    .insert(insertData);

  if (error) {
    // Check if it's a unique constraint violation (already exists)
    if (error.code === '23505') {
      // Already favourited - this is OK, just ignore
      return;
    }
    console.error(`Error adding favourite ${entityType}:`, error);
    throw error;
  }
}

/**
 * Remove a favourite for the current mandate  
 */
export async function removeFavourite(entityType: EntityType, entityId: number): Promise<void> {
  const mandateId = await getCurrentMandateId();
  
  if (!mandateId) {
    throw new Error("No mandate selected");
  }

  const config = FAVOURITES_CONFIG[entityType];
  const supabase = await createClient();

  const { error } = await supabase
    .from(config.table)
    .delete()
    .eq("im_id", mandateId)
    .eq(config.column, entityId);

  if (error) {
    console.error(`Error removing favourite ${entityType}:`, error);
    throw error;
  }
}

/**
 * Toggle favourite status (main function for UI)
 */
export async function toggleFavouriteServer(entityType: EntityType, entityId: number, isCurrentlyFavourite: boolean): Promise<void> {
  if (isCurrentlyFavourite) {
    await removeFavourite(entityType, entityId);
  } else {
    await addFavourite(entityType, entityId);
  }
}

/**
 * Check if a specific item is favourited (utility function)
 */
export async function isFavouriteServer(entityType: EntityType, entityId: number): Promise<boolean> {
  const mandateId = await getCurrentMandateId();
  
  if (!mandateId) {
    return false;
  }

  const config = FAVOURITES_CONFIG[entityType];
  
  try {
    const result = await supabaseListRead({
      table: config.table,
      columns: config.column,
      filters: [
        (query) => query.eq("im_id", mandateId),
        (query) => query.eq(config.column, entityId)
      ]
    });

    return result.length > 0;
  } catch (error) {
    console.error(`Error checking favourite status for ${entityType}:`, error);
    return false;
  }
}