<script setup lang="ts">
import type { AvailableSlot } from '@/api/guest'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

defineProps<{
  slots: AvailableSlot[]
  selectedIndex: number | null
}>()

const emit = defineEmits<{
  select: [index: number]
}>()
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
    <Button
      v-for="(slot, index) in slots"
      :key="slot.slotId + '-' + slot.startTime"
      variant="outline"
      :class="cn(
        'flex-col items-start h-auto py-2 gap-0',
        selectedIndex === index && 'border-primary bg-primary/5'
      )"
      @click="emit('select', index)"
    >
      <span class="text-xs text-muted-foreground">
        {{ new Date(slot.startTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }) }}
      </span>
      <span class="text-base">
        {{ new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
      </span>
    </Button>
  </div>
  <p v-if="slots.length === 0" class="text-sm text-muted-foreground text-center py-8">
    No available slots for this duration.
  </p>
</template>
