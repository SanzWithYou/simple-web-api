import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import type { Application, Router } from 'express'
import logger from './logger'

type RouteModule = { default: Router }

const isProd = process.env.NODE_ENV === 'production'

export const registerRoutes = async (app: Application) => {
  const routesDir = path.join(process.cwd(), isProd ? 'dist/routes' : 'src/routes')

  if (!fs.existsSync(routesDir)) {
    logger.warn(`[routes] directory not found: ${routesDir}`)
    return
  }

  const files = fs.readdirSync(routesDir)
  const routeFiles = files.filter((file) => /\.(route|routes)\.(ts|js)$/.test(file))

  for (const file of routeFiles) {
    const fullPath = path.join(routesDir, file)

    try {
      const mod = isProd
        ? // eslint-disable-next-line @typescript-eslint/no-require-imports
          (require(fullPath) as RouteModule)
        : ((await import(pathToFileURL(fullPath).href)) as RouteModule)

      if (!mod?.default) {
        logger.warn(`[routes] missing default export: ${file}`)
        continue
      }

      const routeName = file.replace(/\.(route|routes)\.(ts|js)$/, '')
      app.use(`/api/${routeName}`, mod.default)

      logger.info(`[routes] mounted /api/${routeName}`)
    } catch (err) {
      logger.error(`[routes] failed to load ${file}`, err)
    }
  }

  logger.info('[routes] registration completed')
}
