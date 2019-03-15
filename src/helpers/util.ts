export default class Util {
  public static capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1)
  }

  public static toLowerCase(toLower, obj) {
    toLower.map(item => {
      if (obj[item]) {
        obj[item] = obj[item].toLowerCase()
      }
    })
  }

  /**
   * Generates random password
   * @param nr : Password's length
   */
  public static generatePassword(nr) {
    var text = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < nr; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length))

    return text
  }

  /**
   * get minutes difference
   *  send only first parameter to compare with NOW
   *
   * @param d1
   * @param d2
   */
  public static diffToMinutes(d1, d2 = new Date()) {
    return Math.round(
      (((new Date(d2).getTime() - new Date(d1).getTime()) % 86400000) % 3600000) / 60000
    )
  }

  public static isNumber(value: string | number): boolean {
    return !isNaN(Number(value.toString()))
  }

  public static addslashes(string) {
    return string
      .replace(/\\/g, '\\\\')
      .replace(/\u0008/g, '\\b')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\f/g, '\\f')
      .replace(/\r/g, '\\r')
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
  }

  /**
   * create a code like "COMP-00000001"
   *
   * @param prefix
   * @param index
   */
  static createCode(prefix, index, size = 10) {
    var s = index + ''
    while (s.length < size) s = '0' + s
    return prefix + '-' + s
  }

  static async getFiles(fp) {
    // const fp = cfg.appConfig.appPath + 'src/app/data-layer/dbo/'
    const data = {}
    const fs = require('fs')
    return await fs.readdir(fp, async function(err, filenames) {
      if (err) {
        return console.log(err)
      }
      filenames.forEach(filename => {
        // console.log(filename)
        const stats = fs.statSync(fp + filename)
        const fileSizeInBytes = stats.size
        data[filename] = fileSizeInBytes
      })
      return data
    })
  }
}
