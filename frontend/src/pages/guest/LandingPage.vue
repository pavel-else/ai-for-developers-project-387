<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getEventTypes } from '@/api/guest'
import type { EventType } from '@/api/guest'
import EventTypeCard from '@/components/EventTypeCard.vue'

const router = useRouter()
const eventTypes = ref<EventType[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    eventTypes.value = await getEventTypes()
  } finally {
    loading.value = false
  }
})

function select(eventType: EventType) {
  router.push({ name: 'book', query: { eventTypeId: String(eventType.id), duration: String(eventType.duration) } })
}
</script>

<template>
  <div class="max-w-2xl mx-auto py-12 px-4">
    <h1 class="text-3xl font-bold mb-2">Book a meeting</h1>
    <p class="text-muted-foreground mb-8">Choose an event type to get started.</p>

    <div v-if="loading" class="text-center text-muted-foreground py-12">Loading...</div>

    <div v-else class="space-y-4">
      <EventTypeCard
        v-for="et in eventTypes"
        :key="et.id"
        :event-type="et"
        @select="select"
      />
    </div>
  </div>
</template>
