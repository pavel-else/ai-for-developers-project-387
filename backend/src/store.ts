import { NotFoundError, ConflictError, BadRequestError } from "./errors.js";

export type BookingStatus = "active" | "cancelled";

export interface Owner {
  id: number;
  name: string;
  slug: string;
  email: string;
}

export interface EventType {
  id: number;
  ownerId: number;
  name: string;
  description: string;
  duration: number;
}

export interface Slot {
  id: number;
  ownerId: number;
  startTime: string;
  endTime: string;
}

export interface Booking {
  id: number;
  slotId: number;
  eventTypeId: number;
  startTime: string;
  endTime: string;
  bookerName: string;
  bookerEmail: string;
  status: BookingStatus;
}

export interface SlotWithBookings extends Slot {
  bookings: Booking[];
}

class Store {
  private owners = new Map<number, Owner>();
  private eventTypes = new Map<number, EventType>();
  private slots = new Map<number, Slot>();
  private bookings = new Map<number, Booking>();

  private nextOwnerId = 1;
  private nextEventTypeId = 1;
  private nextSlotId = 1;
  private nextBookingId = 1;

  // ---- Owner ----

  createOwner(data: Omit<Owner, "id">): Owner {
    const owner: Owner = { id: this.nextOwnerId++, ...data };
    this.owners.set(owner.id, owner);
    return owner;
  }

  getOwnerBySlug(slug: string): Owner | undefined {
    for (const owner of this.owners.values()) {
      if (owner.slug === slug) return owner;
    }
    return undefined;
  }

  // ---- EventType ----

  listEventTypes(): EventType[] {
    return [...this.eventTypes.values()];
  }

  getEventType(id: number): EventType {
    const et = this.eventTypes.get(id);
    if (!et) throw new NotFoundError("EventType", id);
    return et;
  }

  createEventType(data: Omit<EventType, "id">): EventType {
    const et: EventType = { id: this.nextEventTypeId++, ...data };
    this.eventTypes.set(et.id, et);
    return et;
  }

  updateEventType(id: number, data: Omit<EventType, "id" | "ownerId">): EventType {
    const existing = this.eventTypes.get(id);
    if (!existing) throw new NotFoundError("EventType", id);
    const updated: EventType = { ...existing, ...data };
    this.eventTypes.set(id, updated);
    return updated;
  }

  deleteEventType(id: number): void {
    if (!this.eventTypes.has(id)) throw new NotFoundError("EventType", id);
    this.eventTypes.delete(id);
  }

  // ---- Slot ----

  listSlots(): SlotWithBookings[] {
    return [...this.slots.values()].map((s) => ({
      ...s,
      bookings: this.getBookingsForSlot(s.id),
    }));
  }

  listSlotsInRange(from: string, to: string): SlotWithBookings[] {
    return [...this.slots.values()]
      .filter((s) => s.startTime >= from && s.endTime <= to)
      .map((s) => ({
        ...s,
        bookings: this.getBookingsForSlot(s.id),
      }));
  }

  getSlot(id: number): Slot {
    const slot = this.slots.get(id);
    if (!slot) throw new NotFoundError("Slot", id);
    return slot;
  }

  createSlot(data: Omit<Slot, "id">): Slot {
    const slot: Slot = { id: this.nextSlotId++, ...data };
    this.slots.set(slot.id, slot);
    return slot;
  }

  deleteSlot(id: number): void {
    const slot = this.slots.get(id);
    if (!slot) throw new NotFoundError("Slot", id);
    const active = this.getBookingsForSlot(id).filter((b) => b.status === "active");
    if (active.length > 0) {
      throw new ConflictError("Cannot delete slot with active bookings");
    }
    this.slots.delete(id);
  }

  // ---- Booking ----

  listBookings(): Booking[] {
    const now = new Date().toISOString();
    return [...this.bookings.values()]
      .filter((b) => b.status === "active" && b.startTime >= now)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  getBooking(id: number): Booking {
    const booking = this.bookings.get(id);
    if (!booking) throw new NotFoundError("Booking", id);
    return booking;
  }

  createBooking(data: Omit<Booking, "id">): Booking {
    const slot = this.getSlot(data.slotId);
    if (data.startTime < slot.startTime || data.endTime > slot.endTime) {
      throw new BadRequestError("Booking time must be within slot boundaries");
    }
    this.checkOverlap(data.startTime, data.endTime);
    const booking: Booking = { id: this.nextBookingId++, ...data };
    this.bookings.set(booking.id, booking);
    return booking;
  }

  cancelBooking(id: number): Booking {
    const booking = this.bookings.get(id);
    if (!booking) throw new NotFoundError("Booking", id);
    if (booking.status === "cancelled") {
      throw new ConflictError("Booking is already cancelled");
    }
    booking.status = "cancelled";
    this.bookings.set(id, booking);
    return booking;
  }

  listBookingsByEmail(email: string): Booking[] {
    return [...this.bookings.values()].filter((b) => b.bookerEmail === email);
  }

  private getBookingsForSlot(slotId: number): Booking[] {
    return [...this.bookings.values()].filter((b) => b.slotId === slotId);
  }

  private checkOverlap(start: string, end: string): void {
    const overlap = [...this.bookings.values()].some(
      (b) =>
        b.status === "active" && start < b.endTime && end > b.startTime,
    );
    if (overlap) {
      throw new ConflictError("Time slot overlaps with an existing active booking");
    }
  }
}

export const store = new Store();
