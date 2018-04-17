const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const rimraf = require('rimraf');

// delete all files in folder
rimraf('./client/uploads/**.mp3', function () { console.log('upload folder is empty'); });

// Init app
const app = express();

const audioArray = [];
app.use(bodyParser.json());

// static files
app.use(express.static(__dirname + '/client'));

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './client/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + (audioArray.length + 1) + path.extname(file.originalname));
  }
});

// Init Upload
var upload = multer({
  storage: storage,
  limits:{fileSize: 10000000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
});

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|zip|gif|mp3/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  // if(mimetype && extname){
  if(true){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

app.get('/files', (req, res) => {
  res.json(audioArray);
});

app.post('/upload',  (req, res) => {
  var upload = multer({storage: storage}).single('audio');
  upload(req, res, (err) => {
    if(err){
      res.json({
          success: false,
          message: err
      })
    } else {
      if(req.file == undefined){
        res.json({
            success: false,
            message: 'Error: No File Selected!'
        })
      } else {
        res.json({
          success: true,
          message: 'File Uploaded!',
          file: `uploads/${req.file.filename}`
        });
        audioArray.push(req.file.filename);
      }
    }
  });
});

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));
