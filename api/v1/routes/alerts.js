import express from 'express'
import { Alert } from '../models/index'

const router = express.Router()

router.post('/', (req, res) => {
  const { title, content, startDate, endDate, neighborhoods } = req.body
  Alert.create({
    title,
    content,
    startDate,
    endDate,
    neighborhoods,
  })
    .then((data) => {
      res.status(201).json(data.id)
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
