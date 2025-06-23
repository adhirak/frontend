# Use official Node.js image to build the app
FROM node:20 as build

# Create app directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app source code
COPY . .

# Build the React app
RUN npm run build

# Use Nginx to serve the build
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
