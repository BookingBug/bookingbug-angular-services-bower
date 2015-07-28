(function() {
  'use strict';
  angular.module('BBAdminServices', ['BB', 'BBAdmin.Services', 'BBAdmin.Filters', 'BBAdmin.Controllers', 'trNgGrid', 'ui.calendar']);

  angular.module('BBAdminServices').config(function($logProvider) {
    return $logProvider.debugEnabled(true);
  });

  angular.module('BBAdminServicesMockE2E', ['BBAdminServices', 'BBAdminMockE2E']);

}).call(this);

$.fullCalendar.Grid.prototype.setElement = function(el) {
  var noEventClick = this.view.opt('noEventClick');
  var _this = this;

  this.el = el

  // attach a handler to the grid's root element.
  this.el.on('mousedown', function(ev) {
    if (
      (!$(ev.target).is('.fc-event-container *, .fc-more') || noEventClick) && // not an an event element, or "more.." link
      !$(ev.target).closest('.fc-popover').length // not on a popover (like the "more.." events one)
    ) {
      _this.dayMousedown(ev);
    }
  });

  // attach event-element-related handlers. in Grid.events
  // same garbage collection note as above.
  this.bindSegHandlers();

  this.bindGlobalHandlers();

}


var FC = $.fullCalendar;
var agendaSelectAcrossWeek
agendaSelectAcrossWeek = FC.views.agenda.class.extend({

  initialize: function() {
    FC.views.agenda.class.prototype.initialize.apply(this);
    this.timeGrid.renderSelection = this.renderSelection;
  },

  splitRange: function(range) {
    var start = range.start;
    var end = range.end;
    days = moment.duration(end.diff(start)).days()
    return _.map(_.range(days + 1), function(i) {
      day = moment(start).add(i, 'days');
      return {
        start: day.set({'hour': start.hour(), 'minute': start.minute()}),
        end: moment(day).set({'hour': end.hour(), 'minute': end.minute()})
      };
    })
  },

  reportSelection: function(range, ev) {
    _.each(this.splitRange(range), function(r) {
      FC.views.agenda.class.prototype.reportSelection.apply(this, [r, ev])
    }, this);
  },

  renderSelection: function(range) {
    var ranges = this.view.splitRange(range);
    if (this.view.opt('selectHelper')) {
      _.each(ranges, this.renderRangeHelper, this);
    }
    else {
      segs = _.reduce(ranges, function(s, r) {
        return s.concat(this.rangeToSegs(r))
      }, [], this);
      this.renderFill('highlight', segs);
      this.view.trigger('selectx', null, range.start, range.end, null);
    }
  }

});

$.fullCalendar.views.agendaSelectAcrossWeek = agendaSelectAcrossWeek;


(function() {
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
      if (this.params.start_date) {
        this.start_date || (this.start_date = moment(this.params.start_date));
        if (this.start_date.isAfter(item.date)) {
          return false;
        }
      }
      if (this.params.end_date) {
        this.end_date || (this.end_date = moment(this.params.end_date));
        if (this.end_date.isBefore(item.date)) {
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
  angular.module('BBAdminServices').directive('personTable', function(AdminCompanyService, AdminPersonService, $log, ModalForm) {
    var controller, link;
    controller = function($scope) {
      $scope.fields = ['id', 'name', 'mobile'];
      $scope.getPeople = function() {
        var params;
        params = {
          company: $scope.company
        };
        return AdminPersonService.query(params).then(function(people) {
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
        return AdminCompanyService.query(attrs).then(function(company) {
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

}).call(this);

(function() {
  angular.module('BBAdminServices').directive('resourceTable', function(AdminCompanyService, AdminResourceService, $modal, $log, ModalForm) {
    var controller, link;
    controller = function($scope) {
      $scope.fields = ['id', 'name'];
      $scope.getResources = function() {
        var params;
        params = {
          company: $scope.company
        };
        return AdminResourceService.query(params).then(function(resources) {
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
      return $scope.edit = function(resource) {
        return ModalForm.edit({
          model: resource,
          title: 'Edit Resource'
        });
      };
    };
    link = function(scope, element, attrs) {
      if (scope.company) {
        return scope.getResources();
      } else {
        return AdminCompanyService.query(attrs).then(function(company) {
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

}).call(this);

(function() {
  angular.module('BBAdminServices').directive('scheduleCalendar', function(uiCalendarConfig, ScheduleRules) {
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
      options = $scope.$eval($attrs.scheduleCalendar) || {};
      $scope.options = {
        calendar: {
          editable: false,
          selectable: true,
          defaultView: 'agendaSelectAcrossWeek',
          header: {
            left: 'today,prev,next',
            center: 'title',
            right: 'month,agendaSelectAcrossWeek'
          },
          selectHelper: false,
          eventOverlap: false,
          lazyFetching: false,
          views: {
            agendaSelectAcrossWeek: {
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
        render: '=?'
      }
    };
  });

}).call(this);

(function() {
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
      require: 'ngModel'
    };
  });

  angular.module('schemaForm').config(function(schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) {
    schemaFormDecoratorsProvider.addMapping('bootstrapDecorator', 'schedule', 'schedule_edit_form.html');
    return schemaFormDecoratorsProvider.createDirective('schedule', 'schedule_edit_form.html');
  });

}).call(this);

(function() {
  angular.module('BBAdminServices').directive('scheduleTable', function(AdminCompanyService, AdminScheduleService, $modal, $log, ModalForm) {
    var controller, link;
    controller = function($scope) {
      $scope.fields = ['id', 'name', 'mobile'];
      $scope.getSchedules = function() {
        var params;
        params = {
          company: $scope.company
        };
        return AdminScheduleService.query(params).then(function(schedules) {
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
        return AdminCompanyService.query(attrs).then(function(company) {
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

}).call(this);

(function() {
  angular.module('BBAdminServices').directive('scheduleWeekdays', function(uiCalendarConfig, ScheduleRules) {
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
      options = $scope.$eval($attrs.scheduleWeekdays) || {};
      $scope.options = {
        calendar: {
          editable: false,
          selectable: true,
          defaultView: 'agendaSelectAcrossWeek',
          header: {
            left: '',
            center: 'title',
            right: ''
          },
          selectHelper: false,
          eventOverlap: false,
          views: {
            agendaSelectAcrossWeek: {
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
        render: '=?'
      }
    };
  });

}).call(this);

(function() {
  angular.module('BBAdminServices').directive('serviceTable', function(AdminCompanyService, AdminServiceService, $modal, $log, ModalForm) {
    var controller, link;
    controller = function($scope) {
      $scope.fields = ['id', 'name'];
      $scope.getServices = function() {
        var params;
        params = {
          company: $scope.company
        };
        return AdminServiceService.query(params).then(function(services) {
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
      return $scope.edit = function(service) {
        return ModalForm.edit({
          model: service,
          title: 'Edit Service'
        });
      };
    };
    link = function(scope, element, attrs) {
      if (scope.company) {
        return scope.getServices();
      } else {
        return AdminCompanyService.query(attrs).then(function(company) {
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

}).call(this);

(function() {
  'use strict';
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("Admin.AddressModel", function($q, BBModel, BaseModel, AddressModel) {
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
  });

}).call(this);

(function() {
  'use strict';
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("Admin.ClinicModel", function($q, BBModel, BaseModel) {
    var Admin_Clinic;
    return Admin_Clinic = (function(superClass) {
      extend(Admin_Clinic, superClass);

      function Admin_Clinic(data) {
        Admin_Clinic.__super__.constructor.call(this, data);
        this.setTimes();
        this.setResourcesAndPeople();
      }

      Admin_Clinic.prototype.setResourcesAndPeople = function() {
        this.resources = _.reduce(this.resource_ids, function(h, id) {
          h[id] = true;
          return h;
        }, {});
        this.people = _.reduce(this.person_ids, function(h, id) {
          h[id] = true;
          return h;
        }, {});
        this.uncovered = !this.person_ids || this.person_ids.length === 0;
        if (this.uncovered) {
          return this.className = "clinic_uncovered";
        } else {
          return this.className = "clinic_covered";
        }
      };

      Admin_Clinic.prototype.setTimes = function() {
        if (this.start_time) {
          this.start_time = moment(this.start_time);
          this.start = this.start_time;
        }
        if (this.end_time) {
          this.end_time = moment(this.end_time);
          this.end = this.end_time;
        }
        return this.title = this.name;
      };

      Admin_Clinic.prototype.getPostData = function() {
        var data, en, id, ref, ref1;
        data = {};
        data.name = this.name;
        data.start_time = this.start_time;
        data.end_time = this.end_time;
        data.resource_ids = [];
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
        console.log(this.address);
        if (this.address) {
          data.address_id = this.address.id;
        }
        return data;
      };

      Admin_Clinic.prototype.save = function() {
        this.person_ids = _.compact(_.map(this.people, function(present, person_id) {
          if (present) {
            return person_id;
          }
        }));
        this.resource_ids = _.compact(_.map(this.resources, function(present, person_id) {
          if (present) {
            return person_id;
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

      return Admin_Clinic;

    })(BaseModel);
  });

}).call(this);

(function() {
  'use strict';
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("Admin.PersonModel", function($q, BBModel, BaseModel, PersonModel) {
    var Admin_Person;
    return Admin_Person = (function(superClass) {
      extend(Admin_Person, superClass);

      function Admin_Person(data) {
        Admin_Person.__super__.constructor.call(this, data);
        if (!this.queuing_disabled) {
          this.setCurrentCustomer();
        }
      }

      Admin_Person.prototype.setCurrentCustomer = function() {
        var defer;
        defer = $q.defer();
        if (this.$has('queuer')) {
          this.$get('queuer').then((function(_this) {
            return function(queuer) {
              _this.serving = new BBModel.Admin.Queuer(queuer);
              return defer.resolve(_this.serving);
            };
          })(this), function(err) {
            return defer.reject(err);
          });
        } else {
          defer.resolve();
        }
        return defer.promise;
      };

      Admin_Person.prototype.setAttendance = function(status) {
        var defer;
        defer = $q.defer();
        this.$put('attendance', {}, {
          status: status
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

      Admin_Person.prototype.isAvailable = function(start, end) {
        var str;
        str = start.format("YYYY-MM-DD") + "-" + end.format("YYYY-MM-DD");
        this.availability || (this.availability = {});
        if (this.availability[str]) {
          return this.availability[str];
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
        return this.availability[str];
      };

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

      return Admin_Person;

    })(PersonModel);
  });

}).call(this);

(function() {
  'use strict';
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("Admin.ResourceModel", function($q, BBModel, BaseModel, ResourceModel) {
    var Admin_Resource;
    return Admin_Resource = (function(superClass) {
      extend(Admin_Resource, superClass);

      function Admin_Resource() {
        return Admin_Resource.__super__.constructor.apply(this, arguments);
      }

      Admin_Resource.prototype.isAvailable = function(start, end) {
        var str;
        str = start.format("YYYY-MM-DD") + "-" + end.format("YYYY-MM-DD");
        this.availability || (this.availability = {});
        if (this.availability[str]) {
          return this.availability[str];
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
        return this.availability[str];
      };

      return Admin_Resource;

    })(ResourceModel);
  });

}).call(this);

(function() {
  'use strict';
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("Admin.ScheduleModel", function($q, BBModel, BaseModel) {
    var Admin_Schedule;
    return Admin_Schedule = (function(superClass) {
      extend(Admin_Schedule, superClass);

      function Admin_Schedule(data) {
        Admin_Schedule.__super__.constructor.call(this, data);
      }

      return Admin_Schedule;

    })(BaseModel);
  });

}).call(this);

(function() {
  'use strict';
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

      ScheduleRules.prototype.addRange = function(start, end) {
        return this.applyFunctionToDateRange(start, end, 'YYYY-MM-DD', this.addRangeToDate);
      };

      ScheduleRules.prototype.removeRange = function(start, end) {
        return this.applyFunctionToDateRange(start, end, 'YYYY-MM-DD', this.removeRangeFromDate);
      };

      ScheduleRules.prototype.addWeekdayRange = function(start, end) {
        return this.applyFunctionToDateRange(start, end, 'd', this.addRangeToDate);
      };

      ScheduleRules.prototype.removeWeekdayRange = function(start, end) {
        return this.applyFunctionToDateRange(start, end, 'd', this.removeRangeFromDate);
      };

      ScheduleRules.prototype.addRangeToDate = function(date, range) {
        var ranges;
        ranges = this.rules[date] ? this.rules[date].split(',') : [];
        return this.rules[date] = this.joinRanges(this.insertRange(ranges, range));
      };

      ScheduleRules.prototype.removeRangeFromDate = function(date, range) {
        var ranges;
        ranges = this.rules[date] ? this.rules[date].split(',') : [];
        this.rules[date] = this.joinRanges(this.subtractRange(ranges, range));
        if (this.rules[date] === '') {
          return delete this.rules[date];
        }
      };

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

      ScheduleRules.prototype.diffInDays = function(start, end) {
        return moment.duration(end.diff(start)).days();
      };

      ScheduleRules.prototype.insertRange = function(ranges, range) {
        ranges.splice(_.sortedIndex(ranges, range), 0, range);
        return ranges;
      };

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
        }, "");
      };

      ScheduleRules.prototype.filterRulesByDates = function() {
        return _.pick(this.rules, function(value, key) {
          return key.match(/^\d{4}-\d{2}-\d{2}$/);
        });
      };

      ScheduleRules.prototype.filterRulesByWeekdays = function() {
        return _.pick(this.rules, function(value, key) {
          return key.match(/^\d$/);
        });
      };

      ScheduleRules.prototype.formatTime = function(time) {
        return [time.slice(0, 2), time.slice(2, 4)].join(':');
      };

      ScheduleRules.prototype.toEvents = function(d) {
        if (d) {
          return _.map(this.rules[d].split(','), (function(_this) {
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
              return memo.concat(_.map(ranges.split(','), function(range) {
                return {
                  start: [date, _this.formatTime(range.split('-')[0])].join('T'),
                  end: [date, _this.formatTime(range.split('-')[1])].join('T')
                };
              }));
            };
          })(this), []);
        }
      };

      ScheduleRules.prototype.toWeekdayEvents = function() {
        return _.reduce(this.filterRulesByWeekdays(), (function(_this) {
          return function(memo, ranges, day) {
            var date;
            date = moment().set('day', day).format('YYYY-MM-DD');
            return memo.concat(_.map(ranges.split(','), function(range) {
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
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("Admin.ServiceModel", function($q, BBModel, ServiceModel) {
    var Admin_Service;
    return Admin_Service = (function(superClass) {
      extend(Admin_Service, superClass);

      function Admin_Service() {
        return Admin_Service.__super__.constructor.apply(this, arguments);
      }

      return Admin_Service;

    })(ServiceModel);
  });

}).call(this);

(function() {
  angular.module('BBAdmin.Services').factory('AdminAddressService', function($q, BBModel) {
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
  });

}).call(this);

(function() {
  angular.module('BBAdmin.Services').factory('AdminClinicService', function($q, BBModel, ClinicCollections, $window) {
    return {
      query: function(params) {
        var company, defer, existing;
        company = params.company;
        defer = $q.defer();
        existing = ClinicCollections.find(params);
        if (existing) {
          defer.resolve(existing);
        } else {
          company.$get('clinics').then(function(collection) {
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
      "delete": function(clinic) {
        var deferred;
        deferred = $q.defer();
        clinic.$del('self').then((function(_this) {
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
  });

}).call(this);

(function() {
  angular.module('BBAdminServices').factory('AdminPersonService', function($q, $window, $rootScope, halClient, SlotCollections, BBModel, LoginService, $log) {
    return {
      query: function(params) {
        var company, defer;
        company = params.company;
        defer = $q.defer();
        if (company.$has('people')) {
          company.$get('people').then(function(collection) {
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
          return function(slot) {
            slot = new BBModel.Admin.Slot(slot);
            SlotCollections.checkItems(slot);
            return deferred.resolve(slot);
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
  });

}).call(this);

(function() {
  angular.module('BBAdmin.Services').factory('AdminResourceService', function($q, $window, halClient, SlotCollections, BBModel) {
    return {
      query: function(params) {
        var company, defer;
        company = params.company;
        defer = $q.defer();
        company.$get('resources').then(function(collection) {
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
        var deferred, href, prms, uri;
        prms = {
          id: resource.id,
          company_id: company.id
        };
        deferred = $q.defer();
        href = "/api/v1/admin/{company_id}/resource/{id}/block";
        uri = new $window.UriTemplate.parse(href).expand(prms || {});
        halClient.$put(uri, {}, data).then((function(_this) {
          return function(slot) {
            slot = new BBModel.Admin.Slot(slot);
            SlotCollections.checkItems(slot);
            return deferred.resolve(slot);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BBAdmin.Services').factory('AdminScheduleService', function($q, BBModel) {
    return {
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
      }
    };
  });

}).call(this);

(function() {
  angular.module('BBAdmin.Services').factory('AdminServiceService', function($q, BBModel, $log) {
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
  });

}).call(this);
