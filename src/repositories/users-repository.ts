import { Prisma, Role, User } from '@prisma/client'

interface UserCreateInput {
  id?: string | undefined
  name: string
  email: string
  password_hash: string
  role?: Role | undefined
  created_at?: string | Date | undefined
  checkIns?: Prisma.CheckInCreateNestedManyWithoutUserInput | undefined
}

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  create(data: UserCreateInput): Promise<User>
}
