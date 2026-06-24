FROM node:22-alpine AS frontend-builder

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json frontend/.npmrc ./frontend/
RUN npm ci --prefix frontend

COPY frontend/ ./frontend/

ARG VITE_API_BASE_URL=""
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build --prefix frontend

FROM node:22-alpine AS runner

WORKDIR /app

COPY backend/package.json backend/package-lock.json ./backend/
RUN npm ci --prefix backend

COPY backend/ ./backend/

COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

CMD ["npm", "run", "start"]
