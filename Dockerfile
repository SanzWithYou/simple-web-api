FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json tsconfig.build.json ./
COPY src ./src
COPY prisma ./prisma
COPY scripts ./scripts
COPY prisma.config.ts ./

RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app

RUN addgroup --system app && adduser --system --ingroup app app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY tsconfig.build.json ./
COPY prisma ./prisma
COPY --from=build /app/dist ./dist

RUN npx prisma generate

USER app

EXPOSE 3000

CMD ["node", "dist/index.js"]
