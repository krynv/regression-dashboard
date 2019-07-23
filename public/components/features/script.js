angular.module('qaDashboard').component('features', {
    bindings: {
        environment: '<',
    },
    controller: ["Restangular", function (Restangular) {

        this.$onInit = () => {
            Restangular.one('environments')
                .one(this.environment)
                .one('features')
                .get()

                .then((response) => {
                    this.features = response.features;
                });
        }

        this.refreshFeature = () => {

            Restangular.one('environments')
                .one(this.environment)
                .one('features')
                .get()

                .then((response) => {
                    this.features = response.features;
                });
        }

        this.toggleDays = (feature) => {
            feature.active = !feature.active;
        }
    }],
    template: require('./template.html'),

})
    .filter('formattedFeature', () => {
        return (item) => {
            return item.replace('-', ' ')
                .replace('_', ' ')
                .replace('_', ' ')
                .replace('_', ' ');
        }
    });