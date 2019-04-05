import { BaseModel } from './base.model'

export class SampleModel extends BaseModel {
  tableName: string = 'sample'

  pkName: string = 'id'

  async resetDb() {
    return super.resetDb().then(conn => {
      return conn.query(`CREATE TABLE sample (
        id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name mediumtext NOT NULL,
        description mediumtext NOT NULL
      ) ENGINE=MyISAM DEFAULT CHARSET=utf8;`)
    })
  }
}
