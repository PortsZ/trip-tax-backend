import { devClient, getClient } from "../_shared/supabaseClient.ts";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req: Request) => {
  console.log("req", req);
  const { method } = req;

  const supabase = getClient(req);

  switch (method) {
    case "POST": {
      const body = await req.json();

      if (!body) {
        return new Response(JSON.stringify({ error: "No body" }), {
          status: 400,
        });
      }
      const {
        vehicle_id,
        user_id,
        company_id,
        start_time,
        end_time,
        total_distance,
        business_distance,
        personal_distance,
      } = body;
      const { data: createData, error: createError } = await supabase
        .from("trips")
        .insert([{
          vehicle_id,
          user_id,
          company_id,
          start_time,
          end_time,
          total_distance,
          business_distance,
          personal_distance,
        }]);
      return new Response(
        JSON.stringify(createError ? createError : createData),
        { status: createError ? 400 : 201 },
      );
    }
    case "GET": {
      const url = new URL(req.url);
      const username = url.searchParams.get("username");

      if (!username) {
        return new Response(
          JSON.stringify({ error: "username is required" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          },
        );
      }

      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .single();

      if (userError || !userData) {
        return new Response(
          JSON.stringify({ error: "User not found" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 404,
          },
        );
      }

      const user_id = userData.id;

      const { data: readData, error: readError } = await supabase
        .from("trips")
        .select("*")
        .eq("user_id", user_id);

      const res = await supabase.from("trips").select("*");

      console.log(username, userData, user_id, readData, readError, res);

      return new Response(JSON.stringify(readError ? readError : readData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: readError ? 400 : 200,
      });
    }
    case "PUT": {
      const { id, ...updateFields } = body;
      const { data: updateData, error: updateError } = await supabase
        .from("trips")
        .update(updateFields)
        .eq("id", id);
      return new Response(
        JSON.stringify(updateError ? updateError : updateData),
        { status: updateError ? 400 : 200 },
      );
    }
    case "DELETE": {
      const { trip_id } = body;
      const { data: deleteData, error: deleteError } = await supabase
        .from("trips")
        .delete()
        .eq("id", trip_id);
      return new Response(
        JSON.stringify(deleteError ? deleteError : deleteData),
        { status: deleteError ? 400 : 200 },
      );
    }

    default:
      return new Response("Method Not Allowed", { status: 405 });
  }
});
