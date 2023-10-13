import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/repositories/mongodb/helper'
import { MailServiceMock } from '@test/infra/mail-services/mock-email-service'

jest.mock('@/infra/mail-services/nodemailer-email-service', () => {
  return {
    __esModule: true,
    NodemailerEmailService: MailServiceMock
  }
})

describe('Register route', () => {
  beforeAll(async () => {
    await MongoHelper.connect(globalThis.__MONGO_URI__)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    await MongoHelper.clearCollection('users')
  })

  test('should return an account on success', async () => {
    app.post('/test_cors', (req, res) => {
      res.send()
    })
    await request(app).post('/api/register')
      .send({ name: 'Any Name', email: 'maira.oliveirafreitas@gmail.com' })
      .expect(200)
    expect(MailServiceMock.timesSendWasCalled).toEqual(1)
  })
})
