type Env = {
   PORT: string | undefined
   NODE_ENV: 'development' | 'production'
   DATABASE_NAME: string
   DATABASE_USERNAME: string
   DATABASE_PASSWORD: string
   DATABASE_HOST: string
   JWT_KEY: string
   STRIPE_SECRET_KEY: string
   REACT_APP_FACEBOOK_APP_ID: string
   FACEBOOK_APP_SECRET: string
   NODEMAILER_USERNAME: string
   NODEMAILER_PASSWORD: string
   PAYPAL_CLIENT_ID: string
   PAYPAL_CLIENT_SECRET: string
   PRIVATE_VAPID_KEY: string
   REACT_APP_PUBLIC_VAPID_KEY: string
   CLOUDINARY_NAME: string
   CLOUDINARY_API_KEY: string
   CLOUDINARY_API_SECRET: string
}

export const {
   PORT,
   NODE_ENV,
   DATABASE_NAME,
   DATABASE_USERNAME,
   DATABASE_PASSWORD,
   DATABASE_HOST,
   JWT_KEY,
   STRIPE_SECRET_KEY,
   REACT_APP_FACEBOOK_APP_ID,
   FACEBOOK_APP_SECRET,
   NODEMAILER_USERNAME,
   NODEMAILER_PASSWORD,
   PAYPAL_CLIENT_ID,
   PAYPAL_CLIENT_SECRET,
   PRIVATE_VAPID_KEY,
   REACT_APP_PUBLIC_VAPID_KEY,
   CLOUDINARY_NAME,
   CLOUDINARY_API_KEY,
   CLOUDINARY_API_SECRET,
} = process.env as Env
