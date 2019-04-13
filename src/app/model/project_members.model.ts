import { BaseModel } from './base.model'

export class ProjectMembersModel extends BaseModel {
  tableName: string = 'project_members'

  pkName: string = 'id'
}
