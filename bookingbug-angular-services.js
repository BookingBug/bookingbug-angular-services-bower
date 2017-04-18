'use strict';

angular.module('BBAdminServices', ['BB', 'BBAdmin.Services', 'BBAdmin.Filters', 'BBAdmin.Controllers', 'trNgGrid', 'ui.calendar']);

angular.module('BBAdminServicesMockE2E', ['BBAdminServices', 'BBAdminMockE2E']);
'use strict';

angular.module('BBAdminServices').config(function ($logProvider) {
    'ngInject';

    $logProvider.debugEnabled(true);
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

window.Collection.Clinic = function (_window$Collection$Ba) {
    _inherits(Clinic, _window$Collection$Ba);

    function Clinic() {
        _classCallCheck(this, Clinic);

        return _possibleConstructorReturn(this, _window$Collection$Ba.apply(this, arguments));
    }

    Clinic.prototype.checkItem = function checkItem(item) {
        var _window$Collection$Ba2;

        return (_window$Collection$Ba2 = _window$Collection$Ba.prototype.checkItem).call.apply(_window$Collection$Ba2, [this].concat(Array.prototype.slice.call(arguments)));
    };

    Clinic.prototype.matchesParams = function matchesParams(item) {
        if (this.params.start_time) {
            if (!this.start_time) {
                this.start_time = moment(this.params.start_time);
            }
            if (this.start_time.isAfter(item.start_time)) {
                return false;
            }
        }
        if (this.params.end_time) {
            if (!this.end_time) {
                this.end_time = moment(this.params.end_time);
            }
            if (this.end_time.isBefore(item.end_time)) {
                return false;
            }
        }
        if (this.params.start_date) {
            if (!this.start_date) {
                this.start_date = moment(this.params.start_date);
            }
            if (this.start_date.isAfter(item.start_date)) {
                return false;
            }
        }
        if (this.params.end_date) {
            if (!this.end_date) {
                this.end_date = moment(this.params.end_date);
            }
            if (this.end_date.isBefore(item.end_date)) {
                return false;
            }
        }
        return true;
    };

    return Clinic;
}(window.Collection.Base);

angular.module('BBAdmin.Services').provider("ClinicCollections", function () {

    return {
        $get: function $get() {
            return new window.BaseCollections();
        }
    };
});
'use strict';

angular.module('BBAdminServices').directive('personTable', function ($log, ModalForm, BBModel) {

    var controller = function controller($scope) {

        $scope.fields = ['id', 'name', 'mobile'];

        $scope.getPeople = function () {
            return BBModel.Admin.Person.$query({ company: $scope.company }).then(function (people) {
                return $scope.people = people;
            });
        };

        $scope.newPerson = function () {
            return ModalForm.new({
                company: $scope.company,
                title: 'New Person',
                new_rel: 'new_person',
                post_rel: 'people',
                success: function success(person) {
                    return $scope.people.push(person);
                }
            });
        };

        $scope.delete = function (person) {
            return person.$del('self').then(function () {
                return $scope.people = _.reject($scope.people, person);
            }, function (err) {
                return $log.error("Failed to delete person");
            });
        };

        $scope.edit = function (person) {
            return ModalForm.edit({
                model: person,
                title: 'Edit Person'
            });
        };

        return $scope.schedule = function (person) {
            return person.$get('schedule').then(function (schedule) {
                return ModalForm.edit({
                    model: schedule,
                    title: 'Edit Schedule'
                });
            });
        };
    };

    var link = function link(scope, element, attrs) {
        if (scope.company) {
            return scope.getPeople();
        } else {
            return BBModel.Admin.Company.$query(attrs).then(function (company) {
                scope.company = company;
                return scope.getPeople();
            });
        }
    };

    return {
        controller: controller,
        link: link,
        templateUrl: 'person_table_main.html'
    };
});
'use strict';

angular.module('BBAdminServices').directive('resourceTable', function (BBModel, $log, ModalForm) {

    var controller = function controller($scope) {

        $scope.fields = ['id', 'name'];

        $scope.getResources = function () {
            var params = { company: $scope.company };
            return BBModel.Admin.Resource.$query(params).then(function (resources) {
                return $scope.resources = resources;
            });
        };

        $scope.newResource = function () {
            return ModalForm.new({
                company: $scope.company,
                title: 'New Resource',
                new_rel: 'new_resource',
                post_rel: 'resources',
                size: 'lg',
                success: function success(resource) {
                    return $scope.resources.push(resource);
                }
            });
        };

        $scope.delete = function (resource) {
            return resource.$del('self').then(function () {
                return $scope.resources = _.reject($scope.resources, function (p) {
                    return p.id === id;
                });
            }, function (err) {
                return $log.error("Failed to delete resource");
            });
        };

        $scope.edit = function (resource) {
            return ModalForm.edit({
                model: resource,
                title: 'Edit Resource'
            });
        };

        return $scope.schedule = function (resource) {
            return resource.$get('schedule').then(function (schedule) {
                return ModalForm.edit({
                    model: schedule,
                    title: 'Edit Schedule'
                });
            });
        };
    };

    var link = function link(scope, element, attrs) {
        if (scope.company) {
            return scope.getResources();
        } else {
            return BBModel.Admin.Company.$query(attrs).then(function (company) {
                scope.company = company;
                return scope.getResources();
            });
        }
    };

    return {
        controller: controller,
        link: link,
        templateUrl: 'resource_table_main.html'
    };
});
'use strict';

angular.module('BBAdminServices').directive('scheduleCalendar', function (uiCalendarConfig, ScheduleRules) {

    var controller = function controller($scope, $attrs) {

        $scope.calendarName = 'scheduleCal';

        $scope.eventSources = [{
            events: function events(start, end, timezone, callback) {
                return callback($scope.getEvents());
            }
        }];

        $scope.getCalendarEvents = function (start, end) {

            return uiCalendarConfig.calendars.scheduleCal.fullCalendar('clientEvents', function (e) {
                return (start.isAfter(e.start) || start.isSame(e.start)) && (end.isBefore(e.end) || end.isSame(e.end));
            });
        };

        var options = $scope.setOptions;
        if (!options) {
            options = {};
        }

        $scope.options = {
            calendar: {
                schedulerLicenseKey: '0598149132-fcs-1443104297',
                height: options.height || "auto",
                editable: false,
                selectable: true,
                defaultView: 'agendaWeek',
                header: {
                    left: 'today,prev,next',
                    center: 'title',
                    right: 'month,agendaWeek'
                },
                selectHelper: false,
                eventOverlap: false,
                lazyFetching: false,
                views: {
                    agendaWeek: {
                        duration: {
                            weeks: 1
                        },
                        allDaySlot: false,
                        slotEventOverlap: false,
                        minTime: options.min_time || '00:00:00',
                        maxTime: options.max_time || '24:00:00'
                    }
                },
                select: function select(start, end, jsEvent, view) {
                    var events = $scope.getCalendarEvents(start, end);
                    if (events.length > 0) {
                        return $scope.removeRange(start, end);
                    } else {
                        return $scope.addRange(start, end);
                    }
                },
                eventResizeStop: function eventResizeStop(event, jsEvent, ui, view) {
                    return $scope.addRange(event.start, event.end);
                },
                eventDrop: function eventDrop(event, delta, revertFunc, jsEvent, ui, view) {
                    if (event.start.hasTime()) {
                        var orig = {
                            start: moment(event.start).subtract(delta),
                            end: moment(event.end).subtract(delta)
                        };
                        $scope.removeRange(orig.start, orig.end);
                        return $scope.addRange(event.start, event.end);
                    }
                },
                eventClick: function eventClick(event, jsEvent, view) {
                    return $scope.removeRange(event.start, event.end);
                }
            }
        };

        return $scope.render = function () {
            return uiCalendarConfig.calendars.scheduleCal.fullCalendar('render');
        };
    };

    var link = function link(scope, element, attrs, ngModel) {

        var scheduleRules = function scheduleRules() {
            return new ScheduleRules(ngModel.$viewValue);
        };

        scope.getEvents = function () {
            return scheduleRules().toEvents();
        };

        scope.addRange = function (start, end) {
            ngModel.$setViewValue(scheduleRules().addRange(start, end));
            return ngModel.$render();
        };

        scope.removeRange = function (start, end) {
            ngModel.$setViewValue(scheduleRules().removeRange(start, end));
            return ngModel.$render();
        };

        scope.toggleRange = function (start, end) {
            ngModel.$setViewValue(scheduleRules().toggleRange(start, end));
            return ngModel.$render();
        };

        return ngModel.$render = function () {
            if (uiCalendarConfig && uiCalendarConfig.calendars.scheduleCal) {
                uiCalendarConfig.calendars.scheduleCal.fullCalendar('refetchEvents');
                return uiCalendarConfig.calendars.scheduleCal.fullCalendar('unselect');
            }
        };
    };

    return {
        controller: controller,
        link: link,
        templateUrl: 'schedule_cal_main.html',
        require: 'ngModel',
        scope: {
            render: '=?',
            setOptions: '=options'
        }
    };
});
'use strict';

angular.module('BBAdminServices').directive('scheduleEdit', function () {

    var link = function link(scope, element, attrs, ngModel) {

        ngModel.$render = function () {
            return scope.$$value$$ = ngModel.$viewValue;
        };

        return scope.$watch('$$value$$', function (value) {
            if (value != null) {
                return ngModel.$setViewValue(value);
            }
        });
    };

    return {
        link: link,
        templateUrl: 'schedule_edit_main.html',
        require: 'ngModel',
        scope: {
            options: '='
        }
    };
});

angular.module('schemaForm').config(function (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {

    schemaFormDecoratorsProvider.addMapping('bootstrapDecorator', 'schedule', 'schedule_edit_form.html');

    return schemaFormDecoratorsProvider.createDirective('schedule', 'schedule_edit_form.html');
});
'use strict';

angular.module('BBAdminServices').directive('scheduleTable', function (BBModel, $log, ModalForm) {

    var controller = function controller($scope) {

        $scope.fields = ['id', 'name', 'mobile'];

        $scope.getSchedules = function () {
            var params = { company: $scope.company };
            return BBModel.Admin.Schedule.query(params).then(function (schedules) {
                return $scope.schedules = schedules;
            });
        };

        $scope.newSchedule = function () {
            return ModalForm.new({
                company: $scope.company,
                title: 'New Schedule',
                new_rel: 'new_schedule',
                post_rel: 'schedules',
                size: 'lg',
                success: function success(schedule) {
                    return $scope.schedules.push(schedule);
                }
            });
        };

        $scope.delete = function (schedule) {
            return schedule.$del('self').then(function () {
                return $scope.schedules = _.reject($scope.schedules, schedule);
            }, function (err) {
                return $log.error("Failed to delete schedule");
            });
        };

        return $scope.edit = function (schedule) {
            return ModalForm.edit({
                model: schedule,
                title: 'Edit Schedule',
                size: 'lg'
            });
        };
    };

    var link = function link(scope, element, attrs) {
        if (scope.company) {
            return scope.getSchedules();
        } else {
            return BBModel.Admin.Company.query(attrs).then(function (company) {
                scope.company = company;
                return scope.getSchedules();
            });
        }
    };

    return {
        controller: controller,
        link: link,
        templateUrl: 'schedule_table_main.html'
    };
});
'use strict';

angular.module('BBAdminServices').directive('scheduleWeekdays', function (uiCalendarConfig, ScheduleRules) {

    var controller = function controller($scope, $attrs) {

        $scope.calendarName = 'scheduleWeekdays';

        $scope.eventSources = [{
            events: function events(start, end, timezone, callback) {
                return callback($scope.getEvents());
            }
        }];

        $scope.getCalendarEvents = function (start, end) {
            return uiCalendarConfig.calendars.scheduleWeekdays.fullCalendar('clientEvents', function (e) {
                return (start.isAfter(e.start) || start.isSame(e.start)) && (end.isBefore(e.end) || end.isSame(e.end));
            });
        };

        var options = $scope.setOptions;
        if (!options) {
            options = {};
        }

        $scope.options = {
            calendar: {
                schedulerLicenseKey: '0598149132-fcs-1443104297',
                height: options.height || "auto",
                editable: false,
                selectable: true,
                defaultView: 'agendaWeek',
                header: {
                    left: '',
                    center: 'title',
                    right: ''
                },
                selectHelper: false,
                eventOverlap: false,
                views: {
                    agendaWeek: {
                        duration: {
                            weeks: 1
                        },
                        titleFormat: '[]',
                        allDaySlot: false,
                        columnFormat: 'ddd',
                        slotEventOverlap: false,
                        minTime: options.min_time || '00:00:00',
                        maxTime: options.max_time || '24:00:00'
                    }
                },
                select: function select(start, end, jsEvent, view) {
                    var events = $scope.getCalendarEvents(start, end);
                    if (events.length > 0) {
                        return $scope.removeRange(start, end);
                    } else {
                        return $scope.addRange(start, end);
                    }
                },
                eventResizeStop: function eventResizeStop(event, jsEvent, ui, view) {
                    return $scope.addRange(event.start, event.end);
                },
                eventDrop: function eventDrop(event, delta, revertFunc, jsEvent, ui, view) {
                    if (event.start.hasTime()) {
                        var orig = {
                            start: moment(event.start).subtract(delta),
                            end: moment(event.end).subtract(delta)
                        };
                        $scope.removeRange(orig.start, orig.end);
                        return $scope.addRange(event.start, event.end);
                    }
                },
                eventClick: function eventClick(event, jsEvent, view) {
                    return $scope.removeRange(event.start, event.end);
                }
            }
        };

        return $scope.render = function () {
            return uiCalendarConfig.calendars.scheduleWeekdays.fullCalendar('render');
        };
    };

    var link = function link(scope, element, attrs, ngModel) {

        var scheduleRules = function scheduleRules() {
            return new ScheduleRules(ngModel.$viewValue);
        };

        scope.getEvents = function () {
            return scheduleRules().toWeekdayEvents();
        };

        scope.addRange = function (start, end) {
            ngModel.$setViewValue(scheduleRules().addWeekdayRange(start, end));
            return ngModel.$render();
        };

        scope.removeRange = function (start, end) {
            ngModel.$setViewValue(scheduleRules().removeWeekdayRange(start, end));
            return ngModel.$render();
        };

        return ngModel.$render = function () {
            if (uiCalendarConfig && uiCalendarConfig.calendars.scheduleWeekdays) {
                uiCalendarConfig.calendars.scheduleWeekdays.fullCalendar('refetchEvents');
                return uiCalendarConfig.calendars.scheduleWeekdays.fullCalendar('unselect');
            }
        };
    };

    return {
        controller: controller,
        link: link,
        templateUrl: 'schedule_cal_main.html',
        require: 'ngModel',
        scope: {
            render: '=?',
            setOptions: '=options'
        }
    };
});
'use strict';

angular.module('BBAdminServices').directive('serviceTable', function ($uibModal, $log, ModalForm, BBModel) {

    var controller = function controller($scope) {
        $scope.fields = ['id', 'name'];
        $scope.getServices = function () {
            var params = { company: $scope.company };
            return BBModel.Admin.Service.$query(params).then(function (services) {
                return $scope.services = services;
            });
        };

        $scope.newService = function () {
            return ModalForm.new({
                company: $scope.company,
                title: 'New Service',
                new_rel: 'new_service',
                post_rel: 'services',
                success: function success(service) {
                    return $scope.services.push(service);
                }
            });
        };

        $scope.delete = function (service) {
            return service.$del('self').then(function () {
                return $scope.services = _.reject($scope.services, service);
            }, function (err) {
                return $log.error("Failed to delete service");
            });
        };

        $scope.edit = function (service) {
            return ModalForm.edit({
                model: service,
                title: 'Edit Service'
            });
        };

        return $scope.newBooking = function (service) {
            return ModalForm.book({
                model: service,
                company: $scope.company,
                title: 'New Booking',
                success: function success(booking) {
                    return $log.info('Created new booking ', booking);
                }
            });
        };
    };

    var link = function link(scope, element, attrs) {
        if (scope.company) {
            return scope.getServices();
        } else {
            return BBModel.Admin.Company.query(attrs).then(function (company) {
                scope.company = company;
                return scope.getServices();
            });
        }
    };

    return {
        controller: controller,
        link: link,
        templateUrl: 'service_table_main.html'
    };
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/***
 * @ngdoc service
 * @name BB.Models:AdminAddress
 *
 * @description
 * Representation of an Address Object
 *
 * @property {string} address1 First line of the address
 * @property {string} address2 Second line of the address
 * @property {string} address3 Third line of the address
 * @property {string} address4 Fourth line of the address
 * @property {string} address5 Fifth line of the address
 * @property {string} postcode The Postcode/Zipcode
 * @property {string} country The country
 */ //

angular.module('BB.Models').factory("AdminAddressModel", function ($q, BBModel, BaseModel, AddressModel) {
    return (

        /***
         * @ngdoc method
         * @name distanceFrom
         * @methodOf BB.Models:AdminAddress
         * @param {string=} address The admin address
         * @param {array} options The options of admin address
         * @description
         * Calculate the address distance in according of the address and options parameters
         *
         * @returns {array} Returns an array of address
         */
        function (_AddressModel) {
            _inherits(Admin_Address, _AddressModel);

            function Admin_Address() {
                _classCallCheck(this, Admin_Address);

                return _possibleConstructorReturn(this, _AddressModel.apply(this, arguments));
            }

            Admin_Address.prototype.distanceFrom = function distanceFrom(address, options) {

                if (!this.dists) {
                    this.dists = [];
                }
                if (!this.dists[address]) {
                    this.dists[address] = Math.round(Math.random() * 50, 0);
                }
                return this.dists[address];
            };

            return Admin_Address;
        }(AddressModel)
    );
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/***
 * @ngdoc service
 * @name BB.Models:AdminClinic
 *
 * @description
 * Representation of an Clinic Object
 *
 * @property {string} setTimes Set times for the clinic
 * @property {string} setResourcesAndPeople Set resources and people for the clinic
 * @property {object} settings Clinic settings
 * @property {string} resources Clinic resources
 * @property {integer} resource_ids Clinic resources ids
 * @property {string} people Clinic people
 * @property {integer} person_ids Clinic Person ids
 * @property {string} services Clinic services
 * @property {integer} services_ids Clinic service ids
 * @property {string} uncovered The uncovered
 * @property {string} className The class Name
 * @property {string} start_time The clinic start thime
 * @property {string} end_time The clinic end time
 */ //

angular.module('BB.Models').factory("AdminClinicModel", function ($q, BBModel, BaseModel, ClinicModel) {
    return function (_ClinicModel) {
        _inherits(Admin_Clinic, _ClinicModel);

        function Admin_Clinic(data) {
            _classCallCheck(this, Admin_Clinic);

            var _this = _possibleConstructorReturn(this, _ClinicModel.call(this, data));

            if (!_this.repeat_rule) {
                _this.repeat_rule = {};
            }
            if (!_this.repeat_rule.rules) {
                _this.repeat_rule.rules = {};
            }
            return _this;
        }

        /***
         * @ngdoc method
         * @name calcRepeatRule
         * @methodOf BB.Models:AdminClinic
         * @description
         * Calculate the repeat rule
         *
         * @returns {array} Returns an array of repeat rules
         */


        Admin_Clinic.prototype.calcRepeatRule = function calcRepeatRule() {
            var en = void 0;
            var vals = {};
            vals.name = this.name;
            vals.start_time = this.start_time.format("HH:mm");
            vals.end_time = this.end_time.format("HH:mm");
            vals.address_id = this.address_id;
            vals.resource_ids = [];
            for (var id in this.resources) {
                en = this.resources[id];
                if (en) {
                    vals.resource_ids.push(id);
                }
            }
            vals.person_ids = [];
            for (id in this.people) {
                en = this.people[id];
                if (en) {
                    vals.person_ids.push(id);
                }
            }
            vals.service_ids = [];
            for (id in this.services) {
                en = this.services[id];
                if (en) {
                    vals.service_ids.push(id);
                }
            }

            this.repeat_rule.properties = vals;
            return this.repeat_rule;
        };

        /***
         * @ngdoc method
         * @name getPostData
         * @methodOf BB.Models:AdminClinic
         * @description
         * Get post data
         *
         * @returns {array} Returns an array with data
         */


        Admin_Clinic.prototype.getPostData = function getPostData() {
            var en = void 0;
            var data = {};
            data.name = this.name;
            data.repeat_rule = this.repeat_rule;
            data.start_time = this.start_time;
            data.end_time = this.end_time;
            data.resource_ids = [];
            data.update_for_repeat = this.update_for_repeat;
            for (var id in this.resources) {
                en = this.resources[id];
                if (en) {
                    data.resource_ids.push(id);
                }
            }
            data.person_ids = [];
            for (id in this.people) {
                en = this.people[id];
                if (en) {
                    data.person_ids.push(id);
                }
            }
            data.service_ids = [];
            for (id in this.services) {
                en = this.services[id];
                if (en) {
                    data.service_ids.push(id);
                }
            }
            if (this.address) {
                data.address_id = this.address.id;
            }
            if (this.settings) {
                data.settings = this.settings;
            }
            if (this.repeat_rule && this.repeat_rule.rules && this.repeat_rule.rules.frequency) {
                data.repeat_rule = this.calcRepeatRule();
            }
            return data;
        };

        /***
         * @ngdoc method
         * @name save
         * @methodOf BB.Models:AdminClinic
         * @description
         * Save person id, resource id and service id
         *
         * @returns {array} Returns an array with resources and peoples
         */


        Admin_Clinic.prototype.save = function save() {
            var _this2 = this;

            this.person_ids = _.compact(_.map(this.people, function (present, person_id) {
                if (present) {
                    return person_id;
                }
            }));
            this.resource_ids = _.compact(_.map(this.resources, function (present, resource_id) {
                if (present) {
                    return resource_id;
                }
            }));
            this.service_ids = _.compact(_.map(this.services, function (present, service_id) {
                if (present) {
                    return service_id;
                }
            }));
            return this.$put('self', {}, this).then(function (clinic) {
                _this2.updateModel(clinic);
                _this2.setTimes();
                return _this2.setResourcesAndPeople();
            });
        };

        Admin_Clinic.prototype.$update = function $update(data) {
            var _this3 = this;

            if (!data) {
                data = this;
            }
            return this.$put('self', {}, data).then(function (res) {
                return _this3.constructor(res);
            });
        };

        return Admin_Clinic;
    }(ClinicModel);
});
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/***
 * @ngdoc service
 * @name BB.Models:AdminPerson
 *
 * @description
 * Representation of an Person Object
 *
 * @property {integer} id Person id
 * @property {string} name Person name
 * @property {boolean} deleted Verify if person is deleted or not
 * @property {boolean} disabled Verify if person is disabled or not
 * @property {integer} order The person order
 */ //

angular.module('BB.Models').factory("AdminPersonModel", function ($q, AdminPersonService, BBModel, BaseModel, PersonModel) {
    return function (_PersonModel) {
        _inherits(Admin_Person, _PersonModel);

        function Admin_Person(data) {
            _classCallCheck(this, Admin_Person);

            var _this = _possibleConstructorReturn(this, _PersonModel.call(this, data));

            if (!_this.queuing_disabled) {
                _this.setCurrentCustomer();
                if (_this.attendance_status === 2 || _this.attendance_status === 4) {
                    _this.updateEstimatedReturn();
                }
            }
            return _this;
        }

        /***
         * @ngdoc method
         * @name setCurrentCustomer
         * @methodOf BB.Models:AdminPerson
         * @description
         * Set current customer
         *
         * @returns {Promise} Returns a promise that rezolve the current customer
         */


        Admin_Person.prototype.setCurrentCustomer = function setCurrentCustomer() {
            var _this2 = this;

            var defer = $q.defer();
            if (this.$has('queuer')) {
                this.$get('queuer').then(function (queuer) {
                    _this2.serving = new BBModel.Admin.Queuer(queuer);
                    defer.resolve(_this2.serving);
                }, function (err) {
                    return defer.reject(err);
                });
            } else {
                defer.resolve();
            }
            return defer.promise;
        };

        /***
         * @ngdoc method
         * @name setAttendance
         * @methodOf BB.Models:AdminPerson
         * @param {string} status The status of attendance
         * @param {string} duration The estimated duration
         * @description
         * Set attendance in according of the status parameter
         *
         * @returns {Promise} Returns a promise that rezolve the attendance
         */


        Admin_Person.prototype.setAttendance = function setAttendance(status, duration) {
            var _this3 = this;

            var defer = $q.defer();
            this.$put('attendance', {}, { status: status, estimated_duration: duration }).then(function (p) {
                _this3.updateModel(p);
                if (status === 2) {
                    _this3.updateEstimatedReturn(duration);
                }
                if (!_this3.$has('queuer')) _this3.serving = null;
                defer.resolve(_this3);
            }, function (err) {
                defer.reject(err);
            });
            return defer.promise;
        };

        /***
         * @ngdoc method
         * @name finishServing
         * @methodOf BB.Models:AdminPerson
         * @description
         * Finish serving
         *
         * @returns {Promise} Returns a promise that rezolve the finish serving
         */


        Admin_Person.prototype.finishServing = function finishServing() {
            var _this4 = this;

            var defer = $q.defer();
            if (this.$has('finish_serving')) {
                this.$flush('self');
                this.$post('finish_serving').then(function (q) {
                    _this4.$get('self').then(function (p) {
                        _this4.updateModel(p);
                        if (!_this4.$has('queuer')) _this4.serving = null;
                        defer.resolve(q);
                    }, function (err) {
                        defer.reject(err);
                    });
                }, function (err) {
                    defer.reject(err);
                });
            } else {
                defer.reject('finish_serving link not available');
            }
            return defer.promise;
        };

        /***
         * @ngdoc method
         * @name isAvailable
         * @methodOf BB.Models:AdminPerson
         * @param {date=} start The start date format of the availability schedule
         * @param {date=} end The end date format of the availability schedule
         * @description
         * Look up a schedule for a time range to see if this available.
         *
         * @returns {string} Returns yes if schedule is available or not.
         */
        // look up a schedule for a time range to see if this available
        // currently just checks the date - but chould really check the time too


        Admin_Person.prototype.isAvailable = function isAvailable(start, end) {
            var _this5 = this;

            var str = start.format("YYYY-MM-DD") + "-" + end.format("YYYY-MM-DD");
            if (!this.availability) {
                this.availability = {};
            }

            if (this.availability[str]) {
                return this.availability[str] === "Yes";
            }
            this.availability[str] = "-";

            if (this.$has('schedule')) {
                this.$get('schedule', {
                    start_date: start.format("YYYY-MM-DD"),
                    end_date: end.format("YYYY-MM-DD")
                }).then(function (sched) {
                    _this5.availability[str] = "No";
                    if (sched && sched.dates && sched.dates[start.format("YYYY-MM-DD")] && sched.dates[start.format("YYYY-MM-DD")] !== "None") {
                        return _this5.availability[str] = "Yes";
                    }
                });
            } else {
                this.availability[str] = "Yes";
            }

            return this.availability[str] === "Yes";
        };

        /***
         * @ngdoc method
         * @name startServing
         * @methodOf BB.Models:AdminPerson
         * @param {string=} queuer The queuer of the company.
         * @description
         * Start serving in according of the queuer parameter
         *
         * @returns {Promise} Returns a promise that rezolve the start serving link
         */


        Admin_Person.prototype.startServing = function startServing(queuer) {
            var _this6 = this;

            var defer = $q.defer();
            if (this.$has('start_serving')) {
                this.$flush('self');
                var params = { queuer_id: queuer ? queuer.id : null, person_id: this.id };
                this.$post('start_serving', params).then(function (q) {
                    _this6.$get('self').then(function (p) {
                        _this6.updateModel(p);
                        _this6.serving = q;
                        defer.resolve(q);
                    }, function (err) {
                        return defer.reject(err);
                    });
                }, function (err) {
                    return defer.reject(err);
                });
            } else {
                defer.reject('start_serving link not available');
            }
            return defer.promise;
        };

        /***
         * @ngdoc method
         * @name getQueuers
         * @methodOf BB.Models:AdminPerson
         * @description
         * Get the queuers
         *
         * @returns {Promise} Returns a promise that rezolve the queuer links
         */


        Admin_Person.prototype.getQueuers = function getQueuers() {
            var _this7 = this;

            var defer = $q.defer();
            if (this.$has('queuers')) {
                this.$flush('queuers');
                this.$get('queuers').then(function (collection) {
                    collection.$get('queuers').then(function (queuers) {
                        var models = Array.from(queuers).map(function (q) {
                            return new BBModel.Admin.Queuer(q);
                        });
                        _this7.queuers = models;
                        defer.resolve(models);
                    }, function (err) {
                        defer.reject(err);
                    });
                }, function (err) {
                    return defer.reject(err);
                });
            } else {
                defer.reject('queuers link not available');
            }
            return defer.promise;
        };

        Admin_Person.prototype.updateEstimatedReturn = function updateEstimatedReturn(estimate) {
            var start = this.attendance_started;
            if (!estimate) estimate = this.attendance_estimate;
            if (start && estimate) {
                this.estimated_return = moment(start).add(estimate, 'minutes').format('LT');
            }
        };

        /***
         * @ngdoc method
         * @name getPostData
         * @methodOf BB.Models:AdminPerson
         * @description
         * Get post data
         *
         * @returns {array} Returns data
         */


        Admin_Person.prototype.getPostData = function getPostData() {
            var data = {};
            data.id = this.id;
            data.name = this.name;
            data.extra = this.extra;
            data.description = this.description;
            return data;
        };

        /***
         * @ngdoc method
         * @name update
         * @methodOf BB.Models:AdminPerson
         * @param {object} data The company data
         * @description
         * Update the data in according of the data parameter
         *
         * @returns {array} Returns the updated array
         */


        Admin_Person.prototype.$update = function $update(data) {
            var _this8 = this;

            if (!data) {
                data = this.getPostData();
            }
            return this.$put('self', {}, data).then(function (res) {
                return _this8.constructor(res);
            });
        };

        Admin_Person.$query = function $query(params) {
            return AdminPersonService.query(params);
        };

        Admin_Person.$block = function $block(company, person, data) {
            return AdminPersonService.block(company, person, data);
        };

        Admin_Person.$signup = function $signup(user, data) {
            return AdminPersonService.signup(user, data);
        };

        Admin_Person.prototype.$refetch = function $refetch() {
            var _this9 = this;

            var defer = $q.defer();
            this.$flush('self');
            this.$get('self').then(function (res) {
                _this9.constructor(res);
                return defer.resolve(_this9);
            }, function (err) {
                return defer.reject(err);
            });
            return defer.promise;
        };

        return Admin_Person;
    }(PersonModel);
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/***
 * @ngdoc service
 * @name BB.Models:AdminResource
 *
 * @description
 * Representation of an Resource Object
 *
 * @property {integer} total_entries The total entries
 * @property {array} resources An array with resources elements
 * @property {integer} id The resources id
 * @property {string} name Name of resources
 * @propertu {string} type Type of resources
 * @property {boolean} deleted Verify if resources is deleted or not
 * @property {boolean} disabled Verify if resources is disabled or not
 */ //

angular.module('BB.Models').factory("AdminResourceModel", function ($q, AdminResourceService, BBModel, BaseModel, ResourceModel) {
    return function (_ResourceModel) {
        _inherits(Admin_Resource, _ResourceModel);

        function Admin_Resource() {
            _classCallCheck(this, Admin_Resource);

            return _possibleConstructorReturn(this, _ResourceModel.apply(this, arguments));
        }

        /***
         * @ngdoc method
         * @name isAvailable
         * @methodOf BB.Models:AdminResource
         * @param {date=} start The start date of the availability of the resource
         * @param {date=} end The end date of the availability of the resource
         * @description
         * Look up a schedule for a time range to see if this available
         *
         * @returns {string} Returns yes if availability of resource is valid
         */
        // look up a schedule for a time range to see if this available
        // currently just checks the date - but chould really check the time too
        Admin_Resource.prototype.isAvailable = function isAvailable(start, end) {
            var _this2 = this;

            var str = start.format("YYYY-MM-DD") + "-" + end.format("YYYY-MM-DD");
            if (!this.availability) {
                this.availability = {};
            }

            if (this.availability[str]) {
                return this.availability[str] === "Yes";
            }
            this.availability[str] = "-";

            if (this.$has('schedule')) {
                this.$get('schedule', {
                    start_date: start.format("YYYY-MM-DD"),
                    end_date: end.format("YYYY-MM-DD")
                }).then(function (sched) {
                    _this2.availability[str] = "No";
                    if (sched && sched.dates && sched.dates[start.format("YYYY-MM-DD")] && sched.dates[start.format("YYYY-MM-DD")] !== "None") {
                        return _this2.availability[str] = "Yes";
                    }
                });
            } else {
                this.availability[str] = "Yes";
            }

            return this.availability[str] === "Yes";
        };

        Admin_Resource.$query = function $query(params) {
            return AdminResourceService.query(params);
        };

        Admin_Resource.$block = function $block(company, resource, data) {
            return AdminResourceService.block(company, resource, data);
        };

        return Admin_Resource;
    }(ResourceModel);
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/***
 * @ngdoc service
 * @name BB.Models:AdminSchedule
 *
 * @description
 * Representation of an Schedule Object
 *
 * @property {integer} id Schedule id
 * @property {string} rules Schedule rules
 * @property {string} name Schedule name
 * @property {integer} company_id The company id
 * @property {date} duration The schedule duration
 */ //

angular.module('BB.Models').factory("AdminScheduleModel", function ($q, AdminScheduleService, BBModel, BaseModel, ScheduleRules) {
    return function (_BaseModel) {
        _inherits(Admin_Schedule, _BaseModel);

        function Admin_Schedule(data) {
            _classCallCheck(this, Admin_Schedule);

            return _possibleConstructorReturn(this, _BaseModel.call(this, data));
        }

        /***
         * @ngdoc method
         * @name getPostData
         * @methodOf BB.Models:AdminSchedule
         * @description
         * Get post data
         *
         * @returns {array} Returns data.
         */


        Admin_Schedule.prototype.getPostData = function getPostData() {
            var data = {};
            data.id = this.id;
            data.rules = this.rules;
            data.name = this.name;
            data.company_id = this.company_id;
            data.duration = this.duration;
            return data;
        };

        Admin_Schedule.$query = function $query(params) {
            return AdminScheduleService.query(params);
        };

        Admin_Schedule.$delete = function $delete(schedule) {
            return AdminScheduleService.delete(schedule);
        };

        Admin_Schedule.$update = function $update(schedule) {
            return AdminScheduleService.update(schedule);
        };

        return Admin_Schedule;
    }(BaseModel);
});
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/***
 * @ngdoc service
 * @name BB.Models:ScheduleRules
 *
 * @description
 * Representation of an Schedule Rules Object
 *
 * @property {object} rules The schedule rules
 */ //

angular.module('BB.Models').factory("ScheduleRules", function () {
    return function () {
        function ScheduleRules(rules) {
            _classCallCheck(this, ScheduleRules);

            this.addRangeToDate = this.addRangeToDate.bind(this);
            this.removeRangeFromDate = this.removeRangeFromDate.bind(this);
            if (rules == null) {
                rules = {};
            }
            this.rules = rules;
        }

        /***
         * @ngdoc method
         * @name addRange
         * @methodOf BB.Models:ScheduleRules
         * @param {date=} start The start date of the range
         * @param {date=} end The end date of the range
         * @description
         * Add date range in according of the start and end parameters
         *
         * @returns {date} Returns the added date
         */


        ScheduleRules.prototype.addRange = function addRange(start, end) {
            return this.applyFunctionToDateRange(start, end, 'YYYY-MM-DD', this.addRangeToDate);
        };

        /***
         * @ngdoc method
         * @name removeRange
         * @methodOf BB.Models:ScheduleRules
         * @param {date=} start The start date of the range
         * @param {date=} end The end date of the range
         * @description
         * Remove date range in according of the start and end parameters
         *
         * @returns {date} Returns the removed date
         */


        ScheduleRules.prototype.removeRange = function removeRange(start, end) {
            return this.applyFunctionToDateRange(start, end, 'YYYY-MM-DD', this.removeRangeFromDate);
        };

        /***
         * @ngdoc method
         * @name addWeekdayRange
         * @methodOf BB.Models:ScheduleRules
         * @param {date=} start The start date of the range
         * @param {date=} end The end date of the range
         * @description
         * Add week day range in according of the start and end parameters
         *
         * @returns {date} Returns the week day
         */


        ScheduleRules.prototype.addWeekdayRange = function addWeekdayRange(start, end) {
            return this.applyFunctionToDateRange(start, end, 'd', this.addRangeToDate);
        };

        /***
         * @ngdoc method
         * @name removeWeekdayRange
         * @methodOf BB.Models:ScheduleRules
         * @param {date=} start The start date of the range
         * @param {date=} end The end date of the range
         * @description
         * Remove week day range in according of the start and end parameters
         *
         * @returns {date} Returns removed week day
         */


        ScheduleRules.prototype.removeWeekdayRange = function removeWeekdayRange(start, end) {
            return this.applyFunctionToDateRange(start, end, 'd', this.removeRangeFromDate);
        };

        /***
         * @ngdoc method
         * @name addRangeToDate
         * @methodOf BB.Models:ScheduleRules
         * @param {date=} date The date
         * @param {array=} range The range of the date
         * @description
         * Add range to date in according of the date and range parameters
         *
         * @returns {date} Returns the added range of date
         */


        ScheduleRules.prototype.addRangeToDate = function addRangeToDate(date, range) {
            var ranges = this.rules[date] ? this.rules[date] : [];
            return this.rules[date] = this.joinRanges(this.insertRange(ranges, range));
        };

        /***
         * @ngdoc method
         * @name removeRangeFromDate
         * @methodOf BB.Models:ScheduleRules
         * @param {date=} date The date
         * @param {array=} range The range of the date
         * @description
         * Remove range to date in according of the date and range parameters
         *
         * @returns {date} Returns the removed range of date
         */


        ScheduleRules.prototype.removeRangeFromDate = function removeRangeFromDate(date, range) {
            var ranges = this.rules[date] ? this.rules[date] : [];
            this.rules[date] = this.joinRanges(this.subtractRange(ranges, range));
            if (this.rules[date] === '') {
                return delete this.rules[date];
            }
        };

        /***
         * @ngdoc method
         * @name applyFunctionToDateRange
         * @methodOf BB.Models:ScheduleRules
         * @param {date=} start The start date
         * @param {date=} end The end date
         * @param {date=} format The format of the range date
         * @param {object} func The func of the date and range
         * @description
         * Apply date range in according of the start, end, format and func parameters
         *
         * @returns {array} Returns the rules
         */


        ScheduleRules.prototype.applyFunctionToDateRange = function applyFunctionToDateRange(start, end, format, func) {
            var _this = this;

            var date = void 0;
            var days = this.diffInDays(start, end);
            if (days === 0) {
                date = start.format(format);
                var range = [start.format('HHmm'), end.format('HHmm')].join('-');
                func(date, range);
            } else {
                var end_time = moment(start).endOf('day');
                this.applyFunctionToDateRange(start, end_time, format, func);
                _.each(__range__(1, days, true), function (i) {
                    var start_time = void 0;
                    date = moment(start).add(i, 'days');
                    if (i === days) {
                        if (end.hour() !== 0 || end.minute() !== 0) {
                            start_time = moment(end).startOf('day');
                            return _this.applyFunctionToDateRange(start_time, end, format, func);
                        }
                    } else {
                        start_time = moment(date).startOf('day');
                        end_time = moment(date).endOf('day');
                        return _this.applyFunctionToDateRange(start_time, end_time, format, func);
                    }
                });
            }
            return this.rules;
        };

        /***
         * @ngdoc method
         * @name diffInDays
         * @methodOf BB.Models:ScheduleRules
         * @param {date=} start The start date
         * @param {date=} end The end date
         * @description
         * Difference in days in according of the start and end parameters
         *
         * @returns {array} Returns the difference in days
         */


        ScheduleRules.prototype.diffInDays = function diffInDays(start, end) {
            return moment.duration(end.diff(start)).days();
        };

        /***
         * @ngdoc method
         * @name insertRange
         * @methodOf BB.Models:ScheduleRules
         * @param {object} ranges The ranges
         * @param {object} range The range
         * @description
         * Insert range in according of the ranges and range parameters
         *
         * @returns {array} Returns the ranges
         */


        ScheduleRules.prototype.insertRange = function insertRange(ranges, range) {
            ranges.splice(_.sortedIndex(ranges, range), 0, range);
            return ranges;
        };

        /***
         * @ngdoc method
         * @name subtractRange
         * @methodOf BB.Models:ScheduleRules
         * @param {object} ranges The ranges
         * @param {object} range The range
         * @description
         * Substract the range in according of the ranges and range parameters
         *
         * @returns {array} Returns the range decreasing
         */


        ScheduleRules.prototype.subtractRange = function subtractRange(ranges, range) {
            if (_.indexOf(ranges, range, true) > -1) {
                return _.without(ranges, range);
            } else {
                return _.flatten(_.map(ranges, function (r) {
                    if (range.slice(0, 4) >= r.slice(0, 4) && range.slice(5, 9) <= r.slice(5, 9)) {
                        if (range.slice(0, 4) === r.slice(0, 4)) {
                            return [range.slice(5, 9), r.slice(5, 9)].join('-');
                        } else if (range.slice(5, 9) === r.slice(5, 9)) {
                            return [r.slice(0, 4), range.slice(0, 4)].join('-');
                        } else {
                            return [[r.slice(0, 4), range.slice(0, 4)].join('-'), [range.slice(5, 9), r.slice(5, 9)].join('-')];
                        }
                    } else {
                        return r;
                    }
                }));
            }
        };

        /***
         * @ngdoc method
         * @name joinRanges
         * @methodOf BB.Models:ScheduleRules
         * @param {object} ranges The ranges
         * @description
         * Join ranges
         *
         * @returns {array} Returns the range
         */


        ScheduleRules.prototype.joinRanges = function joinRanges(ranges) {
            return _.reduce(ranges, function (m, range) {
                if (m === '') {
                    return range;
                } else if (range.slice(0, 4) <= m.slice(m.length - 4, m.length)) {
                    if (range.slice(5, 9) >= m.slice(m.length - 4, m.length)) {
                        return m.slice(0, m.length - 4) + range.slice(5, 9);
                    } else {
                        return m;
                    }
                } else {
                    return [m, range].join();
                }
            }, "").split(',');
        };

        /***
         * @ngdoc method
         * @name filterRulesByDates
         * @methodOf BB.Models:ScheduleRules
         * @description
         * Filter rules by dates
         *
         * @returns {array} Returns the filtered rules by dates
         */


        ScheduleRules.prototype.filterRulesByDates = function filterRulesByDates() {
            return _.pick(this.rules, function (value, key) {
                return key.match(/^\d{4}-\d{2}-\d{2}$/) && value !== "None";
            });
        };

        /***
         * @ngdoc method
         * @name filterRulesByWeekdays
         * @methodOf BB.Models:ScheduleRules
         * @description
         * Filter rules by week day
         *
         * @returns {array} Returns the filtered rules by week day
         */


        ScheduleRules.prototype.filterRulesByWeekdays = function filterRulesByWeekdays() {
            return _.pick(this.rules, function (value, key) {
                return key.match(/^\d$/);
            });
        };

        /***
         * @ngdoc method
         * @name formatTime
         * @methodOf BB.Models:ScheduleRules
         * @param {date=} time The time
         * @description
         * Format the time in according of the time parameter
         *
         * @returns {date} Returns the formated time
         */


        ScheduleRules.prototype.formatTime = function formatTime(time) {
            return [time.slice(0, 2), time.slice(2, 4)].join(':');
        };

        /***
         * @ngdoc method
         * @name toEvents
         * @methodOf BB.Models:ScheduleRules
         * @param {array} d The day of events
         * @description
         * Go to events day
         *
         * @returns {array} Returns fullcalendar compatible events
         */


        ScheduleRules.prototype.toEvents = function toEvents(d) {
            var _this2 = this;

            if (d && this.rules[d] !== "None") {
                return _.map(this.rules[d], function (range) {
                    return {
                        start: [d, _this2.formatTime(range.split('-')[0])].join('T'),
                        end: [d, _this2.formatTime(range.split('-')[1])].join('T')
                    };
                });
            } else {
                return _.reduce(this.filterRulesByDates(), function (memo, ranges, date) {
                    return memo.concat(_.map(ranges, function (range) {
                        return {
                            start: [date, _this2.formatTime(range.split('-')[0])].join('T'),
                            end: [date, _this2.formatTime(range.split('-')[1])].join('T')
                        };
                    }));
                }, []);
            }
        };

        /***
         * @ngdoc method
         * @name toWeekdayEvents
         * @methodOf BB.Models:ScheduleRules
         * @description
         * Go to events week day
         *
         * @returns {array} Returns fullcalendar compatible events
         */


        ScheduleRules.prototype.toWeekdayEvents = function toWeekdayEvents() {
            var _this3 = this;

            return _.reduce(this.filterRulesByWeekdays(), function (memo, ranges, day) {
                var date = moment().set('day', day).format('YYYY-MM-DD');
                return memo.concat(_.map(ranges, function (range) {
                    return {
                        start: [date, _this3.formatTime(range.split('-')[0])].join('T'),
                        end: [date, _this3.formatTime(range.split('-')[1])].join('T')
                    };
                }));
            }, []);
        };

        return ScheduleRules;
    }();
});

function __range__(left, right, inclusive) {
    var range = [];
    var ascending = left < right;
    var end = !inclusive ? right : ascending ? right + 1 : right - 1;
    for (var i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
        range.push(i);
    }
    return range;
}
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/***
 * @ngdoc service
 * @name BB.Models:AdminService
 *
 * @description
 * Representation of an Service Object
 *
 * @property {integer} id Id of the service
 * @property {string} name The name of service
 * @property {date} duration Duration of the service
 * @property {float} prices The prices of the service
 * @property {integer} detail_group_id The detail group id
 * @property {date} booking_time_step The time step of the booking
 * @property {integer} min_bookings The minimum number of bookings
 * @property {integer} max_booings The maximum number of bookings
 */

angular.module('BB.Models').factory("AdminServiceModel", function ($q, AdminServiceService, BBModel, ServiceModel) {
    return function (_ServiceModel) {
        _inherits(Admin_Service, _ServiceModel);

        function Admin_Service() {
            _classCallCheck(this, Admin_Service);

            return _possibleConstructorReturn(this, _ServiceModel.apply(this, arguments));
        }

        Admin_Service.$query = function $query(params) {
            return AdminServiceService.query(params);
        };

        return Admin_Service;
    }(ServiceModel);
});
'use strict';

angular.module('BBAdmin.Services').factory('AdminAddressService', function ($q, BBModel) {

    return {
        query: function query(params) {
            var company = params.company;

            var defer = $q.defer();
            company.$get('addresses').then(function (collection) {
                return collection.$get('addresses').then(function (addresss) {
                    var models = Array.from(addresss).map(function (s) {
                        return new BBModel.Admin.Address(s);
                    });
                    return defer.resolve(models);
                }, function (err) {
                    return defer.reject(err);
                });
            }, function (err) {
                return defer.reject(err);
            });
            return defer.promise;
        }
    };
});
'use strict';

angular.module('BBAdmin.Services').factory('AdminClinicService', function ($q, BBModel, ClinicCollections, $window) {

    return {
        query: function query(params) {
            var company = params.company;

            var defer = $q.defer();
            if (params.id) {
                // reuqest for a single one
                company.$get('clinics', params).then(function (clinic) {
                    clinic = new BBModel.Admin.Clinic(clinic);
                    return defer.resolve(clinic);
                }, function (err) {
                    return defer.reject(err);
                });
            } else {
                var existing = ClinicCollections.find(params);
                if (existing && !params.skip_cache) {
                    defer.resolve(existing);
                } else {
                    if (params.skip_cache) {
                        if (existing) {
                            ClinicCollections.delete(existing);
                        }
                        company.$flush('clinics', params);
                    }
                    company.$get('clinics', params).then(function (collection) {
                        return collection.$get('clinics').then(function (clinics) {
                            var models = Array.from(clinics).map(function (s) {
                                return new BBModel.Admin.Clinic(s);
                            });
                            clinics = new $window.Collection.Clinic(collection, models, params);
                            ClinicCollections.add(clinics);
                            return defer.resolve(clinics);
                        }, function (err) {
                            return defer.reject(err);
                        });
                    }, function (err) {
                        return defer.reject(err);
                    });
                }
            }
            return defer.promise;
        },
        create: function create(prms, clinic) {
            var company = prms.company;

            var deferred = $q.defer();
            company.$post('clinics', {}, clinic.getPostData()).then(function (clinic) {
                clinic = new BBModel.Admin.Clinic(clinic);
                ClinicCollections.checkItems(clinic);
                return deferred.resolve(clinic);
            }, function (err) {
                return deferred.reject(err);
            });
            return deferred.promise;
        },
        cancel: function cancel(clinic) {
            var deferred = $q.defer();
            clinic.$post('cancel', clinic).then(function (clinic) {
                clinic = new BBModel.Admin.Clinic(clinic);
                ClinicCollections.deleteItems(clinic);
                return deferred.resolve(clinic);
            }, function (err) {
                return deferred.reject(err);
            });
            return deferred.promise;
        },
        update: function update(clinic) {
            var deferred = $q.defer();
            clinic.$put('self', {}, clinic.getPostData()).then(function (c) {
                clinic = new BBModel.Admin.Clinic(c);
                ClinicCollections.checkItems(clinic);
                return deferred.resolve(clinic);
            }, function (err) {
                return deferred.reject(err);
            });
            return deferred.promise;
        }
    };
});
'use strict';

angular.module('BBAdminServices').factory('AdminPersonService', function ($q, $window, $rootScope, halClient, SlotCollections, BookingCollections, BBModel, LoginService, $log) {

    return {
        query: function query(params) {
            var company = params.company;

            var defer = $q.defer();
            if (company.$has('people')) {
                company.$get('people', params).then(function (collection) {
                    if (collection.$has('people')) {
                        return collection.$get('people').then(function (people) {
                            var models = Array.from(people).map(function (p) {
                                return new BBModel.Admin.Person(p);
                            });
                            return defer.resolve(models);
                        }, function (err) {
                            return defer.reject(err);
                        });
                    } else {
                        var obj = new BBModel.Admin.Person(collection);
                        return defer.resolve(obj);
                    }
                }, function (err) {
                    return defer.reject(err);
                });
            } else {
                $log.warn('company has no people link');
                defer.reject('company has no people link');
            }
            return defer.promise;
        },
        block: function block(company, person, data) {
            var deferred = $q.defer();
            person.$put('block', {}, data).then(function (response) {
                if (response.$href('self').indexOf('bookings') > -1) {
                    var booking = new BBModel.Admin.Booking(response);
                    BookingCollections.checkItems(booking);
                    return deferred.resolve(booking);
                } else {
                    var slot = new BBModel.Admin.Slot(response);
                    SlotCollections.checkItems(slot);
                    return deferred.resolve(slot);
                }
            }, function (err) {
                return deferred.reject(err);
            });
            return deferred.promise;
        },
        signup: function signup(user, data) {
            var defer = $q.defer();
            return user.$get('company').then(function (company) {
                var params = {};
                company.$post('people', params, data).then(function (person) {
                    if (person.$has('administrator')) {
                        return person.$get('administrator').then(function (user) {
                            LoginService.setLogin(user);
                            return defer.resolve(person);
                        });
                    } else {
                        return defer.resolve(person);
                    }
                }, function (err) {
                    return defer.reject(err);
                });
                return defer.promise;
            });
        }
    };
});
'use strict';

angular.module('BBAdmin.Services').factory('AdminResourceService', function ($q, UriTemplate, halClient, SlotCollections, BBModel, BookingCollections) {

    return {
        query: function query(params) {
            var company = params.company;

            var defer = $q.defer();
            company.$get('resources', params).then(function (collection) {
                return collection.$get('resources').then(function (resources) {
                    var models = Array.from(resources).map(function (r) {
                        return new BBModel.Admin.Resource(r);
                    });
                    return defer.resolve(models);
                }, function (err) {
                    return defer.reject(err);
                });
            }, function (err) {
                return defer.reject(err);
            });
            return defer.promise;
        },
        block: function block(company, resource, data) {
            var deferred = $q.defer();
            resource.$put('block', {}, data).then(function (response) {
                if (response.$href('self').indexOf('bookings') > -1) {
                    var booking = new BBModel.Admin.Booking(response);
                    BookingCollections.checkItems(booking);
                    return deferred.resolve(booking);
                } else {
                    var slot = new BBModel.Admin.Slot(response);
                    SlotCollections.checkItems(slot);
                    return deferred.resolve(slot);
                }
            }, function (err) {
                return deferred.reject(err);
            });
            return deferred.promise;
        }
    };
});
'use strict';

angular.module('BBAdmin.Services').factory('AdminScheduleService', function ($q, BBModel, ScheduleRules, BBAssets) {

    var schedule_cache = {};

    var cacheDates = function cacheDates(asset, dates) {
        if (!schedule_cache[asset.self]) {
            schedule_cache[asset.self] = {};
        }
        return function () {
            var result = [];
            for (var k in dates) {
                var v = dates[k];
                result.push(schedule_cache[asset.self][k] = v);
            }
            return result;
        }();
    };

    var getCacheDates = function getCacheDates(asset, start, end) {

        if (!schedule_cache[asset.self]) {
            return false;
        }

        var curr = moment(start);
        var dates = [];

        var asset_cache = schedule_cache[asset.self];
        while (curr.unix() < end.unix()) {
            var test = curr.format('YYYY-MM-DD');
            if (!asset_cache[test]) {
                return false;
            }
            dates[test] = asset_cache[test];
            curr = curr.add(1, 'day');
        }

        return dates;
    };

    // return a promise to resolve any existing schedule caching stuff
    var loadScheduleCaches = function loadScheduleCaches(assets) {
        var proms = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = Array.from(assets)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var asset = _step.value;

                if (asset.$has('immediate_schedule')) {
                    (function (asset) {
                        var prom = asset.$get('immediate_schedule');
                        proms.push(prom);
                        return prom.then(function (schedules) {
                            return cacheDates(asset, schedules.dates);
                        });
                    })(asset);
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        var fin = $q.defer();
        if (proms.length > 0) {
            $q.all(proms).then(function () {
                return fin.resolve();
            });
        } else {
            fin.resolve();
        }
        return fin.promise;
    };

    return {
        query: function query(params) {
            var company = params.company;

            var defer = $q.defer();
            company.$get('schedules').then(function (collection) {
                return collection.$get('schedules').then(function (schedules) {
                    var models = Array.from(schedules).map(function (s) {
                        return new BBModel.Admin.Schedule(s);
                    });
                    return defer.resolve(models);
                }, function (err) {
                    return defer.reject(err);
                });
            }, function (err) {
                return defer.reject(err);
            });
            return defer.promise;
        },
        delete: function _delete(schedule) {
            var deferred = $q.defer();
            schedule.$del('self').then(function (schedule) {
                schedule = new BBModel.Admin.Schedule(schedule);
                return deferred.resolve(schedule);
            }, function (err) {
                return deferred.reject(err);
            });

            return deferred.promise;
        },
        update: function update(schedule) {
            var deferred = $q.defer();
            return schedule.$put('self', {}, schedule.getPostData()).then(function (c) {
                schedule = new BBModel.Admin.Schedule(c);
                return deferred.resolve(schedule);
            }, function (err) {
                return deferred.reject(err);
            });
        },
        mapAssetsToScheduleEvents: function mapAssetsToScheduleEvents(start, end, assets) {
            var assets_with_schedule = _.filter(assets, function (asset) {
                return asset.$has('schedule');
            });

            return _.map(assets_with_schedule, function (asset) {

                var events = void 0,
                    rules = void 0;
                var found = getCacheDates(asset, start, end);
                if (found) {
                    rules = new ScheduleRules(found);
                    events = rules.toEvents();
                    _.each(events, function (e) {
                        e.resourceId = parseInt(asset.id) + "_" + asset.type[0];
                        e.title = asset.name;
                        e.start = moment(e.start);
                        e.end = moment(e.end);
                        return e.rendering = "background";
                    });
                    var prom = $q.defer();
                    prom.resolve(events);
                    return prom.promise;
                } else {
                    var params = {
                        start_date: start.format('YYYY-MM-DD'),
                        end_date: end.format('YYYY-MM-DD')
                    };

                    return asset.$get('schedule', params).then(function (schedules) {
                        // cacheDates(asset, schedules.dates)
                        rules = new ScheduleRules(schedules.dates);
                        events = rules.toEvents();
                        _.each(events, function (e) {
                            e.resourceId = parseInt(asset.id) + "_" + asset.type[0];
                            e.title = asset.name;
                            e.start = moment(e.start);
                            e.end = moment(e.end);
                            return e.rendering = "background";
                        });
                        return events;
                    });
                }
            });
        },
        getAssetsScheduleEvents: function getAssetsScheduleEvents(company, start, end, filtered, requested) {
            var _this = this;

            if (filtered == null) {
                filtered = false;
            }
            if (requested == null) {
                requested = [];
            }
            if (filtered) {
                return loadScheduleCaches(requested).then(function () {
                    return $q.all(_this.mapAssetsToScheduleEvents(start, end, requested)).then(function (schedules) {
                        return _.flatten(schedules);
                    });
                });
            } else {
                var localMethod = this.mapAssetsToScheduleEvents;
                return BBAssets.getAssets(company).then(function (assets) {
                    return loadScheduleCaches(assets).then(function () {
                        return $q.all(localMethod(start, end, assets)).then(function (schedules) {
                            return _.flatten(schedules);
                        });
                    });
                });
            }
        }
    };
});
'use strict';

angular.module('BBAdmin.Services').factory('AdminServiceService', function ($q, BBModel, $log) {

    return {
        query: function query(params) {
            var company = params.company;

            var defer = $q.defer();
            company.$get('services').then(function (collection) {
                return collection.$get('services').then(function (services) {
                    var models = Array.from(services).map(function (s) {
                        return new BBModel.Admin.Service(s);
                    });
                    return defer.resolve(models);
                }, function (err) {
                    return defer.reject(err);
                });
            }, function (err) {
                return defer.reject(err);
            });
            return defer.promise;
        }
    };
});
'use strict';

angular.module('BBAdminServices').factory("BB.Service.schedule", function ($q, BBModel) {
    return {
        unwrap: function unwrap(resource) {
            return new BBModel.Admin.Schedule(resource);
        }
    };
});

angular.module('BBAdminServices').factory("BB.Service.person", function ($q, BBModel) {
    return {
        unwrap: function unwrap(resource) {
            return new BBModel.Admin.Person(resource);
        }
    };
});

angular.module('BBAdminServices').factory("BB.Service.people", function ($q, BBModel) {
    return {
        promise: true,
        unwrap: function unwrap(resource) {
            var deferred = $q.defer();
            resource.$get('people').then(function (items) {
                var models = [];
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = Array.from(items)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var i = _step.value;

                        models.push(new BBModel.Admin.Person(i));
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                return deferred.resolve(models);
            }, function (err) {
                return deferred.reject(err);
            });

            return deferred.promise;
        }
    };
});

angular.module('BBAdminServices').factory("BB.Service.resource", function ($q, BBModel) {
    return {
        unwrap: function unwrap(resource) {
            return new BBModel.Admin.Resource(resource);
        }
    };
});

angular.module('BBAdminServices').factory("BB.Service.resources", function ($q, BBModel) {
    return {
        promise: true,
        unwrap: function unwrap(resource) {
            var deferred = $q.defer();
            resource.$get('resources').then(function (items) {
                var models = [];
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = Array.from(items)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var i = _step2.value;

                        models.push(new BBModel.Admin.Resource(i));
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                return deferred.resolve(models);
            }, function (err) {
                return deferred.reject(err);
            });

            return deferred.promise;
        }
    };
});

angular.module('BBAdminServices').factory("BB.Service.service", function ($q, BBModel) {
    return {
        unwrap: function unwrap(resource) {
            return new BBModel.Admin.Service(resource);
        }
    };
});

angular.module('BBAdminServices').factory("BB.Service.services", function ($q, BBModel) {
    return {
        promise: true,
        unwrap: function unwrap(resource) {
            var deferred = $q.defer();
            resource.$get('services').then(function (items) {
                var models = [];
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = Array.from(items)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var i = _step3.value;

                        models.push(new BBModel.Admin.Service(i));
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }

                return deferred.resolve(models);
            }, function (err) {
                return deferred.reject(err);
            });

            return deferred.promise;
        }
    };
});
"use strict";

angular.module("BBAdminServices").config(function ($translateProvider) {
    "ngInject";

    var translations = {
        SERVICES: {
            PERSON_TABLE: {
                NEW_PERSON: "New Person",
                DELETE: "@:COMMON.BTN.DELETE",
                EDIT: "@:COMMON.BTN.EDIT",
                SCHEDULE: "@:COMMON.TERMINOLOGY.SCHEDULE"
            },
            RESOURCE_TABLE: {
                NEW_RESOURCE: "New Resource",
                DELETE: "@:COMMON.BTN.DELETE",
                EDIT: "@:COMMON.BTN.EDIT",
                SCHEDULE: "@:COMMON.TERMINOLOGY.SCHEDULE"
            },
            SERVICE_TABLE: {
                NEW_SERVICE: "New Service",
                EDIT: "@:COMMON.BTN.EDIT",
                BOOK_BTN: "@:COMMON.BTN.BOOK"
            }
        }
    };

    $translateProvider.translations("en", translations);
});