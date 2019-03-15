import { AppSetting, IConfig } from '../../config'
import Crypt from '../../helpers/crypt'
import MailHelper from '../../helpers/mail-helper'

// minutes
const ACTIVATION_EXPIRATION = 100
const ACTIVATION_EXPIRATION1 = 30
const config: IConfig = AppSetting.getConfig()

export default class AuthMail {
  /* Reset Password */
  static resetPasswordMail(email) {
    const now = new Date(),
      sav = new Date(now)
    sav.setMinutes(now.getMinutes() + ACTIVATION_EXPIRATION1)
    const k = Crypt.crypt({
      key: email,
      exp: sav.getTime(),
    })
    const link = config.corsDomains[0] + '/#/auth/password-reset/' + k
    const mailOptions = {
      to: email,
      subject: '🕑Reset Password',
      text: 'Click on this <a href="' + link + '">link</a> to reset your password!',
      htmlFile: 'resetPassword',
      data: {
        title: 'Reset Password',
        header: 'New Password',
        content: 'Click on this <a href="' + link + '">link</a> to reset your password!',
      },
    }
    MailHelper.send(mailOptions)
  }

  /**
   * Invite method for register without invite
   *
   * @param result
   * @param email
   */
  static sendActivationEmail(result, email) {
    const now = new Date(),
      sav = new Date(now)
    sav.setMinutes(now.getMinutes() + ACTIVATION_EXPIRATION)
    const k = Crypt.crypt({
      key: result.get('id'),
      exp: sav.getTime(),
    })
    // send registration email
    const link = config.corsDomains[0] + '/#/auth/activate/' + k

    const mailOptions = {
      to: email,
      subject: 'Activate your actTime account !',
      text:
        'Your account is now created !<br />Click on this <a href="' +
        link +
        '">link</a> to activate your account !',
      htmlFile: 'sendActivation',
      data: {
        title: 'actTime registration',
        header: 'welcome to acttime',
        content:
          'Your account is now created !<br />Click on this <a href="' +
          link +
          '">link</a> to activate your account !',
      },
    }
    MailHelper.send(mailOptions)
  }

  /**
   * Invite method for register without invite
   *
   * @param result
   * @param email
   */
  static resendActivationEmail(result, email) {
    const now = new Date(),
      sav = new Date(now)
    sav.setMinutes(now.getMinutes() + ACTIVATION_EXPIRATION)
    const k = Crypt.crypt({
      key: result.get('id'),
      exp: sav.getTime(),
    })
    // send registration email
    const link = config.corsDomains[0] + '/#/auth/activate/' + k

    const mailOptions = {
      to: email,
      subject: '(Resend)Activate your actTime account !',
      text:
        'Your account is now created !<br />Click on this <a href="' +
        link +
        '">link</a> to activate your account !',
      htmlFile: 'resendActivation',
      data: {
        title: 'actTime registration',
        header: 'welcome to acttime',
        content:
          'Your account is now created !<br />Click on this <a href="' +
          link +
          '">link</a> to activate your account !',
      },
    }
    MailHelper.send(mailOptions)
  }
}
