import { MongodbUserRepository } from '@/infra/repositories/mongodb'
import { MongoHelper } from '@/infra/repositories/mongodb/helper'

describe('Mongodb User Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(globalThis.__MONGO_URI__)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await MongoHelper.clearCollection('users')
  })

  test('when user is added, it should exist', async () => {
    const userRepository = new MongodbUserRepository()
    const user = {
      name: 'Any Name',
      email: 'any@email.com'
    }
    await userRepository.add(user)
    expect(await userRepository.exists(user)).toBeTruthy()
  })

  test('findAllUsers should return all added users', async () => {
    const userRepository = new MongodbUserRepository()
    await userRepository.add({
      name: 'Any Name',
      email: 'any@email.com'
    })
    await userRepository.add({
      name: 'Second Name',
      email: 'second@email.com'
    })
    const users = await userRepository.findAllUsers()
    expect(users[0].name).toEqual('Any Name')
    expect(users[1].name).toEqual('Second Name')
  })
})
