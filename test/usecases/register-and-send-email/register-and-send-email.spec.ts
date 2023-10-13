import { type UserData } from '@/entities'
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { type UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'
import { SendEmail } from '@/usecases/send-email'
import { type EmailOptions } from '@/usecases/send-email/ports'
import { MailServiceMock } from '@test/infra/mail-services/mock-email-service'

describe('Register and send email to user', () => {
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
    path: '../../resources/text.txt'
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

  test('should register user and send an email with valid data', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(
      repo
    )
    const mailServiceMock = new MailServiceMock()
    const sendEmailUseCase: SendEmail = new SendEmail(mailOptions, mailServiceMock)
    const registerAndSendEmailUseCase: RegisterAndSendEmail = new RegisterAndSendEmail(registerUseCase, sendEmailUseCase)
    const name = 'name'
    const email = 'email@email.com'
    const response: UserData = (await registerAndSendEmailUseCase.perform({ name, email })).value as UserData
    const user = await repo.findUserByEmail('email@email.com')
    expect(user?.name).toBe('name')
    expect(response.name).toBe('name')
    expect(MailServiceMock.timesSendWasCalled).toEqual(1)
    expect(response.name).toEqual('name')
  })

  test('should should register user and send an email with invalid email', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(
      repo
    )
    const mailServiceMock = new MailServiceMock()
    const sendEmailUseCase: SendEmail = new SendEmail(mailOptions, mailServiceMock)
    const registerAndSendEmailUseCase: RegisterAndSendEmail = new RegisterAndSendEmail(registerUseCase, sendEmailUseCase)
    const name = 'name'
    const invalidEmail = 'invalid_email'
    const response = (await registerAndSendEmailUseCase.perform({ name, email: invalidEmail })).value as Error
    expect(response.name).toEqual('InvalidEmailError')
  })

  test('should register user and send an email with invalid name', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(
      repo
    )
    const mailServiceMock = new MailServiceMock()
    const sendEmailUseCase: SendEmail = new SendEmail(mailOptions, mailServiceMock)
    const registerAndSendEmailUseCase: RegisterAndSendEmail = new RegisterAndSendEmail(registerUseCase, sendEmailUseCase)
    const invalidName = ''
    const email = 'email@email.com'
    const response = (await registerAndSendEmailUseCase.perform({ name: invalidName, email })).value as Error
    expect(response.name).toEqual('InvalidNameError')
  })
})
