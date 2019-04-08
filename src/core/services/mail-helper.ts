import { AppSetting, IConfig } from '../../config'

const nodemailer = require('nodemailer')

const fs = require('fs')

export default class MailHelper {
  /**
   * Build html template from data
   *
   * @param template
   * @param data
   */
  public static buildHtml(template, data) {
    if (!template || !data) {
      return null
    }
    const tpl = template || 'index'
    const config: IConfig = AppSetting.getConfig()
    let path = config.appConfig.appPath + 'static/email/' + tpl + '.html'
    var fileData = fs.readFileSync(path, 'utf8', function(err, fileData) {
      if (err) {
        return console.log('read', err)
      }
    })
    for (var x in data) {
      fileData = fileData.replace('[' + x + ']', data[x])
    }
    return fileData
  }

  /**
   * send email from server
   *
   * @param mailOptions
   * @param callback
   */
  public static send(mailOptions, callback = null) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'acttimemailler@gmail.com',
        pass: 'acttimemailler2017',
      },
      tls: {
        rejectUnauthorized: false,
      },
    })
    let mo = {}
    mo['from'] = mailOptions['from'] || '"TaskManager" <acttimemailler@gmail.com>'
    mo['to'] = mailOptions['to']
    mo['subject'] = mailOptions['subject']
    mo['text'] = mailOptions['text'] || ''
    mo['html'] = MailHelper.buildHtml(mailOptions['htmlFile'], mailOptions['data']) || ''
    // send mail with defined transport object
    transporter.sendMail(mo, (error, info) => {
      if (error) {
        return console.log(error)
      }
      if (callback && typeof callback === 'function') {
        callback(info)
      }
    })
  }
}
