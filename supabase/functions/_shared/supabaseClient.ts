import { createClient } from "npm:@supabase/supabase-js@2";

export const devClient = (req: Request) =>
    createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        {
            global: {
                headers: { Authorization: req.headers.get("Authorization")! },
            },
        },
    );

export const getClient = (req: Request) =>
    createClient(
        // Supabase API URL - env var exported by default.
        Deno.env.get("SUPABASE_URL")!,
        // Supabase API ANON KEY - env var exported by default.
        Deno.env.get("SUPABASE_ANON_KEY")!,
        {
            global: {
                headers: { Authorization: req.headers.get("Authorization")! },
            },
        },
    );
