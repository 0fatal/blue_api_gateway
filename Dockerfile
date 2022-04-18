FROM node:14 AS build

WORKDIR /app

RUN npm install pnpm -g

COPY . .


RUN pnpm install 

RUN pnpm run build

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