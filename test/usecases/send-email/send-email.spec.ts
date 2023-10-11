import { User } from '@/entities'
import { right, type Either, left } from '@/shared'
import { MailServiceError } from '@/usecases/errors'
import { SendEmail } from '@/usecases/send-email'
import { type EmailService, type EmailOptions } from '@/usecases/send-email/ports'

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
class MailServiceStub implements EmailService {
  async send (emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    return right(emailOptions)
  }
}

class MailServiceErrorStub implements EmailService {
  async send (emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    return left(new MailServiceError())
  }
}

describe('Send email to user', () => {
  test('should email user with valid name and email address', async () => {
    const mailServiceStub = new MailServiceStub()
    const useCase = new SendEmail(mailOptions, mailServiceStub)
    const user = User.create({ name: toName, email: toEmail }).value as User
    const response = (await useCase.perform(user)).value as EmailOptions
    expect(response.to).toEqual(mailOptions.to)
  })

  test('should return error when email service fails', async () => {
    const mailServiceErrorStub = new MailServiceErrorStub()
    const useCase = new SendEmail(mailOptions, mailServiceErrorStub)
    const user = User.create({ name: toName, email: toEmail }).value as User
    const response = await useCase.perform(user)
    expect(response.isLeft()).toBe(true)
    const error = response.value
    expect(error).toBeInstanceOf(MailServiceError)
  })
})
