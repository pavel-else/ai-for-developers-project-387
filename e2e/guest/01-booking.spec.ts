import { test, expect } from '@playwright/test'
import { mockEventTypes, mockAvailableSlots, mockBooking } from '../helpers/fixtures'
import { setupCors, mockGetEventTypes, mockGetSlots, mockCreateBooking } from '../helpers/api'

test.describe('Guest — booking flow', () => {
  test.beforeEach(async ({ page }) => {
    await setupCors(page)
  })
  test('full booking flow: select event type, choose slot, confirm booking', async ({ page }) => {
    await mockGetEventTypes(page, mockEventTypes)
    await mockGetSlots(page, mockAvailableSlots)
    await mockCreateBooking(page, mockBooking)

    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Book a meeting' })).toBeVisible()

    await page.getByText('15 минут').first().click()

    await page.waitForURL(/\/book\?eventTypeId=1&duration=15/)
    await expect(page.getByRole('heading', { name: '15 минут' })).toBeVisible()

    await page.locator('button').filter({ hasText: /10:00/ }).first().click()

    await page.fill('#booking-name', 'Петр Иванов')
    await page.fill('#booking-email', 'ivan@example.com')
    await page.getByRole('button', { name: 'Confirm Booking' }).click()

    await expect(page.getByText('Booking confirmed!')).toBeVisible()
    await expect(page.getByText('ivan@example.com')).toBeVisible()
  })

  test('shows "No available slots" when no slots match the duration', async ({ page }) => {
    await mockGetEventTypes(page, mockEventTypes)
    await mockGetSlots(page, [])

    await page.goto('/')
    await page.getByText('15 минут').first().click()

    await page.waitForURL(/\/book/)
    await expect(page.getByText('No available slots for this duration.')).toBeVisible()
  })

  test('form validation: cannot submit with empty fields', async ({ page }) => {
    await mockGetEventTypes(page, mockEventTypes)
    await mockGetSlots(page, mockAvailableSlots)

    await page.goto('/')
    await page.getByText('15 минут').first().click()
    await page.waitForURL(/\/book/)

    await page.locator('button').filter({ hasText: /10:00/ }).first().click()

    await page.getByRole('button', { name: 'Confirm Booking' }).click()
    await expect(page.getByText('Select a time')).toBeVisible()
    await expect(page.getByText('Booking confirmed!')).not.toBeVisible()
  })
})
