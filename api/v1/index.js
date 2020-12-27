import express from 'express'
import reports from './routes/reports'
import users from './routes/users'
import upload from './routes/upload'

const app = express()
app.use(express.json())

app.use('/reports', reports)
app.use('/users', users)
app.use('/upload', upload)

module.exports = app
