describe('page ', function () {
    
    beforeEach(function () {
        browser.url('/');
    });

    it('should check title', function () {
        var title = browser.getTitle();
        expect(title).toBe('test title');
    });

    it('should inc', function () {
        var resBefore = browser.getText('.user-wealth__resources .resource__val')[0];
        var inc = browser.click('.gift-tunner__controls .tune-controls__inc')[0];

        var bar = browser.getText('.gift-tunner__bar .bar')[0];

        expect(resBefore).toBe('20');
        expect(bar.length).toBe(1);
        var resAfter = browser.getText('.user-wealth__resources .resource__val')[0];
        expect(resAfter).toBe('19');
    });
});
