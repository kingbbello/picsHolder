const GridFsStorage = require('multer-gridfs-storage')
const crypto = require('crypto');
const path = require('path');
const multer = require('multer')

require('dotenv').config()
const dbName = process.env.dbname
const password = process.env.password


const storage = new GridFsStorage({
    url: `mongodb+srv://bsgCans:${password}@cluster0.hxeaw.mongodb.net/${dbName}?retryWrites=true&w=majority`,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(8, (err, buf) => {
                if (err) {
                    return reject(err)
                }

                const filename = buf.toString('hex') + path.extname(file.originalname)
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads',
                    stuff: 'i wrote this'
                }
                resolve(fileInfo)
            })
        })
    }
})

const upload = multer({ storage })

module.exports = {
    upload: upload
}