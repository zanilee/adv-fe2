$(document).ready(function() {
    var posts = Data.getPosts();

    //
    //  Simple helper
    //  ---------------------------------------------

    var postJsonTemplateRaw = $('#posts-json-template').html();
    var postsJsonTemplate = Handlebars.compile(postJsonTemplateRaw);

    Handlebars.registerHelper('json', function(text) {
        return JSON.stringify(text, null, 4);
    });

    $('.posts-json').html(postsJsonTemplate({
        posts: Data.getPosts()
    }));

    //
    //  Block helper
    //  ---------------------------------------------

    var postTableTemplateRaw = $('#posts-table-template').html();
    var postsTableTemplate = Handlebars.compile(postTableTemplateRaw);

    Handlebars.registerHelper('table', function(context, options) {
        var result = '<ul>';

        for(var i = 0, j = context.length; i < j; i++) {
            var stripeClass = (i % 2) ? '_even' : '_odd';

            result = result + '<li class="' + stripeClass + '">' + options.fn(context[i]) + '</li>';
        }

        return result + '</ul>';
    });

    $('.posts-table').html(postsTableTemplate({
        posts: Data.getPosts()
    }));

});
