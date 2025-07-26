export type MeetingNotes = {
    meeting_id: number;
    created_at: Date;
    rel_lead_id?: number;
    meeting_name?: string;
    meeting_date?: Date;
    show_to_client?: boolean;
    meeting_summary?: string;
    meeting_notes?: string;
};
