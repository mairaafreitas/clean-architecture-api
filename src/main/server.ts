import 'module-alias/register'
import { MongoHelper } from '@/infra/repositories/mongodb/helper'

MongoHelper.connect(process.env.MONGO_URL).then(async () => {
  const app = (await import('./config/app')).default
  app.listen(5000, () => {
    console.log('Server running at http://localhost/5000')
  })
}).catch(console.error)
