const JWT = require('jsonwebtoken')
const Grid = require('gridfs-stream')
const mongoose = require('mongoose')
const conn = require('../helpers/init_mogodb');

let gfs;
let gridFSBucket;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo)
    gridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads'
    });
    gfs.collection('uploads')
})

module.exports = {
    upload: (req, res, next) => {
        const token = req.headers['authorization'].split(' ')[1]
        const { aud } = JWT.decode(token)

        // console.log(aud);
        mongoose.connection.db.collection('uploads.files', (err, collection) => {
            collection.findOneAndUpdate({ filename: req.file.filename }, { $set: { userID: aud } }, { upsert: true })
        })
        res.redirect('/')
    },

    main: (req, res) => {
        const token = req.headers['authorization'].split(' ')[1]
        const { aud } = JWT.decode(token)

        gfs.files.find({ userID: aud }).toArray((err, files) => {
            // Check if filesmis empty
            if (!files || files.length === 0) {
                res.send({ files: false });
            } else {
                files.map(file => {
                    if (
                        file.contentType === 'image/jpeg' ||
                        file.contentType === 'image/png'
                    ) {
                        file.isImage = true;
                    } else {
                        file.isImage = false;
                    }
                });
                res.send({ files: files });
            }
        });
    },

    delete: (req, res) => {
        const token = req.headers['authorization'].split(' ')[1]
        const { aud } = JWT.decode(token)

        gfs.files.find({ userID: aud }).toArray((err, files) => {
            for (let file of files) {
                if (file._id == req.body.id) {
                    gridFSBucket.delete(file._id)
                }
            }
        });
        res.send('deleted')
    },

    deleteAll: (req, res) => {
        const token = req.headers['authorization'].split(' ')[1]
        const { aud } = JWT.decode(token)

        gfs.files.find({ userID: aud }).toArray((err, files) => {
            for (let file of files) {
                gridFSBucket.delete(file._id)
                console.log(file._id);
            }
        });
        res.send('delete')
    },

    images: (req, res) => {
        gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
            // Check if file
            if (!file || file.length === 0) {
                return res.status(404).json({
                    err: 'No file exists'
                });
            }

            // Check if image
            if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
                // Read output to browser
                const readstream = gridFSBucket.openDownloadStream(file._id);
                readstream.pipe(res);
            } else {
                res.status(404).json({
                    err: 'Not an image'
                });
            }
        });
    }
}