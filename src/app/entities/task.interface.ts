export interface ITask {
  id?: number
  subject?: string
  created_by?: number
  project_id?: number
  start_date?: Date
  end_date?: Date
  priority?: string
  status?: string
  description?: string
  created_at?: Date
}
