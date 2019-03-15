import { Environment } from '.'
import { AppSetting } from './app.setting'
import { IConfig } from './IConfig'
const nconf = require('nconf')
const path = require('path')

export class ConfigManager {
  public Config: IConfig
  constructor(pth?: string) {
    let filename

    switch (AppSetting.Env) {
      case Environment.Dev:
      case Environment.Local:
        filename = 'config.dev.json'
        break
      case Environment.Production:
        filename = 'config.prod.json'
        break
      default:
        process.exit()
        break
    }
    nconf.use('memory')
    if (!nconf.get('Config')) {
      this.getFile(filename)
    }
    this.Config = nconf.get('Config')
    if (!this.Config) {
      process.exit()
    }
  }
  public getFile(filename) {
    nconf.file('Config', {
      file: filename,
      dir: './config/',
      search: true,
    })
    if (!nconf.get('Config')) {
      nconf.file('Config', {
        file: 'config/' + filename,
        dir: __dirname,
        search: true,
      })
    }
  }
  public reset() {
    nconf.reset()
    nconf.clear()
  }
}
