export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | { [key: string]: JsonValue } | JsonValue[];

export type MutationOperation = "Insert" | "Update" | "Delete";

export type MutationAuditMeta = {
  doNotLog?: boolean;
  segment?: string;
  entityId?: number | null;
  entitySlug?: string | null;
  entityTitle?: string | null;
  pagePath?: string | null;
};

export type UserLogInsert = {
  user_id: string;
  user_role?: string | null;
  user_name?: string | null;
  group_id?: number | null;
  group_name?: string | null;
  segment: string;
  entity_id?: number | null;
  entity_slug?: string | null;
  entity_title?: string | null;
  page_path?: string | null;
  mutation_payload?: JsonValue;
};

export type UserLogDetail = {
  log_id: number;
  user_id: string;
  user_role?: string | null;
  user_name?: string | null;
  group_id?: number | null;
  group_name?: string | null;
  event_timestamp: string;
  segment: string;
  entity_id?: number | null;
  entity_slug?: string | null;
  entity_title?: string | null;
  page_path?: string | null;
  mutation_payload?: JsonValue;
};
