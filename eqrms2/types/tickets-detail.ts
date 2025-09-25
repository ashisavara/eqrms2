export type Ticket = {
    ticket_id: number;
    created_at: Date;
    ticket_name: string;
    ticket_summary:string;
    ticket_description: string;
    hours_passed: number;
    creator_name: string;
    status: string;
    due_date: Date;
    status_desc: string;
    assignee_name: string;
    importance: string;
    ticket_segment: number;
};