const db = require('../models/index.model');
const News = db.news
const User = db.user


const fs = require('fs')

const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './storage/images/news')
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + extension
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1048576 //bytes or 2mb
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == 'image/png' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg') {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png or .jpg format allowed!'));
        }
    }
})

module.exports = {
    upload: upload,
    async read(req, res, next) {
        try {
            const allData = await News.findAll({
                where: {
                    deletedAt: null,
                    isActive: true,
                },
                attributes: ['id', 'title', 'thumbnail', 'content'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'full_name']
                    },
                ],
                order: [
                    ['createdAt', 'ASC']
                ]
            })

            res.status(200).send({
                success: true,
                message: "Get All News Has Been Successfully.",
                data: allData
            })
        }
        catch (err) {
            next(err)
        }
    },

    async readById(req, res, next) {
        try {
            const { id } = req.params

            const data = await News.findOne({
                where: {
                    id: id,
                    deletedAt: null,
                    isActive: true,
                },
                attributes: ['id', 'title', 'thumbnail', 'content'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'full_name']
                    },
                ],
                order: [
                    ['createdAt', 'ASC']
                ]
            })

            if (data) {
                res.status(200).send({
                    success: true,
                    message: "Get News by Id Has Been Successfully.",
                    data: data
                })
            } else {
                res.status(400).json({
                    success: false,
                    message: 'News not found.'
                })
            }

        }
        catch (err) {
            next(err)
        }
    },

    async create(req, res, next) {
        try {
            const { title, content, UserId } = req.body

            let data = {
                title: title,
                content: content,
                thumbnail: req.file ? req.file.filename : 'default.jpg',
                UserId: UserId,
                createdBy: UserId
            }

            const createNews = await News.create(data)

            res.status(201).json({
                success: true,
                message: 'Succesfully creating News.',
                data: createNews
            })
        }
        catch (err) {
            next(err)
        }
    },

    async delete(req, res, next) {
        try {
            const { id } = req.params
            const { deletedBy } = req.body

            const data = await News.findOne({
                where: {
                    id: id
                },
                attributes: ['id']
            })

            if (data) {
                const deleteData = await News.update({
                    deletedAt: new Date(),
                    deletedBy: deletedBy,
                    isActive: false
                }, {
                    where: {
                        id: id
                    }
                })
                res.status(200).json({
                    success: true,
                    message: 'Delete News has been successfully.'
                })
            } else {
                res.status(400).json({
                    success: false,
                    message: 'News not found.'
                })
            }

        }
        catch (err) {
            next(err)
        }
    },

    async update(req, res, next) {
        try {
            const { title, content, updatedBy, isActive } = req.body
            const { id } = req.params

            const data = await News.findOne({
                where: {
                    id: id
                },
                attributes: ['id', 'thumbnail']
            })

            if(data) {
                let dataUpdated = {
                    title: title,
                    content: content,
                    updatedBy: updatedBy,
                    isActive: isActive
                }

                if(req.file) {
                    if(data.thumbnail != null || data.thumbnail != 'default.jpg') {
                        const path = process.cwd() + '/storage/attachment/news/' + data.thumbnail
                        if (fs.existsSync(path)) {
                            //file exists
                            fs.unlink(path, (err) => {
                                if (err) {
                                    console.error(err)
                                    return
                                }
                            })
                        }
                    }
                    dataUpdated.thumbnail = req.file.filename
                }
                const update = await News.update(dataUpdated, {
                    where: {
                        id: id
                    }
                })

                res.status(200).json({
                    success: true,
                    message: 'News has been updated.'
                })
            } else {
                res.status(404).json({
                    success: false,
                    message: 'News not found.'
                })
            }

        }
        catch (err) {
            next(err)
        }
    },
}