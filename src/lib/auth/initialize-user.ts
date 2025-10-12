import type { SupabaseClient, User } from "@supabase/supabase-js";

const DEFAULT_PROJECT_NAME = "My First Project";
const DEFAULT_PLAN = "hacker";

type GenericClient = SupabaseClient<any, "public", any>;

export const initializeUserResources = async (
  supabase: GenericClient,
  user: User | null
) => {
  if (!user?.id) {
    return;
  }

  const { error: projectError } = await supabase.from("projects").insert({
    owner_id: user.id,
    name: DEFAULT_PROJECT_NAME,
  });

  if (projectError && projectError.code !== "23505") {
    console.error("Failed to create default project", projectError);
  }

  const derivedUsername = user.user_metadata?.username || user.email?.split("@")[0] || null;
  const fullName = user.user_metadata?.full_name || derivedUsername;

  const { error: profileError } = await supabase.from("profiles").insert({
    id: user.id,
    username: derivedUsername,
    plan: DEFAULT_PLAN,
    full_name: fullName,
  });

  if (profileError && profileError.code !== "23505") {
    console.error("Failed to create user profile", profileError);
  }
};

