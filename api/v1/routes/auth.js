import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { User } from '../models/index'

const router = express.Router()

router.post('/login', (req, res) => {
  const { email, password } = req.body

  if (email && password) {
    User.findOne({
      where: {
        email,
      },
    })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            error: 'User not found',
          })
        }
        bcrypt.compare(password, user.password).then((isMatch) => {
          if (isMatch) {
            const payload = {
              id: user.id,
              email: user.email,
            }
            // Sign Token
            jwt.sign(payload, 'secret', { expiresIn: 7200 }, (err, token) => {
              if (err) {
                throw new Error(err)
              }
              res.json({
                token,
              })
            })
          } else {
            return res.status(400).json({
              error: 'Password invalid',
            })
          }
        })
      })
      .catch((err) => {
        throw new Error(err)
      })
  } else {
    return res.status(404).json({ error: 'Email and password required' })
  }
})

router.get('/user', (req, res) => {
  const bearerHeader = req.headers.authorization
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ')
    const token = bearer[1]

    jwt.verify(token, 'secret', (err, data) => {
      if (err) {
        res.json({ user: false })
      } else {
        res.json({ user: { email: data.email } })
      }
    })
  } else {
    res.json({ user: false })
  }
})

export default router
