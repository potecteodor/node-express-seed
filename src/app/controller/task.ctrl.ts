import { Request, Response, Router } from 'express'
import { Api } from '../../core/services/api'
import { ProjectModel } from '../model/project.model'
import { TaskModel } from '../model/task.model'
import { TaskMembersModel } from '../model/task_members.model'

export class TaskCtrl {
  public static route = '/task'
  public router: Router = Router()

  constructor() {
    this.router.post('/create', this.createTask)
    this.router.post('/checkTaskName', this.checkTaskName)
    this.router.get('/getMyTasks/:id', this.getMyTasks)
    this.router.get('/getOtherTasks/:id', this.getOtherTasks)
    this.router.get('/getTaskMembers/:id', this.getTaskMembers)
    this.router.get('/getOne/:id', this.getOne)
    this.router.get('/getProject/:id', this.getProject)
    this.router.put('/editTask', this.editTask)
    this.router.delete('/deleteTask/:id', this.deleteTask)
  }

  /**
   * Get the project for this task
   * @param req
   * @param res
   */
  getProject(req: Request, res: Response) {
    try {
      const id = req.params.id
      const sql = `Select project.* From project JOIN task ON project.id = task.project_id Where task.id = ${id}`
      const m = new TaskModel()
      m.executeQuery(sql, true).then(result => {
        Api.ok(req, res, result)
      })
    } catch (err) {
      Api.serverError(req, res, err)
    }
  }

  /**
   * Get one task by id
   * @param req
   * @param res
   */
  getOne(req: Request, res: Response) {
    try {
      const id = req.params.id
      const sql = `Select * From task Where id = ${id}`
      const m = new TaskModel()
      m.executeQuery(sql, true).then(result => {
        Api.ok(req, res, result)
      })
    } catch (err) {
      Api.serverError(req, res, err)
    }
  }

  /**
   * Edit task
   * @param req
   * @param res
   */
  editTask(req: Request, res: Response) {
    try {
      const task = req.body.task
      const members = req.body.members
      const tm = new TaskModel()
      const tmm = new TaskMembersModel()
      const sql = `UPDATE task SET subject = '${task.subject}', description = '${task.description}', start_date='${task.start_date}', priority='${task.priority}',status='${task.status}', end_date='${task.end_date}' WHERE id=${task.id}`
      const deleteMembers = `Delete From task_members Where task_id=${task.id}`
      tm.executeQuery(sql).then(result => {
        if (members && members.length > 0) {
          tmm.executeQuery(deleteMembers).then(del => {
            members.forEach(async member => {
              const sql2 = `INSERT INTO task_members(member_id, task_id) VALUES(${member}, ${task.id})`
              await tmm.executeQuery(sql2)
            })
          })
        }
        Api.ok(req, res, true)
      })
    } catch (err) {
      return Api.serverError(req, res, err)
    }
  }

  /**
   * Get Task members
   * @param req
   * @param res
   */
  getTaskMembers(req: Request, res: Response) {
    try {
      const task_id = req.params.id
      const m = new TaskMembersModel()
      const sql = `Select * From user JOIN task_members ON user.id=task_members.member_id WHERE task_id = ${task_id}`
      m.executeQuery(sql, true).then(result => {
        return Api.ok(req, res, result)
      })
    } catch (err) {
      return Api.serverError(req, res, err)
    }
  }

  /**
   * Delete own projects
   * @param req
   * @param res
   */
  deleteTask(req: Request, res: Response) {
    try {
      const task_id = req.params.id
      const taskModel = new TaskModel()
      const tmModel = new TaskMembersModel()
      const sql = `Delete From task Where id = ${task_id}`
      const sql2 = `Delete From task_members Where task_id=${task_id}`
      taskModel.executeQuery(sql).then(result => {
        tmModel.executeQuery(sql2).then(result2 => {
          return Api.ok(req, res, true)
        })
      })
    } catch (err) {
      return Api.serverError(req, res, err)
    }
  }

  /**
   * Get all tasks created by logged user
   * @param req
   * @param res
   */
  getMyTasks(req: Request, res: Response) {
    const id = req.params.id
    const m = new TaskModel()
    const sql = `Select * From task Where created_by=${id}`
    m.executeQuery(sql, true).then(
      result => {
        Api.ok(req, res, result)
      },
      error => {
        Api.serverError(req, res, error)
      }
    )
  }

  /**
   * Get all tasks you are part of
   * @param req
   * @param res
   */
  getOtherTasks(req: Request, res: Response) {
    const id = req.params.id
    const m = new TaskModel()
    const sql = `Select * From task Join task_members ON task.id = task_members.task_id Where task_members.member_id=${id}`
    m.executeQuery(sql, true).then(
      result => {
        Api.ok(req, res, result)
      },
      error => {
        Api.serverError(req, res, error)
      }
    )
  }

  /**
   * Create a task
   * @param req
   * @param res
   */
  createTask(req: Request, res: Response) {
    try {
      const task = req.body.task
      const members = req.body.members
      const m = new TaskModel()
      const m2 = new TaskMembersModel()
      const sql = `INSERT INTO task(subject,created_by,start_date,end_date,project_id,priority,status,description)
    VALUES('${task.subject}',${task.created_by},'${task.start_date}','${task.end_date}',${task.project_id},'${task.priority}','${task.status}','${task.description}')`
      const inserted = `Select * From task WHERE subject='${task.subject}' AND created_by=${task.created_by}`
      m.executeQuery(sql, true).then(result => {
        if (members && members.length > 0) {
          m.executeQuery(inserted, true).then(insertedTask => {
            members.forEach(async member => {
              const sql2 = `INSERT INTO task_members(member_id, task_id) VALUES(${member}, ${insertedTask[0].id})`
              await m2.executeQuery(sql2)
            })
          })
        }
        return Api.ok(req, res, true)
      })
    } catch (err) {
      Api.serverError(req, res, err)
    }
  }

  /**
   * Check if logged user has already a project with this name
   * @param req
   * @param res
   */
  checkTaskName(req: Request, res: Response) {
    const created_by_id = req.body.created_by_id
    const name = req.body.name
    const m = new ProjectModel()
    const sql = `Select * From task Where created_by=${created_by_id} AND subject='${name}'`
    m.executeQuery(sql).then(
      result => {
        if (result[0].length > 0) {
          Api.ok(req, res, false)
        } else {
          Api.ok(req, res, true)
        }
      },
      error => {
        Api.serverError(req, res, error)
      }
    )
  }
}
