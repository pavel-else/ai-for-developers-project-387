<script setup lang="ts">
import { ref } from 'vue'
import { getMyBookings, cancelBooking } from '@/api/guest'
import type { Booking } from '@/api/guest'
import BookingCard from '@/components/BookingCard.vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const email = ref('')
const bookings = ref<Booking[]>([])
const loading = ref(false)
const fetched = ref(false)
const error = ref('')

async function search() {
  if (!email.value) return
  loading.value = true
  error.value = ''
  try {
    bookings.value = await getMyBookings(email.value)
    fetched.value = true
  } catch (e) {
    error.value = 'Failed to load bookings.'
  } finally {
    loading.value = false
  }
}

async function onCancel(booking: Booking) {
  try {
    await cancelBooking(booking.id, email.value)
    bookings.value = bookings.value.map(b =>
      b.id === booking.id ? { ...b, status: 'cancelled' as const } : b
    )
  } catch (e) {
    error.value = 'Failed to cancel booking.'
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto py-12 px-4">
    <h1 class="text-3xl font-bold mb-10">My Bookings</h1>

    <form @submit.prevent="search" class="flex gap-2 items-end mb-8">
      <div class="space-y-1 flex-1">
        <Label for="email-input">Email</Label>
        <Input id="email-input" v-model="email" type="email" placeholder="your@email.com" required />
      </div>
      <Button type="submit" :disabled="loading">
        {{ loading ? 'Loading...' : 'Search' }}
      </Button>
    </form>

    <p v-if="error" class="text-destructive text-sm mb-4">{{ error }}</p>

    <div class="mt-8">
      <p v-if="fetched && bookings.length === 0" class="text-center text-muted-foreground py-12">
        No bookings found for this email.
      </p>

      <div class="space-y-3">
        <BookingCard
          v-for="booking in bookings"
          :key="booking.id"
          :booking="booking"
          @cancel="onCancel"
        />
      </div>
    </div>
  </div>
</template>
