import express from 'express'
import { Report } from '../models/index'

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

router.get('/:reportId/', (req, res) => {
  const reportId = req.params.reportId

  Report.findByPk(reportId)
    .then((report) => {
      res.json(report)
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

export default router
