import { TableAmcScreen } from "./TableAmcScreen";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import { AMC } from "@/types/amc-detail";
import { redirect } from "next/navigation";

export default async function CompaniesPage() {

  return (
    redirect('/funds'));
}
