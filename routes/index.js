var express = require('express');
var router = express.Router();
var formidable = require("formidable")
var fs = require('fs')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.delete('/file', (req, res) => {
  const form = formidable({ multiples: true, uploadDir: './uploads' });
  form.parse(req, (err, fields, files) => {
    console.log('aaaaaaa',fields.path)
    let path =  fields.path
    console.log(path)
    if (fs.existsSync(path)){
      console.log('entrou aq')
      fs.unlink(path, err => {
        if(err) {   console.log('entrou aq nounlinik ERRO',path)
          res.status(400).json({
            err
          });
        } else {
          console.log('entrou aq nounlinik',path)
          res.json({
            fields
          })
        }
      });
    } else {
      console.log('nao tem path')
    }
 
  });
});

router.post('/upload', (req, res, next) => {
  console.log('upload')
  const form = formidable({ multiples: true, uploadDir: './uploads' });

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    res.json({ fields, files });
  });

});

module.exports = router;
