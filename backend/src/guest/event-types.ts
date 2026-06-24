import { Hono } from "hono";
import { store } from "../store.js";

export const eventTypesRouter = new Hono().get("/", (c) => {
  return c.json(store.listEventTypes());
});
