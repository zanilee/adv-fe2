$(document).ready(function() {
    var posts = Data.getPosts();

    var postJsonTemplateRaw = $('#posts-json-template').html();
    var postsJsonTemplate = Handlebars.compile(postJsonTemplateRaw);

    Handlebars.registerHelper('json', function(text) {
        return JSON.stringify(text, null, 4);
    });

    $('.posts-json').html(postsJsonTemplate({
        posts: Data.getPosts()
    }));
});
