const Grid = require('gridfs-stream')
const mongoose = require('mongoose')
const conn = require('../helpers/init_mogodb');

let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('uploads')
        // console.log('added Grid');
})

module.exports = {
    upload: (req, res, next) => {
        res.redirect('/')
    },

    main: (req, res) => {
        console.log(gfs);
        gfs.files.find().toArray((err, files) => {
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
        gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
            if (err) {
                return res.status(404).json({ err: err });
            }

            res.redirect('/');
        });
    }
}