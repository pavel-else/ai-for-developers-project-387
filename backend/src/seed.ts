import { store } from "./store.js";

function seedSlots(): void {
  const now = new Date();
  for (let day = 1; day <= 5; day++) {
    const start = new Date(now);
    start.setDate(start.getDate() + day);
    start.setHours(9, 0, 0, 0);
    const end = new Date(start);
    end.setHours(18, 0, 0, 0);

    store.createSlot({
      ownerId: 1,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    });
  }
}

export function seed(): void {
  store.createOwner({
    name: "Владелец",
    slug: "owner",
    email: "owner@example.com",
  });

  store.createEventType({
    ownerId: 1,
    name: "15 минут",
    description: "Короткая встреча на 15 минут",
    duration: 15,
  });

  store.createEventType({
    ownerId: 1,
    name: "30 минут",
    description: "Стандартная встреча на 30 минут",
    duration: 30,
  });

  seedSlots();
}
