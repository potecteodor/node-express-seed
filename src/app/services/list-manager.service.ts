import { sequelize } from '../../helpers/sequelize'
import { IGridFilter } from '../../shared/interfaces/list/grid-filter.interface'

const Op = sequelize.getSequelize().Op

/**
 * handle all lists with this class
 */
export class ListManager {
  /**
   * get all data from database
   *
   * @param request
   */
  public getAll(listRequest: IGridFilter, dbo): Promise<any> {
    const filter = listRequest.filterGroups.length > 0 ? this.getFilter(listRequest) : {}
    return new Promise((resolve, reject) => {
      const f = {
        where: filter,
        offset: listRequest.offset || 0,
        limit: listRequest.limit || 25,
        raw: true,
      }
      if (listRequest.sorters) {
        f['order'] = this._buildOrder(listRequest.sorters)
      }
      dbo.findAndCountAll(f).then(result => {
        resolve(result)
      })
    })
  }

  /**
   * build filters from parameters
   *
   * @param req
   */
  private getFilter(req: IGridFilter, noSql?: boolean | null) {
    let groups = req.filterGroups
    let filter = {}
    if (noSql) {
      let filter = { $or: [] }
      groups.forEach(group => {
        let g = { $and: [] }
        group.forEach(criteria => {
          let c = {}
          let v = criteria.value + ''
          if (v.toLowerCase() === 'yes') {
            criteria.value = true
          }
          if (v.toLowerCase() === 'no') {
            criteria.value = false
          }
          c[criteria.field] = this.getCondition(criteria.op, criteria.value, noSql)
          g.$and.push(c)
        })
        if (g.$and.length > 0) {
          filter.$or.push(g)
        }
      })
      if (filter.$or.length === 0) {
        return {}
      }
    } else {
      filter = {} // [Op.or]: [{ id: [1, 2, 3] }, { id: { [Op.gt]: 10 } }]
      let or = []
      groups.forEach(group => {
        group.forEach(criteria => {
          let o = {}
          o[criteria.field] = this.getCondition(criteria.op, criteria.value)
          or.push(o)
        })
      })
      filter = { [Op.or]: or }
    }
    return filter
  }

  /**
   * parse and get condition
   *
   * @param operator
   * @param value
   */
  private getCondition(operator, value, noSql?: boolean | null) {
    switch (operator) {
      case '>':
        return { $gt: +value }
      case '<':
        return { $lt: +value }
      case '<>':
        if (noSql) {
          return { $lt: +value }
        }
        return { [Op.ne]: value }
      case 'startWith':
        return { $regex: '^' + value }
      case 'endWith':
        return { $regex: value + '$' }
      case 'like':
        return { $regex: value }
      default:
        return value
    }
  }

  _buildOrder(gf: any) {
    return sequelize.getSequelize().literal(`${gf[0]['name']} ${gf[0]['dir']}`)
  }

  /**
   * @todo: Move this method out of this class
   *
   * get all data from database
   *
   * @param request
   */
  public getAllStaff(listRequest: IGridFilter, dbo, companyID): Promise<any> {
    return new Promise((resolve, reject) => {
      dbo
        .findAndCountAll({ where: { company_id: companyID } })
        /* where: {
            title: {
              [Op.like]: 'foo%'
            }
          }, */
        /* offset: listRequest.limit || 25,
          limit: listRequest.offset || 0, */
        /* {order: 'title DESC' */
        .then(result => {
          /* // console.log(result.count)
          // console.log(result.rows) */
          // console.log(result)
          resolve(result)
        })

      /* dao.countDocuments(this.getFilter(listRequest), (err, cnt) => {
        if (err) {
          reject(err)
        }
        let q = dao
          .find(this.getFilter(listRequest))
          .limit(listRequest.limit || 25)
          .skip(listRequest.offset || 0)
        for (let s in listRequest.sorters) {
          if (listRequest.sorters.hasOwnProperty(s)) {
            let x = {}
            x[listRequest['sorters'][s]['name']] =
              listRequest['sorters'][s]['dir'] === 'desc' ? -1 : 1

            // console.log(x)
            q.sort(x)
          }
        }
        q.exec((err1, countries) => {
          if (err1) {
            reject(err1)
          }
          resolve({ total_rows: cnt, rows: countries })
        })
      }) */
    })
  }

  public getAllSystemUsers(listRequest: IGridFilter, dbo): Promise<any> {
    return new Promise((resolve, reject) => {
      dbo
        .findAndCountAll({
          where: {
            [Op.or]: [{ role: 'sys_admin' }, { role: 'translator' }],
          },
        })
        .then(result => {
          resolve(result)
        })
    })
  }
}
