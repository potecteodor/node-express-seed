import { Request, Response } from 'express'
import { AppSetting, IConfig } from '../../config'
import { Api } from '../../helpers'
import { ICompany } from '../../shared/interfaces/db/company.interface'
import { CompanyDbo } from '../data-layer/dbo/setup/company.dbo'

export class CompanyService {
  /**
   * activate a company account
   *
   */
  static async activate(cId, req: Request, res: Response) {
    // find company
    const comp: ICompany = await CompanyDbo.findOne({ where: { id: cId } })
    const nameDb = 'oldapp_' + comp.subdomain_name.split('.')[0]
    const config: IConfig = AppSetting.getConfig()

    if (comp.status === 'verified') {
      return Api.ok(req, res, 'ok')
    }

    const mysql = require('mysql2/promise')
    mysql
      .createConnection({
        host: config.DBConnections.default.options.host,
        user: config.DBConnections.default.user,
        password: config.DBConnections.default.password,
      })
      .then(connection => {
        connection.query(`DROP DATABASE IF EXISTS ${nameDb}`).then(() => {
          connection.query(`CREATE DATABASE IF NOT EXISTS ${nameDb}`).then(() => {
            // Safe to use sequelize now
            require('mysql-import')
              .config({
                host: config.DBConnections.default.options.host,
                user: config.DBConnections.default.user,
                password: config.DBConnections.default.password,
                database: nameDb,
                onerror: err => {
                  return Api.serverError(req, res, err)
                },
              })
              .import(
                config.appConfig.appPath +
                  config.thirdParty.staticPath +
                  'sql/database.sql'
              )
              .then(() => {
                CompanyDbo.update(
                  {
                    status: 'verified',
                    host: config.DBConnections.default.options.host,
                    db_user: config.DBConnections.default.user,
                    db_pass: config.DBConnections.default.password,
                    database: nameDb,
                  },
                  { where: { id: cId } }
                )
                // create staff and other options
                mysql
                  .createConnection({
                    host: config.DBConnections.default.options.host,
                    user: config.DBConnections.default.user,
                    password: config.DBConnections.default.password,
                    database: nameDb,
                  })
                  .then(conn => {
                    const d = new Date()
                    const t = d.getTime()
                    conn.query(
                      `UPDATE tbloptions SET value='${comp.timezone}' WHERE name='default_timezone'`
                    )
                    conn.query(`UPDATE tbloptions SET value='${t}' WHERE name='di'`)
                    conn.query(
                      `INSERT INTO tblstaff (firstname, lastname, password, email, datecreated, admin, active) VALUES
                        ('${comp.first_name}', '${comp.last_name}', '${comp.password}', '${comp.email}', ` +
                        conn.escape(d) +
                        `, 1, 1)`
                    )
                  })
                Api.ok(req, res, 'ok')
              })
              .catch(err => {
                return Api.serverError(req, res, err)
              })
          })
        })
      })
  }
}
