FROM node:20-alpine

WORKDIR /app

RUN apk --no-cache add ffmpeg \
&& yarn global add nodemon concurrently

COPY package.json  ./

RUN yarn install

COPY . .

CMD ["yarn", "run", "dev"]