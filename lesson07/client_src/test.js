var BASE_PATH = '/json-server';
var POSTS_URL = BASE_PATH + '/posts/';
var POST_URL = BASE_PATH + '/posts/466';
var USER_URL = BASE_PATH + '/users/';

//  [1.1] Update likes count on /json-server/posts/466 ----------------------------------------------------------------
var postUpdate = fetch(POST_URL).then(function(res){ // Async post success
    return fetch(POST_URL, {
        method: 'PATCH',
            headers: {
            'Accept': 'application/json',
                'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "likeCount": 18
        })
    });
});

postUpdate.then(function(){
    console.log('Likes updated');
}).catch(function(err){
    console.log('Error executing postUpdate!');
});

//  [1.2] Get posts and count likes summary on GET /json-server/posts -------------------------------------------------
var likesCountPromise = fetch(POSTS_URL, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
}).then(function(res){
    return res.json();
});

var likesCount = likesCountPromise.then(function(post){
    var likesSum = 0;
    var i = 0;

    post.forEach(function(){
        likesSum += post[i].likeCount;
        i++;
    });

    document.getElementById('likes').innerHTML = likesSum;
});

likesCount.then(function(){
    console.log('Likes counted successfully.');
}).catch(function(err){
    console.log('Error executing likesCount!');
});

//  [1.3] Get comments to the post /json-server/posts/466 -------------------------------------------------------------
var commentsGet = fetch(POST_URL, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
}).then(function(res){
    return res.json();
}).then(function(post){
    var commentShow = '';
    var i = 0;

    post.comments.forEach(function(){
        commentShow += post.comments[i].user + ': ' + post.comments[i].text + '; ';
        i++;
    });
    document.getElementById('comments').innerHTML = commentShow;
});

commentsGet.then(function(){
    console.log('Comment added successfully.');
}).catch(function(err){
    console.log('Error executing commentsGet!');
});

//  ToDo --------------------------------------------------------------------------------------------------------------
//  can we announce like this & then use it in every our promise in the project?
var usersJson = fetch(USER_URL);
var postsJson = fetch(POSTS_URL);


Promise.all([
    postsJson,
    usersJson
], {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
}).then(function(res){
    var commentShow = '';
    var usersList = [];
    var i = 0;

    console.log(res[0]);
    console.log('---------------------');
    console.log(res[1]);

    //  ??Ok, we got "Response" as a result. But we need json. How we can get it from response?


//    res.comments.forEach(function(){
//        commentShow += usersList[res.comments[i].user] + ': ' + res.comments[i].text + '; ';
//        console.log(commentShow);
//        i++;
//    });
});
//.catch(function(err){
//    console.log('Error executing Promise.all!');
//});
