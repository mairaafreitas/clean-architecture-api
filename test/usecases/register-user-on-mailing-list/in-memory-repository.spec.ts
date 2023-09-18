import { InMemoryUserRepository } from '../../../src/usecases/register-user-on-mailing-list/repository/in-memory-user-repository'
import type { UserData } from '../../../src/entities/user-data'

describe('In memory User Repository', () => {
  test('should return null if user is not found', async () => {
    const users: UserData[] = []
    const userRepo = new InMemoryUserRepository(users)
    const user = await userRepo.findUserByEmail('any@email.com')
    expect(user).toBeNull()
  })

  test('should return user if user is found in repository', async () => {
    const users: UserData[] = []
    const name = 'name'
    const email = 'email@email.com'
    const userRepo = new InMemoryUserRepository(users)
    await userRepo.add({ name, email })
    const user = await userRepo.findUserByEmail('email@email.com')
    expect(user.name).toBe('name')
  })

  test('should return all users in repository', async () => {
    const users: UserData[] = [
      { name: 'any_name', email: 'any@email.com' },
      { name: 'second_name', email: 'second@email.com' }
    ]
    const userRepo = new InMemoryUserRepository(users)

    const returnedUser = await userRepo.findAllUsers()
    expect(returnedUser.length).toBe(2)
  })
})
