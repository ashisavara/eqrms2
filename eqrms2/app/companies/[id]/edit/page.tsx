"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client"; // adjust if your client is elsewhere
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function EditCompanyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState({
    snapshot: "",
    positive: "",
    negative: "",
    outlook: "",
    inv_view: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("eq_rms_company_view")
        .select("ime_name, sector_id, industry, coverage, snapshot, positive, negative, outlook, inv_view")
        .eq("id", id)
        .single();

      console.log("Supabase error:", error);

      if (data) {
        console.log("Fetched data:", data);
        setForm({
          snapshot: data.snapshot ?? "",
          positive: data.positive ?? "",
          negative: data.negative ?? "",
          outlook: data.outlook ?? "",
          inv_view: data.inv_view ?? "",
        });
      }
      setLoading(false);
    };
    fetchCompany();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    const { error } = await supabase
      .from("eq_rms_valscreen")
      .update(form)
      .eq("rel_company_id", id);
    if (error) {
      console.error("Supabase update error:", error);
      alert("Error saving: " + error.message);
      return;
    }
    router.push(`/companies/${id}`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl w-full mx-auto p-4 space-y-4">
      <p>Edit Valscreen for {form.ime_name}</p>
      <div>
        <Label htmlFor="snapshot">Snapshot</Label>
        <Textarea
          id="snapshot"
          name="snapshot"
          value={form.snapshot}
          onChange={handleChange}
          className="w-full min-h-[120px] resize-y"
        />
      </div>
      <div>
        <Label htmlFor="positive">Positive</Label>
        <Textarea
          id="positive"
          name="positive"
          value={form.positive}
          onChange={handleChange}
          className="w-full min-h-[120px] resize-y"
        />
      </div>
      <div>
        <Label htmlFor="negative">Negative</Label>
        <Textarea
          id="negative"
          name="negative"
          value={form.negative}
          onChange={handleChange}
          className="w-full min-h-[120px] resize-y"
        />
      </div>
      <div>
        <Label htmlFor="outlook">Outlook</Label>
        <Textarea
          id="outlook"
          name="outlook"
          value={form.outlook}
          onChange={handleChange}
          className="w-full min-h-[120px] resize-y"
        />
      </div>
      <div>
        <Label htmlFor="inv_view">Investment View</Label>
        <Textarea
          id="inv_view"
          name="inv_view"
          value={form.inv_view}
          onChange={handleChange}
          className="w-full min-h-[120px] resize-y"
        />
      </div>
      <Button type="submit" className="w-full">
        Save
      </Button>
    </form>
  );
}
