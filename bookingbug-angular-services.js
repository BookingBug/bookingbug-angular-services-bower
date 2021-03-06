(function() {
  'use strict';
  angular.module('BBAdminServices').config(["$logProvider", function($logProvider) {
    'ngInject';
    $logProvider.debugEnabled(true);
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdminServices', ['BB', 'BBAdmin.Services', 'BBAdmin.Filters', 'BBAdmin.Controllers', 'trNgGrid', 'ui.calendar']);

  angular.module('BBAdminServicesMockE2E', ['BBAdminServices', 'BBAdminMockE2E']);

}).call(this);

(function() {
  'use strict';
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.Collection.Clinic = (function(superClass) {
    extend(Clinic, superClass);

    function Clinic() {
      return Clinic.__super__.constructor.apply(this, arguments);
    }

    Clinic.prototype.checkItem = function(item) {
      return Clinic.__super__.checkItem.apply(this, arguments);
    };

    Clinic.prototype.matchesParams = function(item) {
      if (this.params.start_time) {
        this.start_time || (this.start_time = moment(this.params.start_time));
        if (this.start_time.isAfter(item.start_time)) {
          return false;
        }
      }
      if (this.params.end_time) {
        this.end_time || (this.end_time = moment(this.params.end_time));
        if (this.end_time.isBefore(item.end_time)) {
          return false;
        }
      }
      if (this.params.start_date) {
        this.start_date || (this.start_date = moment(this.params.start_date));
        if (this.start_date.isAfter(item.start_date)) {
          return false;
        }
      }
      if (this.params.end_date) {
        this.end_date || (this.end_date = moment(this.params.end_date));
        if (this.end_date.isBefore(item.end_date)) {
          return false;
        }
      }
      return true;
    };

    return Clinic;

  })(window.Collection.Base);

  angular.module('BBAdmin.Services').provider("ClinicCollections", function() {
    return {
      $get: function() {
        return new window.BaseCollections();
      }
    };
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdminServices').directive('personTable', ["$log", "ModalForm", "BBModel", function($log, ModalForm, BBModel) {
    var controller, link;
    controller = function($scope) {
      $scope.fields = ['id', 'name', 'mobile'];
      $scope.getPeople = function() {
        return BBModel.Admin.Person.$query({
          company: $scope.company
        }).then(function(people) {
          return $scope.people = people;
        });
      };
      $scope.newPerson = function() {
        return ModalForm["new"]({
          company: $scope.company,
          title: 'New Person',
          new_rel: 'new_person',
          post_rel: 'people',
          success: function(person) {
            return $scope.people.push(person);
          }
        });
      };
      $scope["delete"] = function(person) {
        return person.$del('self').then(function() {
          return $scope.people = _.reject($scope.people, person);
        }, function(err) {
          return $log.error("Failed to delete person");
        });
      };
      $scope.edit = function(person) {
        return ModalForm.edit({
          model: person,
          title: 'Edit Person'
        });
      };
      return $scope.schedule = function(person) {
        return person.$get('schedule').then(function(schedule) {
          return ModalForm.edit({
            model: schedule,
            title: 'Edit Schedule'
          });
        });
      };
    };
    link = function(scope, element, attrs) {
      if (scope.company) {
        return scope.getPeople();
      } else {
        return BBModel.Admin.Company.$query(attrs).then(function(company) {
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
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdminServices').directive('resourceTable', ["BBModel", "$log", "ModalForm", function(BBModel, $log, ModalForm) {
    var controller, link;
    controller = function($scope) {
      $scope.fields = ['id', 'name'];
      $scope.getResources = function() {
        var params;
        params = {
          company: $scope.company
        };
        return BBModel.Admin.Resource.$query(params).then(function(resources) {
          return $scope.resources = resources;
        });
      };
      $scope.newResource = function() {
        return ModalForm["new"]({
          company: $scope.company,
          title: 'New Resource',
          new_rel: 'new_resource',
          post_rel: 'resources',
          size: 'lg',
          success: function(resource) {
            return $scope.resources.push(resource);
          }
        });
      };
      $scope["delete"] = function(resource) {
        return resource.$del('self').then(function() {
          return $scope.resources = _.reject($scope.resources, function(p) {
            return p.id === id;
          });
        }, function(err) {
          return $log.error("Failed to delete resource");
        });
      };
      $scope.edit = function(resource) {
        return ModalForm.edit({
          model: resource,
          title: 'Edit Resource'
        });
      };
      return $scope.schedule = function(resource) {
        return resource.$get('schedule').then(function(schedule) {
          return ModalForm.edit({
            model: schedule,
            title: 'Edit Schedule'
          });
        });
      };
    };
    link = function(scope, element, attrs) {
      if (scope.company) {
        return scope.getResources();
      } else {
        return BBModel.Admin.Company.$query(attrs).then(function(company) {
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
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdminServices').directive('scheduleCalendar', ["uiCalendarConfig", "ScheduleRules", function(uiCalendarConfig, ScheduleRules) {
    var controller, link;
    controller = function($scope, $attrs) {
      var options;
      $scope.calendarName = 'scheduleCal';
      $scope.eventSources = [
        {
          events: function(start, end, timezone, callback) {
            return callback($scope.getEvents());
          }
        }
      ];
      $scope.getCalendarEvents = function(start, end) {
        var events;
        return events = uiCalendarConfig.calendars.scheduleCal.fullCalendar('clientEvents', function(e) {
          return (start.isAfter(e.start) || start.isSame(e.start)) && (end.isBefore(e.end) || end.isSame(e.end));
        });
      };
      options = $scope.setOptions;
      options || (options = {});
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
          select: function(start, end, jsEvent, view) {
            var events;
            events = $scope.getCalendarEvents(start, end);
            if (events.length > 0) {
              return $scope.removeRange(start, end);
            } else {
              return $scope.addRange(start, end);
            }
          },
          eventResizeStop: function(event, jsEvent, ui, view) {
            return $scope.addRange(event.start, event.end);
          },
          eventDrop: function(event, delta, revertFunc, jsEvent, ui, view) {
            var orig;
            if (event.start.hasTime()) {
              orig = {
                start: moment(event.start).subtract(delta),
                end: moment(event.end).subtract(delta)
              };
              $scope.removeRange(orig.start, orig.end);
              return $scope.addRange(event.start, event.end);
            }
          },
          eventClick: function(event, jsEvent, view) {
            return $scope.removeRange(event.start, event.end);
          }
        }
      };
      return $scope.render = function() {
        return uiCalendarConfig.calendars.scheduleCal.fullCalendar('render');
      };
    };
    link = function(scope, element, attrs, ngModel) {
      var scheduleRules;
      scheduleRules = function() {
        return new ScheduleRules(ngModel.$viewValue);
      };
      scope.getEvents = function() {
        return scheduleRules().toEvents();
      };
      scope.addRange = function(start, end) {
        ngModel.$setViewValue(scheduleRules().addRange(start, end));
        return ngModel.$render();
      };
      scope.removeRange = function(start, end) {
        ngModel.$setViewValue(scheduleRules().removeRange(start, end));
        return ngModel.$render();
      };
      scope.toggleRange = function(start, end) {
        ngModel.$setViewValue(scheduleRules().toggleRange(start, end));
        return ngModel.$render();
      };
      return ngModel.$render = function() {
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
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdminServices').directive('scheduleEdit', function() {
    var link;
    link = function(scope, element, attrs, ngModel) {
      ngModel.$render = function() {
        return scope.$$value$$ = ngModel.$viewValue;
      };
      return scope.$watch('$$value$$', function(value) {
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

  angular.module('schemaForm').config(["schemaFormProvider", "schemaFormDecoratorsProvider", "sfPathProvider", function(schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {
    schemaFormDecoratorsProvider.addMapping('bootstrapDecorator', 'schedule', 'schedule_edit_form.html');
    return schemaFormDecoratorsProvider.createDirective('schedule', 'schedule_edit_form.html');
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdminServices').directive('scheduleTable', ["BBModel", "$log", "ModalForm", function(BBModel, $log, ModalForm) {
    var controller, link;
    controller = function($scope) {
      $scope.fields = ['id', 'name', 'mobile'];
      $scope.getSchedules = function() {
        var params;
        params = {
          company: $scope.company
        };
        return BBModel.Admin.Schedule.query(params).then(function(schedules) {
          return $scope.schedules = schedules;
        });
      };
      $scope.newSchedule = function() {
        return ModalForm["new"]({
          company: $scope.company,
          title: 'New Schedule',
          new_rel: 'new_schedule',
          post_rel: 'schedules',
          size: 'lg',
          success: function(schedule) {
            return $scope.schedules.push(schedule);
          }
        });
      };
      $scope["delete"] = function(schedule) {
        return schedule.$del('self').then(function() {
          return $scope.schedules = _.reject($scope.schedules, schedule);
        }, function(err) {
          return $log.error("Failed to delete schedule");
        });
      };
      return $scope.edit = function(schedule) {
        return ModalForm.edit({
          model: schedule,
          title: 'Edit Schedule',
          size: 'lg'
        });
      };
    };
    link = function(scope, element, attrs) {
      if (scope.company) {
        return scope.getSchedules();
      } else {
        return BBModel.Admin.Company.query(attrs).then(function(company) {
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
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdminServices').directive('scheduleWeekdays', ["uiCalendarConfig", "ScheduleRules", function(uiCalendarConfig, ScheduleRules) {
    var controller, link;
    controller = function($scope, $attrs) {
      var options;
      $scope.calendarName = 'scheduleWeekdays';
      $scope.eventSources = [
        {
          events: function(start, end, timezone, callback) {
            return callback($scope.getEvents());
          }
        }
      ];
      $scope.getCalendarEvents = function(start, end) {
        var events;
        return events = uiCalendarConfig.calendars.scheduleWeekdays.fullCalendar('clientEvents', function(e) {
          return (start.isAfter(e.start) || start.isSame(e.start)) && (end.isBefore(e.end) || end.isSame(e.end));
        });
      };
      options = $scope.setOptions;
      options || (options = {});
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
          select: function(start, end, jsEvent, view) {
            var events;
            events = $scope.getCalendarEvents(start, end);
            if (events.length > 0) {
              return $scope.removeRange(start, end);
            } else {
              return $scope.addRange(start, end);
            }
          },
          eventResizeStop: function(event, jsEvent, ui, view) {
            return $scope.addRange(event.start, event.end);
          },
          eventDrop: function(event, delta, revertFunc, jsEvent, ui, view) {
            var orig;
            if (event.start.hasTime()) {
              orig = {
                start: moment(event.start).subtract(delta),
                end: moment(event.end).subtract(delta)
              };
              $scope.removeRange(orig.start, orig.end);
              return $scope.addRange(event.start, event.end);
            }
          },
          eventClick: function(event, jsEvent, view) {
            return $scope.removeRange(event.start, event.end);
          }
        }
      };
      return $scope.render = function() {
        return uiCalendarConfig.calendars.scheduleWeekdays.fullCalendar('render');
      };
    };
    link = function(scope, element, attrs, ngModel) {
      var scheduleRules;
      scheduleRules = function() {
        return new ScheduleRules(ngModel.$viewValue);
      };
      scope.getEvents = function() {
        return scheduleRules().toWeekdayEvents();
      };
      scope.addRange = function(start, end) {
        ngModel.$setViewValue(scheduleRules().addWeekdayRange(start, end));
        return ngModel.$render();
      };
      scope.removeRange = function(start, end) {
        ngModel.$setViewValue(scheduleRules().removeWeekdayRange(start, end));
        return ngModel.$render();
      };
      return ngModel.$render = function() {
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
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdminServices').directive('serviceTable', ["$uibModal", "$log", "ModalForm", "BBModel", function($uibModal, $log, ModalForm, BBModel) {
    var controller, link;
    controller = function($scope) {
      $scope.fields = ['id', 'name'];
      $scope.getServices = function() {
        var params;
        params = {
          company: $scope.company
        };
        return BBModel.Admin.Service.$query(params).then(function(services) {
          return $scope.services = services;
        });
      };
      $scope.newService = function() {
        return ModalForm["new"]({
          company: $scope.company,
          title: 'New Service',
          new_rel: 'new_service',
          post_rel: 'services',
          success: function(service) {
            return $scope.services.push(service);
          }
        });
      };
      $scope["delete"] = function(service) {
        return service.$del('self').then(function() {
          return $scope.services = _.reject($scope.services, service);
        }, function(err) {
          return $log.error("Failed to delete service");
        });
      };
      $scope.edit = function(service) {
        return ModalForm.edit({
          model: service,
          title: 'Edit Service'
        });
      };
      return $scope.newBooking = function(service) {
        return ModalForm.book({
          model: service,
          company: $scope.company,
          title: 'New Booking',
          success: function(booking) {
            return $log.info('Created new booking ', booking);
          }
        });
      };
    };
    link = function(scope, element, attrs) {
      if (scope.company) {
        return scope.getServices();
      } else {
        return BBModel.Admin.Company.query(attrs).then(function(company) {
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
  }]);

}).call(this);

(function() {
  'use strict';

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
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("AdminAddressModel", ["$q", "BBModel", "BaseModel", "AddressModel", function($q, BBModel, BaseModel, AddressModel) {

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
    var Admin_Address;
    return Admin_Address = (function(superClass) {
      extend(Admin_Address, superClass);

      function Admin_Address() {
        return Admin_Address.__super__.constructor.apply(this, arguments);
      }

      Admin_Address.prototype.distanceFrom = function(address, options) {
        var base;
        this.dists || (this.dists = []);
        (base = this.dists)[address] || (base[address] = Math.round(Math.random() * 50, 0));
        return this.dists[address];
      };

      return Admin_Address;

    })(AddressModel);
  }]);

}).call(this);

(function() {
  'use strict';

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
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("AdminClinicModel", ["$q", "BBModel", "BaseModel", "ClinicModel", function($q, BBModel, BaseModel, ClinicModel) {
    var Admin_Clinic;
    return Admin_Clinic = (function(superClass) {
      extend(Admin_Clinic, superClass);

      function Admin_Clinic(data) {
        var base;
        Admin_Clinic.__super__.constructor.call(this, data);
        this.repeat_rule || (this.repeat_rule = {});
        (base = this.repeat_rule).rules || (base.rules = {});
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

      Admin_Clinic.prototype.calcRepeatRule = function() {
        var en, id, ref, ref1, ref2, vals;
        vals = {};
        vals.name = this.name;
        vals.start_time = this.start_time.format("HH:mm");
        vals.end_time = this.end_time.format("HH:mm");
        vals.address_id = this.address_id;
        vals.resource_ids = [];
        ref = this.resources;
        for (id in ref) {
          en = ref[id];
          if (en) {
            vals.resource_ids.push(id);
          }
        }
        vals.person_ids = [];
        ref1 = this.people;
        for (id in ref1) {
          en = ref1[id];
          if (en) {
            vals.person_ids.push(id);
          }
        }
        vals.service_ids = [];
        ref2 = this.services;
        for (id in ref2) {
          en = ref2[id];
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

      Admin_Clinic.prototype.getPostData = function() {
        var data, en, id, ref, ref1, ref2;
        data = {};
        data.name = this.name;
        data.repeat_rule = this.repeat_rule;
        data.start_time = this.start_time;
        data.end_time = this.end_time;
        data.resource_ids = [];
        data.update_for_repeat = this.update_for_repeat;
        ref = this.resources;
        for (id in ref) {
          en = ref[id];
          if (en) {
            data.resource_ids.push(id);
          }
        }
        data.person_ids = [];
        ref1 = this.people;
        for (id in ref1) {
          en = ref1[id];
          if (en) {
            data.person_ids.push(id);
          }
        }
        data.service_ids = [];
        ref2 = this.services;
        for (id in ref2) {
          en = ref2[id];
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

      Admin_Clinic.prototype.save = function() {
        this.person_ids = _.compact(_.map(this.people, function(present, person_id) {
          if (present) {
            return person_id;
          }
        }));
        this.resource_ids = _.compact(_.map(this.resources, function(present, resource_id) {
          if (present) {
            return resource_id;
          }
        }));
        this.service_ids = _.compact(_.map(this.services, function(present, service_id) {
          if (present) {
            return service_id;
          }
        }));
        return this.$put('self', {}, this).then((function(_this) {
          return function(clinic) {
            _this.updateModel(clinic);
            _this.setTimes();
            return _this.setResourcesAndPeople();
          };
        })(this));
      };

      Admin_Clinic.prototype.$update = function(data) {
        data || (data = this);
        return this.$put('self', {}, data).then((function(_this) {
          return function(res) {
            return _this.constructor(res);
          };
        })(this));
      };

      return Admin_Clinic;

    })(ClinicModel);
  }]);

}).call(this);

(function() {
  'use strict';

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
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("AdminPersonModel", ["$q", "AdminPersonService", "BBModel", "BaseModel", "PersonModel", function($q, AdminPersonService, BBModel, BaseModel, PersonModel) {
    var Admin_Person;
    return Admin_Person = (function(superClass) {
      extend(Admin_Person, superClass);

      function Admin_Person(data) {
        Admin_Person.__super__.constructor.call(this, data);
      }


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

      Admin_Person.prototype.setAttendance = function(status, duration) {
        var defer;
        defer = $q.defer();
        this.$put('attendance', {}, {
          status: status,
          estimated_duration: duration
        }).then((function(_this) {
          return function(p) {
            _this.updateModel(p);
            return defer.resolve(_this);
          };
        })(this), (function(_this) {
          return function(err) {
            return defer.reject(err);
          };
        })(this));
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

      Admin_Person.prototype.finishServing = function() {
        var defer;
        defer = $q.defer();
        if (this.$has('finish_serving')) {
          this.$flush('self');
          this.$post('finish_serving').then((function(_this) {
            return function(q) {
              _this.$get('self').then(function(p) {
                return _this.updateModel(p);
              });
              _this.serving = null;
              return defer.resolve(q);
            };
          })(this), (function(_this) {
            return function(err) {
              return defer.reject(err);
            };
          })(this));
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

      Admin_Person.prototype.isAvailable = function(start, end) {
        var str;
        str = start.format("YYYY-MM-DD") + "-" + end.format("YYYY-MM-DD");
        this.availability || (this.availability = {});
        if (this.availability[str]) {
          return this.availability[str] === "Yes";
        }
        this.availability[str] = "-";
        if (this.$has('schedule')) {
          this.$get('schedule', {
            start_date: start.format("YYYY-MM-DD"),
            end_date: end.format("YYYY-MM-DD")
          }).then((function(_this) {
            return function(sched) {
              _this.availability[str] = "No";
              if (sched && sched.dates && sched.dates[start.format("YYYY-MM-DD")] && sched.dates[start.format("YYYY-MM-DD")] !== "None") {
                return _this.availability[str] = "Yes";
              }
            };
          })(this));
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

      Admin_Person.prototype.startServing = function(queuer) {
        var defer, params;
        defer = $q.defer();
        if (this.$has('start_serving')) {
          this.$flush('self');
          params = {
            queuer_id: queuer ? queuer.id : null
          };
          this.$post('start_serving', params).then((function(_this) {
            return function(q) {
              _this.$get('self').then(function(p) {
                return _this.updateModel(p);
              });
              _this.serving = q;
              return defer.resolve(q);
            };
          })(this), (function(_this) {
            return function(err) {
              return defer.reject(err);
            };
          })(this));
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

      Admin_Person.prototype.getQueuers = function() {
        var defer;
        defer = $q.defer();
        if (this.$has('queuers')) {
          this.$flush('queuers');
          this.$get('queuers').then((function(_this) {
            return function(collection) {
              return collection.$get('queuers').then(function(queuers) {
                var models, q;
                models = (function() {
                  var i, len, results;
                  results = [];
                  for (i = 0, len = queuers.length; i < len; i++) {
                    q = queuers[i];
                    results.push(new BBModel.Admin.Queuer(q));
                  }
                  return results;
                })();
                _this.queuers = models;
                return defer.resolve(models);
              }, function(err) {
                return defer.reject(err);
              });
            };
          })(this), (function(_this) {
            return function(err) {
              return defer.reject(err);
            };
          })(this));
        } else {
          defer.reject('queuers link not available');
        }
        return defer.promise;
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

      Admin_Person.prototype.getPostData = function() {
        var data;
        data = {};
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

      Admin_Person.prototype.$update = function(data) {
        data || (data = this.getPostData());
        return this.$put('self', {}, data).then((function(_this) {
          return function(res) {
            return _this.constructor(res);
          };
        })(this));
      };

      Admin_Person.$query = function(params) {
        return AdminPersonService.query(params);
      };

      Admin_Person.$block = function(company, person, data) {
        return AdminPersonService.block(company, person, data);
      };

      Admin_Person.$signup = function(user, data) {
        return AdminPersonService.signup(user, data);
      };

      Admin_Person.prototype.$refetch = function() {
        var defer;
        defer = $q.defer();
        this.$flush('self');
        this.$get('self').then((function(_this) {
          return function(res) {
            _this.constructor(res);
            return defer.resolve(_this);
          };
        })(this), function(err) {
          return defer.reject(err);
        });
        return defer.promise;
      };

      return Admin_Person;

    })(PersonModel);
  }]);

}).call(this);

(function() {
  'use strict';

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
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("AdminResourceModel", ["$q", "AdminResourceService", "BBModel", "BaseModel", "ResourceModel", function($q, AdminResourceService, BBModel, BaseModel, ResourceModel) {
    var Admin_Resource;
    return Admin_Resource = (function(superClass) {
      extend(Admin_Resource, superClass);

      function Admin_Resource() {
        return Admin_Resource.__super__.constructor.apply(this, arguments);
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

      Admin_Resource.prototype.isAvailable = function(start, end) {
        var str;
        str = start.format("YYYY-MM-DD") + "-" + end.format("YYYY-MM-DD");
        this.availability || (this.availability = {});
        if (this.availability[str]) {
          return this.availability[str] === "Yes";
        }
        this.availability[str] = "-";
        if (this.$has('schedule')) {
          this.$get('schedule', {
            start_date: start.format("YYYY-MM-DD"),
            end_date: end.format("YYYY-MM-DD")
          }).then((function(_this) {
            return function(sched) {
              _this.availability[str] = "No";
              if (sched && sched.dates && sched.dates[start.format("YYYY-MM-DD")] && sched.dates[start.format("YYYY-MM-DD")] !== "None") {
                return _this.availability[str] = "Yes";
              }
            };
          })(this));
        } else {
          this.availability[str] = "Yes";
        }
        return this.availability[str] === "Yes";
      };

      Admin_Resource.$query = function(params) {
        return AdminResourceService.query(params);
      };

      Admin_Resource.$block = function(company, resource, data) {
        return AdminResourceService.block(company, resource, data);
      };

      return Admin_Resource;

    })(ResourceModel);
  }]);

}).call(this);

(function() {
  'use strict';

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
   */
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("AdminScheduleModel", ["$q", "AdminScheduleService", "BBModel", "BaseModel", "ScheduleRules", function($q, AdminScheduleService, BBModel, BaseModel, ScheduleRules) {
    var Admin_Schedule;
    return Admin_Schedule = (function(superClass) {
      extend(Admin_Schedule, superClass);

      function Admin_Schedule(data) {
        Admin_Schedule.__super__.constructor.call(this, data);
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

      Admin_Schedule.prototype.getPostData = function() {
        var data;
        data = {};
        data.id = this.id;
        data.rules = this.rules;
        data.name = this.name;
        data.company_id = this.company_id;
        data.duration = this.duration;
        return data;
      };

      Admin_Schedule.$query = function(params) {
        return AdminScheduleService.query(params);
      };

      Admin_Schedule.$delete = function(schedule) {
        return AdminScheduleService["delete"](schedule);
      };

      Admin_Schedule.$update = function(schedule) {
        return AdminScheduleService.update(schedule);
      };

      return Admin_Schedule;

    })(BaseModel);
  }]);

}).call(this);

(function() {
  'use strict';

  /***
  * @ngdoc service
  * @name BB.Models:ScheduleRules
  *
  * @description
  * Representation of an Schedule Rules Object
  *
  * @property {object} rules The schedule rules
   */
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('BB.Models').factory("ScheduleRules", function() {
    var ScheduleRules;
    return ScheduleRules = (function() {
      function ScheduleRules(rules) {
        if (rules == null) {
          rules = {};
        }
        this.removeRangeFromDate = bind(this.removeRangeFromDate, this);
        this.addRangeToDate = bind(this.addRangeToDate, this);
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

      ScheduleRules.prototype.addRange = function(start, end) {
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

      ScheduleRules.prototype.removeRange = function(start, end) {
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

      ScheduleRules.prototype.addWeekdayRange = function(start, end) {
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

      ScheduleRules.prototype.removeWeekdayRange = function(start, end) {
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

      ScheduleRules.prototype.addRangeToDate = function(date, range) {
        var ranges;
        ranges = this.rules[date] ? this.rules[date] : [];
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

      ScheduleRules.prototype.removeRangeFromDate = function(date, range) {
        var ranges;
        ranges = this.rules[date] ? this.rules[date] : [];
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

      ScheduleRules.prototype.applyFunctionToDateRange = function(start, end, format, func) {
        var date, days, end_time, j, range, results;
        days = this.diffInDays(start, end);
        if (days === 0) {
          date = start.format(format);
          range = [start.format('HHmm'), end.format('HHmm')].join('-');
          func(date, range);
        } else {
          end_time = moment(start).endOf('day');
          this.applyFunctionToDateRange(start, end_time, format, func);
          _.each((function() {
            results = [];
            for (var j = 1; 1 <= days ? j <= days : j >= days; 1 <= days ? j++ : j--){ results.push(j); }
            return results;
          }).apply(this), (function(_this) {
            return function(i) {
              var start_time;
              date = moment(start).add(i, 'days');
              if (i === days) {
                if (!(end.hour() === 0 && end.minute() === 0)) {
                  start_time = moment(end).startOf('day');
                  return _this.applyFunctionToDateRange(start_time, end, format, func);
                }
              } else {
                start_time = moment(date).startOf('day');
                end_time = moment(date).endOf('day');
                return _this.applyFunctionToDateRange(start_time, end_time, format, func);
              }
            };
          })(this));
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

      ScheduleRules.prototype.diffInDays = function(start, end) {
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

      ScheduleRules.prototype.insertRange = function(ranges, range) {
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

      ScheduleRules.prototype.subtractRange = function(ranges, range) {
        if (_.indexOf(ranges, range, true) > -1) {
          return _.without(ranges, range);
        } else {
          return _.flatten(_.map(ranges, function(r) {
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

      ScheduleRules.prototype.joinRanges = function(ranges) {
        return _.reduce(ranges, function(m, range) {
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

      ScheduleRules.prototype.filterRulesByDates = function() {
        return _.pick(this.rules, function(value, key) {
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

      ScheduleRules.prototype.filterRulesByWeekdays = function() {
        return _.pick(this.rules, function(value, key) {
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

      ScheduleRules.prototype.formatTime = function(time) {
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

      ScheduleRules.prototype.toEvents = function(d) {
        if (d && this.rules[d] !== "None") {
          return _.map(this.rules[d], (function(_this) {
            return function(range) {
              return {
                start: [d, _this.formatTime(range.split('-')[0])].join('T'),
                end: [d, _this.formatTime(range.split('-')[1])].join('T')
              };
            };
          })(this));
        } else {
          return _.reduce(this.filterRulesByDates(), (function(_this) {
            return function(memo, ranges, date) {
              return memo.concat(_.map(ranges, function(range) {
                return {
                  start: [date, _this.formatTime(range.split('-')[0])].join('T'),
                  end: [date, _this.formatTime(range.split('-')[1])].join('T')
                };
              }));
            };
          })(this), []);
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

      ScheduleRules.prototype.toWeekdayEvents = function() {
        return _.reduce(this.filterRulesByWeekdays(), (function(_this) {
          return function(memo, ranges, day) {
            var date;
            date = moment().set('day', day).format('YYYY-MM-DD');
            return memo.concat(_.map(ranges, function(range) {
              return {
                start: [date, _this.formatTime(range.split('-')[0])].join('T'),
                end: [date, _this.formatTime(range.split('-')[1])].join('T')
              };
            }));
          };
        })(this), []);
      };

      return ScheduleRules;

    })();
  });

}).call(this);

(function() {
  'use strict';

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
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("AdminServiceModel", ["$q", "AdminServiceService", "BBModel", "ServiceModel", function($q, AdminServiceService, BBModel, ServiceModel) {
    var Admin_Service;
    return Admin_Service = (function(superClass) {
      extend(Admin_Service, superClass);

      function Admin_Service() {
        return Admin_Service.__super__.constructor.apply(this, arguments);
      }

      Admin_Service.$query = function(params) {
        return AdminServiceService.query(params);
      };

      return Admin_Service;

    })(ServiceModel);
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Services').factory('AdminAddressService', ["$q", "BBModel", function($q, BBModel) {
    return {
      query: function(params) {
        var company, defer;
        company = params.company;
        defer = $q.defer();
        company.$get('addresses').then(function(collection) {
          return collection.$get('addresses').then(function(addresss) {
            var models, s;
            models = (function() {
              var i, len, results;
              results = [];
              for (i = 0, len = addresss.length; i < len; i++) {
                s = addresss[i];
                results.push(new BBModel.Admin.Address(s));
              }
              return results;
            })();
            return defer.resolve(models);
          }, function(err) {
            return defer.reject(err);
          });
        }, function(err) {
          return defer.reject(err);
        });
        return defer.promise;
      }
    };
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Services').factory('AdminClinicService', ["$q", "BBModel", "ClinicCollections", "$window", function($q, BBModel, ClinicCollections, $window) {
    return {
      query: function(params) {
        var company, defer, existing;
        company = params.company;
        defer = $q.defer();
        if (params.id) {
          company.$get('clinics', params).then(function(clinic) {
            clinic = new BBModel.Admin.Clinic(clinic);
            return defer.resolve(clinic);
          }, function(err) {
            return defer.reject(err);
          });
        } else {
          existing = ClinicCollections.find(params);
          if (existing && !params.skip_cache) {
            defer.resolve(existing);
          } else {
            if (params.skip_cache) {
              if (existing) {
                ClinicCollections["delete"](existing);
              }
              company.$flush('clinics', params);
            }
            company.$get('clinics', params).then(function(collection) {
              return collection.$get('clinics').then(function(clinics) {
                var models, s;
                models = (function() {
                  var i, len, results;
                  results = [];
                  for (i = 0, len = clinics.length; i < len; i++) {
                    s = clinics[i];
                    results.push(new BBModel.Admin.Clinic(s));
                  }
                  return results;
                })();
                clinics = new $window.Collection.Clinic(collection, models, params);
                ClinicCollections.add(clinics);
                return defer.resolve(clinics);
              }, function(err) {
                return defer.reject(err);
              });
            }, function(err) {
              return defer.reject(err);
            });
          }
        }
        return defer.promise;
      },
      create: function(prms, clinic) {
        var company, deferred;
        company = prms.company;
        deferred = $q.defer();
        company.$post('clinics', {}, clinic.getPostData()).then((function(_this) {
          return function(clinic) {
            clinic = new BBModel.Admin.Clinic(clinic);
            ClinicCollections.checkItems(clinic);
            return deferred.resolve(clinic);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      cancel: function(clinic) {
        var deferred;
        deferred = $q.defer();
        clinic.$post('cancel', clinic).then((function(_this) {
          return function(clinic) {
            clinic = new BBModel.Admin.Clinic(clinic);
            ClinicCollections.deleteItems(clinic);
            return deferred.resolve(clinic);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      update: function(clinic) {
        var deferred;
        deferred = $q.defer();
        clinic.$put('self', {}, clinic.getPostData()).then((function(_this) {
          return function(c) {
            clinic = new BBModel.Admin.Clinic(c);
            ClinicCollections.checkItems(clinic);
            return deferred.resolve(clinic);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdminServices').factory('AdminPersonService', ["$q", "$window", "$rootScope", "halClient", "SlotCollections", "BookingCollections", "BBModel", "LoginService", "$log", function($q, $window, $rootScope, halClient, SlotCollections, BookingCollections, BBModel, LoginService, $log) {
    return {
      query: function(params) {
        var company, defer;
        company = params.company;
        defer = $q.defer();
        if (company.$has('people')) {
          company.$get('people', params).then(function(collection) {
            var obj;
            if (collection.$has('people')) {
              return collection.$get('people').then(function(people) {
                var models, p;
                models = (function() {
                  var i, len, results;
                  results = [];
                  for (i = 0, len = people.length; i < len; i++) {
                    p = people[i];
                    results.push(new BBModel.Admin.Person(p));
                  }
                  return results;
                })();
                return defer.resolve(models);
              }, function(err) {
                return defer.reject(err);
              });
            } else {
              obj = new BBModel.Admin.Person(collection);
              return defer.resolve(obj);
            }
          }, function(err) {
            return defer.reject(err);
          });
        } else {
          $log.warn('company has no people link');
          defer.reject('company has no people link');
        }
        return defer.promise;
      },
      block: function(company, person, data) {
        var deferred;
        deferred = $q.defer();
        person.$put('block', {}, data).then((function(_this) {
          return function(response) {
            var booking, slot;
            if (response.$href('self').indexOf('bookings') > -1) {
              booking = new BBModel.Admin.Booking(response);
              BookingCollections.checkItems(booking);
              return deferred.resolve(booking);
            } else {
              slot = new BBModel.Admin.Slot(response);
              SlotCollections.checkItems(slot);
              return deferred.resolve(slot);
            }
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      signup: function(user, data) {
        var defer;
        defer = $q.defer();
        return user.$get('company').then(function(company) {
          var params;
          params = {};
          company.$post('people', params, data).then(function(person) {
            if (person.$has('administrator')) {
              return person.$get('administrator').then(function(user) {
                LoginService.setLogin(user);
                return defer.resolve(person);
              });
            } else {
              return defer.resolve(person);
            }
          }, function(err) {
            return defer.reject(err);
          });
          return defer.promise;
        });
      }
    };
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Services').factory('AdminResourceService', ["$q", "UriTemplate", "halClient", "SlotCollections", "BBModel", "BookingCollections", function($q, UriTemplate, halClient, SlotCollections, BBModel, BookingCollections) {
    return {
      query: function(params) {
        var company, defer;
        company = params.company;
        defer = $q.defer();
        company.$get('resources', params).then(function(collection) {
          return collection.$get('resources').then(function(resources) {
            var models, r;
            models = (function() {
              var i, len, results;
              results = [];
              for (i = 0, len = resources.length; i < len; i++) {
                r = resources[i];
                results.push(new BBModel.Admin.Resource(r));
              }
              return results;
            })();
            return defer.resolve(models);
          }, function(err) {
            return defer.reject(err);
          });
        }, function(err) {
          return defer.reject(err);
        });
        return defer.promise;
      },
      block: function(company, resource, data) {
        var deferred;
        deferred = $q.defer();
        resource.$put('block', {}, data).then((function(_this) {
          return function(response) {
            var booking, slot;
            if (response.$href('self').indexOf('bookings') > -1) {
              booking = new BBModel.Admin.Booking(response);
              BookingCollections.checkItems(booking);
              return deferred.resolve(booking);
            } else {
              slot = new BBModel.Admin.Slot(response);
              SlotCollections.checkItems(slot);
              return deferred.resolve(slot);
            }
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Services').factory('AdminScheduleService', ["$q", "BBModel", "ScheduleRules", "BBAssets", function($q, BBModel, ScheduleRules, BBAssets) {
    var cacheDates, getCacheDates, loadScheduleCaches, schedule_cache;
    schedule_cache = {};
    ({
      query: function(params) {
        var company, defer;
        company = params.company;
        defer = $q.defer();
        company.$get('schedules').then(function(collection) {
          return collection.$get('schedules').then(function(schedules) {
            var models, s;
            models = (function() {
              var i, len, results;
              results = [];
              for (i = 0, len = schedules.length; i < len; i++) {
                s = schedules[i];
                results.push(new BBModel.Admin.Schedule(s));
              }
              return results;
            })();
            return defer.resolve(models);
          }, function(err) {
            return defer.reject(err);
          });
        }, function(err) {
          return defer.reject(err);
        });
        return defer.promise;
      },
      "delete": function(schedule) {
        var deferred;
        deferred = $q.defer();
        schedule.$del('self').then((function(_this) {
          return function(schedule) {
            schedule = new BBModel.Admin.Schedule(schedule);
            return deferred.resolve(schedule);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      update: function(schedule) {
        var deferred;
        deferred = $q.defer();
        return schedule.$put('self', {}, schedule.getPostData()).then((function(_this) {
          return function(c) {
            schedule = new BBModel.Admin.Schedule(c);
            return deferred.resolve(schedule);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
      }
    });
    cacheDates = function(asset, dates) {
      var k, name, results, v;
      schedule_cache[name = asset.self] || (schedule_cache[name] = {});
      results = [];
      for (k in dates) {
        v = dates[k];
        results.push(schedule_cache[asset.self][k] = v);
      }
      return results;
    };
    getCacheDates = function(asset, start, end) {
      var asset_cache, curr, dates, en, st, test;
      if (!schedule_cache[asset.self]) {
        return false;
      }
      st = moment(start);
      en = moment(end);
      curr = moment(start);
      dates = [];
      asset_cache = schedule_cache[asset.self];
      while (curr.unix() < end.unix()) {
        test = curr.format('YYYY-MM-DD');
        if (!asset_cache[test]) {
          return false;
        }
        dates[test] = asset_cache[test];
        curr = curr.add(1, 'day');
      }
      return dates;
    };
    loadScheduleCaches = function(assets) {
      var asset, fin, i, len, proms;
      proms = [];
      for (i = 0, len = assets.length; i < len; i++) {
        asset = assets[i];
        if (asset.$has('immediate_schedule')) {
          (function(_this) {
            return (function(asset) {
              var prom;
              prom = asset.$get('immediate_schedule');
              proms.push(prom);
              return prom.then(function(schedules) {
                return cacheDates(asset, schedules.dates);
              });
            });
          })(this)(asset);
        }
      }
      fin = $q.defer();
      if (proms.length > 0) {
        $q.all(proms).then(function() {
          return fin.resolve();
        });
      } else {
        fin.resolve();
      }
      return fin.promise;
    };
    return {
      mapAssetsToScheduleEvents: function(start, end, assets) {
        var assets_with_schedule;
        assets_with_schedule = _.filter(assets, function(asset) {
          return asset.$has('schedule');
        });
        return _.map(assets_with_schedule, function(asset) {
          var events, found, params, prom, rules;
          found = getCacheDates(asset, start, end);
          if (found) {
            rules = new ScheduleRules(found);
            events = rules.toEvents();
            _.each(events, function(e) {
              e.resourceId = parseInt(asset.id) + "_" + asset.type[0];
              e.title = asset.name;
              e.start = moment(e.start);
              e.end = moment(e.end);
              return e.rendering = "background";
            });
            prom = $q.defer();
            prom.resolve(events);
            return prom.promise;
          } else {
            params = {
              start_date: start.format('YYYY-MM-DD'),
              end_date: end.format('YYYY-MM-DD')
            };
            return asset.$get('schedule', params).then(function(schedules) {
              rules = new ScheduleRules(schedules.dates);
              events = rules.toEvents();
              _.each(events, function(e) {
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
      getAssetsScheduleEvents: function(company, start, end, filtered, requested) {
        var localMethod;
        if (filtered == null) {
          filtered = false;
        }
        if (requested == null) {
          requested = [];
        }
        if (filtered) {
          return loadScheduleCaches(requested).then((function(_this) {
            return function() {
              return $q.all(_this.mapAssetsToScheduleEvents(start, end, requested)).then(function(schedules) {
                return _.flatten(schedules);
              });
            };
          })(this));
        } else {
          localMethod = this.mapAssetsToScheduleEvents;
          return BBAssets.getAssets(company).then(function(assets) {
            return loadScheduleCaches(assets).then(function() {
              return $q.all(localMethod(start, end, assets)).then(function(schedules) {
                return _.flatten(schedules);
              });
            });
          });
        }
      }
    };
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Services').factory('AdminServiceService', ["$q", "BBModel", "$log", function($q, BBModel, $log) {
    return {
      query: function(params) {
        var company, defer;
        company = params.company;
        defer = $q.defer();
        company.$get('services').then(function(collection) {
          return collection.$get('services').then(function(services) {
            var models, s;
            models = (function() {
              var i, len, results;
              results = [];
              for (i = 0, len = services.length; i < len; i++) {
                s = services[i];
                results.push(new BBModel.Admin.Service(s));
              }
              return results;
            })();
            return defer.resolve(models);
          }, function(err) {
            return defer.reject(err);
          });
        }, function(err) {
          return defer.reject(err);
        });
        return defer.promise;
      }
    };
  }]);

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdminServices').factory("BB.Service.schedule", ["$q", "BBModel", function($q, BBModel) {
    return {
      unwrap: function(resource) {
        return new BBModel.Admin.Schedule(resource);
      }
    };
  }]);

  angular.module('BBAdminServices').factory("BB.Service.person", ["$q", "BBModel", function($q, BBModel) {
    return {
      unwrap: function(resource) {
        return new BBModel.Admin.Person(resource);
      }
    };
  }]);

  angular.module('BBAdminServices').factory("BB.Service.people", ["$q", "BBModel", function($q, BBModel) {
    return {
      promise: true,
      unwrap: function(resource) {
        var deferred;
        deferred = $q.defer();
        resource.$get('people').then((function(_this) {
          return function(items) {
            var i, j, len, models;
            models = [];
            for (j = 0, len = items.length; j < len; j++) {
              i = items[j];
              models.push(new BBModel.Admin.Person(i));
            }
            return deferred.resolve(models);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  }]);

  angular.module('BBAdminServices').factory("BB.Service.resource", ["$q", "BBModel", function($q, BBModel) {
    return {
      unwrap: function(resource) {
        return new BBModel.Admin.Resource(resource);
      }
    };
  }]);

  angular.module('BBAdminServices').factory("BB.Service.resources", ["$q", "BBModel", function($q, BBModel) {
    return {
      promise: true,
      unwrap: function(resource) {
        var deferred;
        deferred = $q.defer();
        resource.$get('resources').then((function(_this) {
          return function(items) {
            var i, j, len, models;
            models = [];
            for (j = 0, len = items.length; j < len; j++) {
              i = items[j];
              models.push(new BBModel.Admin.Resource(i));
            }
            return deferred.resolve(models);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  }]);

  angular.module('BBAdminServices').factory("BB.Service.service", ["$q", "BBModel", function($q, BBModel) {
    return {
      unwrap: function(resource) {
        return new BBModel.Admin.Service(resource);
      }
    };
  }]);

  angular.module('BBAdminServices').factory("BB.Service.services", ["$q", "BBModel", function($q, BBModel) {
    return {
      promise: true,
      unwrap: function(resource) {
        var deferred;
        deferred = $q.defer();
        resource.$get('services').then((function(_this) {
          return function(items) {
            var i, j, len, models;
            models = [];
            for (j = 0, len = items.length; j < len; j++) {
              i = items[j];
              models.push(new BBModel.Admin.Service(i));
            }
            return deferred.resolve(models);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  }]);

}).call(this);

(function() {
  "use strict";
  angular.module("BBAdminServices").config(["$translateProvider", function($translateProvider) {
    "ngInject";
    var translations;
    translations = {
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
  }]);

}).call(this);
