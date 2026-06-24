<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getEventTypes, createEventType, updateEventType, deleteEventType } from '@/api/admin'
import type { EventType, EventTypeCreate, EventTypeUpdate } from '@/api/admin'
import AdminNav from '@/components/AdminNav.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const eventTypes = ref<EventType[]>([])
const loading = ref(true)
const error = ref('')
const dialogOpen = ref(false)
const editing = ref<EventType | null>(null)
const form = ref({ name: '', description: '', duration: 30 })
const saving = ref(false)

onMounted(load)

function openCreate() {
  editing.value = null
  form.value = { name: '', description: '', duration: 30 }
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    eventTypes.value = await getEventTypes()
  } catch {
    error.value = 'Failed to load event types.'
  } finally {
    loading.value = false
  }
}

function closeDialog() {
  editing.value = null
  dialogOpen.value = false
}

function openEdit(et: EventType) {
  editing.value = et
  form.value = { name: et.name, description: et.description, duration: et.duration }
  dialogOpen.value = true
}

async function save() {
  saving.value = true
  error.value = ''
  try {
    if (editing.value) {
      const updated = await updateEventType(editing.value.id, form.value as EventTypeUpdate)
      eventTypes.value = eventTypes.value.map((et) => (et.id === updated.id ? updated : et))
    } else {
      const created = await createEventType(form.value as EventTypeCreate)
      eventTypes.value.push(created)
    }
    closeDialog()
  } catch {
    error.value = 'Failed to save event type.'
  } finally {
    saving.value = false
  }
}

async function remove(et: EventType) {
  if (!confirm(`Delete "${et.name}"?`)) return
  error.value = ''
  try {
    await deleteEventType(et.id)
    eventTypes.value = eventTypes.value.filter((e) => e.id !== et.id)
  } catch {
    error.value = 'Failed to delete event type.'
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto py-12 px-4">
    <h1 class="text-3xl font-bold mb-6">Admin</h1>
    <AdminNav />

    <div class="flex items-center justify-between mb-6">
      <p class="text-sm text-muted-foreground">Manage your event types.</p>
      <Dialog v-model:open="dialogOpen">
        <DialogTrigger as-child>
          <Button @click="openCreate">{{ editing ? 'Edit' : 'Create' }} Event Type</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{{ editing ? 'Edit Event Type' : 'Create Event Type' }}</DialogTitle>
          </DialogHeader>
          <form @submit.prevent="save" class="space-y-4">
            <div class="space-y-1">
              <Label for="et-name">Name</Label>
              <Input id="et-name" v-model="form.name" required />
            </div>
            <div class="space-y-1">
              <Label for="et-desc">Description</Label>
              <Input id="et-desc" v-model="form.description" />
            </div>
            <div class="space-y-1">
              <Label for="et-duration">Duration (minutes)</Label>
              <Input
                id="et-duration"
                v-model="form.duration"
                type="number"
                min="5"
                max="480"
                step="5"
                required
              />
            </div>
            <p v-if="error" class="text-destructive text-sm">{{ error }}</p>
            <DialogFooter>
              <Button type="button" variant="outline" @click="closeDialog">Cancel</Button>
              <Button type="submit" :disabled="saving">{{ saving ? 'Saving...' : 'Save' }}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>

    <p v-if="error && !dialogOpen" class="text-destructive text-sm mb-4">{{ error }}</p>

    <Card v-if="loading">
      <CardHeader><CardTitle>Loading...</CardTitle></CardHeader>
    </Card>

    <div v-else-if="eventTypes.length === 0" class="text-center text-muted-foreground py-12">
      No event types yet. Create one to get started.
    </div>

    <div v-else class="space-y-3">
      <Card v-for="et in eventTypes" :key="et.id">
        <CardContent class="flex items-center justify-between py-4">
          <div>
            <p class="font-medium">{{ et.name }}</p>
            <p class="text-sm text-muted-foreground">{{ et.description }}</p>
            <p class="text-xs text-muted-foreground">{{ et.duration }} min</p>
          </div>
          <div class="flex gap-2">
            <Button variant="outline" size="sm" @click="openEdit(et)">Edit</Button>
            <Button variant="outline" size="sm" @click="remove(et)">Delete</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
