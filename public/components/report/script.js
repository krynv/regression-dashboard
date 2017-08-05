angular.module('qaDashboard').component('report', {
    require: {
        hourParent: '^hours',
    },
    bindings: {
        time: '<',
    },
    controller: function () {
        this.filteredDuration = (givenDuration) => {
            return ((givenDuration/1000)/60).toFixed(2) < 1 ? `${Math.round(givenDuration/1000)}s` : `${Math.round(((givenDuration/1000)/60))}m`;
        }
    },
    template: require('./template.html'),

});
