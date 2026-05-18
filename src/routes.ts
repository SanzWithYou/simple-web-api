/* eslint-disable @typescript-eslint/no-require-imports */
import fs from 'fs'
import path from 'path'
import { Application, Router } from 'express'
import logger from './logger'

type RouteModule = {
  default: Router
}

export const registerRoutes = async (app: Application): Promise<void> => {
  // Cek apakah file ini dijalankan dari folder dist (production) atau src (development)
  const isCompiled = __filename.endsWith('.js')
  const routesDir = isCompiled
    ? path.join(process.cwd(), 'dist/routes')
    : path.join(process.cwd(), 'src/routes')

  logger.info(`[routes] scanning = ${routesDir}`)

  // Return early if routes directory doesn't exist
  if (!fs.existsSync(routesDir)) {
    logger.warn(`[routes] directory not found: ${routesDir}`)
    return
  }

  // Read all files in the routes directory
  const files = fs.readdirSync(routesDir)
  logger.info(`[routes] total files = ${files.length}`)

  // Filter for route files (files ending with .route.ts, .routes.ts, .route.js, or .routes.js)
  const routeFiles = files.filter((file) => {
    if (isCompiled) {
      return /\.(route|routes)\.js$/.test(file)
    }
    return /\.(route|routes)\.ts$/.test(file)
  })

  // Process each route file
  for (const file of routeFiles) {
    const fullPath = path.join(routesDir, file)

    logger.info(`[routes] loading = ${file}`)

    try {
      // Gunakan require secara konsisten untuk CommonJS
      const mod = require(fullPath) as RouteModule

      // Skip if module doesn't have a default export
      if (!mod?.default) {
        logger.warn(`[routes] missing default export = ${file}`)
        continue
      }

      // Extract route name from filename (remove .route.ts, .routes.ts, etc.)
      const routeName = file.replace(/\.(route|routes)\.(ts|js)$/, '')

      // Mount the route under /api/{routeName}
      app.use(`/api/${routeName}`, mod.default)

      logger.info(`[routes] mounted = /api/${routeName}`)
    } catch (err) {
      // Log error if route loading fails
      logger.error(`[routes] failed = ${file}`, err)
    }
  }

  logger.info(`[routes] registration completed`)
}
