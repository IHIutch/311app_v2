import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendMail } from '../functions'
import { User, Report } from '../models/index'

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

router.get('/account', (req, res) => {
  // const { email } = req.body
  const bearerHeader = req.headers.authorization
  const bearer = bearerHeader.split(' ')
  const token = bearer[1]

  jwt.verify(token, 'secret', (err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'Must be logged in to see this information',
      })
    } else {
      const { id, email } = data
      const user = User.findOne({
        where: {
          id,
        },
        attributes: [
          'id',
          'firstName',
          'lastName',
          'email',
          'neighborhood',
          'type',
        ],
      })
      const reports = Report.findAll({ where: { email } })
      Promise.all([user, reports])
        .then((data) => {
          res.json({ user: data[0], reports: data[1] })
        })
        .catch((err) => {
          throw new Error(err)
        })
    }
  })
})

export default router
