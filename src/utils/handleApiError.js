import utils from 'utils'

export default error => {
    console.log(error)
    if (error.response) {
        const status = error.response.status
        const { errorHeader, errorMessage } = error.response.data
        status === 401 && utils.redirectTo('/user/login')
        if (errorHeader && errorMessage) {
            return utils.setFeedbackData(errorHeader, errorMessage)
        }
        return utils.setFeedbackData(
            'Connecting to the server',
            `A connection couldn't be established with the server or an unexpected problem occurred on its side`,
            'Refresh the application',
            () => process.env.NODE_ENV === 'production' && window.location.reload()
        )
    }
    if (error.request) {
        return utils.setFeedbackData(
            'Request Processing',
            'The server cannot temporarily process your request',
            'Refresh the application',
            () => process.env.NODE_ENV === 'production' && window.location.reload()
        )
    }
    utils.setFeedbackData(
        'Request Processing',
        'An unexpected problem has occurred in the application',
        'Refresh the application',
        () => process.env.NODE_ENV === 'production' && window.location.reload()
    )
}