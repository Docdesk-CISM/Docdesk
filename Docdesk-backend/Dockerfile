FROM node:20-alpine

# Install build dependencies for bcrypt and curl for healthchecks
RUN apk add --no-cache python3 make g++ curl

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

# Ensure the server starts
EXPOSE 5000

CMD ["node", "server.js"]
