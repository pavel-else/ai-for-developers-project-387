import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { serveStatic } from "@hono/node-server/serve-static";
import { AppError } from "./errors.js";
import { seed } from "./seed.js";
import { eventTypesRouter as adminEventTypesRouter } from "./admin/event-types.js";
import { slotsRouter as adminSlotsRouter } from "./admin/slots.js";
import { bookingsRouter as adminBookingsRouter } from "./admin/bookings.js";
import { eventTypesRouter as guestEventTypesRouter } from "./guest/event-types.js";
import { slotsRouter as guestSlotsRouter } from "./guest/slots.js";
import { bookingsRouter as guestBookingsRouter } from "./guest/bookings.js";

seed();

const app = new Hono();

app.use("/*", cors());

import type { ContentfulStatusCode } from "hono/utils/http-status";

app.onError((err, c) => {
  if (err instanceof AppError) {
    return c.json({ error: err.message }, err.status as ContentfulStatusCode);
  }
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status as ContentfulStatusCode);
  }
  console.error(err);
  return c.json({ error: "Internal Server Error" }, 500);
});

app.route("/admin/event-types", adminEventTypesRouter);
app.route("/admin/slots", adminSlotsRouter);
app.route("/admin/bookings", adminBookingsRouter);
app.route("/event-types", guestEventTypesRouter);
app.route("/", guestSlotsRouter);
app.route("/bookings", guestBookingsRouter);

app.get("*", serveStatic({ root: "../frontend/dist" }));
app.get("*", serveStatic({ path: "../frontend/dist/index.html" }));

export default app;
