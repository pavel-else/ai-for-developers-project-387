<script setup lang="ts">
import type { EventType } from '@/api/guest'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  eventType: EventType
}>()

const emit = defineEmits<{
  select: [eventType: EventType]
}>()
</script>

<template>
  <Card class="cursor-pointer hover:shadow-md transition-shadow" @click="emit('select', eventType)">
    <CardHeader>
      <CardTitle>{{ eventType.name }}</CardTitle>
      <CardDescription>{{ eventType.description }}</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="flex items-center justify-between">
        <span class="text-sm text-muted-foreground">{{ eventType.duration }} min</span>
        <Button size="sm" @click.stop="emit('select', eventType)">Select</Button>
      </div>
    </CardContent>
  </Card>
</template>
