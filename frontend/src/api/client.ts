import ky from 'ky'
import { config } from './config'

export const api = ky.create({
  prefix: config.apiBaseUrl,
  timeout: 10_000,
})
