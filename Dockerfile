FROM oven/bun:1.3.14-alpine

WORKDIR /app

COPY package.json bun.lock ./
COPY .npmrc ./

RUN --mount=type=secret,id=env,target=/app/.env \
    export GITHUB_AUTH_TOKEN=$(grep GITHUB_AUTH_TOKEN /app/.env | cut -d '=' -f2) && \
    bun ci

COPY . .

RUN bun run build
RUN rm -rf output && mkdir output
RUN bun generate

CMD ["bun", "start"]
