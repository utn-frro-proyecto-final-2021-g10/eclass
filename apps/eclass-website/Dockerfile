FROM node:16 AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json ./
RUN yarn install

# Rebuild the source code only when needed
FROM node:16 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn remove bcrypt
RUN yarn add bcrypt
RUN yarn build

EXPOSE 3000
ENV PORT 3000
ENV NODE_ENV production

# Rebuild the source code only when needed
CMD ["yarn", "start"]
