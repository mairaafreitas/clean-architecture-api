import { NodemailerEmailService } from '@/infra/mail-services'
import { MailServiceError } from '@/usecases/errors'
import { type EmailOptions } from '@/usecases/send-email/ports'
import nodemailer from 'nodemailer'

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
jest.mock('nodemailer')
const sendMailMock = jest.fn().mockReturnValueOnce('ok')
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock })

describe('Nodemailer mail service adapter', () => {
  beforeEach(() => {
    sendMailMock.mockClear()
    nodemailer.createTransport.mockClear()
  })
  test('should return ok if email is sent', async () => {
    const nodemailer = new NodemailerEmailService()
    const result = await nodemailer.send(mailOptions)
    expect(result.value).toEqual(mailOptions)
  })

  test('should return error if email is not sent', async () => {
    const nodemailer = new NodemailerEmailService()
    sendMailMock.mockImplementationOnce(() => {
      throw new Error()
    })
    const result = await nodemailer.send(mailOptions)
    expect(result.value).toBeInstanceOf(MailServiceError)
  })
})
