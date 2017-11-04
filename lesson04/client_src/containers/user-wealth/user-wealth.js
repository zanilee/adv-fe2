var Resource = require('components/resource/resource.js');

module.exports = function UserWealth(options) {
    var elem = $('<div></div>');

    var goldRes = new Resource({
        name: 'Gold',
        total: 20,
        hateCount: 2
    });
    var diamondsRes = new Resource({
        name: 'Diamonds',
        total: 5,
        hateCount: 3
    });
    var silkRes = new Resource({
        name: 'Silk',
        total: 40,
        hateCount: 1
    });

    var resources = {};
    resources[goldRes.name.toLowerCase()] = goldRes;
    resources[diamondsRes.name.toLowerCase()] = diamondsRes;
    resources[silkRes.name.toLowerCase()] = silkRes;

    function render() {
        elem.html(App.templates['user-wealth']({}));

        elem.find('.user-wealth__gold-res').html(goldRes.render().elem);
        elem.find('.user-wealth__diamonds-res').html(diamondsRes.render().elem);
        elem.find('.user-wealth__silk-res').html(silkRes.render().elem);
        return this;
    }

    return {
        render: render,
        elem: elem,
        resources: resources
    }
};