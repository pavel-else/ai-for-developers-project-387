import type { Page } from '@playwright/test'

const API = 'http://localhost:3001'

export async function setupCors(page: Page) {
  await page.route(`${API}/**`, async (route) => {
    if (route.request().method() === 'OPTIONS') {
      await route.fulfill({
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Headers': '*',
        },
      })
    } else {
      await route.fallback()
    }
  })
}

export async function mockGetEventTypes(page: Page, data: unknown) {
  await page.route(`${API}/event-types`, async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ json: data })
    } else {
      await route.fallback()
    }
  })
}

export async function mockGetSlots(page: Page, data: unknown) {
  await page.route(`${API}/*/slots*`, async (route) => {
    await route.fulfill({ json: data })
  })
}

export async function mockCreateBooking(page: Page, data: unknown) {
  await page.route(`${API}/bookings`, async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({ status: 201, json: data })
    } else {
      await route.fallback()
    }
  })
}

export async function mockGetBookings(page: Page, data: unknown) {
  await page.route(`${API}/bookings*`, async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ json: data })
    } else {
      await route.fallback()
    }
  })
}

export async function mockCancelBooking(page: Page, data: unknown) {
  await page.route(`${API}/bookings/*/cancel`, async (route) => {
    if (route.request().method() === 'PATCH') {
      await route.fulfill({ json: data })
    } else {
      await route.fallback()
    }
  })
}

export async function mockGetAdminEventTypes(page: Page, data: unknown) {
  await page.route(`${API}/admin/event-types`, async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ json: data })
    } else {
      await route.fallback()
    }
  })
}

export async function mockCreateAdminEventType(page: Page, data: unknown) {
  await page.route(`${API}/admin/event-types`, async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({ status: 201, json: data })
    } else {
      await route.fallback()
    }
  })
}

export async function mockUpdateAdminEventType(page: Page, id: number, data: unknown) {
  await page.route(`${API}/admin/event-types/${id}`, async (route) => {
    if (route.request().method() === 'PUT') {
      await route.fulfill({ json: data })
    } else {
      await route.fallback()
    }
  })
}

export async function mockDeleteAdminEventType(page: Page, id: number) {
  await page.route(`${API}/admin/event-types/${id}`, async (route) => {
    if (route.request().method() === 'DELETE') {
      await route.fulfill({ status: 204 })
    } else {
      await route.fallback()
    }
  })
}

export async function mockGetAdminSlots(page: Page, data: unknown) {
  await page.route(`${API}/admin/slots`, async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ json: data })
    } else {
      await route.fallback()
    }
  })
}

export async function mockCreateAdminSlot(page: Page, data: unknown) {
  await page.route(`${API}/admin/slots`, async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({ status: 201, json: data })
    } else {
      await route.fallback()
    }
  })
}

export async function mockDeleteAdminSlot(page: Page, id: number, status = 204) {
  await page.route(`${API}/admin/slots/${id}`, async (route) => {
    if (route.request().method() === 'DELETE') {
      await route.fulfill({ status })
    } else {
      await route.fallback()
    }
  })
}

export async function mockGetAdminBookings(page: Page, data: unknown) {
  await page.route(`${API}/admin/bookings`, async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ json: data })
    } else {
      await route.fallback()
    }
  })
}

export async function mockCancelAdminBooking(page: Page, id: number, data: unknown) {
  await page.route(`${API}/admin/bookings/${id}/cancel`, async (route) => {
    await route.fulfill({ json: data })
  })
}
