define(['<%= src %>'], function (<%= _.classify(name) %><%= type %>) {

    describe('Give it some context', function () {
        var <%= name %><%= type %> = new <%= _.classify(name) %><%= type %>();

        describe('maybe a bit more context here', function () {

            it('should run here few assertions', function () {
                 
            });

        });
    });

});