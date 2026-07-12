import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

interface RecordSignupInput {
  userId: string;
  email: string;
  fullName: string;
  organization?: string;
  sourcePath?: string;
  referrer?: string;
  userAgent?: string;
}

interface SignupTableClient {
  from(table: "mira_signups"): {
    upsert(
      values: {
        user_id: string;
        email: string;
        full_name: string;
        organization: string | null;
        source_path: string | null;
        referrer: string | null;
        user_agent: string | null;
      },
      options: { onConflict: string },
    ): Promise<{ error: { message: string } | null }>;
  };
}

export const recordSignupTraffic = createServerFn({ method: "POST" })
  .validator((data: RecordSignupInput) => data)
  .handler(async ({ data }) => {
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(
      data.userId,
    );

    if (userError || !user.user) throw new Error("Could not verify the new signup.");
    if (user.user.email?.toLowerCase() !== data.email.toLowerCase()) {
      throw new Error("Signup email did not match the created account.");
    }

    const signupTableClient = supabaseAdmin as unknown as SignupTableClient;
    const { error } = await signupTableClient.from("mira_signups").upsert(
      {
        user_id: data.userId,
        email: data.email,
        full_name: data.fullName,
        organization: data.organization?.trim() || null,
        source_path: data.sourcePath || null,
        referrer: data.referrer || null,
        user_agent: data.userAgent || null,
      },
      { onConflict: "user_id" },
    );

    if (error) throw new Error(`Could not record signup: ${error.message}`);
    return { ok: true };
  });
