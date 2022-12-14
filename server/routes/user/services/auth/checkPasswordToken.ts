import { JsonWebTokenError, TokenExpiredError, verify } from 'jsonwebtoken'

import { JWT_KEY } from 'config'

import { User } from 'database'

import { validator } from 'helpers'

import { ApiError } from 'utils'

import { PasswordTokendata } from 'types'
import { Route } from 'types/express'

export const checkPasswordToken: Route = async (req, res, next) => {
   try {
      const { passwordToken } = req.body

      const { email } = verify(passwordToken, JWT_KEY) as PasswordTokendata

      const user = await User.findOne({
         where: {
            email,
            passwordToken,
         },
      })

      if (!user) {
         throw new ApiError('Password recovery', 'The password recovery link is invalid', 400)
      }

      res.send()
   } catch (error) {
      if (error instanceof JsonWebTokenError) {
         if (error instanceof TokenExpiredError) {
            throw new ApiError('Password recovery', 'The password recovery link has expired', 400)
         }
         throw new ApiError('Password recovery', 'The password recovery link is invalid', 400)
      }
      next(error)
   }
}

export const validation = () => [validator.validateProperty('passwordToken').isJWT()]
