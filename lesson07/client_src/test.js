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

//  [1.3.1] Get comments to the post /json-server/posts/466 -----------------------------------------------------------
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

//  [1.3.2] Get comments with user names to the post /json-server/posts/466 -------------------------------------------
Promise.all([
    fetch(USER_URL).then(function (res) {
        return res.json()
    }),
    fetch(POST_URL).then(function (res) {
        return res.json()
    })
], {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
}).then(function(res){
    var commentList = []; // Comments array
    var commentShow = ''; // The string that is added to html
    var usersIndexList = []; // Users indexes list
    var usersList = []; // User names array
    var i = 0, j = 0, k = 0;

    var usersSource = res[0];
    var commentsSource = res[1];

    commentsSource.comments.forEach(function(){
        usersIndexList.push(commentsSource.comments[i].user);
        commentList.push(commentsSource.comments[i].text);
        i++;
    });

    usersSource.forEach(function(){
        while(k < usersIndexList.length) {
            if (usersSource[j].id == usersIndexList[k]) {
                console.log();
                usersList.push(usersSource[j].name);
            }
            k++;
        }
        k = 0;
        j++;
    });

    for (i = 0; i < commentList.length; i++) {
        commentShow += usersList[i] + ': ' + commentList[i] + '; ';
    }

    document.getElementById('comments').innerHTML = commentShow;
    console.log('Promise.all executed successfully');

}).catch(function(err){
    console.log('Error executing Promise.all!');
});
