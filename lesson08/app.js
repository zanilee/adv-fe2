var express = require( 'express' );
var path = require( 'path' );
var fs = require( 'fs' );
var url = require('url');
var apiVersion = require('./package').version;

var app = express();

app.set('port', 5000);

app.listen(app.get('port'), function() {
    console.log('Node app is running on http://localhost:' + app.get('port') );
});

app.get('/', function (req, res) {
    var urlParsed = url.parse(req.url, true);

    console.log(urlParsed);

    res.send('<html><body><h1>My web app http API! Version ' + apiVersion + ' </h1></body></html>');
});

app.all('/test/', function (req, res) {
    res.send('<html><body><h1>Hello test</h1></body></html>');
});

//  Get request
app.get('/api/' + apiVersion + '/*', function (req, res) {
    render(req, res);
});

//  Post request
app.post('/api/' + apiVersion + '/*', function (req, res) {
    add(req, res);
});

//  Put request
app.put('/api/' + apiVersion + '/*', function (req, res) {
    put(req, res);
});

//  Delete request
app.delete('/api/' + apiVersion + '/*', function (req, res) {
    remove(req, res);
});

//  Handle all other requests
app.all('/api/' + apiVersion + '/*', function (req, res) {
    console.log(req);

    render(req, res);
});


function render(req, res) {
    var dirPath = req.path + '/';
    //   /api/1.0.1/users/

    dirPath = dirPath.replace('/' + apiVersion + '/', '/');
    dirPath = path.join(__dirname, dirPath);
    //   /api/users/
    
    var jsonName = req.method.toLowerCase() + '.json';
    //   get.json, post.json, etc.
    //   \/api\/[a-z]*\/[0-9]*\/get.json


    function fileList(dir) {
        return fs.readdirSync(dir).reduce(function(list, file) {
            var name = path.join(dir, file);
            var isDir = fs.statSync(name).isDirectory();
            return list.concat(isDir ? fileList(name) : [name]);
        }, []);
    }

    // var regexp = '\/api\/[a-z]*\/[0-9]*\/';
    var theFileList = fileList(dirPath);

    for (var i = 0; i < theFileList.length; i++) {
        if (fs.statSync( theFileList[i])) {
            res.setHeader('content-type', 'application/json');

            fs.createReadStream(theFileList[i]).pipe(res);
            console.log(i , ' => ', theFileList[i]);
        } else {
            console.log('no such file', theFileList[i]);

            res
                .status(404)
                .json([
                    {
                        "info": {
                            "success": false,
                            "code": 12345
                        }
                    }
                ])
                .end();
        }
    }

/*  !!!!!!
    Now we have a list of all files in /api/users/ or /api/posts directory:

    0 ' => ' 'D:\\_educ\\course\\adv-fe2\\lesson08\\api\\posts\\001\\get.json'
    1 ' => ' 'D:\\_educ\\course\\adv-fe2\\lesson08\\api\\posts\\002\\get.json'
    2 ' => ' 'D:\\_educ\\course\\adv-fe2\\lesson08\\api\\posts\\002\\put.json'
    3 ' => ' 'D:\\_educ\\course\\adv-fe2\\lesson08\\api\\posts\\get.json'

    Select from them files from 001, 002 etc folders but not the root folder with get.json or put.json name

    How to select files only in directories??
*/



/*
     //  Initial code

     var fileName = req.path + '/' + req.method.toLowerCase() + '.json';
     //   /api/1.0.1/users/get.json
     fileName = fileName.replace('/' + apiVersion + '/', '/');
     //   replace version: we don't have a version folder in the file structure:
     //   /api/users/get.json
     var filePath = path.join(__dirname, fileName);
     console.log(req.method, filePath);
     //   /Users/puzankov/work/fs/node-js-getting-started/api/users/get.json

    if (fs.statSync(filePath)) {

        res.setHeader('content-type', 'application/json');

        fs.createReadStream(filePath).pipe(res);
    }
    else {
        console.log('no such file', filePath);

        res
            .status(404)
            .json([
                {
                    "info": {
                        "success": false,
                        "code": 12345
                    }
                }
            ])
            .end();
    }
*/
}

function remove(req, res) {
    var dirPath = req.path + '/'; //   /api/1.0.1/users/

    dirPath = dirPath.replace('/' + apiVersion + '/', '/');
    dirPath = path.join(__dirname, dirPath); //  the full path to the file

    var deleteFolderRecursive = function(dirPath) {
        if(fs.statSync(dirPath)) {
            fs.readdirSync(dirPath).forEach(function(file,index){
                var curPath = path.join(dirPath, file);
                console.log(curPath);
                if(fs.lstatSync(curPath).isDirectory()) { // Recursion
                    deleteFolderRecursive(curPath);
                } else { // Delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(dirPath);

            res
                .json([
                    {
                        "status": "success"
                    }
                ])
                .end();

        } else {  // If there is no such directory, why don't we get here??
            console.log('No such directory');
            res
                .status(404)
                .json([{
                    "status": "fail"
                }])
                .end();
        }
    };

    deleteFolderRecursive(dirPath);
}


function add(req, res) {
    var dirPath = req.path + '/'; //   /api/1.0.1/users/001

    dirPath = dirPath.replace('/' + apiVersion + '/', '/');
    dirPath = path.join(__dirname, dirPath); //  the full path to the file

    // Ok, we're doing the dirPath for the 3-rd time - in every function. can we do it as a separate function??

    var filePath = dirPath + 'get.json';

    if (fs.statSync(dirPath)) { // Does the dir exist?
        // Directory already exists: 409
        console.log('The user/post already exist!');
        res
            .status(409) // Conflict: Indicates that the request could not be processed because of conflict in the request.
            .json([{
                "status": "fail"
            }])
            .end();
    } else {   // If there is no such directory, why don't we get here??
        // Directory does not exist: create

        // How to get the "003" from the request??

        var postData = {
            "postId": "003",  // Replace to an id from the path in browser
            "imgUrl":"some-image.jpg",
            "likeCount":0,
            "description":"Cool text",
            "userId":"003" // Replace to an id from the path in browser
        };

        var userData = {
            "id": "003", // Replace to an id from the path in browser
            "email": "testuser003@test.com",
            "name": "testuser003",
            "image": "some-image003.jpg",
            "password": "1324567",
            "following": {
                "tags": [],
                "users": []
            }
        };

        // How to add a check if it is user or post??
        fs.writeFile(filePath, JSON.stringify(postData, null, 4), function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("JSON saved to " + filePath);
            }
        });

        res
            .json([{
                "status": "success"
            }])
            .end();  // Do we need a res when we're done and no other action except of end??
    }
}


function put(req, res) {
    var dirPath = req.path + '/'; //   /api/1.0.1/users/001

    dirPath = dirPath.replace('/' + apiVersion + '/', '/');
    dirPath = path.join(__dirname, dirPath); //  the full path to the file

    var filePath = dirPath + 'get.json';

    if (fs.statSync(dirPath)) {
        var postData = {
            "postId": "003",  // Replace to an id from the path in browser
            "imgUrl":"some-image.jpg",
            "likeCount":0,
            "description":"Cool text",
            "userId":"003" // Replace to an id from the path in browser
        };

        var userData = {
            "id": "003", // Replace to an id from the path in browser
            "email": "testuser003@test.com",
            "name": "testuser003",
            "image": "some-image003.jpg",
            "password": "1324567",
            "following": {
                "tags": [],
                "users": []
            }
        };

        // How to add a check if it is user or post??
        fs.writeFile(filePath, JSON.stringify(userData, null, 4), function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("JSON saved to " + filePath);
            }
        });

        res
            .json([{
                "status": "success"
            }])
            .end();  // Do we need a res when we're done and no other action except of end??

    } else {
        console.log('There is no such file');

        res
            .status(404)
            .json([{
                "status": "fail"
            }])
            .end();
    }
}

//app.get('/api/1.0/users', function (req, res) {
//    res.send(users);
//});
//
//app.get('/api/1.0/users/:userId', function (req, res) {
//
//    console.log(req.query);
//
//    res.send(user);
//});
