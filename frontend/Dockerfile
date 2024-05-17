FROM node:18.20.2

WORKDIR /app

COPY package*.json ./

RUN rm package-lock.json

RUN /usr/local/bin/npm install --legacy-peer-deps

COPY . .

RUN /usr/local/bin/npm run build

CMD ["/usr/local/bin/npm", "run", "dev"]

