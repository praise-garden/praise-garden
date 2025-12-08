import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/server-auth";
import FormsPageClient from "@/components/FormsPageClient";
import type { Form } from "@/types/form-config";

const FormsPage = async () => {
  await requireAuth();
  const supabase = await createClient();

  const { data: forms, error } = await supabase
    .from("forms")
    .select(
      `
      *,
      project:projects(id, name)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching forms:", error);
    return <FormsPageClient initialForms={[]} />;
  }

  return <FormsPageClient initialForms={forms as Form[]} />;
};

export default FormsPage;
