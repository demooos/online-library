import fs from 'fs'
import sharp from 'sharp'

import middlewares from 'middlewares'

import utils from 'utils'

import { MulterRoute } from 'types/global'

const handleMulterFile = (): MulterRoute => (req, res, next) =>
    middlewares.multerFile.single('file')(req, res, () => {
        const deleteFile = () => {
            try {
                fs.existsSync(req.file.path) && fs.unlinkSync(req.file.path)
            } catch (error) {}
        }
        switch (true) {
            case !req.file as boolean:
                next(
                    new utils.ApiError(
                        'Sending a file',
                        'There was an unexpected problem when sending the file',
                        500
                    )
                )
                break
            case req.allowedExtenstionsError:
                deleteFile()
                next(
                    new utils.ApiError(
                        'Sending a file',
                        'You cannot send file with such an extension',
                        500
                    )
                )
                break
            case req.sizeLimit:
                deleteFile()
                next(
                    new utils.ApiError(
                        'Sending a file',
                        'You cannot send file with such a large size',
                        500
                    )
                )
                break
            default:
                const { filename, path } = req.file
                const handleSharp = async () =>
                    await sharp(path)
                        .rotate()
                        .resize(800)
                        .jpeg({ quality: 75 })
                        .toBuffer((error, buffer) => {
                            if (error) {
                                deleteFile()
                                next(
                                    new utils.ApiError(
                                        'Sending a file',
                                        'There was an unexpected problem when sending the file',
                                        500
                                    )
                                )
                            }
                            fs.writeFileSync(path, buffer)
                            next()
                        })
                if (/jpg|jpeg|png|gif/i.test(filename)) {
                    handleSharp()
                } else {
                    next()
                }
        }
    })

export default handleMulterFile
