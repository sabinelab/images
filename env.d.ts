declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number
      HOST: string
      API_URL: string
    }
  }
}

export {}
