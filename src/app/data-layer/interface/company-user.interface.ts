/**
 * define a type for any users in application
 * @author Florin
 */
export interface IUser {
  id?: Number
  email: string
  password: string
  first_name: string
  last_name: string
  about_me?: string
  nationality?: string
  language?: string
  status: string
  info_status: string
  role: string
  is_public?: boolean
  company_id: Number
  age?: Number
  address?: string
  tel?: string
  occupation?: string
  skills?: string
}
