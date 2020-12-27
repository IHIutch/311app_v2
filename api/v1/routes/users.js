import express from 'express'
import sgMail from '@sendgrid/mail'
import { User } from '../models/index'

const router = express.Router()
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

router.post('/', (req, res) => {
  const { email, password } = req.body
  User.create({
    email,
    password,
  })
    .then((data) => {
      const msg = {
        to: data.email,
        from: 'jbhutch01+311@gmail.com', // Use the email address or domain you verified above
        subject: 'Sending with Twilio SendGrid is Fun',
        text: 'This is a test',
        html: '<strong>This is a test</strong>',
      }
      sgMail.send(msg).then(
        () => {
          res.status(201).json(data.id)
        },
        (err) => {
          console.error(err)
          if (err.response) {
            console.error(err.response.body)
          }
        }
      )
    })
    .catch((err) => console.log(err))
})

export default router
