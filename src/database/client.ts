import { env } from '@/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const adapter = new PrismaPg({ connectionString: env.db.databaseUrl })
export const client = new PrismaClient({ adapter })
