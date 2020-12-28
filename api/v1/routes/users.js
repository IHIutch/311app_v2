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
        template: 'welcome',
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
