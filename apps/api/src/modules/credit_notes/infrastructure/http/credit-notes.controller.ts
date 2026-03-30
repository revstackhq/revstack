import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "@/container";
import {
  createCreditNoteRoute,
  listCreditNotesRoute,
  getCreditNoteRoute,
} from "./credit_notes.routes";

export const creditNotesController = new OpenAPIHono<AppEnv>();

creditNotesController.openapi(createCreditNoteRoute, async (c) => {
  const handler = c.get("creditNotes").create;
  const dto = c.req.valid("json");
  const result = await handler.execute(dto);
  return c.json(result, 201);
});

creditNotesController.openapi(listCreditNotesRoute, async (c) => {
  const handler = c.get("creditNotes").list;
  const query = c.req.valid("query");
  const result = await handler.execute(query);
  return c.json(result, 200);
});

creditNotesController.openapi(getCreditNoteRoute, async (c) => {
  const handler = c.get("creditNotes").get;
  const { id } = c.req.valid("param");
  const result = await handler.execute({ id });
  return c.json(result, 200);
});
