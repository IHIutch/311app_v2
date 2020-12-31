import sgMail from '@sendgrid/mail'
import { renderEmail } from '../functions'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const from = 'jbhutch01+311@gmail.com'

export default function sendMail({
  to = [],
  template,
  meta = {
    title: '',
    subject: '',
    preview: '',
  },
  data,
}) {
  return new Promise((resolve, reject) => {
    renderEmail(template, {
      metaTitle: meta.title,
      metaPreview: meta.preview,
      ...data,
    })
      .then(
        ({ text, html }) => {
          sgMail
            .sendMultiple({
              to,
              from,
              subject: meta.subject,
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
