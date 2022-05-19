FROM node:16 AS base
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install

FROM base AS builder
ARG environment
COPY . .

# RUN apk add -y wget
# RUN wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
# RUN apk add ./google-chrome-stable_current_amd64.deb

# RUN npm run test:ci
RUN npm run build


### STAGE 2: Run ###
FROM nginx:1.13.12-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/dist/odds-booking /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
