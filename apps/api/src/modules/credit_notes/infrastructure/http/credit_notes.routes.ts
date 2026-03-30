import { createRoute, z } from "@hono/zod-openapi";
import { CreateCreditNoteCommandSchema } from "@/modules/credit_notes/application/use-cases/CreateCreditNote/CreateCreditNote.schema";
import { ListCreditNotesQuerySchema } from "@/modules/credit_notes/application/use-cases/ListCreditNotes/ListCreditNotes.schema";

export const createCreditNoteRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Credit Notes"],
  summary: "Create a credit note",
  description: "Issues a credit note against an invoice for partial or full refund.",
  request: {
    body: {
      content: { "application/json": { schema: CreateCreditNoteCommandSchema } },
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

export const listCreditNotesRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Credit Notes"],
  summary: "List credit notes",
  description: "Retrieves credit notes with optional filters.",
  request: { query: ListCreditNotesQuerySchema },
  responses: {
    200: {
      description: "List of credit notes",
      content: { "application/json": { schema: z.array(z.any()) } },
    },
  },
});

export const getCreditNoteRoute = createRoute({
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
