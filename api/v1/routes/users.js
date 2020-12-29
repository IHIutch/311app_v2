import express from 'express'
import { sendMail } from '../functions'
import { User } from '../models/index'

const router = express.Router()

router.post('/', (req, res) => {
  const { email, password, neighborhood, type } = req.body
  User.create({
    email,
    password,
    neighborhood,
    type,
  })
    .then((data) => {
      sendMail({
        to: data.email,
        template: 'registration-success',
        title: 'Welcome to Buffalo 311',
        preview: '',
        subject: 'Welcome to Buffalo 311',
        data,
      })
        .then(() => {
          res.status(201).json(data.id)
        })
        .catch((err) => {
          throw new Error(err)
        })
    })
    .catch((err) => {
      throw new Error(err)
    })
})

export default router
