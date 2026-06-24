export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string ?? 'http://localhost:3001',
  ownerSlug: import.meta.env.VITE_OWNER_SLUG as string ?? 'owner',
}
