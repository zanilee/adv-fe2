module.exports = function Resource(options) {
    var elem = $('<div></div>');
    var name = options.name || '';
    var total = options.total || 0;
    var hateCount = options.hateCount || 1;

    function render() {
        elem.html(App.templates['resource']({
            name: options.name,
            total: total
        }));

        return this;
    }

    return {
        render: render,
        incAmount: function (val) {
            total += val || 1;
            render();
        },
        decAmount: function (val) {
            total -= val || 1;
            render();
        },
        getAmount: function () {
            return total;
        },
        hateCount: hateCount,
        name: name,
        total: total,
        elem: elem
    };
};
