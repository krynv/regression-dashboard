angular.module('qaDashboard').component('environments', {
    controller: function (Restangular) {
        this.$onInit = () => {
            Restangular.one('environments').get().then((response) => {
                this.environments = response.environments;
            });
        }
    },
    template: require('./template.html'),

}).filter('formattedEnvironment', () => {
    return (item) => {
        return item.replace('-', ' ')
                   .replace('_', ' ')
                   .replace('_', ' ')
                   .replace('_', ' ');
    }
});