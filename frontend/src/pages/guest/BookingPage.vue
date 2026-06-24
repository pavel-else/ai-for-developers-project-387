<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSlots, getEventTypes, createBooking } from '@/api/guest'
import type { AvailableSlot, Booking, EventType } from '@/api/guest'
import { config } from '@/api/config'
import SlotPicker from '@/components/SlotPicker.vue'
import BookingForm from '@/components/BookingForm.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const route = useRoute()
const router = useRouter()

const eventTypeId = computed(() => Number(route.query.eventTypeId))
const duration = computed(() => Number(route.query.duration))

const eventType = ref<EventType | null>(null)
const slots = ref<AvailableSlot[]>([])
const loading = ref(true)
const selectedIndex = ref<number | null>(null)
const createdBooking = ref<Booking | null>(null)
const error = ref('')

const selectedSlot = computed(() =>
  selectedIndex.value !== null ? slots.value[selectedIndex.value] ?? null : null,
)

onMounted(async () => {
  if (!eventTypeId.value || !duration.value) {
    router.replace({ name: 'landing' })
    return
  }
  try {
    const [types, slotList] = await Promise.all([
      getEventTypes(),
      getSlots(duration.value),
    ])
    eventType.value = types.find(t => t.id === eventTypeId.value) ?? null
    slots.value = slotList
  } catch (e) {
    error.value = 'Failed to load booking data.'
  } finally {
    loading.value = false
  }
})

async function onFormSubmit(data: { name: string; email: string }) {
  if (!selectedSlot.value || !eventType.value) return
  try {
    error.value = ''
    createdBooking.value = await createBooking({
      slotId: selectedSlot.value.slotId,
      eventTypeId: eventType.value.id,
      startTime: selectedSlot.value.startTime,
      endTime: selectedSlot.value.endTime,
      name: data.name,
      email: data.email,
    })
  } catch (e) {
    error.value = 'Booking failed. Please try again.'
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto py-12 px-4">
    <template v-if="loading">
      <p class="text-center text-muted-foreground py-12">Loading...</p>
    </template>

    <template v-else-if="createdBooking">
      <Card>
        <CardHeader>
          <CardTitle>Booking confirmed!</CardTitle>
          <CardDescription>
            {{ new Date(createdBooking.startTime).toLocaleString() }}
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <p class="text-sm text-muted-foreground">
            A confirmation has been sent to {{ createdBooking.bookerEmail }}.
          </p>
          <div class="flex gap-2">
            <Button variant="outline" @click="router.push({ name: 'my-bookings' })">
              View My Bookings
            </Button>
            <Button variant="ghost" @click="router.push({ name: 'landing' })">
              Back Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </template>

    <template v-else>
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-1">{{ eventType?.name ?? 'Booking' }}</h1>
        <p class="text-muted-foreground">{{ eventType?.description }}</p>
      </div>

      <div v-if="error" class="text-destructive text-sm mb-4">{{ error }}</div>

      <h2 class="text-lg font-semibold mb-6">Select a time</h2>
      <SlotPicker
        :slots="slots"
        :selected-index="selectedIndex"
        @select="selectedIndex = $event"
      />

      <div v-if="selectedSlot" class="mt-8">
        <BookingForm @submit="onFormSubmit" />
      </div>
    </template>
  </div>
</template>
