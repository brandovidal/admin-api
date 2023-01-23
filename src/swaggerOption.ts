export const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mongo API',
      version: '1.0.0',
      description: 'A simple Express API'
    },
    servers: [
      {
        url: 'http://localhost:5000'
      }
    ]
  },
  apis: ['./src/routes/*.ts']
}
