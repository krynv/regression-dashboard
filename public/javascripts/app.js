angular.module('qaDashboard', ['restangular'])
    .controller('NavigationCtrl', ["$scope", "$location", "$anchorScroll",
        function ($scope, $location, $anchorScroll) {
            $scope.scrollTo = function (id) {
                $location.hash(id);
                $anchorScroll();
            }
        }]);

// Environment
require('../components/environments/script.js');
require('../components/environments/style.scss');

// Feature
require('../components/features/script.js');
require('../components/features/style.scss');

// Day
require('../components/days/script.js');
require('../components/days/style.scss');

// Hour
require('../components/hours/script.js');

// Report Data (URL & JSON)
require('../components/report/script.js');
require('../components/report/style.scss');

// Index Style
require('../stylesheets/style.scss');
