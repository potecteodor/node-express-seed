import { BaseModel } from './base.model'

export class ProjectModel extends BaseModel {
  tableName: string = 'project'

  pkName: string = 'id'
}
