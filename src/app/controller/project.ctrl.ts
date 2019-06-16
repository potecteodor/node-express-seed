import { Request, Response, Router } from 'express'
import { Api } from '../../core/services/api'
import { ProjectModel } from '../model/project.model'
import { ProjectMembersModel } from '../model/project_members.model'
import { TaskModel } from '../model/task.model'
import { UserModel } from '../model/user.model'

export class ProjectCtrl {
  public static route = '/project'
  public router: Router = Router()

  constructor() {
    this.router.get('/getMyProjects/:id', this.getMyProjects)
    this.router.get('/getProjectOwner/:id', this.getProjectOwner)
    this.router.get('/getOtherProjects/:id', this.getOtherProjects)
    this.router.get('/getProjectMembers/:id', this.getProjectMembers)
    this.router.get('/getOneProject/:id', this.getOneProject)
    this.router.get('/getProjectTasks/:id', this.getProjectTasks)
    this.router.post('/create', this.createProject)
    this.router.post('/checkProjectName', this.checkProjectName)
    this.router.put('/editProject', this.updateProject)
    this.router.delete('/deleteProject/:id', this.deleteProject)
  }

  /**
   * Get all tasks for a project
   * @param req
   * @param res
   */
  getProjectTasks(req: Request, res: Response) {
    try {
      const id = req.params.id
      const sql = `Select task.* From task Join project ON project.id = task.project_id Where project.id = ${id}`
      const m = new TaskModel()
      m.executeQuery(sql, true).then(result => {
        Api.ok(req, res, result)
      })
    } catch (err) {
      Api.serverError(req, res, err)
    }
  }

  /**
   *
   * @param req
   * @param res
   */
  getProjectOwner(req: Request, res: Response) {
    try {
      const id = req.params.id
      const sql = `Select * From user Join project ON user.id = project.created_by_id Where project.id = ${id}`
      const m = new ProjectModel()
      m.executeQuery(sql, true).then(result => {
        Api.ok(req, res, result)
      })
    } catch (err) {
      Api.serverError(req, res, err)
    }
  }

  /**
   * Get one project
   * @param req
   * @param res
   */
  getOneProject(req: Request, res: Response) {
    try {
      const id = req.params.id
      const sql = `Select * From project Where id = ${id}`
      const m = new ProjectModel()
      m.executeQuery(sql, true).then(result => {
        Api.ok(req, res, result)
      })
    } catch (err) {
      Api.serverError(req, res, err)
    }
  }

  /**
   * Create Project + project members
   * @param req
   * @param res
   */
  async createProject(req: Request, res: Response) {
    try {
      const project = req.body.project
      const members = req.body.members
      const m = new ProjectModel()
      const m2 = new ProjectMembersModel()
      const sql = `INSERT INTO project(name,created_by_id,start_date,end_date,description)
    VALUES('${project.name}',${project.created_by_id},'${project.start_date}','${
        project.end_date
      }','${project.description}')`
      const inserted = `Select * From project WHERE name='${
        project.name
      }' AND created_by_id=${project.created_by_id}`
      m.executeQuery(sql, true).then(result => {
        if (members && members.length > 0) {
          m.executeQuery(inserted, true).then(insertedProject => {
            members.forEach(async member => {
              const sql2 = `INSERT INTO project_members(member_id, project_id) VALUES(${member}, ${
                insertedProject[0].id
              })`
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
   * Update a project
   * @param req
   * @param res
   */
  updateProject(req: Request, res: Response) {
    try {
      const project = req.body.project
      const members = req.body.members
      const pm = new ProjectModel()
      const pmm = new ProjectMembersModel()
      const sql = `UPDATE project SET name = '${project.name}', description = '${
        project.description
      }', start_date='${project.start_date}', end_date='${project.end_date}' WHERE id=${
        project.id
      }`
      const deleteMembers = `Delete From project_members Where project_id=${project.id}`
      pm.executeQuery(sql).then(result => {
        if (members && members.length > 0) {
          pmm.executeQuery(deleteMembers).then(del => {
            members.forEach(async member => {
              const sql2 = `INSERT INTO project_members(member_id, project_id) VALUES(${member}, ${
                project.id
              })`
              await pmm.executeQuery(sql2)
            })
          })
        }
        Api.ok(req, res, true)
      })
    } catch (err) {
      Api.serverError(req, res, err)
    }
  }

  /**
   * Get members from a project
   * @param req
   * @param res
   */
  getProjectMembers(req: Request, res: Response) {
    try {
      const project_id = req.params.id
      const m = new UserModel()
      const sql = `Select user.* From user Join project_members ON project_members.member_id = user.id Where project_members.project_id=${project_id}`
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
  deleteProject(req: Request, res: Response) {
    try {
      const project_id = req.params.id
      const projectModel = new ProjectModel()
      const pmModel = new ProjectMembersModel()
      const sql = `Delete From project Where id = ${project_id}`
      const sql2 = `Delete From project_members Where project_id=${project_id}`
      projectModel.executeQuery(sql).then(result => {
        pmModel.executeQuery(sql2).then(result2 => {
          return Api.ok(req, res, true)
        })
      })
    } catch (err) {
      return Api.serverError(req, res, err)
    }
  }

  /**
   * Check if logged user has already a project with this name
   * @param req
   * @param res
   */
  checkProjectName(req: Request, res: Response) {
    const created_by_id = req.body.created_by_id
    const name = req.body.name
    const m = new ProjectModel()
    const sql = `Select * From project Where created_by_id=${created_by_id} AND name='${name}'`
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

  /**
   * Get all projects you are part of
   * @param req
   * @param res
   */
  getOtherProjects(req: Request, res: Response) {
    const id = req.params.id
    const m = new ProjectModel()
    const sql = `Select * From project Join project_members ON project.id = project_members.project_id Where project_members.member_id=${id}`
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
   * Get all projects created by logged user
   * @param req
   * @param res
   */
  getMyProjects(req: Request, res: Response) {
    const id = req.params.id
    const m = new ProjectModel()
    const sql = `Select * From project Where created_by_id=${id}`
    m.executeQuery(sql, true).then(
      result => {
        Api.ok(req, res, result)
      },
      error => {
        Api.serverError(req, res, error)
      }
    )
  }
}
