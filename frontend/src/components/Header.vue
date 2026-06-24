<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="border-b">
    <div class="max-w-6xl mx-auto flex items-center justify-between h-14 px-4">
      <RouterLink to="/" class="font-semibold text-lg">CalClone</RouterLink>
      <nav class="flex gap-4 text-sm text-muted-foreground">
        <RouterLink to="/bookings" class="hover:text-foreground transition-colors">
          My Bookings
        </RouterLink>
        <RouterLink to="/admin/event-types" class="hover:text-foreground transition-colors">
          Admin
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
