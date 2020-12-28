import FS from 'fs'
import VUE from 'vue'
import mjml2html from 'mjml'
import { htmlToText } from 'html-to-text'
import { createRenderer } from 'vue-server-renderer'

export default function renderEmail(templateName, data) {
  return new Promise((resolve, reject) => {
    const filePath = `./emails/templates/${templateName}.mjml`
    try {
      if (FS.existsSync(filePath)) {
        const app = new VUE({
          data,
          template: FS.readFileSync(filePath, 'utf-8'),
        })
        createRenderer().renderToString(app, (err, vueRender) => {
          if (err) {
            reject(new Error(`Error at Vue compiler: ${err}`))
          } else {
            const htmlOutput = mjml2html(vueRender).html
            const textOutput = htmlToText(htmlOutput)
            if (htmlOutput && textOutput) {
              resolve({
                text: textOutput,
                html: htmlOutput,
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
