<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const links = [
  { name: 'admin-event-types', label: 'Event Types' },
  { name: 'admin-slots', label: 'Slots' },
  { name: 'admin-bookings', label: 'Bookings' },
]
</script>

<template>
  <nav class="flex gap-1 mb-8 border-b">
    <RouterLink
      v-for="link in links"
      :key="link.name"
      :to="{ name: link.name }"
      class="px-3 py-2 text-sm -mb-px border-b-2 transition-colors"
      :class="route.name === link.name ? 'border-primary text-foreground font-medium' : 'border-transparent text-muted-foreground hover:text-foreground'"
    >
      {{ link.label }}
    </RouterLink>
  </nav>
</template>
