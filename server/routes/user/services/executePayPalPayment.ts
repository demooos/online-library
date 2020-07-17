import { Request, Response, NextFunction } from 'express'
import paypal from 'paypal-rest-sdk'

import { Connection, Book } from '../../../database/database'

import utils from '../../../utils'

interface IBody {
    paymentId: string
    PayerID: string
}

export default {
    default: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await Connection.transaction(async transaction => {
                const { paymentId, PayerID }: IBody = req.body
                const [payment] = await req.user.getPayments({
                    where: {
                        paymentId
                    },
                    transaction
                })
                if (!payment) {
                    throw new utils.ApiError(
                        'Submitting the order',
                        'There was an unexpected problem when processing your payment',
                        402
                    )
                }
                paypal.payment.execute(
                    paymentId,
                    {
                        payer_id: PayerID
                    },
                    async (error, executedPayment) => {
                        if (error || executedPayment.state !== 'approved') {
                            throw new utils.ApiError(
                                'Submitting the order',
                                'There was an unexpected problem when processing your payment',
                                402
                            )
                        }
                        const books = await Book.findAll({
                            where: {
                                id: payment.products.split(',')
                            }
                        })
                        await Promise.all(books.map(async book => await req.user.addBook(book)))
                        res.send({
                            success: true
                        })
                    }
                )
            })
        } catch (error) {
            next(error)
        }
    },
    validation: () => [
        utils.validator.validateProperty('paymentId'),
        utils.validator.validateProperty('PayerID')
    ]
}