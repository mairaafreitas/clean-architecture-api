import { type EmailAttachment, type EmailOptions } from '@/usecases/send-email/ports'

const attachments: EmailAttachment[] = [{
  filename: 'text.txt',
  path: '../../resources/text.txt'
}]

export function getEmailOptions (): EmailOptions {
  const from = 'Maíra Freitas <maira.oliveirafreitas@gmail.com'
  const to = ''
  const mailOptions: EmailOptions = {
    host: process.env.EMAIL_HOST ?? 'smtp.gmail.com',
    port: Number.parseInt(process.env.EMAIL_PORT ?? '587'),
    username: process.env.EMAIL_USERNAME ?? '',
    password: process.env.EMAIL_PASSWORD ?? '',
    from,
    to,
    subject: 'Mensagem de teste',
    text: 'Texto da mensagem',
    html: '<b> Texto da mensagem </b>',
    attachments
  }
  return mailOptions
}
