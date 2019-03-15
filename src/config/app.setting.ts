import { cloneDeep } from 'lodash'
import { Environment, IConfig } from '.'
import { ConfigManager } from './config.manager'

export class AppSetting {
  public static Env = Environment.Dev

  public static getConfig(): IConfig {
    let configManager = new ConfigManager()
    return cloneDeep(configManager.Config)
  }
}
