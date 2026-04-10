FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --omit=dev
COPY . .
ENV NODE_ENV=production
CMD ["node", "src/index.js"]
