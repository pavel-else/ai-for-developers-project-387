import { test, expect } from '@playwright/test'
import { mockAdminBookings } from '../helpers/fixtures'
import { setupCors, mockGetAdminBookings, mockCancelAdminBooking } from '../helpers/api'

test.describe('Admin — bookings management', () => {
  test.beforeEach(async ({ page }) => {
    await setupCors(page)
  })
  test('lists all upcoming bookings', async ({ page }) => {
    await mockGetAdminBookings(page, mockAdminBookings)

    await page.goto('/admin/bookings')
    await expect(page.getByText('Иван Петров')).toBeVisible()
    await expect(page.getByText('Мария Иванова')).toBeVisible()
  })

  test('cancel an active booking', async ({ page }) => {
    const active = mockAdminBookings[0]
    const cancelled = { ...active, status: 'cancelled' as const }
    await mockGetAdminBookings(page, [active])
    await mockCancelAdminBooking(page, 1, cancelled)

    await page.goto('/admin/bookings')
    await expect(page.getByText('Status: active')).toBeVisible()

    page.on('dialog', (dialog) => dialog.accept())
    await page.getByRole('button', { name: 'Cancel' }).click()

    await expect(page.getByText('Cancelled', { exact: true })).toBeVisible()
  })

  test('shows empty state when no bookings', async ({ page }) => {
    await mockGetAdminBookings(page, [])

    await page.goto('/admin/bookings')
    await expect(page.getByText('No upcoming bookings.')).toBeVisible()
  })

  test('cancelled booking shows Cancelled label and no Cancel button', async ({ page }) => {
    const cancelled = { ...mockAdminBookings[0], status: 'cancelled' as const }
    await mockGetAdminBookings(page, [cancelled])

    await page.goto('/admin/bookings')
    await expect(page.getByText('Cancelled', { exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Cancel' })).not.toBeVisible()
  })
})
