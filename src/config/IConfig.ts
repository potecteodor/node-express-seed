export interface IConfig {
  port: number
  uploadConfig: string
  corsDomains: string[]
  appConfig: any
  thirdParty: {
    staticPath: string
  }
  DBConnections: {
    default: {
      debug: {
        query: boolean
        errors: boolean
      }
      user: String
      password: String
      database: String
      i18nDb: string
      options: {
        host: String
        requestTimeout: Number
        dialect: String
        operatorsAliases: boolean
        logging: any
        dialectOptions: {
          encrypt: boolean
        }
        pool: {
          max: Number
          min: Number
          acquire: Number
          idle: Number
        }
      }
    }
  }
  crypt: {
    keySize: Number
    ivSize: Number
    iterations: Number
    hh: String // header key
    udhesaw: String // separator
    ytfasf: String // crypt key
  }
}
