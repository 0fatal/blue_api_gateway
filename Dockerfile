FROM node:14 AS build

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

FROM node:14-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/bootstrap.js ./
COPY --from=build /app/package.json ./

RUN apk add --no-cache tzdata

ENV TZ="Asia/Shanghai"

RUN npm install --production

EXPOSE 7001

CMD ["npm", "run", "online"]