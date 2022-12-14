import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useFormHandler } from 'hooks'

import { handleApiValidation, setApiFeedback } from 'helpers'

import { axios, history } from 'utils'

export const usePasswordRecovery = () => {
   const { passwordToken } = useParams()
   useEffect(() => {
      const checkPasswordToken = async () => {
         try {
            const url = '/api/user/auth/checkPasswordToken'
            await axios.post(url, { passwordToken })
         } catch (error) {
            history.push('/login')
         }
      }
      checkPasswordToken()
   }, [])
   const [form, setForm] = useState({
      password: '',
      passwordError: '',
      repeatedPassword: '',
      repeatedPasswordError: '',
   })
   const { password, repeatedPassword } = form
   const formHandler = useFormHandler(setForm)
   const validate = () => {
      let validated = true
      setForm(form => ({
         ...form,
         passwordError: '',
         repeatedPasswordError: '',
      }))
      if (!formHandler.validatePassword(password, repeatedPassword, false)) validated = false
      if (!formHandler.validateRepeatedPassword(repeatedPassword, password)) validated = false
      return validated
   }
   const changePassword = async (event: React.FormEvent) => {
      event.preventDefault()
      if (validate()) {
         try {
            const url = '/api/user/auth/changePassword'
            const response = await axios.post(url, {
               password,
               repeatedPassword,
               passwordToken,
            })
            if (response) {
               setApiFeedback(
                  'Password Recovery',
                  'Your password has been successfully changed, you can login now',
                  'Okey',
                  () => history.push('/login')
               )
            }
         } catch (error) {
            handleApiValidation(error as ApiError, setForm)
         }
      }
   }
   return {
      form,
      formHandler,
      changePassword,
   }
}
