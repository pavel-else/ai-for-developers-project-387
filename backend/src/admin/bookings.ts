import { Hono } from "hono";
import { store } from "../store.js";

export const bookingsRouter = new Hono()
  .get("/", (c) => {
    return c.json(store.listBookings());
  })

  .patch("/:id/cancel", (c) => {
    const id = Number(c.req.param("id"));
    const booking = store.cancelBooking(id);
    return c.json(booking);
  });
