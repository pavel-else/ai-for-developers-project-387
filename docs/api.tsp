import "@typespec/http";
import "@typespec/rest";

using TypeSpec.Http;

// ===================== Enums =====================

enum BookingStatus {
  active,
  cancelled,
}

// ===================== Models =====================

model Owner {
  id: uint32;

  @example("Владелец")
  @minLength(1)
  name: string;

  @example("owner")
  @minLength(1)
  slug: string;

  @example("owner@example.com")
  @format("email")
  email: string;
}

model EventType {
  id: uint32;
  ownerId: uint32;

  @example("15 минут")
  @minLength(1)
  name: string;

  @example("Короткая встреча на 15 минут")
  @minLength(1)
  description: string;

  @example(30)
  @minValue(1)
  @maxValue(480)
  duration: int32;
}

model Slot {
  id: uint32;
  ownerId: uint32;

  @example(utcDateTime.fromISO("2026-07-01T09:00:00Z"))
  startTime: utcDateTime;

  @example(utcDateTime.fromISO("2026-07-01T18:00:00Z"))
  endTime: utcDateTime;
}

model Booking {
  id: uint32;
  slotId: uint32;
  eventTypeId: uint32;

  @example(utcDateTime.fromISO("2026-07-01T10:00:00Z"))
  startTime: utcDateTime;

  @example(utcDateTime.fromISO("2026-07-01T10:15:00Z"))
  endTime: utcDateTime;

  @example("Иван Петров")
  @minLength(1)
  bookerName: string;

  @example("ivan@example.com")
  @format("email")
  bookerEmail: string;

  status: BookingStatus;
}

// ===================== Request bodies =====================

model EventTypeCreate {
  @example("45 минут")
  @minLength(1)
  name: string;

  @example("Встреча на 45 минут")
  @minLength(1)
  description: string;

  @example(45)
  @minValue(1)
  @maxValue(480)
  duration: int32;
}

model EventTypeUpdate {
  @example("45 минут")
  @minLength(1)
  name: string;

  @example("Встреча на 45 минут")
  @minLength(1)
  description: string;

  @example(45)
  @minValue(1)
  @maxValue(480)
  duration: int32;
}

model SlotCreate {
  @example(utcDateTime.fromISO("2026-07-01T09:00:00Z"))
  startTime: utcDateTime;

  @example(utcDateTime.fromISO("2026-07-01T18:00:00Z"))
  endTime: utcDateTime;
}

model BookingCreate {
  slotId: uint32;
  eventTypeId: uint32;

  @example(utcDateTime.fromISO("2026-07-01T10:00:00Z"))
  startTime: utcDateTime;

  @example(utcDateTime.fromISO("2026-07-01T10:15:00Z"))
  endTime: utcDateTime;

  @example("Иван Петров")
  @minLength(1)
  name: string;

  @example("ivan@example.com")
  @format("email")
  email: string;
}

model BookingCancelInput {
  @example("ivan@example.com")
  @format("email")
  email: string;
}

// ===================== Admin API =====================

@service(#{
  title: "Admin API",
})
@doc("Административное API для владельца календаря")
namespace Admin {
  @route("/admin/event-types")
  interface EventTypes {
    @doc("Список всех типов событий")
    @get list(): EventType[];

    @doc("Создать тип события")
    @post create(@body body: EventTypeCreate): EventType;

    @doc("Обновить тип события")
    @put update(@path id: uint32, @body body: EventTypeUpdate): EventType;

    @doc("Удалить тип события")
    @delete delete(@path id: uint32): void;
  }

  @route("/admin/slots")
  interface Slots {
    @doc("Список своих слотов с бронями. Каждый слот содержит вложенные Booking[].")
    @get list(): Slot[];

    @doc("Создать новый слот")
    @post create(@body body: SlotCreate): Slot;

    @doc("Удалить слот. Блокировано, пока есть активные брони")
    @delete delete(@path id: uint32): void;
  }

  @route("/admin/bookings")
  interface Bookings {
    @doc("Все предстоящие встречи (active, startTime >= сейчас), отсортированные по startTime")
    @get list(): Booking[];

    @doc("Отменить бронь")
    @route("{id}/cancel")
    @patch cancel(@path id: uint32): Booking;
  }
}

// ===================== Guest API =====================

@service(#{
  title: "Guest API",
})
@doc("Публичное API для гостей (без аутентификации)")
namespace Guest {
  @route("/event-types")
  interface EventTypes {
    @doc("Список доступных типов событий")
    @get list(): EventType[];
  }

  @route("/{slug}/slots")
  interface Slots {
    @doc("""
      Свободные окна для указанной длительности.
      Возвращает только слоты в ближайшие 14 дней от текущей даты.
    """)
    @get list(@path slug: string, @query duration: int32): Slot[];
  }

  @route("/bookings")
  interface Bookings {
    @doc("""
      Создать бронь.
      Проверка: на одно и то же время не может быть двух активных бронирований
      (независимо от slotId и eventTypeId).
    """)
    @post create(@body body: BookingCreate): Booking;

    @doc("Свои брони по email")
    @get listByEmail(@query email: string): Booking[];
  }

  @route("/bookings/{id}/cancel")
  interface BookingCancel {
    @doc("Отменить свою бронь. В теле передаётся email для верификации")
    @patch cancel(@path id: uint32, @body body: BookingCancelInput): Booking;
  }
}
