var GodGiftForm = require('containers/god-gift-form/god-gift-form.js');
var UserWealth = require('containers/user-wealth/user-wealth.js');

module.exports = function Game() {
    var elem = $('<div></div>');

    var userWealth = new UserWealth({
        title: 'Wealth'
    });

    var godGiftForm = new GodGiftForm({
        userWealth: userWealth
    });

    function render() {
        elem.html(App.templates['game']({}));
        elem.find('.game__gift-form').html(godGiftForm.render().elem);
        return this;
    }

    return {
        render: render,
        elem: elem
    }
};
