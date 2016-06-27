module.exports = function TuneControls(options) {
    var elem = $('<div></div>');

    var bar = options.bar; // <----
    var hateIndicator = options.hateIndicator; // <----
    var resource = options.resource;
    var startAmount = resource.getAmount();

    function render() {
        elem.html(App.templates['tune-controls']({}));
        subscribeHandlers(elem);

        return this;
    }

    function subscribeHandlers() {
        elem.find('.tune-controls__inc').click(function() {
            if (resource.getAmount() > 0) {
                bar.inc(); // <----
                hateIndicator.dec(resource.hateCount); // <----
                resource.decAmount();
            }
        });
        elem.find('.tune-controls__dec').click(function() {
            if (resource.getAmount() < startAmount) {
                bar.dec(); // <----
                hateIndicator.inc(resource.hateCount); // <----
                resource.incAmount();
            }
        });
    }

    return {
        render: render,
        elem: elem
    }
};
