import { test, expect } from '@playwright/test'
import { mockBooking, mockCancelledBooking } from '../helpers/fixtures'
import { setupCors, mockGetBookings, mockCancelBooking } from '../helpers/api'

test.describe('Guest — my bookings', () => {
  test.beforeEach(async ({ page }) => {
    await setupCors(page)
  })
  test('search bookings by email and display list', async ({ page }) => {
    await mockGetBookings(page, [mockBooking, mockCancelledBooking])

    await page.goto('/bookings')
    await expect(page.getByRole('heading', { name: 'My Bookings' })).toBeVisible()

    await page.fill('#email-input', 'ivan@example.com')
    await page.getByRole('button', { name: 'Search' }).click()

    await expect(page.getByText('Иван Петров')).toBeVisible()
    await expect(page.getByText('Мария Иванова')).toBeVisible()
  })

  test('cancel an active booking', async ({ page }) => {
    const cancelled = { ...mockBooking, status: 'cancelled' as const }
    await mockGetBookings(page, [mockBooking])
    await mockCancelBooking(page, cancelled)

    await page.goto('/bookings')
    await page.fill('#email-input', 'ivan@example.com')
    await page.getByRole('button', { name: 'Search' }).click()
    await expect(page.getByText('Upcoming')).toBeVisible()

    page.on('dialog', (dialog) => dialog.accept())
    await page.getByRole('button', { name: 'Cancel' }).click()

    await expect(page.getByText('Cancelled')).toBeVisible()
  })

  test('shows empty message when no bookings found', async ({ page }) => {
    await mockGetBookings(page, [])

    await page.goto('/bookings')
    await page.fill('#email-input', 'nobody@example.com')
    await page.getByRole('button', { name: 'Search' }).click()

    await expect(page.getByText('No bookings found for this email.')).toBeVisible()
  })
})
