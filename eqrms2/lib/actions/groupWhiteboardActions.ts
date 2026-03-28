"use server";

import { supabaseSingleRead, supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";
import { JsonValue } from "@/types/user-log";

type WhiteboardRow = {
  group_id: number;
  excalidraw_json: JsonValue | null;
  excalidraw_updated_at: string | null;
};

type WhiteboardResponse<T = undefined> = {
  success: boolean;
  data?: T;
  updatedAt?: string;
  error?: string;
};

type SaveSource = "autosave" | "manual";

export async function loadGroupWhiteboard(groupId: number): Promise<WhiteboardResponse<WhiteboardRow>> {
  try {
    const data = await supabaseSingleRead<WhiteboardRow>({
      table: "client_group",
      columns: "group_id, excalidraw_json, excalidraw_updated_at",
      filters: [(query) => query.eq("group_id", groupId)],
    });

    if (!data) {
      return { success: false, error: "Group not found" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error loading group whiteboard:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load whiteboard",
    };
  }
}

export async function saveGroupWhiteboard(
  groupId: number,
  sceneJson: JsonValue,
  source: SaveSource = "autosave"
): Promise<WhiteboardResponse> {
  try {
    const updatedAt = new Date().toISOString();
    const payload = { excalidraw_json: sceneJson, excalidraw_updated_at: updatedAt };
    const audit =
      source === "autosave"
        ? { doNotLog: true, segment: "mandate:whiteboard:autosave", pagePath: "/mandate/whiteboard" }
        : { segment: "mandate:whiteboard:manual", pagePath: "/mandate/whiteboard" };

    await supabaseUpdateRow("client_group", "group_id", groupId, payload, { audit });

    return { success: true, updatedAt };
  } catch (error) {
    console.error("Error saving group whiteboard:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save whiteboard",
    };
  }
}
