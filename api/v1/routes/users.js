import express from 'express'
import sgMail from '@sendgrid/mail'
import renderEmail from '../../../emails'
import { User } from '../models/index'

const sentry = process.sentry
const router = express.Router()
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

router.post('/', (req, res) => {
  const { email, password } = req.body
  User.create({
    email,
    password,
  })
    .then((data) => {
      renderEmail('welcome', { email })
        .then(({ text, html }) => {
          const msg = {
            to: data.email,
            from: 'jbhutch01+311@gmail.com', // Use the email address or domain you verified above
            subject: 'Sending with Twilio SendGrid is Fun',
            text,
            html,
          }
          sgMail.send(msg).then(
            () => {
              res.status(201).json(data.id)
            },
            (err) => {
              sentry.captureException(err)
            }
          )
        })
        .catch((err) => sentry.captureException(err))
    })
    .catch((err) => sentry.captureException(err))
})

export default router
