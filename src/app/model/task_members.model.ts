import { BaseModel } from './base.model'

export class TaskMembersModel extends BaseModel {
  tableName: string = 'task_members'

  pkName: string = 'id'
}
