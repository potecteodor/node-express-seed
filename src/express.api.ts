import { json, urlencoded } from 'body-parser'
import * as compression from 'compression'
import * as express from 'express'
import { NextFunction, Request, Response } from 'express'
import * as http from 'http'
import { ApiRouting } from './api.routing'
import AuthService from './app/services/auth.service'
import { AppSetting, IConfig } from './config'
import { Api } from './core/services/api'

export class ExpressApi {
  public app: express.Express
  private router: express.Router
  private config: IConfig

  constructor() {
    this.app = express()
    this.router = express.Router()
    this.config = AppSetting.getConfig()
    this.configure()
  }

  private configure() {
    this.configureMiddleware()
    this.configureBaseRoute()
    this.configureRoutes()
    this.errorHandler()
  }

  private configureMiddleware() {
    this.app.use(json({ limit: '50mb' }))
    this.app.use(compression())
    this.app.use(urlencoded({ limit: '50mb', extended: true }))
    if (this.config.corsDomains.length > 0) {
      this.app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*') // this.config.corsDomains[0]
        //  res.setHeader('Access-Control-Allow-Origin', this.config.corsDomains[1])
        res.setHeader(
          'Access-Control-Allow-Methods',
          'GET, POST, OPTIONS, PUT, PATCH, DELETE'
        )
        res.setHeader(
          'Access-Control-Allow-Headers',
          'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With' +
            ',' +
            this.config.crypt.hh
        )
        res.setHeader('Access-Control-Allow-Credentials', 'true')
        next()
      })

      this.app.disable('x-powered-by')
      // check login hash
      this.app.all('/*', AuthService.checkHeader)
    }
  }

  private configureBaseRoute() {
    this.app.use(function(req, res, next) {
      let config = AppSetting.getConfig()
      if (req.url === '/') {
        return res.json(config.appConfig)
      } else {
        next()
      }
    })
    this.app.use('/', this.router)
  }

  private configureRoutes() {
    this.app.use(function(req: Request, res: Response, next: NextFunction) {
      for (let key in req.query) {
        if (key) {
          req.query[key.toLowerCase()] = req.query[key]
        }
      }
      next()
    })
    ApiRouting.ConfigureRouters(this.app)
  }

  private errorHandler() {
    this.app.use(function(err, req, res, next) {
      if (req.body) {
        console.error(req.body)
      }
      console.error(err)
      Api.serverError(req, res, err)
    })

    // catch 404 and forward to error handler
    this.app.use(function(req, res) {
      Api.notFound(req, res)
    })
  }

  public run() {
    let server = http.createServer(this.app)
    server.listen(this.config.port)
    server.on('error', this.onError)
    return server
  }

  private onError(error) {
    let port = this.config.port
    if (error.syscall !== 'listen') {
      throw error
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges')
        process.exit(1)
        break
      case 'EADDRINUSE':
        console.error(bind + ' is already in use')
        process.exit(1)
        break
      default:
        throw error
    }
  }
}
