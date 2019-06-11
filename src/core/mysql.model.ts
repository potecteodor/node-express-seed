import { AppSetting, IConfig } from '../config'

const mysql = require('mysql2')

export let dbConnection = null

/**
 * @author Florin Ancuta
 * @email florin@doitdev.ro
 * @create date 2019-03-13 14:24:32
 * @modify date 2019-03-13 14:24:32
 * @desc [description]
 */
export abstract class MysqlModel<T> {
  /**
   * table name
   */
  abstract tableName = '' // model name: eg: table

  /**
   * primary key name
   */
  abstract pkName = ''

  private _connection = null

  private _dbName: string = null

  private _lastResult: any

  constructor(dbName: string = null) {
    this._dbName = dbName
  }

  /**
   * basic connect function
   */
  async connect() {
    if (!dbConnection || dbConnection.connection._closing) {
      try {
        console.log('starting SQL connection...')
        const config: IConfig = AppSetting.getConfig()
        const pool = mysql.createConnection({
          host: config.DBConnections.default.options.host,
          user: config.DBConnections.default.user,
          password: config.DBConnections.default.password,
          database: this._dbName || config.DBConnections.default.database,
          connectionLimit: 10,
          waitForConnections: true,
          queueLimit: 0,
        })
        dbConnection = await pool.promise()
        return dbConnection
      } catch (error) {
        return console.log(`Could not connect - ${error}`)
      }
    }
    return dbConnection
  }

  get connection() {
    return dbConnection
  }

  get lastResult() {
    return this._lastResult
  }

  /**
   * recreate database
   */
  async resetDb() {
    const config: IConfig = AppSetting.getConfig()
    const conn = await this.connect()
    await conn.query(`DROP DATABASE IF EXISTS ${config.DBConnections.default.database}`)
    await conn.query(
      `CREATE DATABASE IF NOT EXISTS ${config.DBConnections.default.database}`
    )
    await conn.query(`USE ${config.DBConnections.default.database}`)
    return this.connection
  }

  /**
   * Execute a query string
   * @param String the query
   * @return void
   */
  async executeQuery(sql: string, withResult = false): Promise<any> {
    const conn = await this.connect()
    if (withResult) {
      return new Promise((resolve, reject) => {
        console.log('sql', sql)
        conn.query(sql).then(result => resolve(result[0]), error => reject(error))
      })
    } else {
      return await conn.query(sql)
    }
  }

  /**
   * Delete records from the database
   * @param String the table to remove rows from
   * @param String the condition for which rows are to be removed
   * @param int the number of rows to be removed
   * @return void
   */
  public async deleteRecords(condition, limit: number = null) {
    const withLimit = limit > 0 ? ' LIMIT ' + limit : ''
    const sql = `DELETE FROM ${this.tableName} WHERE ${condition} ${withLimit}`
    return await this.executeQuery(sql, true)
  }

  /**
   * Delete records from the database
   * @param String the table to remove rows from
   * @param String the condition for which rows are to be removed
   * @param int the number of rows to be removed
   * @return void
   */
  public async deleteByPk(pk) {
    const condition = ` ${this.pkName} = ${pk} `
    return await this.deleteRecords(condition, 1)
  }

  /**
   * Update records in the database
   * @param String the table
   * @param array of changes field => value
   * @param String the condition
   * @return bool
   */
  public async updateRecords(changes, condition): Promise<T> {
    const table = this.tableName
    let update = 'UPDATE `' + table + '` SET '
    for (let field in changes) {
      let value = changes[field]
      switch (typeof value) {
        case 'string':
          update += '`' + field + "`='" + this.addslashes(value) + "',"
          break
        default:
          update += '`' + field + '`=' + value + ','
          break
      }
    }
    // remove our trailing ,
    update = update.slice(0, update.length - 1)
    if (condition !== '') {
      update += ' WHERE ' + condition
    }
    return new Promise<T>((resolve, reject) => {
      this.executeQuery(update, true).then((data: T) => resolve(data), err => reject(err))
    })
  }

  /**
   * simple insert in database
   */
  public async insertSimple(data: T): Promise<T> {
    let fields = ''
    let values = ''
    for (let f in data) {
      let v = data[f]
      fields += '`' + f + '`,'
      switch (typeof v) {
        case 'string':
          values += "'" + this.addslashes(v) + "',"
          break
        default:
          values += v + ','
          break
      }
    }
    //	remove our trailing ,
    fields = fields.slice(0, fields.length - 1)
    //	remove our trailing ,
    values = values.slice(0, values.length - 1)
    const insert =
      'INSERT INTO `' + this.tableName + '` (' + fields + ') VALUES (' + values + ')'
    return new Promise<T>((resolve, reject) => {
      this.executeQuery(insert, true).then(
        d => {
          this.getById(d.insertId).then((data: T) => resolve(data), err => reject(err))
        },
        err => {
          return reject({ type: 'DB Error', body: err })
        }
      )
    })
  }

  /**
   * get all from table
   */
  public async getAll() {
    const sql = `SELECT * FROM ${this.tableName}`
    return await this.executeQuery(sql, true)
  }

  /**
   * get row by id
   *
   * @param id
   */
  public async getById(id: any): Promise<T> {
    const sql = `SELECT * FROM ${this.tableName} WHERE ${this.pkName} = ${id} LIMIT 1`
    return new Promise<T>((resolve, reject) => {
      this.executeQuery(sql, true).then(result => resolve(result[0]), err => reject(err))
    })
  }

  /**
   *
   * @param where
   */
  public async getAllByWhere(where) {
    const sql = `SELECT * FROM ${this.tableName} WHERE ${where} `
    return await this.executeQuery(sql, true)
  }

  /**
   *
   * @param where
   */
  public async getByWhere(where): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getAllByWhere(where + ' LIMIT 1').then(
        data => resolve(data[0]),
        error => reject(error)
      )
    })
  }

  /**
   * Insert records into the database
   * @param String the database table
   * @param array data to insert field => value
   * @return bool
   */
  public async insertRecords($data): Promise<T> {
    //  $t = $this -> get('t');
    //	$t::prt($data);
    // if ($t:: isMultiArray($data)) {
    //   return $this -> insertMultiple($data);
    // }else {
    return this.insertSimple($data)
    // }
    // return true;
  }

  public async setPk(name, value) {
    // this._pk[this.mName][name] = value
  }

  public async setPkVal(value) {
    // this._pk[this.mName][this._pk] = value
  }

  public async save(data: T): Promise<T> {
    const pkArr = this.pkName
    if (data[pkArr] > 0) {
      console.log('save will do an update now.')
      const id = data[pkArr]
      const condition = ` ${this.pkName} = ${id} LIMIT 1`
      return this.updateRecords(data, condition)
    } else {
      console.log('save will do an insert now.')
      return this.insertRecords(data)
    }
  }

  /*
   public function getPkValue(){
    	$v = array_values($this->pk[$this->mname]);
    	return $v[0];
    }





    public function resultToObject($result = null){
    	if($result==null){
    		$result = $this->last;
    	}
    	$o = $result->fetch_object();
    	$result->close();
    	return $o;
    }*/

  /**
   * Sanitize data
   * @param String the data to be sanitized
   * @return String the sanitized data
   */
  public async sanitizeData($data) {
    //  return $this -> connection -> real_escape_string($data);
  }

  /**
   * Get last inserted id
   *
   * @return int
   */
  public async getLastInsertId() {
    // return $this -> connection -> insert_id;
  }

  /**
   * internal function
   *  @todo - move this to util class
   *
   * @param value
   */
  private is_numeric(value: string | number): boolean {
    return value != null && !isNaN(Number(value.toString()))
  }

  private addslashes(str) {
    try {
      return str.replace(/'/g, "\\'")
    } catch (e) {
      return str
    }
  }
}
