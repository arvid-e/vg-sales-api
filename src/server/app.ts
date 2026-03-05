import express from 'express'
import router from './routes/router.js'

export const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(router)

app.get('/', (req, res) => {
  res.json({
    message: 'API loaded successfully.',
    status: 'ok',
  })
})
