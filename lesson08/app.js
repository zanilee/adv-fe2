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

app.all('/api/:apiVersion/:entity/?:id', function (req, res) {
    var reqMethod = req.method.toLowerCase();

    switch (reqMethod) {
        case 'get':
            render(req, res);
            break
        case 'post':
            add(req, res);
            break
        case 'put':
            put(req, res);
            break
        case 'delete':
            remove(req, res);
            break
        default:
            render(req, res);
            break
    }
});

//  Render
function render(req, res) {
    var dirPath = req.path + '/';
    //   /api/1.0.1/users/

    dirPath = dirPath.replace('/' + apiVersion + '/', '/');
    dirPath = path.join(__dirname, dirPath);
    //   /api/users/
    
    var jsonName = req.method.toLowerCase() + '.json';
    //   get.json, post.json, etc.
    //   var regexp = '\/api\/[a-z]*\/[0-9]*\/';

    function fileList(dir) {
        return fs.readdirSync(dir).reduce(function(list, file) {
            var name = path.join(dir, file);
            var isJson = (file === jsonName);
            var isDir = fs.statSync(name).isDirectory();

            return (isJson || isDir) ? list.concat(isDir ? fileList(name) : [name] ) : list;
        }, []);
    }

    var theFileList = fileList(dirPath);


    for (var i = 0; i < theFileList.length; i++) {
        if (fs.statSync( theFileList[i])) {
            res.setHeader('content-type', 'application/json');

            fs.createReadStream(theFileList[i]).pipe(res);
        } else {
            console.log('There is no such file', theFileList[i]);

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

//  Delete
function remove(req, res) {
    var dirPath = req.path + '/'; //   /api/1.0.1/users/

    dirPath = dirPath.replace('/' + apiVersion + '/', '/');
    dirPath = path.join(__dirname, dirPath); //  the full path to the file

    var deleteFolderRecursive = function(dirPath) {
        try {
            var stats = fs.statSync(dirPath); // Does the dir exist?

            fs.readdirSync(dirPath).forEach(function(file,index){
                var curPath = path.join(dirPath, file);

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

        }
        catch(err) {  // If there is no such directory, why don't we get here??
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

//  Add post
function add(req, res) {
    var dirPath = req.path + '/'; //   /api/1.0.1/users/001

    dirPath = dirPath.replace('/' + apiVersion + '/', '/');
    dirPath = path.join(__dirname, dirPath); //  the full path to the file

    var filePath = dirPath + 'get.json';

    try {
        var stats = fs.statSync(dirPath); // Does the dir exist?
        // Directory already exists: 409

        console.log('The user/post already exist!');
        res
            .status(409) // Conflict: Indicates that the request could not be processed because of conflict in the request.
            .json([{
                "status": "fail"
            }])
            .end();
    }
    catch(err) {
        var postData = '';

        if (req.params.entity == 'users') {
            postData = {
                "id": req.params.id, // Replace to an id from the path in browser
                "email": "testuser003@test.com",
                "name": "testuser003",
                "image": "some-image003.jpg",
                "password": "1324567",
                "following": {
                    "tags": [],
                    "users": []
                }
            };
        } else {
            postData = {
                "postId": req.params.id,  // Replace to an id from the path in browser
                "imgUrl": "some-image.jpg",
                "likeCount": 0,
                "description": "Cool text",
                "userId": req.params.id // Replace to an id from the path in browser
            };
        }
        
        fs.mkdir(dirPath); // Directory does not exist: creating

        fs.writeFile(filePath, JSON.stringify(postData, null, 4), function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log('JSON saved to ' + filePath);
            }
        });

        res
            .json([{
                "status": "success"
            }])
            .end();
    }
}


function put(req, res) {
    var dirPath = req.path + '/'; //   /api/1.0.1/users/001

    dirPath = dirPath.replace('/' + apiVersion + '/', '/');
    dirPath = path.join(__dirname, dirPath); //  the full path to the file

    var filePath = dirPath + 'get.json';

    try {
        var stats = fs.statSync(dirPath);

        var postData = '';

        if (req.params.entity == 'users') {
            postData = {
                "id": req.params.id, // Replace to an id from the path in browser
                "email": "putupdate@test.com",
                "name": "putupdate",
                "image": "some-image003.jpg",
                "password": "1324567",
                "following": {
                    "tags": [],
                    "users": []
                }
            };
        } else {
            postData = {
                "postId": req.params.id,  // Replace to an id from the path in browser
                "imgUrl": "some-image.jpg",
                "likeCount": 0,
                "description": "put update",
                "userId": req.params.id // Replace to an id from the path in browser
            };
        }

        fs.writeFile(filePath, JSON.stringify(postData, null, 4), function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log('JSON saved to ' + filePath);
            }
        });

        res
            .json([{
                "status": "success"
            }])
            .end();
    }
    catch(err) {
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
