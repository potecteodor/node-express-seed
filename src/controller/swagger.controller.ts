import { Express } from 'express'
import { SAMPLE_DOC } from '../swagger-docs'
const swaggerUi = require('swagger-ui-express')

export class SwaggerController {
  public static configure(app: Express) {
    app.use('/swagger/sample', swaggerUi.serve, swaggerUi.setup(SAMPLE_DOC))
  }
}
