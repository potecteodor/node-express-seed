import { AppSetting, IConfig } from '../../config'
import Crypt from '../../helpers/crypt'
import MailHelper from '../../helpers/mail-helper'

// minutes
const ACTIVATION_EXPIRATION = 100
const ACTIVATION_EXPIRATION1 = 30
const config: IConfig = AppSetting.getConfig()

export default class AuthMail {
  static sendAdminInvite(email, password) {
    const now = new Date(),
      sav = new Date(now)
    sav.setMinutes(now.getMinutes() + ACTIVATION_EXPIRATION)
    // send registration email
    const link = config.corsDomains[0] + '/#/admin/login'
    const mailOptions = {
      to: email,
      subject: '🕑You are invited to join Acttime !',
      text:
        'You can login with your email and this password:' +
        password +
        '<br />Click on this <a href="' +
        link +
        '">link</a> to login!',
      htmlFile: 'inviteSystem',
      data: {
        title: 'actTime registration',
        header: 'welcome to acttime',
        content:
          'You can login with your email and this password:' +
          password +
          '<br />Click on this <a href="' +
          link +
          '">link</a> to login!',
      },
    }
    MailHelper.send(mailOptions)
  }

  static inviteCompanyToRegister(email, loggedCName, invitedCName) {
    const link = config.corsDomains[0] + '/#/auth/register/' + Crypt.crypt(invitedCName)
    const mailOptions = {
      to: email,
      subject: '🕑 You have been invited to join ActTime !',
      text:
        'Company: ' +
        loggedCName +
        ' has invited you to register to ActTime !<br />Click on this <a href="' +
        link +
        '">link</a> to register !',
      htmlFile: 'verifyCompany',
      data: {
        title: 'ActTime invitation',
        header: 'Welcome to Acttime',
        content:
          'Company: ' +
          loggedCName +
          ' has invited you to register to ActTime !<br />Click on this <a href="' +
          link +
          '">link</a> to register !',
      },
    }
    MailHelper.send(mailOptions)
  }

  static inviteContact(email, id, name) {
    const link = config.corsDomains[0] + '/#/verify/contact/' + id
    const mailOptions = {
      to: email,
      subject: '🕑 You have been invited to join ActTime !',
      text:
        'Company: ' +
        name +
        ' has invited you to verify your data !<br />Click on this <a href="' +
        link +
        '">link</a> to verify your contact data !',
      htmlFile: 'verifyCompany',
      data: {
        title: 'actTime invitation',
        header: 'welcome to acttime',
        content:
          'Company: ' +
          name +
          ' has invited you to verify your data !<br />Click on this <a href="' +
          link +
          '">link</a> to verify your contact data !',
      },
    }
    MailHelper.send(mailOptions)
  }

  static inviteCompany(email, id, name) {
    const link = config.corsDomains[0] + '/#/verify/company/' + id
    const mailOptions = {
      to: email,
      subject: '🕑 You have been invited to join ActTime !',
      text:
        'Company: ' +
        name +
        ' has invited you to ActTime !<br />Click on this <a href="' +
        link +
        '">link</a> to verify your company data !',
      htmlFile: 'verifyCompany',
      data: {
        title: 'actTime invitation',
        header: 'welcome to acttime',
        content:
          'Company: ' +
          name +
          ' has invited you to join ActTime !<br />Click on this <a href="' +
          link +
          '">link</a> to verify your company data !',
      },
    }
    MailHelper.send(mailOptions)
  }

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
   * Invite method for inviting companies/users
   * @param result
   * @param email
   */
  static sendInvite(result, email) {
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
      subject: '🕑You are invited to join Acttime !',
      text:
        'You need to register !<br />Click on this <a href="' +
        link +
        '">link</a> to create your account !',
      htmlFile: 'invite',
      data: {
        title: 'actTime registration',
        header: 'welcome to acttime',
        content:
          'You need to register !<br />Click on this <a href="' +
          link +
          '">link</a> to create your account !',
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
      subject: '🕑(Resend)Activate your actTime account !',
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
