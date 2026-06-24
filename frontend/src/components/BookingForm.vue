<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const emit = defineEmits<{
  submit: [data: { name: string; email: string }]
}>()

const name = ref('')
const email = ref('')
const submitting = ref(false)

async function onSubmit() {
  if (!name.value || !email.value) return
  submitting.value = true
  try {
    emit('submit', { name: name.value, email: email.value })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Your details</CardTitle>
      <CardDescription>Enter your contact information to confirm the booking.</CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div class="space-y-1">
          <Label for="booking-name">Name</Label>
          <Input id="booking-name" v-model="name" placeholder="Your name" required />
        </div>
        <div class="space-y-1">
          <Label for="booking-email">Email</Label>
          <Input id="booking-email" v-model="email" type="email" placeholder="your@email.com" required />
        </div>
        <Button type="submit" :disabled="submitting" class="w-full">
          {{ submitting ? 'Booking...' : 'Confirm Booking' }}
        </Button>
      </form>
    </CardContent>
  </Card>
</template>
