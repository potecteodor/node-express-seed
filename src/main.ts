import { AppSetting } from './config'
import { ExpressApi } from './express.api'

let api = new ExpressApi()

api.run()
console.log(`listening on ${AppSetting.getConfig().port}`)

let app = api.app
export { app }
