import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { getClient } from "../_shared/supabaseClient.ts";
import { corsHeaders } from "../_shared/corsHeaders.ts";
import { Vehicle } from "./vehicles.d.ts";
console.log("Hello from Functions!");

Deno.serve(async (req) => {
  const { method } = req;
  const supabase = getClient(req);

  switch (method) {
    case "POST":
      return await createVehicle(req, supabase);
    case "GET":
      return await getVehicles(req, supabase);
    case "PUT":
      return await updateVehicle(req, supabase);
    case "DELETE":
      return await deleteVehicle(req, supabase);
    default:
      return new Response("Method Not Allowed", { status: 405 });
  }
});

//* POST
const createVehicle = async (req: any, supabase: any) => {
  const url = new URL(req.url);
  const user_id = url.searchParams.get("user_id");
  const company_id = url.searchParams.get("company_id");

  if (!user_id) {
    return new Response(JSON.stringify({ error: "user_id is required" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }

  if (!req.body) {
    return new Response(JSON.stringify({ error: "body is required" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }

  const insertData: Vehicle = {
    user_id,
    make: req.body.make,
    model: req.body.model,
    year: req.body.year,
    license_plate: req.body.license_plate,
    created_at: new Date(),
    updated_at: new Date(),
    company_id: company_id ? company_id : null,
  };

  const { data, error } = await supabase.from("vehicles").insert(insertData);
  return new Response(JSON.stringify(error ? error : data), {
    headers: { "Content-Type": "application/json" },
    status: error ? 400 : 200,
  });
};

//* GET
const getVehicles = async (req: Request, supabase: any) => {
  const url = new URL(req.url);
  const user_id = url.searchParams.get("user_id");

  if (!user_id) {
    return new Response(JSON.stringify({ error: "user_id is required" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }

  //* Get vehicles from trips table
  const { data: readData, error: readError } = await supabase
    .from("vehicles")
    .select("*")
    .eq("user_id", user_id);

  return new Response(JSON.stringify(readError ? readError : readData), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: readError ? 400 : 200,
  });
};

//* PUT
const updateVehicle = async (req: any, supabase: any) => {
  const body = req.body;

  const { id, user_id, company_id, make, model, year, license_plate } = body;

  if (!user_id || !id || !make || !model || !year || !license_plate) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }

  if (!req.body) {
    return new Response(JSON.stringify({ error: "body is required" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
  const putData: Vehicle = {
    id,
    make,
    model,
    year,
    license_plate,
    company_id: company_id ? company_id : null,
    updated_at: new Date(), //"now"
  };

  const { data, error } = await supabase
    .from("vehicles")
    .update(putData)
    .eq("id", id) // this is the vehicle id
    .eq("user_id", user_id);
  return new Response(JSON.stringify(error ? error : data), {
    headers: { "Content-Type": "application/json" },
    status: error ? 400 : 200,
  });
};

//* DELETE
const deleteVehicle = async (req: any, supabase: any) => {
  const { id, user_id } = req.body;
  const { data, error } = await supabase
    .from("vehicles")
    .delete()
    .eq("id", id)
    .eq("user_id", user_id);

  return new Response(JSON.stringify(error ? error : data), {
    headers: { "Content-Type": "application/json" },
    status: error ? 400 : 200,
  });
};
