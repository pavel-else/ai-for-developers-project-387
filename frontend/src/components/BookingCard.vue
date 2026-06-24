<script setup lang="ts">
import { computed } from 'vue'
import type { Booking } from '@/api/guest'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  booking: Booking
}>()

const emit = defineEmits<{
  cancel: [booking: Booking]
}>()

const isPast = computed(() => new Date(props.booking.startTime) < new Date())
const statusLabel = computed(() => {
  if (props.booking.status === 'cancelled') return 'Cancelled'
  if (isPast.value) return 'Completed'
  return 'Upcoming'
})
</script>

<template>
  <Card>
    <CardContent class="flex items-center justify-between py-4">
      <div class="space-y-1">
        <p class="font-medium">
          {{ new Date(booking.startTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }) }}
          &middot;
          {{ new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
        </p>
        <p class="text-sm text-muted-foreground">
          {{ booking.bookerName }} &middot; {{ booking.bookerEmail }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <span
          class="text-xs px-2 py-0.5 rounded-full"
          :class="booking.status === 'cancelled' ? 'bg-destructive/10 text-destructive' : 'bg-green-100 text-green-700'"
        >
          {{ statusLabel }}
        </span>
        <Button
          v-if="booking.status === 'active'"
          variant="outline"
          size="sm"
          @click="emit('cancel', booking)"
        >
          Cancel
        </Button>
      </div>
    </CardContent>
  </Card>
</template>
