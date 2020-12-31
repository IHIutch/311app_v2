import express from 'express'
import { Op } from 'sequelize'
import { sendMail } from '../functions'
import { Alert, User } from '../models/index'

const router = express.Router()

router.post('/', (req, res) => {
  const {
    title,
    content,
    startDate,
    endDate,
    neighborhoods,
    status,
    sendNotification,
  } = req.body
  Alert.create({
    title,
    content,
    startDate,
    endDate,
    neighborhoods,
    status,
  })
    .then((alert) => {
      if (sendNotification) {
        User.findAll({
          where: {
            neighborhood: neighborhoods,
          },
        })
          .then((users) => {
            const userEmails = users.map((user) => user.email)
            sendMail({
              to: userEmails,
              template: 'alert',
              meta: {
                title: 'New Alert',
                subject: title,
                preview: '',
              },
              data: {
                title: alert.title,
                content: alert.content,
                alertLink: `/alerts/${alert.id}`,
              },
            })
              .then(() => {
                res.status(201).json(alert.id)
              })
              .catch((err) => {
                throw new Error(err)
              })
          })
          .catch((err) => {
            throw new Error(err)
          })
      } else {
        res.status(201).json(alert.id)
      }
    })
    .catch((err) => {
      throw new Error(err)
    })
})

router.get('/', (req, res) => {
  Alert.findAll()
    .then((data) => {
      res.json(data)
    })
    .catch((err) => {
      throw new Error(err)
    })
})

router.get('/:alertId/', (req, res) => {
  const alertId = req.params.alertId

  Alert.findByPk(alertId)
    .then((data) => {
      res.json(data)
    })
    .catch((err) => {
      throw new Error(err)
    })
})

export default router
