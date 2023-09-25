import type { UserData } from '@/entities'
import { type UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { InMemoryUserRepository } from '@test/usecases/register-user-on-mailing-list/repository'

describe('Register user on mailing list user case', () => {
  test('should add user with complete data to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(
      repo
    )
    const name = 'name'
    const email = 'email@email.com'
    const response = await useCase.perform({ name, email })
    const user = await repo.findUserByEmail('email@email.com')
    expect(user.name).toBe('name')
    expect(response.value.name).toBe('name')
  })

  test('should not add user with invalid email to mailing list', async () => {
    const users: UserData[] = []
    console.log(users)
    const repo: UserRepository = new InMemoryUserRepository(users)
    const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(
      repo
    )
    const name = 'name'
    const invalidEmail = 'invalid_email'
    const response = (await useCase.perform({ name, email: invalidEmail })).value as Error
    const user = await repo.findUserByEmail(invalidEmail)
    expect(user).toBeNull()
    expect(response.name).toEqual('InvalidEmailError')
  })

  test('should not add user with invalid name to mailing list', async () => {
    const users: UserData[] = []
    console.log(users)
    const repo: UserRepository = new InMemoryUserRepository(users)
    const useCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(
      repo
    )
    const invalidName = ''
    const email = 'email@email.com'
    const response = (await useCase.perform({ name: invalidName, email })).value as Error
    const user = await repo.findUserByEmail(email)
    expect(user).toBeNull()
    expect(response.name).toEqual('InvalidNameError')
  })
})