import { test, expect } from '@playwright/test'
import { mockEventTypes, mockCreatedEventType } from '../helpers/fixtures'
import {
  setupCors,
  mockGetAdminEventTypes,
  mockCreateAdminEventType,
  mockUpdateAdminEventType,
  mockDeleteAdminEventType,
} from '../helpers/api'

test.describe('Admin — event types management', () => {
  test.beforeEach(async ({ page }) => {
    await setupCors(page)
  })
  test('create a new event type', async ({ page }) => {
    await mockGetAdminEventTypes(page, [])
    await mockCreateAdminEventType(page, mockCreatedEventType)

    await page.goto('/admin/event-types')
    await expect(page.getByText('No event types yet.')).toBeVisible()

    await page.getByRole('button', { name: 'Create Event Type' }).click()
    await page.fill('#et-name', '45 минут')
    await page.fill('#et-desc', 'Длинная встреча')
    await page.fill('#et-duration', '45')
    await page.getByRole('button', { name: 'Save' }).click()

    await expect(page.getByText('45 минут')).toBeVisible()
  })

  test('edit an existing event type', async ({ page }) => {
    const initial = [{ ...mockEventTypes[0] }]
    const updated = { ...mockEventTypes[0], name: '15 минут (edited)' }
    await mockGetAdminEventTypes(page, initial)
    await mockUpdateAdminEventType(page, 1, updated)

    await page.goto('/admin/event-types')
    await page.getByRole('button', { name: 'Edit' }).click()
    await page.fill('#et-name', '')
    await page.fill('#et-name', '15 минут (edited)')
    await page.getByRole('button', { name: 'Save' }).click()

    await expect(page.getByText('15 минут (edited)')).toBeVisible()
  })

  test('delete an event type', async ({ page }) => {
    await mockGetAdminEventTypes(page, mockEventTypes)
    await mockDeleteAdminEventType(page, 1)

    await page.goto('/admin/event-types')
    await expect(page.getByText('15 минут').first()).toBeVisible()

    page.on('dialog', (dialog) => dialog.accept())
    await page.getByRole('button', { name: 'Delete' }).first().click()

    await expect(page.getByText('30 минут', { exact: true })).toBeVisible()
    await expect(page.getByText('15 минут', { exact: true })).not.toBeVisible()
  })
})
