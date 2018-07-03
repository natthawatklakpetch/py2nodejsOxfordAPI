var http = require('http');
var sha256 = require('sha256');
var url = require('url');
var encrypt = require('./modules/encrypt');
var fs = require('fs');
var isEmptyObject = require('is-empty-object')
var mysql = require('mysql');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
var formidable = require('formidable');
var ejs = require('ejs');

http.createServer(function(req, res) {

  var fullUrl = new URL("https://text.com" + req.url);
  console.log(`Path name = ${fullUrl.pathname}`);

  if (fullUrl.pathname == '/oxfordapi.html') {
    var checkResult = "NotCheckYet";
    var q = url.parse(req.url, true).query;
    console.log(`Requested word = ${q.word}`);

    if (q.word !== undefined) {
      exec(`python glu.py ${q.word}`, (err, stdout, stderr) => {
        if (err) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        checkResult = stdout;
        console.log(`result in exe ${checkResult}`);
        callback();
      });
    }

    function callback() {
      var path = url.parse(req.url, true);
      var filename = "." + path.pathname;
      var filename = `.${path.pathname}`;
      fs.readFile(filename, 'utf-8', function(err, data) {
        if (err) {
          res.writeHead(404, {
            'Content-Type': 'text/html'
          });
          return res.end("service list = {sha256}");
        }
        res.writeHead(200, {
          'Content-Type': 'text/html'
        });

        var renderedHtml = ejs.render(data, {
          checkResult: checkResult,
          word: q.word
        });
        console.log(`result in readFile ${checkResult}`);
        // res.write(data);
        return res.end(renderedHtml);
      });
    }

  } else if (fullUrl.pathname == '/fileupload') { ////////////////////////////////////////////////

    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      var oldpath = files.filetoupload.path;
      var newpath = './input.jpg';
      fs.rename(oldpath, newpath, function(err) {
        if (err) throw err;
        console.log('File uploaded and moved!');
        console.log('Making a mess in process (It\'s mean please wait, stay here. Do no leave me!)...');
      });
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.write('<meta http-equiv="refresh" content="5; url=http://localhost:8080/run">');
      return res.end();
    });


  } else if (fullUrl.pathname == '/upload') { ////////////////////////////////////////////////
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.write('<form id="uploadForm" action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<label>Position Mess:</label>');
    res.write('<input type="number" name="position_mess" value="80"><br>');
    res.write('<label>Color Mess:</label>');
    res.write('<input type="number" name="color_mess" value="80"><br>');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
  } else if (fullUrl.pathname == '/run') { ////////////////////////////////////////////////
    async function mess() {
      const {
        stdout,
        stderr
      } = await exec('python experiment.py 50 50');
      console.log('stdout:', stdout);
      console.log('stderr:', stderr);
      fs.readFile('result.html', function(err, data) {
        if (err) {
          res.writeHead(404, {
            'Content-Type': 'text/html'
          });
          return res.end("service list = {sha256}");
        }
        res.writeHead(200, {
          'Content-Type': 'text/html'
        });
        res.write(data);
        return res.end();
      });
    }
    mess();
  } else if (fullUrl.pathname == '/encrypt') { ////////////////////////////////////////////////
    goto_encrypt(req, res);
  } else if (fullUrl.pathname == '/238b9f2f4dba0822c0a7ad8f949b756ccc7b3839436f6b7976f768abf9c3e365') { ////////////////////////////////////////////////
    goto_dog(req, res);
  } else {
    var q = url.parse(req.url, true);
    var filename = "." + q.pathname;
    fs.readFile(filename, function(err, data) {
      if (err) {
        res.writeHead(404, {
          'Content-Type': 'text/html'
        });
        return res.end("service list = {sha256}");
      }
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.write(data);
      return res.end();
    });
  }

  function goto_encrypt(req, res) {
    var q = url.parse(req.url, true).query;
    console.log(q);
    if (!isEmptyObject(q)) {
      try {
        res.end(encrypt.shadox(q.x));
      } catch (error) {
        console.log(error.message);
      }
    } else {
      res.end("How to use: /encrypt?x=example");
    }
  }

  function goto_dog(req, res) {
    fs.readFile('test1.html', function(err, data) {
      if (err) {
        res.writeHead(404, {
          'Content-Type': 'text/html'
        });
        return res.end("404 Not Found");
      }
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.write(data);
      return res.end();
    });
  }

}).listen(8080);
