import { redirect } from "next/navigation";

// Force dynamic rendering - even for redirects, to prevent static generation issues
export const dynamic = 'force-dynamic';

export default async function AmcPage() {
  redirect('/funds');
}
