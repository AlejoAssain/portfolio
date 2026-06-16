import { createClient } from "jsr:@supabase/supabase-js@2";

/**
 * Public contact form endpoint.
 *
 * The browser calls this Edge Function instead of inserting directly into
 * `contact_messages`. This lets the server validate bot protection, sanitize
 * the payload, and write to Supabase with server-side credentials.
 */
type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
  turnstileToken?: string;
  website?: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/**
 * Return JSON with the CORS headers required by browser requests.
 */
function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

/**
 * Lightweight email shape validation. This is intentionally simple because
 * deliverability is not being verified here.
 */
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Ask Cloudflare Turnstile whether the browser-provided token is valid.
 * The secret key lives in Supabase function secrets, never in the frontend.
 */
async function verifyTurnstile(token: string, ip: string | null) {
  const secret = Deno.env.get("TURNSTILE_SECRET_KEY");

  if (!secret) {
    throw new Error("Missing TURNSTILE_SECRET_KEY.");
  }

  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);

  if (ip) {
    formData.append("remoteip", ip);
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    return false;
  }

  const result = await response.json();

  return result.success === true;
}

Deno.serve(async (req) => {
  // Browsers send a preflight request before POSTing JSON to this function.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // This endpoint only accepts contact form submissions.
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  let payload: ContactPayload;

  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid request body." }, 400);
  }

  // Normalize input before validation and storage.
  const name = payload.name?.trim() ?? "";
  const email = payload.email?.trim().toLowerCase() ?? "";
  const message = payload.message?.trim() ?? "";
  const turnstileToken = payload.turnstileToken ?? "";
  const website = payload.website?.trim() ?? "";

  // Honeypot field. Real users should never fill this hidden field.
  if (website) {
    return jsonResponse({ ok: true });
  }

  // Keep validation strict enough to reject malformed or abusive submissions.
  if (!name || name.length > 120) {
    return jsonResponse({ error: "Invalid name." }, 400);
  }

  if (!email || email.length > 254 || !isValidEmail(email)) {
    return jsonResponse({ error: "Invalid email." }, 400);
  }

  if (!message || message.length > 3000) {
    return jsonResponse({ error: "Invalid message." }, 400);
  }

  if (!turnstileToken) {
    return jsonResponse({ error: "Missing bot check token." }, 400);
  }

  // Forward the client IP when available so Turnstile can score the request.
  const ip = req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for");

  const validTurnstile = await verifyTurnstile(turnstileToken, ip);

  if (!validTurnstile) {
    return jsonResponse({ error: "Bot check failed." }, 400);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  // Hosted Supabase Functions expose these secrets automatically.
  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "Server configuration error." }, 500);
  }

  // The service role key is used only inside this server-side function.
  // Do not expose it through Vite or any browser-readable environment variable.
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });

  // Store only the fields that belong in the public inbox table.
  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    message,
  });

  if (error) {
    console.error("contact_messages insert failed", error);
    return jsonResponse({ error: "Message could not be saved." }, 500);
  }

  return jsonResponse({ ok: true });
});
