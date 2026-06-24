import { Hono } from "hono";
import { store } from "../store.js";
import { SlotCreateSchema } from "../validation.js";
import { BadRequestError } from "../errors.js";

export const slotsRouter = new Hono()
  .get("/", (c) => {
    return c.json(store.listSlots());
  })

  .post("/", async (c) => {
    const body = await c.req.json();
    const parsed = SlotCreateSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestError(parsed.error.message);
    const slot = store.createSlot({ ownerId: 1, ...parsed.data });
    return c.json(slot, 200);
  })

  .delete("/:id", (c) => {
    const id = Number(c.req.param("id"));
    store.deleteSlot(id);
    return c.body(null, 204);
  });
