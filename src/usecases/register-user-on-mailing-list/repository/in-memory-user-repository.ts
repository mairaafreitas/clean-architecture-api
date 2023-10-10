import { type UserData } from '@/entities'
import { type UserRepository } from '@/usecases/register-user-on-mailing-list/ports'

export class InMemoryUserRepository implements UserRepository {
  private readonly repository: UserData[]
  constructor (repository: UserData[]) {
    this.repository = repository
  }

  async add (user: UserData): Promise<void> {
    const exists = await this.exists(user)
    if (!exists) {
      this.repository.push(user)
    }
  }

  async findUserByEmail (email: string): Promise<UserData> {
    const userFound = this.repository.find((user) => user.email === email)
    if (userFound === undefined) {
      throw new Error('User not found')
    }
    return userFound
  }

  async findAllUsers (): Promise<UserData[]> {
    return this.repository
  }

  async exists (user: UserData): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const foundUser = await this.findUserByEmail(user.email)
    if (foundUser == null) {
      return false
    }
    return true
  }
}
