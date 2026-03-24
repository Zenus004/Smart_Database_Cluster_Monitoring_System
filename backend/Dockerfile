FROM node:18-alpine

# Install Docker CLI and Compose Plugin
RUN apk add --no-cache docker-cli docker-cli-compose

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
# For dev, we might override command to "npm run dev" in compose, 
# but "npm start" (node index.js) is good for production.
