import express from 'express'
import jwt from 'jsonwebtoken'
import { Report, Comment } from '../models/index'

const router = express.Router()

router.get('/', (req, res) => {
  Report.findAll({
    limit: 100,
  })
    .then((reports) => {
      res.json(reports)
    })
    .catch((err) => {
      throw new Error(err)
    })
})

router.post('/', (req, res) => {
  const {
    reportTypeId,
    email,
    streetNumber,
    streetName,
    zipCode,
    neighborhood,
    lat,
    lng,
    location,
    images,
    status,
    description,
  } = req.body

  Report.create({
    reportTypeId,
    email,
    streetNumber,
    streetName,
    zipCode,
    neighborhood,
    lat,
    lng,
    location,
    images,
    status,
    description,
  })
    .then((data) => {
      res.status(201).json(data.id)
    })
    .catch((err) => {
      throw new Error(err)
    })
})

router.get('/:reportId/', (req, res) => {
  const { reportId } = req.params

  Report.findByPk(reportId)
    .then((report) => {
      res.json(report)
    })
    .catch((err) => {
      throw new Error(err)
    })
})

router.post('/comment', (req, res) => {
  const bearerHeader = req.headers.authorization
  const bearer = bearerHeader.split(' ')
  const token = bearer[1]

  jwt.verify(token, 'secret', (err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'Must be logged in to perform this action',
      })
    } else {
      const { id } = data
      const { content, reportId } = req.body

      Comment.create({ userId: id, content, reportId })
        .then((data) => {
          res.status(201).json(data)
        })
        .catch((err) => {
          throw new Error(err)
        })
    }
  })
})

export default router
