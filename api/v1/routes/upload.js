import express from 'express'
import * as AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET } = process.env

AWS.config.update({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
  region: 'us-east-2',
})

const s3 = new AWS.S3()

router.get('/', (req, res) => {
  s3.createPresignedPost(
    {
      Bucket: S3_BUCKET,
      Fields: {
        success_action_status: '200',
        key: `uploads/${uuidv4()}`,
      },
      Conditions: [
        ['starts-with', '$key', 'uploads/'],
        ['starts-with', '$Content-Type', 'image/'],
      ],
      Expires: 60,
    },
    (err, data) => {
      if (err) {
        res.status(500).json(err)
      } else {
        res.status(200).json(data)
      }
    }
  )
})

export default router
