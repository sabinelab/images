FROM oven/bun:1.3.4-alpine

WORKDIR /app

COPY package.json bun.lock /app/
COPY . .

RUN bun i --frozen-lockfile
RUN bun compile
RUN rm -rf output && mkdir output
RUN bun generate

CMD ["bun", "start"]