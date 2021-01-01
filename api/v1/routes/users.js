import express from 'express'
import bcrypt from 'bcryptjs'
import { sendMail } from '../functions'
import { User } from '../models/index'

const router = express.Router()

router.post('/', (req, res) => {
  const { email, password, neighborhood, type } = req.body

  if (email && password) {
    User.findOne({
      where: {
        email,
      },
    })
      .then((user) => {
        if (user) {
          return res.status(404).json({ error: 'That email already exists' })
        } else {
          bcrypt.genSalt(10, (err, salt) => {
            if (err) {
              throw new Error(err)
            }
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) {
                throw new Error(err)
              }
              User.create({
                email,
                password: hash,
                neighborhood,
                type,
              }).then((user) => {
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
            })
          })
        }
      })
      .catch((err) => {
        throw new Error(err)
      })
  } else {
    return res.status(404).json({ error: 'Email and password required' })
  }
})

export default router
