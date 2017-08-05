angular.module('qaDashboard').component('days', {
    require: {
        featureParent: '^features',
    },
    bindings: {
        feature: '<',
    },
    controller: function () {
        this.$onInit = () => {
            this.setFilteredHours = (day, mySelection) => {
                //console.log(`You have selected: ${mySelection} for: ${day.date}`);
                if (mySelection === "all") {
                    day.hours.forEach((hour) => {
                        hour.visible = true;
                    });
                    return;
                }

                day.hours.forEach((hour) => {
                    if (hour.summary === mySelection) {
                        hour.visible = true;
                    }
                    else {
                        hour.visible = false;
                    }
                });
            }
        }
    },
    template: require('./template.html'),
});