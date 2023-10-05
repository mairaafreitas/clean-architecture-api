import { type UserData } from '@/entities'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { type UseCase } from '@/usecases/ports'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { type UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { RegisterAndSendEmailController } from '@/web-controllers'
import { type HttpRequest, type HttpResponse } from '@/web-controllers/ports'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'
import { type Either, right } from '@/shared'
import { type MailServiceError } from '@/usecases/errors'
import { type EmailService, type EmailOptions } from '@/usecases/send-email/ports'
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email'
import { SendEmail } from '@/usecases/send-email'

const attachmentFilePath = '../resources/test.txt'
const fromName = 'Test'
const fromEmail = 'from_mail@mail.com'
const toName = 'Any Name'
const toEmail = 'any@email.com'
const subject = 'Test email'
const emailBody = 'Hello World attachment test'
const emailBodyHtml = '<b>Hello World attachment test</b>'
const attachment = [{
  filename: attachmentFilePath,
  contentType: 'text/plain'
}]
const mailOptions: EmailOptions = {
  host: 'test',
  port: 867,
  username: 'test',
  password: 'test',
  from: `${fromName} ${fromEmail}`,
  to: `${toName}<${toEmail}>`,
  subject,
  text: emailBody,
  html: emailBodyHtml,
  attachments: attachment
}

class MailServiceStub implements EmailService {
  async send (emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    return right(emailOptions)
  }
}

describe('Register user web controller', () => {
  const users: UserData[] = []
  const repo: UserRepository = new InMemoryUserRepository(users)
  const registerUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(
    repo
  )
  const mailServiceStub = new MailServiceStub()
  const sendEmailUseCase: SendEmail = new SendEmail(mailOptions, mailServiceStub)
  const registerAndSendEmailUseCase: RegisterAndSendEmail = new RegisterAndSendEmail(registerUseCase, sendEmailUseCase)
  const controller: RegisterAndSendEmailController = new RegisterAndSendEmailController(registerAndSendEmailUseCase)

  class ErrorUseCaseStub implements UseCase {
    async perform (request: any): Promise<void> {
      throw Error()
    }
  }
  const errorUseCaseStub: UseCase = new ErrorUseCaseStub()

  test('should return status code ok when request contain valid user data', async () => {
    const request: HttpRequest = {
      body: {
        name: 'Any Name',
        email: 'email@email.com'
      }
    }
    const response: HttpResponse = await controller.handle(request)
    expect(response.statusCode).toEqual(200)
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
    const controller: RegisterAndSendEmailController = new RegisterAndSendEmailController(errorUseCaseStub)
    const response: HttpResponse = await controller.handle(request)
    expect(response.statusCode).toEqual(500)
    expect(response.body).toBeInstanceOf(Error)
  })
})
