import { AppSetting, IConfig } from '../../../config'
import Crypt from '../../../core/services/crypt'
import MailHelper from '../../../core/services/mail-helper'

// minutes
const ACTIVATION_EXPIRATION = 100
const ACTIVATION_EXPIRATION1 = 30
const config: IConfig = AppSetting.getConfig()

export default class AuthMail {
  /* Reset Password */
  static resetPasswordMail(email) {
    const k = Crypt.crypt({
      key: email,
    })
    const link = config.corsDomains[0] + '/#/auth/reset-password/' + k
    const mailOptions = {
      to: email,
      subject: '[Reset Password]',
      text: 'Click on this <a href="' + link + '">link</a> to reset your password!',
      htmlFile: 'resetPassword',
      data: {
        title: 'Reset Password for TaskManager Account',
        header: 'New Password',
        content: 'Click on this <a href="' + link + '">link</a> to reset your password!',
      },
    }
    MailHelper.send(mailOptions)
  }

  /**
   * email activation after register
   *
   * @param result
   * @param email
   */
  static sendActivationEmail(id, email) {
    const k = Crypt.crypt({ key: id })
    const link = config.corsDomains[0] + '/#/auth/activate/' + k

    const mailOptions = {
      to: email,
      subject: '[Email Activation]!',
      text:
        'Your account is now created !<br />Click on this <a href="' +
        link +
        '">link</a> to activate your account !',
      htmlFile: 'sendActivation',
      data: {
        title: 'ProjectManager Account Activation',
        header: 'Register to ProjectManager',
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

  /**
   * Invite method for register without invite
   *
   * @param result
   * @param email
   */
  static sendInvitation(email, from) {
    // send registration email
    const link = config.corsDomains[0] + '/#/auth/register/'

    const mailOptions = {
      to: email,
      subject: 'Invited to TaskManager!',
      text:
        from.display_name +
        ' (' +
        from.email +
        ') has invited you!<br/>' +
        'Click on this <a href="' +
        link +
        '">link</a> to register!',
      htmlFile: 'resendActivation',
      data: {
        title: 'TaskManager registration',
        header: 'Invited to TaskManager!',
        content:
          from.display_name +
          ' (' +
          from.email +
          ') has invited you!<br/>' +
          'Click on this <a href="' +
          link +
          '">link</a> to register!',
      },
    }
    MailHelper.send(mailOptions)
  }
}
