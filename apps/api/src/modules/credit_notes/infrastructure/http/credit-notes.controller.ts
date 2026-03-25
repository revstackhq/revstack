import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createCreditNoteSchema } from "@/modules/credit_notes/application/commands/CreateCreditNoteCommand";
import { listCreditNotesSchema } from "@/modules/credit_notes/application/queries/ListCreditNotesQuery";
import type { AppEnv } from "@/container";

export const creditNotesController = new Hono<AppEnv>();

creditNotesController.post(
  "/",
  zValidator("json", createCreditNoteSchema),
  async (c) => {
    const handler = c.get("creditNotes").create;
    const dto = c.req.valid("json");
    const result = await handler.handle(dto);
    return c.json(result, 201);
  }
);

creditNotesController.get(
  "/",
  zValidator("query", listCreditNotesSchema),
  async (c) => {
    const handler = c.get("creditNotes").list;
    const query = c.req.valid("query");
    const result = await handler.handle(query);
    return c.json(result, 200);
  }
);

creditNotesController.get("/:id", async (c) => {
  const handler = c.get("creditNotes").get;
  const result = await handler.handle({ id: c.req.param("id") });
  return c.json(result, 200);
});
