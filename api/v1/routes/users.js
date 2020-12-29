import express from 'express'
import { sendMail } from '../functions'
import { userType } from '../../../constants'
import { User } from '../models/index'

const router = express.Router()

router.post('/', (req, res) => {
  const { email, password } = req.body
  User.create({
    email,
    password,
    type: userType.USER,
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
