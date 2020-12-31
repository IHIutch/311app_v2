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
    .then((user) => {
      sendMail({
        to: [user.email],
        template: 'registration-success',
        meta: {
          title: 'Welcome to Buffalo 311',
          preview: '',
          subject: 'Welcome to Buffalo 311',
        },
        data: {
          email: user.email,
        },
      })
        .then(() => {
          res.status(201).json(user.id)
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
