import { AppSetting, IConfig } from '../config'

const mysql = require('mysql2/promise')

export abstract class MysqlModel {
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

  constructor(dbName: string = null) {
    this._dbName = dbName
  }

  /**
   * basic connect function
   */
  async connect() {
    if (!this._connection) {
      console.log('starting connection')
      const config: IConfig = AppSetting.getConfig()
      this._connection = await mysql.createConnection({
        host: config.DBConnections.default.options.host,
        user: config.DBConnections.default.user,
        password: config.DBConnections.default.password,
        database: this._dbName || config.DBConnections.default.database,
      })
    }
    return this._connection
  }

  get connection() {
    return this._connection
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
  async executeQuery(sql: string, withResult = false) {
    const conn = await this.connect()
    if (withResult) {
      return new Promise((resolve, reject) => {
        console.log('sql', sql)
        conn.query(sql).then(
          result => {
            resolve(result[0])
          },
          error => {
            reject(error)
          }
        )
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
    return this.executeQuery(sql, true)
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
  public async updateRecords(changes, condition) {
    const table = this.tableName
    let update = 'UPDATE `' + table + '` SET '
    for (let field in changes) {
      let value = changes[field]
      if (this.is_numeric(value)) {
        update += '`' + field + '`=' + value + ','
      } else {
        update += '`' + field + "`='" + value + "',"
      }
    }
    // remove our trailing ,
    update = update.slice(0, update.length - 1)
    if (condition !== '') {
      update += ' WHERE ' + condition
    }
    const conn = await this.connect()
    return new Promise((resolve, reject) => {
      conn.query(update).then(result => {
        resolve(result[0])
      })
    })
  }

  /**
   * simple insert in database
   */
  private async insertSimple(data) {
    console.log(data)
    let fields = ''
    let values = ''
    for (let f in data) {
      let v = data[f]
      fields += '`' + f + '`,'
      values +=
        this.is_numeric(v) && ++v === v ? v + ',' : "'" + this.addslashes(v) + "',"
    }
    //	remove our trailing ,
    fields = fields.slice(0, fields.length - 1)
    //	remove our trailing ,
    values = values.slice(0, values.length - 1)
    const insert =
      'INSERT INTO `' + this.tableName + '` (' + fields + ') VALUES (' + values + ')'
    return this.executeQuery(insert, true)
  }

  /**
   * get all from table
   */
  public async getAll() {
    const sql = `SELECT * FROM ${this.tableName}`
    return this.executeQuery(sql, true)
  }

  /**
   * get row by id
   *
   * @param id
   */
  public async getById(id: any) {
    const sql = `SELECT * FROM ${this.tableName} WHERE ${this.pkName} = ${id} LIMIT 1`
    return new Promise((resolve, reject) => {
      this.executeQuery(sql, true).then(
        result => {
          resolve(result[0])
        },
        err => {
          reject(err)
        }
      )
    })
  }

  /**
   * Insert records into the database
   * @param String the database table
   * @param array data to insert field => value
   * @return bool
   */
  public async insertRecords($data) {
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

  public async save(data) {
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


    public function getAllByWhere($w){
    	$sql = "SELECT * FROM `{$this->mname}` WHERE {$w} ";
    	$this->executeQuery($sql, MYSQLI_STORE_RESULT);
    	return $this->last;
    }


    public function getByWhere($w){
    	return $this->getAllByWhere($w . " LIMIT 1");
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
    return str.replace(/'/g, "\\'")
  }

  /*
  private function insertMultiple($data){
    	$t = $this->get('t');
    	$insert = "INSERT INTO {$this->mname} (";
    	$fields = "";
    	$values = "";
    	$x=0;
    	foreach($data as $d){
    		$fields = "";
    		$values .= "(";
    		foreach($d as $f=>$v){
    			if($x==0){
    				$fields  .= "`$f`,";
    			}
    			$values .= ( is_numeric( $v ) && ( intval( $v ) == $v ) ) ? $v."," : "'" .addslashes($v). "',";
    		}
    		$x++;
	    	$fields = substr($fields, 0, -1);
    		$values = substr($values, 0, -1) . '),';
	    	$insert .= $fields;
    	}

    	$values = substr($values, 0, -1);
    	$insert .= ') VALUES ' . $values;
    	$this->executeQuery( $insert );
    	return true;
    }
    */
}
