import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const taskFields = z.object({
  name: z.string().min(1).optional(),
  department: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(["done", "inprogress", "blocked", "next"]).optional(),
  priority: z.enum(["critical", "high", "medium", "low"]).optional(),
  owner: z.string().optional(),
  eta: z.string().optional(),
  note: z.string().optional(),
  blockingLaunch: z.boolean().optional(),
  dependencies: z.array(z.object({ name: z.string(), done: z.boolean() })).optional(),
});

function client() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
          h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

function toRow(input: z.infer<typeof taskFields>) {
  const { blockingLaunch, ...rest } = input;
  const row: Record<string, unknown> = { ...rest };
  if (blockingLaunch !== undefined) row["blocking_launch"] = blockingLaunch;
  return row;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const Route = createFileRoute("/api/public/tasks")({
  server: {
    handlers: {
      GET: async () => {
        const { data, error } = await client()
          .from("roadmap_tasks")
          .select("*")
          .order("position", { ascending: true });
        if (error) return json({ error: error.message }, 500);
        return json({ tasks: data });
      },
      POST: async ({ request }) => {
        const parsed = taskFields.extend({ name: z.string().min(1) }).safeParse(await request.json());
        if (!parsed.success) return json({ error: parsed.error.message }, 400);
        const { data, error } = await client()
          .from("roadmap_tasks")
          .insert(toRow(parsed.data) as never)
          .select()
          .single();
        if (error) return json({ error: error.message }, 500);
        return json({ task: data }, 201);
      },
      PATCH: async ({ request }) => {
        const parsed = taskFields
          .extend({ id: z.string().uuid() })
          .safeParse(await request.json());
        if (!parsed.success) return json({ error: parsed.error.message }, 400);
        const { id, ...fields } = parsed.data;
        const { data, error } = await client()
          .from("roadmap_tasks")
          .update(toRow(fields) as never)
          .eq("id", id)
          .select()
          .single();
        if (error) return json({ error: error.message }, 500);
        return json({ task: data });
      },
      DELETE: async ({ request }) => {
        const id = new URL(request.url).searchParams.get("id");
        if (!id) return json({ error: "Missing id" }, 400);
        const { error } = await client().from("roadmap_tasks").delete().eq("id", id);
        if (error) return json({ error: error.message }, 500);
        return json({ ok: true });
      },
    },
  },
});
