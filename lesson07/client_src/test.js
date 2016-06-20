var BASE_PATH = '/json-server';
var POSTS_URL = BASE_PATH + '/posts/';
var POST_URL = BASE_PATH + '/posts/466';

//  [1.1] Update likes count on /json-server/posts/466
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
    console.log('Error!');
});

//  [1.2] Get posts and count likes summary on GET /json-server/posts
var likesCountPromise = fetch(POSTS_URL).then(function(res){
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
    console.log('Likes counted successfully');
}).catch(function(err){
    console.log('Error!');
});


//  [1.3] Get comments to the post /json-server/posts/466
var commentsGet = fetch(POST_URL).then(function(res){
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
    console.log('Comment added');
}).catch(function(err){
    console.log('Error!');
});

/*
ToDo:

У каждого комментария есть user - это id пользователя. Необходимо получить всех пользователей по id из комментариев.

    GET /json-server/user/{id}

см. Promise.all, Promise.race
Далее расширяем комментарии полученными именами пользователей.
    Такое преобразование каждого комментария: {user:1, text:'asdf'} -> {user:'name', text:'asdf'}.
    И выводим комментарии на страницу.
 */
