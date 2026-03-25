import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { createCreditNoteSchema } from "@/modules/credit_notes/application/commands/CreateCreditNoteCommand";
import { listCreditNotesSchema } from "@/modules/credit_notes/application/queries/ListCreditNotesQuery";
import type { AppEnv } from "@/container";

export const creditNotesController = new OpenAPIHono<AppEnv>();

const createCreditNoteRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Credit Notes"],
  summary: "Create a credit note",
  description:
    "Issues a credit note against an invoice for partial or full refund.",
  request: {
    body: {
      content: { "application/json": { schema: createCreditNoteSchema } },
    },
  },
  responses: {
    201: {
      description: "Credit note created",
      content: { "application/json": { schema: z.any() } },
    },
    400: { description: "Validation error" },
  },
});

creditNotesController.openapi(createCreditNoteRoute, async (c) => {
  const handler = c.get("creditNotes").create;
  const dto = c.req.valid("json");
  const result = await handler.handle(dto);
  return c.json(result, 201);
});

const listCreditNotesRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Credit Notes"],
  summary: "List credit notes",
  description: "Retrieves credit notes with optional filters.",
  request: { query: listCreditNotesSchema },
  responses: {
    200: {
      description: "List of credit notes",
      content: { "application/json": { schema: z.array(z.any()) } },
    },
  },
});

creditNotesController.openapi(listCreditNotesRoute, async (c) => {
  const handler = c.get("creditNotes").list;
  const query = c.req.valid("query");
  const result = await handler.handle(query);
  return c.json(result, 200);
});

const getCreditNoteRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Credit Notes"],
  summary: "Get a credit note",
  description: "Retrieves a single credit note by ID.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "cn_abc123" }) }),
  },
  responses: {
    200: {
      description: "Credit note details",
      content: { "application/json": { schema: z.any() } },
    },
  },
});

creditNotesController.openapi(getCreditNoteRoute, async (c) => {
  const handler = c.get("creditNotes").get;
  const { id } = c.req.valid("param");
  const result = await handler.handle({ id });
  return c.json(result, 200);
});
