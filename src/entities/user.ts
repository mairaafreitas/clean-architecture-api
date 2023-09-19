import { type Either, left, right } from '../shared/either'
import { Email } from './email'
import { InvalidEmailError } from './errors/invalid-email-error'
import { InvalidNameError } from './errors/invalid-name-error'
import { Name } from './name'
import { type UserData } from './user-data'

export class User {
  public readonly name: Name
  public readonly email: Email

  private constructor (name: Name, email: Email) {
    this.name = name
    this.email = email
  }

  static create (userData: UserData): Either<InvalidNameError | InvalidEmailError, User> {
    const nameOrError = Name.create(userData.name)
    if (nameOrError.isLeft()) {
      return left(new InvalidNameError())
    }

    const emailOrError = Email.create(userData.email)
    if (emailOrError.isLeft()) {
      return left(new InvalidEmailError())
    }

    const name: Name = nameOrError.value
    const email: Email = emailOrError.value

    return right(new User(name, email))
  }
}
