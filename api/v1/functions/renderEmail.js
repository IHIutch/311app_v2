import FS from 'fs'
import VUE from 'vue'
import mjml2html from 'mjml'
import { htmlToText } from 'html-to-text'
import { createRenderer } from 'vue-server-renderer'

export default function renderEmail(templateName, templateData) {
  return new Promise((resolve, reject) => {
    const filePath = `./emails/templates/${templateName}.mjml`
    try {
      if (FS.existsSync(filePath)) {
        const app = new VUE({
          data: templateData,
          template: FS.readFileSync(filePath, 'utf-8'),
        })
        createRenderer().renderToString(app, (err, vueRender) => {
          if (err) {
            reject(new Error(`Error at Vue compiler: ${err}`))
          } else {
            const { html } = mjml2html(vueRender)
            const text = htmlToText(html)
            if (html && text) {
              resolve({
                text,
                html,
              })
            } else {
              reject(err)
            }
          }
        })
      } else {
        reject(
          new Error(`Could not find template: ./templates/${templateName}.mjml`)
        )
      }
    } catch (err) {
      reject(err)
    }
  })
}
