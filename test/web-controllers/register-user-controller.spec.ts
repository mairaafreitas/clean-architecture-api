import { type UserData } from '@/entities'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { type UseCase } from '@/usecases/ports'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { type UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { RegisterUserController } from '@/web-controllers'
import { type HttpRequest, type HttpResponse } from '@/web-controllers/ports'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'

describe('Register user web controller', () => {
  const users: UserData[] = []
  const repo: UserRepository = new InMemoryUserRepository(users)
  const useCase: UseCase = new RegisterUserOnMailingList(
    repo
  )
  const controller: RegisterUserController = new RegisterUserController(useCase)

  class ErrorUseCaseStub implements UseCase {
    async perform (request: any): Promise<void> {
      throw Error()
    }
  }
  const errorUseCaseStub: UseCase = new ErrorUseCaseStub()

  test('should return status code 201 when request contain valid user data', async () => {
    const request: HttpRequest = {
      body: {
        name: 'Any Name',
        email: 'email@email.com'
      }
    }
    const response: HttpResponse = await controller.handle(request)
    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual(request.body)
  })

  test('should return status code 400 when request contains invalid name', async () => {
    const requestWithInvalidName: HttpRequest = {
      body: {
        name: 'A',
        email: 'email@email.com'
      }
    }
    const response: HttpResponse = await controller.handle(requestWithInvalidName)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidNameError)
  })

  test('should return status code 400 when request contains invalid email', async () => {
    const requestWithInvalidEmail: HttpRequest = {
      body: {
        name: 'Any Name',
        email: 'invalid_email.com'
      }
    }
    const response: HttpResponse = await controller.handle(requestWithInvalidEmail)
    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidEmailError)
  })

  test('should return status code 400 when request is missing user name', async () => {
    const requestWithMissingName: HttpRequest = {
      body: {
        email: 'invalid_email.com'
      }
    }
    const response: HttpResponse = await controller.handle(requestWithMissingName)
    expect(response.statusCode).toEqual(400)
    expect((response.body as Error).message).toEqual('Missing parameter from request: name.')
  })

  test('should return status code 400 when request is missing user email', async () => {
    const requestWithMissingEmail: HttpRequest = {
      body: {
        name: 'Any Name'
      }
    }
    const response: HttpResponse = await controller.handle(requestWithMissingEmail)
    expect(response.statusCode).toEqual(400)
    expect((response.body as Error).message).toEqual('Missing parameter from request: email.')
  })

  test('should return status code 400 when request is missing user email', async () => {
    const requestWithMissingNameAndEmail: HttpRequest = {
      body: {
      }
    }
    const response: HttpResponse = await controller.handle(requestWithMissingNameAndEmail)
    expect(response.statusCode).toEqual(400)
    expect((response.body as Error).message).toEqual('Missing parameter from request: name email.')
  })

  test('should return status code 500 when server raises', async () => {
    const request: HttpRequest = {
      body: {
        name: 'Any Name',
        email: 'email@email.com'
      }
    }
    const controller: RegisterUserController = new RegisterUserController(errorUseCaseStub)
    const response: HttpResponse = await controller.handle(request)
    expect(response.statusCode).toEqual(500)
    expect(response.body).toBeInstanceOf(Error)
  })
})
