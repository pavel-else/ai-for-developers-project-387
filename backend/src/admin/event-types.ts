import { Hono } from "hono";
import { store } from "../store.js";
import { EventTypeCreateSchema, EventTypeUpdateSchema } from "../validation.js";
import { BadRequestError } from "../errors.js";

export const eventTypesRouter = new Hono()
  .get("/", (c) => {
    return c.json(store.listEventTypes());
  })

  .post("/", async (c) => {
    const body = await c.req.json();
    const parsed = EventTypeCreateSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestError(parsed.error.message);
    const et = store.createEventType({ ownerId: 1, ...parsed.data });
    return c.json(et, 200);
  })

  .put("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();
    const parsed = EventTypeUpdateSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestError(parsed.error.message);
    const et = store.updateEventType(id, parsed.data);
    return c.json(et);
  })

  .delete("/:id", (c) => {
    const id = Number(c.req.param("id"));
    store.deleteEventType(id);
    return c.body(null, 204);
  });
