<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getBookings, cancelBooking } from '@/api/admin'
import type { Booking } from '@/api/admin'
import AdminNav from '@/components/AdminNav.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const bookings = ref<Booking[]>([])
const loading = ref(true)
const error = ref('')

onMounted(load)

async function load() {
  loading.value = true
  error.value = ''
  try {
    bookings.value = await getBookings()
  } catch {
    error.value = 'Failed to load bookings.'
  } finally {
    loading.value = false
  }
}

async function cancel(b: Booking) {
  if (!confirm(`Cancel booking by ${b.bookerName} on ${new Date(b.startTime).toLocaleString()}?`)) return
  error.value = ''
  try {
    const updated = await cancelBooking(b.id)
    bookings.value = bookings.value.map(bk => bk.id === updated.id ? updated : bk)
  } catch {
    error.value = 'Failed to cancel booking.'
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto py-12 px-4">
    <h1 class="text-3xl font-bold mb-6">Admin</h1>
    <AdminNav />

    <p class="text-sm text-muted-foreground mb-6">Upcoming bookings.</p>

    <p v-if="error" class="text-destructive text-sm mb-4">{{ error }}</p>

    <Card v-if="loading">
      <CardHeader><CardTitle>Loading...</CardTitle></CardHeader>
    </Card>

    <div v-else-if="bookings.length === 0" class="text-center text-muted-foreground py-12">
      No upcoming bookings.
    </div>

    <div v-else class="space-y-3">
      <Card v-for="b in bookings" :key="b.id">
        <CardContent class="flex items-center justify-between py-4">
          <div>
            <p class="font-medium">{{ b.bookerName }} ({{ b.bookerEmail }})</p>
            <p class="text-sm text-muted-foreground">
              {{ new Date(b.startTime).toLocaleString() }} – {{ new Date(b.endTime).toLocaleTimeString() }}
            </p>
            <p class="text-xs text-muted-foreground">
              Event #{{ b.eventTypeId }} &middot; Status: {{ b.status }}
            </p>
          </div>
          <Button
            v-if="b.status === 'active'"
            variant="outline"
            size="sm"
            @click="cancel(b)"
          >
            Cancel
          </Button>
          <span v-else class="text-xs text-muted-foreground">Cancelled</span>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
