import { User, type UserData } from '@/entities'
import { type UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'

describe('Register user on mailing list user case', () => {
  test('should add user with complete data to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(
      repo
    )
    const user = User.create({ name: 'name', email: 'email@email.com' }).value as User
    const response = await useCase.perform(user)
    const addedUser = await repo.findUserByEmail('email@email.com')
    expect(addedUser.name).toBe('name')
    expect(response.name).toBe('name')
  })
})
