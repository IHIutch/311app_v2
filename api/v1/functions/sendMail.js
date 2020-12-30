import sgMail from '@sendgrid/mail'
import { renderEmail } from '../functions'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const from = 'jbhutch01+311@gmail.com'

export default function sendMail({ to, template, subject, data }) {
  return new Promise((resolve, reject) => {
    renderEmail(template, { email: data.email })
      .then(
        ({ text, html }) => {
          sgMail
            .send({
              to,
              from,
              subject,
              text,
              html,
            })
            .then(
              () => {
                resolve()
              },
              (err) => {
                reject(err)
              }
            )
        },
        (err) => {
          reject(err)
        }
      )
      .catch((err) => reject(err))
  })
}