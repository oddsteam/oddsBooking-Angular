FROM node:16-alpine AS base
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install

FROM base AS builder
ARG environment
COPY . .

RUN apk -U --no-cache \
    --allow-untrusted add \
    zlib-dev \
    chromium \
    xvfb \
    wait4ports \
    xorg-server \
    dbus \
    ttf-freefont \
    mesa-dri-swrast \
    grep \
    udev \
    && apk del --purge --force linux-headers binutils-gold gnupg zlib-dev libc-utils \
    && rm -rf /var/lib/apt/lists/* \
    /var/cache/apk/* \
    /usr/share/man \
    /tmp/* \
    /usr/lib/node_modules/npm/man \
    /usr/lib/node_modules/npm/doc \
    /usr/lib/node_modules/npm/html \
    /usr/lib/node_modules/npm/scripts

WORKDIR /home/dev/code
COPY . .

ENV CHROME_BIN=/usr/bin/chromium-browser
ENV CHROME_PATH=/usr/lib/chromium/
RUN npm run test:ci
RUN npm run build


### STAGE 2: Run ###
FROM nginx:1.13.12-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/dist/odds-booking /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
