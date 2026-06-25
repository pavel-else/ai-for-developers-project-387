<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSlots, createSlot, deleteSlot } from '@/api/admin'
import type { SlotWithBookings, Slot, SlotCreate } from '@/api/admin'
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

const slots = ref<SlotWithBookings[]>([])
const loading = ref(true)
const error = ref('')
const dialogOpen = ref(false)
const form = ref({ startTime: '', endTime: '' })
const saving = ref(false)

onMounted(load)

async function load() {
  loading.value = true
  error.value = ''
  try {
    slots.value = await getSlots()
  } catch {
    error.value = 'Failed to load slots.'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  form.value = { startTime: '', endTime: '' }
  dialogOpen.value = true
}

async function save() {
  saving.value = true
  error.value = ''
  try {
    const body: SlotCreate = {
      startTime: new Date(form.value.startTime).toISOString(),
      endTime: new Date(form.value.endTime).toISOString(),
    }
    const created = await createSlot(body)
    slots.value.push(created)
    dialogOpen.value = false
  } catch {
    error.value = 'Failed to create slot.'
  } finally {
    saving.value = false
  }
}

async function remove(slot: Slot) {
  if (!confirm(`Delete slot on ${new Date(slot.startTime).toLocaleString()}?`)) return
  error.value = ''
  try {
    await deleteSlot(slot.id)
    slots.value = slots.value.filter(s => s.id !== slot.id)
  } catch {
    error.value = 'Failed to delete slot.'
  }
}

</script>

<template>
  <div class="max-w-4xl mx-auto py-12 px-4">
    <h1 class="text-3xl font-bold mb-6">Admin</h1>
    <AdminNav />

    <div class="flex items-center justify-between mb-6">
      <p class="text-sm text-muted-foreground">Manage your availability slots.</p>
      <Dialog v-model:open="dialogOpen">
        <DialogTrigger as-child>
          <Button @click="openCreate">Create Slot</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Slot</DialogTitle>
          </DialogHeader>
          <form @submit.prevent="save" class="space-y-4">
            <div class="space-y-1">
              <Label for="slot-start">Start</Label>
              <Input id="slot-start" v-model="form.startTime" type="datetime-local" required />
            </div>
            <div class="space-y-1">
              <Label for="slot-end">End</Label>
              <Input id="slot-end" v-model="form.endTime" type="datetime-local" required />
            </div>
            <p v-if="error" class="text-destructive text-sm">{{ error }}</p>
            <DialogFooter>
              <Button type="button" variant="outline" @click="dialogOpen = false">Cancel</Button>
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

    <div v-else-if="slots.length === 0" class="text-center text-muted-foreground py-12">
      No slots yet. Create one to get started.
    </div>

    <div v-else class="space-y-3">
      <Card v-for="slot in slots" :key="slot.id">
        <CardContent class="py-4">
          <div class="flex items-center justify-between mb-3">
            <div>
              <p class="font-medium">{{ new Date(slot.startTime).toLocaleString() }}</p>
              <p class="text-sm text-muted-foreground">
                {{ new Date(slot.startTime).toLocaleTimeString() }} – {{ new Date(slot.endTime).toLocaleTimeString() }}
              </p>
            </div>
            <Button variant="outline" size="sm" @click="remove(slot)">Delete</Button>
          </div>
          <div v-if="slot.bookings && slot.bookings.length > 0" class="border-t pt-3 space-y-2">
            <p class="text-sm font-medium text-muted-foreground">Bookings</p>
            <div v-for="booking in slot.bookings" :key="booking.id" class="flex items-center justify-between text-sm pl-2">
              <div>
                <p>{{ booking.bookerName }} ({{ booking.bookerEmail }})</p>
                <p class="text-muted-foreground">
                  {{ new Date(booking.startTime).toLocaleTimeString() }} – {{ new Date(booking.endTime).toLocaleTimeString() }}
                </p>
              </div>
              <span
                class="text-xs px-2 py-0.5 rounded"
                :class="booking.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'"
              >
                {{ booking.status }}
              </span>
            </div>
          </div>
          <p v-else class="text-xs text-muted-foreground border-t pt-2">No bookings</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
