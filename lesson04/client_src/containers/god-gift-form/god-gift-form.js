var GiftTunner = require('containers/gift-tunner/gift-tunner.js');
var GodHateIndicator = require('containers/god-hate-indicator/god-hate-indicator.js');
var UserWealth = require('containers/user-wealth/user-wealth.js');

module.exports = function GodGiftForm(options) {
    var elem = $('<div></div>');

    var userWealth = new UserWealth({});

    var godHateIndicator = new GodHateIndicator({
        hate: 30
    });

    var goldTunner = new GiftTunner({
        resource: userWealth.resources['gold'],
        hateIndicator: godHateIndicator
    });
    var diamondsTunner = new GiftTunner({
        resource: userWealth.resources['diamonds'],
        hateIndicator: godHateIndicator
    });
    var silkTunner = new GiftTunner({
        resource: userWealth.resources['silk'],
        hateIndicator: godHateIndicator
    });

    function render() {
        elem.html(App.templates['god-gift-form']({}));

        elem.find('.god-gift-form__user-wealth').html(userWealth.render().elem);

        elem.find('.god-gift-form__gold-tunner').html(goldTunner.render().elem);
        elem.find('.god-gift-form__diamonds-tunner').html(diamondsTunner.render().elem);
        elem.find('.god-gift-form__silk-tunner').html(silkTunner.render().elem);
        elem.find('.god-gift-form__hate').html(godHateIndicator.render().elem);

        subscribeHandlers(elem);

        return this;
    }

    function subscribeHandlers(elem) {
        elem.find('.god-gift-form__send').click(function() {
            console.log('Send gift [Gold: ' + goldTunner.getCount() + ', Diamonds: ' + diamondsTunner.getCount() + ', Silk: ' + silkTunner.getCount() + ']');
        });
    }

    return {
        render: render,
        elem: elem
    }
};
