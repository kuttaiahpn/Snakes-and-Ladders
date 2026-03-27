# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Declare build-time args for Vite env injection
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_FIREBASE_MEASUREMENT_ID
ARG VITE_GEMINI_API_KEY

# Expose them as env vars so Vite can inline them at build time
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID
ENV VITE_FIREBASE_MEASUREMENT_ID=$VITE_FIREBASE_MEASUREMENT_ID
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vite application (env vars are now available for import.meta.env)
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the built assets from the build stage to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

RUN mkdir -p /etc/nginx/templates && echo 'server { listen ${PORT}; location / { root /usr/share/nginx/html; index index.html index.htm; try_files $uri $uri/ /index.html; } }' > /etc/nginx/templates/default.conf.template

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
