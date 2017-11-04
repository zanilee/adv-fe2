var Bar = require('./bar.js');

describe('bar', function () {
    beforeEach(function () {
        this.bar = new Bar();
    });

    describe('render method ', function () {
        it('should be defined', function () {
            expect(this.bar.render).toBeDefined();
            debugger;
        });

        it('should be called', function () {
            this.bar.render();
            expect(this.bar.render).toHaveBeenCalled();
        });

    });
});
