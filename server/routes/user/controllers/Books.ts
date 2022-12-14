import { Router } from 'express'

import { checkValidation, jwtAuthorization } from 'middlewares'

import { books } from '../services'

export const Books = Router()

Books.post(
   '/getSuggestions',
   jwtAuthorization,
   books.getSuggestions.validation(),
   checkValidation,
   books.getSuggestions.getSuggestions as any
)
