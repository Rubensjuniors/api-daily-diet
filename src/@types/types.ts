export interface IUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone_number: string
  is_active: boolean
  created_at: string
  updated_at?: string
  session_id?: string
}
