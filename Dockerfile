# Use the official Node.js LTS (Long Term Support) image as the base image
FROM node:lts-bookworm-slim AS frontend-build

# Copy the client directory into the build context
COPY ./client /frontend

WORKDIR /frontend

# Install frontend dependencies and build
RUN npm install
RUN npm run build


FROM node:lts-bookworm-slim AS server-build

WORKDIR /app

# Copy the server directory into the build context
COPY ./server /app

RUN npm install

# Copy the built frontend files
COPY --from=frontend-build /frontend/dist /app/dist

RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

CMD ["node", "dist/server.js"]