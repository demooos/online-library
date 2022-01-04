import { Op } from 'sequelize'

import { Book } from 'database/database'

import middlewares from 'middlewares'

import { GraphQLResolverContext } from 'types/global'

const paidBooks = async (
    _: any,
    { paidBooksOffset, freeBooksOffset }: any,
    context: GraphQLResolverContext
) => {
    middlewares.roleAuthorization(context, 'user')
    return await Book.findAll({
        where: {
            price: {
                [Op.ne]: null
            }
        },
        limit: freeBooksOffset > 0 ? 0 : 10,
        offset: paidBooksOffset
    })
}

export default paidBooks
