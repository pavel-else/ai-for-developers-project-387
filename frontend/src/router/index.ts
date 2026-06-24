import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('../pages/guest/LandingPage.vue'),
    },
    {
      path: '/book',
      name: 'book',
      component: () => import('../pages/guest/BookingPage.vue'),
    },
    {
      path: '/bookings',
      name: 'my-bookings',
      component: () => import('../pages/guest/MyBookingsPage.vue'),
    },
    {
      path: '/admin/event-types',
      name: 'admin-event-types',
      component: () => import('../pages/admin/EventTypesPage.vue'),
    },
    {
      path: '/admin/slots',
      name: 'admin-slots',
      component: () => import('../pages/admin/SlotsPage.vue'),
    },
    {
      path: '/admin/bookings',
      name: 'admin-bookings',
      component: () => import('../pages/admin/BookingsPage.vue'),
    },
  ],
})

export default router
