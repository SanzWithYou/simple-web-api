import 'dotenv/config'

const requiredVars = [
  'PORT',
  'DATABASE_URL',
  'DIRECT_URL',
  'ACCESS_TOKEN_SECRET',
  'ACCESS_TOKEN_PUBLIC',
  'REFRESH_TOKEN_SECRET',
  'REFRESH_TOKEN_PUBLIC'
]

const missing = requiredVars.filter((v) => !process.env[v])
if (missing.length > 0) {
  throw new Error(`Missing required env vars: ${missing.join(', ')}`)
}

export const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV as 'development' | 'production',
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  logLevel: process.env.LOG_LEVEL || 'info',

  accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC!,
  accessTokenSecretKey: process.env.ACCESS_TOKEN_SECRET!,
  refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC!,
  refreshTokenSecretKey: process.env.REFRESH_TOKEN_SECRET!,

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || 'app',
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    databaseUrl: process.env.DATABASE_URL,
    databaseDirectUrl: process.env.DIRECT_URL
  },

  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: process.env.CORS_METHODS || 'GET,POST,PUT,PATCH,DELETE'
  }
} as const

console.log(`
╔═══════════════════════════════════════════════════╗
║           ENVIRONMENT CONFIGURATION               ║
╠═══════════════════════════════════════════════════╣
║ Environment:  ${env.nodeEnv.toUpperCase().padEnd(36)}║
║ Port:         ${env.port.toString().padEnd(36)}║
║ Log Level:    ${env.logLevel.padEnd(36)}║
║ CORS Origin:  ${env.cors.origin.padEnd(36)}║
║ DB Host:      ${env.db.host.padEnd(36)}║
║ DB Port:      ${env.db.port.toString().padEnd(36)}║
║ DB Name:      ${env.db.name.padEnd(36)}║
║ DB URL:       ${env.db.databaseUrl ? 'connected'.padEnd(36) : 'not set'.padEnd(36)}║
║ API URL:      ${env.apiUrl.padEnd(36)}║
╚═══════════════════════════════════════════════════╝
`)
