import { Hono } from "hono";
import { store } from "../store.js";
import { BookingCreateSchema, BookingCancelSchema } from "../validation.js";
import { BadRequestError, ConflictError } from "../errors.js";

export const bookingsRouter = new Hono()
  .get("/", (c) => {
    const email = c.req.query("email");
    if (!email) throw new BadRequestError("email query parameter is required");
    return c.json(store.listBookingsByEmail(email));
  })

  .post("/", async (c) => {
    const body = await c.req.json();
    const parsed = BookingCreateSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestError(parsed.error.message);

    const { slotId, eventTypeId, startTime, endTime, name, email } = parsed.data;

    const et = store.getEventType(eventTypeId);
    const expectedDuration = et.duration * 60 * 1000;
    const actualDuration =
      new Date(endTime).getTime() - new Date(startTime).getTime();

    if (actualDuration !== expectedDuration) {
      throw new BadRequestError(
        `Booking duration must be exactly ${et.duration} minutes for event type "${et.name}"`,
      );
    }

    const booking = store.createBooking({
      slotId,
      eventTypeId,
      startTime,
      endTime,
      bookerName: name,
      bookerEmail: email,
      status: "active",
    });

    return c.json(booking, 200);
  })

  .patch("/:id/cancel", async (c) => {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();
    const parsed = BookingCancelSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestError(parsed.error.message);

    const booking = store.getBooking(id);
    if (booking.bookerEmail !== parsed.data.email) {
      throw new ConflictError("Email does not match the booking owner");
    }

    const cancelled = store.cancelBooking(id);
    return c.json(cancelled);
  });
