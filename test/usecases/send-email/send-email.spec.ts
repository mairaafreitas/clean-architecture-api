import { right, type Either, Right } from '@/shared'
import { type MailServiceError } from '@/usecases/errors'
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
describe('Send email to user', () => {
  test('should email user with valid name and email address', async () => {
    const mailServiceStub = new MailServiceStub()
    const useCase = new SendEmail(mailOptions, mailServiceStub)
    const response = await useCase.perform({ name: toName, email: toEmail })
    expect(response).toBeInstanceOf(Right)
  })
})
