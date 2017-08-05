angular.module('qaDashboard').component('hours', {
    require: {
        dayParent: '^days',
    },
    bindings: {
        day: '<',
    },
    template: require('./template.html'),

});