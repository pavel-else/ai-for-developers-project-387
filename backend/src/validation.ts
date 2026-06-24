import { z } from "zod";

export const EventTypeCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  duration: z.number().int().positive().max(480),
});

export const EventTypeUpdateSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  duration: z.number().int().positive().max(480),
});

export const SlotCreateSchema = z.object({
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
});

export const BookingCreateSchema = z.object({
  slotId: z.number().int().positive(),
  eventTypeId: z.number().int().positive(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  name: z.string().min(1),
  email: z.string().email(),
});

export const BookingCancelSchema = z.object({
  email: z.string().email(),
});
