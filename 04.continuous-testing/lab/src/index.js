const express = require('express')
const userRouter = require('./routes/user')
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const path = require('path')

const app = express()
const port = process.env.PORT || 3000

const db = require('./dbClient')
db.on("error", (err) => {
  console.error(err)
})

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'A simple Express User API with Redis',
      contact: {
        name: 'ECE DevOps'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      }
    ],
    tags: [
      {
        name: 'User',
        description: 'User management endpoints'
      }
    ]
  },
  apis: [path.join(__dirname, './routes/*.js')]
}

const swaggerDocs = swaggerJsdoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))

app.use('/user', userRouter)

const server = app.listen(port, (err) => {
  if (err) throw err
  console.log("Server listening the port " + port)
  console.log("Swagger docs available at http://localhost:" + port + "/api-docs")
})

module.exports = server
