import { test, expect } from '@playwright/test'
import { mockAdminSlots } from '../helpers/fixtures'
import {
  setupCors,
  mockGetAdminSlots,
  mockCreateAdminSlot,
  mockDeleteAdminSlot,
} from '../helpers/api'

test.describe('Admin — slots management', () => {
  test.beforeEach(async ({ page }) => {
    await setupCors(page)
  })
  test('create a new slot', async ({ page }) => {
    const newSlot = { id: 3, ownerId: 1, startTime: '2026-07-03T09:00:00Z', endTime: '2026-07-03T17:00:00Z' }
    await mockGetAdminSlots(page, [])
    await mockCreateAdminSlot(page, newSlot)

    await page.goto('/admin/slots')
    await expect(page.getByText('No slots yet.')).toBeVisible()

    await page.getByRole('button', { name: 'Create Slot' }).click()
    await page.fill('#slot-start', '2026-07-03T09:00')
    await page.fill('#slot-end', '2026-07-03T17:00')
    await page.getByRole('button', { name: 'Save' }).click()
  })

  test('delete a slot', async ({ page }) => {
    await mockGetAdminSlots(page, mockAdminSlots)
    await mockDeleteAdminSlot(page, 1)

    await page.goto('/admin/slots')
    await expect(page.getByText('No slots yet.')).not.toBeVisible()

    await expect(page.getByText('Петр Иванов')).toBeVisible()
    await expect(page.getByText('Мария Иванова')).toBeVisible()
    await expect(page.getByText('active')).toBeVisible()
    await expect(page.getByText('cancelled')).toBeVisible()

    page.on('dialog', (dialog) => dialog.accept())
    await page.getByRole('button', { name: 'Delete' }).first().click()

    await expect(page.getByText('No slots yet.')).not.toBeVisible()
  })

  test('cannot delete a slot with active bookings (409)', async ({ page }) => {
    await mockGetAdminSlots(page, mockAdminSlots)
    await mockDeleteAdminSlot(page, 1, 409)

    await page.goto('/admin/slots')

    page.on('dialog', (dialog) => dialog.accept())
    await page.getByRole('button', { name: 'Delete' }).first().click()

    await expect(page.getByText('Failed to delete slot.')).toBeVisible()
  })
})
