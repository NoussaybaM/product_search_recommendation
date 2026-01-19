# FROM node:20
# WORKDIR /app
# COPY . .
# RUN npm install && npm run build
# CMD ["npm", "run","preview","--","--host"]
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
