(function() {
  'use strict';
  var adminapp;

  adminapp = angular.module('BBAdmin', ['BB', 'BBAdmin.Services', 'BBAdmin.Filters', 'BBAdmin.Controllers', 'trNgGrid']);

  angular.module('BBAdmin').config(function($logProvider) {
    return $logProvider.debugEnabled(true);
  });

  angular.module('BBAdmin.Directives', []);

  angular.module('BBAdmin.Filters', []);

  angular.module('BBAdmin.Services', ['ngResource', 'ngSanitize', 'ngLocalData']);

  angular.module('BBAdmin.Controllers', ['ngLocalData', 'ngSanitize']);

  adminapp.run(function($rootScope, $log, DebugUtilsService, FormDataStoreService, $bbug, $document, $sessionStorage, AppConfig, AdminLoginService) {
    return AdminLoginService.checkLogin().then(function() {
      if ($rootScope.user && $rootScope.user.company_id) {
        $rootScope.bb || ($rootScope.bb = {});
        return $rootScope.bb.company_id = $rootScope.user.company_id;
      }
    });
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdminMockE2E', ['BBAdmin', 'ngMockE2E']);

  angular.module('BBAdminMockE2E').run(function($httpBackend) {
    var admin_schema, administrators, company, event_chain_schema, event_chains, member_bookings, member_schema, people, person_schema, schedule1, schedule_schema, schedules, service_schema, services;
    $httpBackend.whenPOST('http://www.bookingbug.com/api/v1/login/admin/123').respond(function(method, url, data) {
      var login;
      console.log('login post');
      login = {
        email: "tennis@example.com",
        auth_token: "PO_MZmDtEhU1BK6tkMNPjg",
        company_id: 123,
        path: "http://www.bookingbug.com/api/v1",
        role: "owner",
        _embedded: {
          members: [],
          administrators: [
            {
              role: "owner",
              name: "Tom's Tennis",
              company_id: 123,
              _links: {
                self: {
                  href: "http://www.bookingbug.com/api/v1/admin/123/administrator/29774"
                },
                company: {
                  href: "http://www.bookingbug.com/api/v1/admin/123/company"
                },
                login: {
                  href: "http://www.bookingbug.com/api/v1/login/admin/123"
                }
              }
            }
          ]
        },
        _links: {
          self: {
            href: "http://www.bookingbug.com/api/v1/login/123"
          },
          administrator: {
            href: "http://www.bookingbug.com/api/v1/admin/123/administrator/29774",
            templated: true
          }
        }
      };
      return [200, login, {}];
    });
    company = {
      id: 123,
      name: "Tom's Tennis",
      currency_code: 'GBP',
      country_code: 'gb',
      timezone: 'Europe/London',
      _links: {
        self: {
          href: 'http://www.bookingbug.com/api/v1/company/123'
        },
        people: {
          href: 'http://www.bookingbug.com/api/v1/admin/123/people'
        },
        new_person: {
          href: 'http://www.bookingbug.com/api/v1/admin/123/people/new{?signup}',
          templated: true
        },
        administrators: {
          href: 'http://www.bookingbug.com/api/v1/admin/123/administrators'
        },
        new_administrator: {
          href: 'http://www.bookingbug.com/api/v1/admin/123/administrators/new'
        },
        services: {
          href: 'http://www.bookingbug.com/api/v1/admin/123/services'
        },
        new_service: {
          href: 'http://www.bookingbug.com/api/v1/admin/123/services/new'
        },
        event_chains: {
          href: 'http://www.bookingbug.com/api/v1/admin/123/event_chains'
        },
        new_event_chain: {
          href: 'http://www.bookingbug.com/api/v1/admin/123/event_chains/new'
        },
        schedules: {
          href: 'http://www.bookingbug.com/api/v1/admin/123/schedules'
        },
        new_schedule: {
          href: 'http://www.bookingbug.com/api/v1/admin/123/schedules/new'
        },
        resources: {
          href: 'http://www.bookingbug.com/api/v1/admin/123/resources'
        },
        new_resource: {
          href: 'http://www.bookingbug.com/api/v1/admin/123/resources/new'
        }
      }
    };
    $httpBackend.whenGET('http://www.bookingbug.com/api/v1/admin/123/company').respond(company);
    people = {
      total_entries: 3,
      _embedded: {
        people: [
          {
            id: 1,
            name: "John",
            type: "person",
            deleted: false,
            disabled: false,
            company_id: 123,
            mobile: "",
            _links: {
              self: {
                href: "http://www.bookingbug.com/api/v1/admin/123/people/1"
              },
              items: {
                href: "http://www.bookingbug.com/api/v1/123/items?person_id=1"
              },
              edit: {
                href: "http://www.bookingbug.com/api/v1/admin/123/people/1/edit"
              },
              schedule: {
                href: "http://www.bookingbug.com/api/v1/admin/123/schedules/1"
              }
            },
            _embedded: {}
          }, {
            id: 2,
            name: "Mary",
            type: "person",
            email: "mary@example.com",
            deleted: false,
            disabled: false,
            company_id: 123,
            mobile: "",
            _links: {
              self: {
                href: "http://www.bookingbug.com/api/v1/admin/123/people/2"
              },
              items: {
                href: "http://www.bookingbug.com/api/v1/123/items?person_id=2"
              },
              edit: {
                href: "http://www.bookingbug.com/api/v1/admin/123/people/2/edit"
              },
              schedule: {
                href: "http://www.bookingbug.com/api/v1/admin/123/schedules/1"
              }
            },
            _embedded: {}
          }, {
            id: 3,
            name: "Bob",
            type: "person",
            email: "bob@example.com",
            deleted: false,
            disabled: false,
            company_id: 123,
            mobile: "",
            _links: {
              self: {
                href: "http://www.bookingbug.com/api/v1/admin/123/people/3"
              },
              items: {
                href: "http://www.bookingbug.com/api/v1/123/items?person_id=3"
              },
              edit: {
                href: "http://www.bookingbug.com/api/v1/admin/123/people/3/edit"
              },
              schedule: {
                href: "http://www.bookingbug.com/api/v1/admin/123/schedules/1"
              }
            },
            _embedded: {}
          }
        ]
      },
      _links: {
        self: {
          href: "http://www.bookingbug.com/api/v1/admin/123/people"
        },
        "new": {
          href: "http://www.bookingbug.com/api/v1/admin/123/people/new{?signup}",
          templated: true
        }
      }
    };
    $httpBackend.whenGET('http://www.bookingbug.com/api/v1/admin/123/people').respond(people);
    person_schema = {
      form: [
        '*', {
          type: 'submit',
          title: 'Save'
        }
      ],
      schema: {
        properties: {
          email: {
            title: 'Email *',
            type: 'string'
          },
          name: {
            title: 'Name *',
            type: 'string'
          },
          phone: {
            title: 'Phone',
            type: 'string'
          }
        },
        required: ['name', 'email'],
        title: 'Person',
        type: 'object'
      }
    };
    $httpBackend.whenGET('http://www.bookingbug.com/api/v1/admin/123/people/new').respond(function() {
      return [200, person_schema, {}];
    });
    $httpBackend.whenGET(/http:\/\/www.bookingbug.com\/api\/v1\/admin\/123\/people\/\d\/edit/).respond(function() {
      return [200, person_schema, {}];
    });
    $httpBackend.whenDELETE(/http:\/\/www.bookingbug.com\/api\/v1\/admin\/123\/people\/\d/).respond(function() {
      return [200, {}, {}];
    });
    $httpBackend.whenPOST('http://www.bookingbug.com/api/v1/admin/123/people').respond(function(method, url, data) {
      console.log('post person');
      console.log(method);
      console.log(url);
      console.log(data);
      return [200, people.concat([data]), {}];
    });
    services = {
      total_entries: 3,
      _embedded: {
        services: [
          {
            id: 1,
            name: "Data analysis",
            type: "service",
            deleted: false,
            disabled: false,
            company_id: 123,
            _links: {
              self: {
                href: "http://www.bookingbug.com/api/v1/admin/123/services/1"
              },
              edit: {
                href: 'http://www.bookingbug.com/api/v1/admin/123/services/1/edit',
                templated: true
              },
              items: {
                href: "http://www.bookingbug.com/api/v1/123/items?service_id=1"
              }
            },
            _embedded: {}
          }, {
            id: 2,
            name: "Personal consultation",
            type: "service",
            deleted: false,
            disabled: false,
            company_id: 123,
            _links: {
              self: {
                href: "http://www.bookingbug.com/api/v1/admin/123/services/2"
              },
              edit: {
                href: 'http://www.bookingbug.com/api/v1/admin/123/services/2/edit',
                templated: true
              },
              items: {
                href: "http://www.bookingbug.com/api/v1/123/items?service_id=2"
              }
            },
            _embedded: {}
          }, {
            id: 3,
            name: "Marketing strategy",
            type: "service",
            deleted: false,
            disabled: false,
            company_id: 123,
            _links: {
              self: {
                href: "http://www.bookingbug.com/api/v1/admin/123/services/3"
              },
              edit: {
                href: 'http://www.bookingbug.com/api/v1/admin/123/services/3/edit',
                templated: true
              },
              items: {
                href: "http://www.bookingbug.com/api/v1/123/items?service_id=3"
              }
            },
            _embedded: {}
          }
        ]
      },
      _links: {
        self: {
          href: "http://www.bookingbug.com/api/v1/admin/123/services"
        },
        "new": {
          href: "http://www.bookingbug.com/api/v1/admin/123/services/new{?signup}",
          templated: true
        }
      }
    };
    $httpBackend.whenGET('http://www.bookingbug.com/api/v1/admin/123/services').respond(services);
    service_schema = {
      form: [
        {
          'key': 'name',
          type: 'text',
          feedback: false
        }, {
          type: 'submit',
          title: 'Save'
        }
      ],
      schema: {
        properties: {
          name: {
            title: 'Name *',
            type: 'String'
          }
        },
        required: ['name'],
        title: 'Service',
        type: 'object'
      }
    };
    $httpBackend.whenGET('http://www.bookingbug.com/api/v1/admin/123/services/new').respond(function() {
      return [200, service_schema, {}];
    });
    $httpBackend.whenGET('http://www.bookingbug.com/api/v1/admin/123/services/1/edit').respond(function() {
      return [200, service_schema, {}];
    });
    $httpBackend.whenGET('http://www.bookingbug.com/api/v1/admin/123/services/2/edit').respond(function() {
      return [200, service_schema, {}];
    });
    $httpBackend.whenGET('http://www.bookingbug.com/api/v1/admin/123/services/3/edit').respond(function() {
      return [200, service_schema, {}];
    });
    $httpBackend.whenPOST('http://www.bookingbug.com/api/v1/admin/123/services').respond(function(method, url, data) {
      console.log('post service');
      console.log(method);
      console.log(url);
      console.log(data);
      return [200, services.concat([data]), {}];
    });
    administrators = {
      _embedded: {
        administrators: [
          {
            name: "Dave",
            email: "dave@example.com",
            role: 'admin',
            company_id: 123,
            company_name: "Tom's Tennis",
            _links: {
              self: {
                href: 'http://www.bookingbug.com/api/v1/admin/123/administrators/1'
              },
              edit: {
                href: 'http://www.bookingbug.com/api/v1/admin/123/administrators/1/edit'
              },
              company: {
                href: 'http://www.bookingbug.com/api/v1/admin/123/company'
              },
              login: {
                href: 'http://www.bookingbug.com/api/v1/login/admin/123'
              }
            }
          }, {
            name: "Sue",
            email: "sue@example.com",
            role: 'owner',
            company_id: 123,
            company_name: "Tom's Tennis",
            _links: {
              self: {
                href: 'http://www.bookingbug.com/api/v1/admin/123/administrators/2'
              },
              edit: {
                href: 'http://www.bookingbug.com/api/v1/admin/123/administrators/2/edit'
              },
              company: {
                href: 'http://www.bookingbug.com/api/v1/admin/123/company'
              },
              login: {
                href: 'http://www.bookingbug.com/api/v1/login/admin/123'
              }
            }
          }
        ]
      },
      _links: {
        self: {
          href: 'http://www.bookingbug.com/api/v1/admin/123/administrators'
        },
        "new": {
          href: 'http://www.bookingbug.com/api/v1/admin/123/administrators/new',
          templated: true
        }
      }
    };
    $httpBackend.whenGET('http://www.bookingbug.com/api/v1/admin/123/administrators').respond(administrators);
    admin_schema = {
      form: [
        {
          key: 'name',
          type: 'text',
          feedback: false
        }, {
          key: 'email',
          type: 'text',
          feedback: false
        }, {
          key: 'role',
          type: 'select',
          feedback: false,
          titleMap: {
            owner: 'Owner',
            admin: 'Admin',
            user: 'User'
          }
        }, {
          type: 'submit',
          title: 'Save'
        }
      ],
      schema: {
        properties: {
          name: {
            title: 'Name *',
            type: 'string'
          },
          email: {
            title: 'Email *',
            type: 'string'
          },
          role: {
            title: 'Role',
            type: 'string',
            "enum": ['owner', 'admin', 'user', 'callcenter']
          }
        },
        required: ['name', 'email'],
        title: 'Administrator',
        type: 'object'
      }
    };
    $httpBackend.whenGET('http://www.bookingbug.com/api/v1/admin/123/administrators/new').respond(function() {
      return [200, admin_schema, {}];
    });
    admin_schema = {
      form: [
        {
          key: 'name',
          type: 'text',
          feedback: false
        }, {
          key: 'role',
          type: 'select',
          feedback: false,
          titleMap: {
            owner: 'Owner',
            admin: 'Admin',
            user: 'User'
          }
        }, {
          type: 'submit',
          title: 'Save'
        }
      ],
      schema: {
        properties: {
          name: {
            title: 'Name *',
            type: 'string'
          },
          role: {
            title: 'Role',
            type: 'string',
            "enum": ['owner', 'admin', 'user', 'callcenter']
          }
        },
        title: 'Administrator',
        type: 'object'
      }
    };
    $httpBackend.whenGET('http://www.bookingbug.com/api/v1/admin/123/administrators/1/edit').respond(function() {
      return [200, admin_schema, {}];
    });
    $httpBackend.whenPOST('http://www.bookingbug.com/api/v1/login/member/123').respond(function(method, url, data) {
      var login;
      login = {
        email: "smith@example.com",
        auth_token: "TO_4ZrDtEhU1BK6tkMNPj0",
        company_id: 123,
        path: "http://www.bookingbug.com/api/v1",
        role: "member",
        _embedded: {
          members: [
            {
              first_name: "John",
              last_name: "Smith",
              email: "smith@example.com",
              client_type: "Member",
              address1: "Some street",
              address3: "Some town",
              id: 123456,
              company_id: 123,
              _links: {
                self: {
                  href: "http://www.bookingbug.com/api/v1/123/members/123456{?embed}",
                  templated: true
                },
                bookings: {
                  href: "http://www.bookingbug.com/api/v1/123/members/123456/bookings{?start_date,end_date,include_cancelled,page,per_page}",
                  templated: true
                },
                company: {
                  href: "http://www.bookingbug.com/api/v1/company/123",
                  templated: true
                },
                edit_member: {
                  href: "http://www.bookingbug.com/api/v1/123/members/123456/edit",
                  templated: true
                },
                pre_paid_bookings: {
                  href: "http://www.bookingbug.com/api/v1/123/members/123456/pre_paid_bookings{?start_date,end_date,page,per_page}",
                  templated: true
                }
              }
            }
          ],
          administrators: []
        },
        _links: {
          self: {
            href: "http://www.bookingbug.com/api/v1/login/123"
          },
          member: {
            href: "http://www.bookingbug.com/api/v1/123/members/123456{?embed}",
            templated: true
          }
        }
      };
      return [200, login, {}];
    });
    member_schema = {
      form: [
        {
          key: 'first_name',
          type: 'text',
          feedback: false
        }, {
          key: 'last_name',
          type: 'text',
          feedback: false
        }, {
          key: 'email',
          type: 'email',
          feedback: false
        }, {
          key: 'address1',
          type: 'text',
          feedback: false
        }, {
          key: 'address2',
          type: 'text',
          feedback: false
        }, {
          key: 'address3',
          type: 'text',
          feedback: false
        }, {
          key: 'address4',
          type: 'text',
          feedback: false
        }, {
          key: 'postcode',
          type: 'text',
          feedback: false
        }, {
          type: 'submit',
          title: 'Save'
        }
      ],
      schema: {
        properties: {
          first_name: {
            title: 'First Name',
            type: 'string'
          },
          last_name: {
            title: 'Last Name',
            type: 'string'
          },
          email: {
            title: 'Email',
            type: 'string'
          },
          address1: {
            title: 'Address',
            type: 'string'
          },
          address2: {
            title: ' ',
            type: 'string'
          },
          address3: {
            title: 'Town',
            type: 'string'
          },
          address4: {
            title: 'County',
            type: 'string'
          },
          postcode: {
            title: 'Post Code',
            type: 'string'
          }
        },
        title: 'Member',
        type: 'object'
      }
    };
    $httpBackend.whenGET('http://www.bookingbug.com/api/v1/123/members/123456/edit').respond(function() {
      return [200, member_schema, {}];
    });
    member_bookings = {
      _embedded: {
        bookings: [
          {
            _embedded: {
              answers: [
                {
                  admin_only: false,
                  company_id: 123,
                  id: 6700607,
                  outcome: false,
                  price: 0,
                  question_id: 20478,
                  question_text: "Gender",
                  value: "M"
                }
              ]
            },
            _links: {
              company: {
                href: "http://www.bookingbug.com/api/v1/company/123"
              },
              edit_booking: {
                href: "http://www.bookingbug.com/api/v1/123/members/123456/bookings/4553463/edit"
              },
              member: {
                href: "http://www.bookingbug.com/api/v1/123/members/123456{?embed}",
                templated: true
              },
              person: {
                href: "http://www.bookingbug.com/api/v1/123/people/74",
                templated: true
              },
              self: {
                href: "http://www.bookingbug.com/api/v1/123/members/123456/bookings?start_date=2014-11-21&page=1&per_page=30"
              },
              service: {
                href: "http://www.bookingbug.com/api/v1/123/services/30063",
                templated: true
              }
            },
            attended: true,
            category_name: "Private Lessons",
            company_id: 123,
            datetime: "2014-11-21T12:00:00+00:00",
            describe: "Fri 21st Nov 12:00pm",
            duration: 3600,
            end_datetime: "2014-11-21T13:00:00+00:00",
            event_id: 325562,
            full_describe: "Tennis Lesson",
            id: 4553463,
            min_cancellation_time: "2014-11-20T12:00:00+00:00",
            on_waitlist: false,
            paid: 0,
            person_name: "Bob",
            price: 1,
            purchase_id: 3844035,
            purchase_ref: "j7PuYsmbexmFXS12Mzg0NDAzNQ%3D%3D",
            quantity: 1,
            service_name: "Tennis Lesson",
            time_zone: ""
          }
        ]
      },
      _links: {
        self: {
          href: "http://www.bookingbug.com/api/v1/123/members/123456/bookings?start_date=2014-11-21&page=1&per_page=30"
        }
      },
      total_entries: 1
    };
    $httpBackend.whenGET("http://www.bookingbug.com/api/v1/123/members/123456/bookings?start_date=" + (moment().format("YYYY-MM-DD"))).respond(function() {
      return [200, member_bookings, {}];
    });
    event_chains = {
      total_entries: 1,
      _embedded: {
        event_chains: [
          {
            id: 1,
            deleted: false,
            disabled: false,
            company_id: 123,
            capacity_view: 3,
            description: "",
            duration: 120,
            email_per_ticket: true,
            end_date: "2015-11-12",
            group: "Events",
            long_description: "",
            max_num_bookings: 1,
            min_advance_time: "2015-02-13T14:24:29+00:00",
            name: "My Event",
            person_name: "Ed",
            price: 0,
            questions_per_ticket: false,
            spaces: 10,
            start_date: "2015-11-12",
            ticket_type: "single_space",
            time: "12:00:00+00:00",
            mobile: "",
            _links: {
              self: {
                href: "http://www.bookingbug.com/api/v1/admin/123/event_chains/1"
              },
              edit: {
                href: "http://www.bookingbug.com/api/v1/admin/123/event_chains/1/edit"
              }
            },
            _embedded: {}
          }
        ]
      },
      _links: {
        self: {
          href: "http://www.bookingbug.com/api/v1/admin/123/event_chains"
        },
        "new": {
          href: "http://www.bookingbug.com/api/v1/admin/123/event_chains/new",
          templated: true
        }
      }
    };
    $httpBackend.whenGET('http://www.bookingbug.com/api/v1/admin/123/event_chains').respond(event_chains);
    event_chain_schema = {
      form: [
        {
          key: 'name',
          type: 'text',
          feedback: false
        }, {
          key: 'description',
          type: 'text',
          feedback: false
        }, {
          key: 'spaces',
          type: 'number',
          feedback: false
        }, {
          key: 'events',
          feedback: false,
          add: 'New Event',
          style: {
            add: 'btn-success'
          },
          items: [
            {
              key: 'events[].date',
              type: 'date',
              feedback: false
            }, {
              key: 'events[].time',
              type: 'time',
              feedback: false
            }, {
              key: 'events[].duration',
              type: 'number',
              feedback: false
            }
          ]
        }, {
          type: 'submit',
          title: 'Save'
        }
      ],
      schema: {
        properties: {
          name: {
            title: 'Name *',
            type: 'string'
          },
          description: {
            title: 'Description',
            type: 'string'
          },
          events: {
            title: 'Events',
            type: 'array',
            items: {
              type: 'object',
              properties: {
                date: {
                  format: 'date',
                  title: 'Date',
                  type: 'string'
                },
                duration: {
                  title: 'Duration',
                  type: 'number'
                },
                time: {
                  format: 'time',
                  title: 'Time',
                  type: 'string'
                }
              }
            }
          },
          spaces: {
            title: 'Spaces *',
            type: 'string'
          }
        },
        required: ['name', 'spaces'],
        title: 'Event Chain',
        type: 'object'
      }
    };
    $httpBackend.whenGET('http://www.bookingbug.com/api/v1/admin/123/event_chains/new').respond(function() {
      return [200, event_chain_schema, {}];
    });
    $httpBackend.whenGET('http://www.bookingbug.com/api/v1/admin/123/event_chains/1/edit').respond(function() {
      return [200, event_chain_schema, {}];
    });
    schedule1 = {
      id: 1,
      name: "Schedule1",
      company_id: 123,
      rules: {
        '1': "0700-1500",
        '2': "0700-1600,1800-1900",
        '2015-02-01': "0600-1200"
      },
      _links: {
        self: {
          href: "http://www.bookingbug.com/api/v1/admin/123/schedules/1"
        },
        edit: {
          href: "http://www.bookingbug.com/api/v1/admin/123/schedules/edit"
        }
      }
    };
    $httpBackend.whenGET('http://www.bookingbug.com/api/v1/admin/123/schedules/1').respond(schedule1);
    schedules = {
      total_entries: 1,
      _embedded: {
        schedules: [schedule1]
      },
      _links: {
        self: {
          href: "http://www.bookingbug.com/api/v1/admin/123/schedules"
        },
        "new": {
          href: "http://www.bookingbug.com/api/v1/admin/123/schedules/new",
          templated: true
        }
      }
    };
    $httpBackend.whenGET('http://www.bookingbug.com/api/v1/admin/123/schedules').respond(schedules);
    schedule_schema = {
      form: [
        {
          key: 'name',
          type: 'text',
          feedback: false
        }, {
          key: 'rules',
          type: 'schedule',
          feedback: false
        }, {
          type: 'submit',
          title: 'Save'
        }
      ],
      schema: {
        properties: {
          name: {
            title: 'Name *',
            type: 'string'
          },
          rules: {
            title: 'Rules *',
            type: 'string'
          }
        },
        required: ['name', 'rules'],
        title: 'Schema',
        type: 'object'
      }
    };
    $httpBackend.whenGET('http://www.bookingbug.com/api/v1/admin/123/schedules/new').respond(function() {
      return [200, schedule_schema, {}];
    });
    return $httpBackend.whenGET('http://www.bookingbug.com/api/v1/admin/123/schedules/edit').respond(function() {
      return [200, schedule_schema, {}];
    });
  });

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.Collection.Booking = (function(superClass) {
    extend(Booking, superClass);

    function Booking() {
      return Booking.__super__.constructor.apply(this, arguments);
    }

    Booking.prototype.checkItem = function(item) {
      return Booking.__super__.checkItem.apply(this, arguments);
    };

    Booking.prototype.matchesParams = function(item) {
      if (this.params.start_date != null) {
        if (this.start_date == null) {
          this.start_date = moment(this.params.date);
        }
        if (this.start_date.isAfter(item.start)) {
          return false;
        }
      }
      if (this.params.end_date != null) {
        if (this.end_date == null) {
          this.end_date = moment(this.params.end_date);
        }
        if (this.end_date.isBefore(item.start.clone().startOf('day'))) {
          return false;
        }
      }
      if (!this.params.include_cancelled && item.is_cancelled) {
        return false;
      }
      return true;
    };

    return Booking;

  })(window.Collection.Base);

  angular.module('BB.Services').provider("BookingCollections", function() {
    return {
      $get: function() {
        return new window.BaseCollections();
      }
    };
  });

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.Collection.Client = (function(superClass) {
    extend(Client, superClass);

    function Client() {
      return Client.__super__.constructor.apply(this, arguments);
    }

    Client.prototype.checkItem = function(item) {
      return Client.__super__.checkItem.apply(this, arguments);
    };

    return Client;

  })(window.Collection.Base);

  angular.module('BB.Services').provider("ClientCollections", function() {
    return {
      $get: function() {
        return new window.BaseCollections();
      }
    };
  });

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.Collection.Slot = (function(superClass) {
    extend(Slot, superClass);

    function Slot() {
      return Slot.__super__.constructor.apply(this, arguments);
    }

    Slot.prototype.checkItem = function(item) {
      return Slot.__super__.checkItem.apply(this, arguments);
    };

    Slot.prototype.matchesParams = function(item) {
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

    return Slot;

  })(window.Collection.Base);

  angular.module('BB.Services').provider("SlotCollections", function() {
    return {
      $get: function() {
        return new window.BaseCollections();
      }
    };
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Controllers').controller('CalendarCtrl', function($scope, AdminBookingService, $rootScope) {

    /* event source that pulls from google.com
    $scope.eventSource = {
            url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
            className: 'gcal-event',           // an option!
            currentTimezone: 'America/Chicago' // an option!
    };
     */
    $scope.eventsF = function(start, end, tz, callback) {
      var bookings, prms;
      console.log(start, end, callback);
      prms = {
        company_id: 21
      };
      prms.start_date = start.format("YYYY-MM-DD");
      prms.end_date = end.format("YYYY-MM-DD");
      bookings = AdminBookingService.query(prms);
      return bookings.then((function(_this) {
        return function(s) {
          console.log(s.items);
          callback(s.items);
          return s.addCallback(function(booking) {
            return $scope.myCalendar.fullCalendar('renderEvent', booking, true);
          });
        };
      })(this));
    };
    $scope.dayClick = function(date, allDay, jsEvent, view) {
      return $scope.$apply((function(_this) {
        return function() {
          console.log(date, allDay, jsEvent, view);
          return $scope.alertMessage = 'Day Clicked ' + date;
        };
      })(this));
    };
    $scope.alertOnDrop = function(event, revertFunc, jsEvent, ui, view) {
      return $scope.$apply((function(_this) {
        return function() {
          return $scope.popupTimeAction({
            action: "move",
            booking: event,
            newdate: event.start,
            onCancel: revertFunc
          });
        };
      })(this));
    };
    $scope.alertOnResize = function(event, revertFunc, jsEvent, ui, view) {
      return $scope.$apply((function(_this) {
        return function() {
          return $scope.alertMessage = 'Event Resized ';
        };
      })(this));
    };
    $scope.addRemoveEventSource = function(sources, source) {
      var canAdd;
      canAdd = 0;
      angular.forEach(sources, (function(_this) {
        return function(value, key) {
          if (sources[key] === source) {
            sources.splice(key, 1);
            return canAdd = 1;
          }
        };
      })(this));
      if (canAdd === 0) {
        return sources.push(source);
      }
    };
    $scope.addEvent = function() {
      var m, y;
      y = '';
      m = '';
      return $scope.events.push({
        title: 'Open Sesame',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        className: ['openSesame']
      });
    };
    $scope.remove = function(index) {
      return $scope.events.splice(index, 1);
    };
    $scope.changeView = function(view) {
      return $scope.myCalendar.fullCalendar('changeView', view);
    };
    $scope.eventClick = function(event, jsEvent, view) {
      return $scope.$apply((function(_this) {
        return function() {
          return $scope.selectBooking(event);
        };
      })(this));
    };
    $scope.selectTime = function(start, end, allDay) {
      return $scope.$apply((function(_this) {
        return function() {
          $scope.popupTimeAction({
            start_time: moment(start),
            end_time: moment(end),
            allDay: allDay
          });
          return $scope.myCalendar.fullCalendar('unselect');
        };
      })(this));
    };
    $scope.uiConfig = {
      calendar: {
        height: 450,
        editable: true,
        header: {
          left: 'month agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: $scope.dayClick,
        eventClick: $scope.eventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        selectable: true,
        selectHelper: true,
        select: $scope.selectTime
      }
    };
    return $scope.eventSources = [$scope.eventsF];
  });

}).call(this);

(function() {
  angular.module('BBAdmin.Controllers').controller('CategoryList', function($scope, $location, CategoryService, $rootScope) {
    $rootScope.connection_started.then((function(_this) {
      return function() {
        $scope.categories = CategoryService.query($scope.bb.company);
        return $scope.categories.then(function(items) {});
      };
    })(this));
    $scope.$watch('selectedCategory', (function(_this) {
      return function(newValue, oldValue) {
        var items;
        $rootScope.category = newValue;
        return items = $('.inline_time').each(function(idx, e) {
          return angular.element(e).scope().clear();
        });
      };
    })(this));
    return $scope.$on("Refresh_Cat", (function(_this) {
      return function(event, message) {
        return $scope.$apply();
      };
    })(this));
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Directives').directive('bbAdminClients', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: 'AdminClients',
      link: function(scope, element, attrs) {}
    };
  });

  angular.module('BBAdmin.Controllers').controller('AdminClients', function($scope, $rootScope, $q, AdminClientService, ClientDetailsService, AlertService) {
    $scope.clientDef = $q.defer();
    $scope.clientPromise = $scope.clientDef.promise;
    $scope.per_page = 15;
    $scope.total_entries = 0;
    $scope.clients = [];
    $scope.getClients = function(currentPage, filterBy, filterByFields, orderBy, orderByReverse) {
      var clientDef;
      console.log(currentPage, filterBy, filterByFields, orderBy, orderByReverse);
      clientDef = $q.defer();
      $rootScope.connection_started.then(function() {
        $scope.notLoaded($scope);
        return AdminClientService.query({
          company_id: $scope.bb.company_id,
          per_page: $scope.per_page,
          page: currentPage + 1,
          filter_by: filterBy,
          filter_by_fields: filterByFields,
          order_by: orderBy,
          order_by_reverse: orderByReverse
        }).then((function(_this) {
          return function(clients) {
            $scope.clients = clients.items;
            $scope.setLoaded($scope);
            $scope.setPageLoaded();
            $scope.total_entries = clients.total_entries;
            console.log($scope.clients);
            return clientDef.resolve(clients.items);
          };
        })(this), function(err) {
          clientDef.reject(err);
          return $scope.setLoadedAndShowError($scope, err, 'Sorry, something went wrong');
        });
      });
      return true;
    };
    return $scope.edit = function(item) {
      return console.log(item);
    };
  });

}).call(this);

(function() {
  angular.module('BBAdmin.Controllers').controller('CompanyList', function($scope, $rootScope, $location) {
    $scope.selectedCategory = null;
    $rootScope.connection_started.then((function(_this) {
      return function() {
        var d, date, end, results;
        date = moment();
        $scope.current_date = date;
        $scope.companies = $scope.bb.company.companies;
        if (!$scope.companies || $scope.companies.length === 0) {
          $scope.companies = [$scope.bb.company];
        }
        $scope.dates = [];
        end = moment(date).add(21, 'days');
        $scope.end_date = end;
        d = moment(date);
        results = [];
        while (d.isBefore(end)) {
          $scope.dates.push(d.clone());
          results.push(d.add(1, 'days'));
        }
        return results;
      };
    })(this));
    $scope.selectCompany = function(item) {
      return window.location = "/view/dashboard/pick_company/" + item.id;
    };
    $scope.advance_date = function(num) {
      var d, date, results;
      date = $scope.current_date.add(num, 'days');
      $scope.end_date = moment(date).add(21, 'days');
      $scope.current_date = moment(date);
      $scope.dates = [];
      d = date.clone();
      results = [];
      while (d.isBefore($scope.end_date)) {
        $scope.dates.push(d.clone());
        results.push(d.add(1, 'days'));
      }
      return results;
    };
    return $scope.$on("Refresh_Comp", function(event, message) {
      return $scope.$apply();
    });
  });

}).call(this);

(function() {
  angular.module('BBAdmin.Controllers').controller('DashboardContainer', function($scope, $rootScope, $location, $modal) {
    var ModalInstanceCtrl;
    $scope.selectedBooking = null;
    $scope.poppedBooking = null;
    $scope.selectBooking = function(booking) {
      return $scope.selectedBooking = booking;
    };
    $scope.popupBooking = function(booking) {
      var modalInstance;
      $scope.poppedBooking = booking;
      modalInstance = $modal.open({
        templateUrl: 'full_booking_details',
        controller: ModalInstanceCtrl,
        scope: $scope,
        backdrop: true,
        resolve: {
          items: (function(_this) {
            return function() {
              return {
                booking: booking
              };
            };
          })(this)
        }
      });
      return modalInstance.result.then((function(_this) {
        return function(selectedItem) {
          return $scope.selected = selectedItem;
        };
      })(this), (function(_this) {
        return function() {
          return console.log('Modal dismissed at: ' + new Date());
        };
      })(this));
    };
    ModalInstanceCtrl = function($scope, $modalInstance, items) {
      angular.extend($scope, items);
      $scope.ok = function() {
        console.log("closeing", items, items.booking && items.booking.self ? items.booking.$update() : void 0);
        return $modalInstance.close();
      };
      return $scope.cancel = function() {
        return $modalInstance.dismiss('cancel');
      };
    };
    return $scope.popupTimeAction = function(prms) {
      var modalInstance;
      console.log(prms);
      return modalInstance = $modal.open({
        templateUrl: $scope.partial_url + 'time_popup',
        controller: ModalInstanceCtrl,
        scope: $scope,
        backdrop: false,
        resolve: {
          items: (function(_this) {
            return function() {
              return prms;
            };
          })(this)
        }
      });
    };
  });

}).call(this);

(function() {
  'use strict';
  angular.module('BBAdmin.Controllers').controller('DashDayList', function($scope, $rootScope, $q, AdminDayService) {
    $scope.init = (function(_this) {
      return function(company_id) {
        var date, dayListDef, prms, weekListDef;
        $scope.inline_items = "";
        if (company_id) {
          $scope.bb.company_id = company_id;
        }
        if (!$scope.current_date) {
          $scope.current_date = moment().startOf('month');
        }
        date = $scope.current_date;
        prms = {
          date: date.format('DD-MM-YYYY'),
          company_id: $scope.bb.company_id
        };
        if ($scope.service_id) {
          prms.service_id = $scope.service_id;
        }
        if ($scope.end_date) {
          prms.edate = $scope.end_date.format('DD-MM-YYYY');
        }
        dayListDef = $q.defer();
        weekListDef = $q.defer();
        $scope.dayList = dayListDef.promise;
        $scope.weeks = weekListDef.promise;
        prms.url = $scope.bb.api_url;
        return AdminDayService.query(prms).then(function(days) {
          $scope.sdays = days;
          dayListDef.resolve();
          if ($scope.category) {
            return $scope.update_days();
          }
        });
      };
    })(this);
    $scope.format_date = (function(_this) {
      return function(fmt) {
        return $scope.current_date.format(fmt);
      };
    })(this);
    $scope.selectDay = (function(_this) {
      return function(day, dayBlock, e) {
        var elm, seldate, xelm;
        if (day.spaces === 0) {
          return false;
        }
        seldate = moment($scope.current_date);
        seldate.date(day.day);
        $scope.selected_date = seldate;
        elm = angular.element(e.toElement);
        elm.parent().children().removeClass("selected");
        elm.addClass("selected");
        xelm = $('#tl_' + $scope.bb.company_id);
        $scope.service_id = dayBlock.service_id;
        $scope.service = {
          id: dayBlock.service_id,
          name: dayBlock.name
        };
        $scope.selected_day = day;
        if (xelm.length === 0) {
          return $scope.inline_items = "/view/dash/time_small";
        } else {
          return xelm.scope().init(day);
        }
      };
    })(this);
    $scope.$watch('current_date', (function(_this) {
      return function(newValue, oldValue) {
        if (newValue && $scope.bb.company_id) {
          return $scope.init();
        }
      };
    })(this));
    $scope.update_days = (function(_this) {
      return function() {
        var day, i, len, ref, results;
        $scope.dayList = [];
        $scope.service_id = null;
        ref = $scope.sdays;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          day = ref[i];
          if (day.category_id === $scope.category.id) {
            $scope.dayList.push(day);
            results.push($scope.service_id = day.id);
          } else {
            results.push(void 0);
          }
        }
        return results;
      };
    })(this);
    return $rootScope.$watch('category', (function(_this) {
      return function(newValue, oldValue) {
        if (newValue && $scope.sdays) {
          return $scope.update_days();
        }
      };
    })(this));
  });

}).call(this);

(function() {
  angular.module('BBAdmin.Controllers').controller('EditBookingDetails', function($scope, $location, $rootScope) {});

}).call(this);

(function() {
  angular.module('BBAdmin.Directives').directive('bbAdminLogin', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        onSuccess: '=',
        onCancel: '=',
        onError: '=',
        bb: '='
      },
      controller: 'AdminLogin',
      template: '<div ng-include="login_template"></div>'
    };
  });

  angular.module('BBAdmin.Controllers').controller('AdminLogin', function($scope, $rootScope, AdminLoginService, $q, $sessionStorage) {
    $scope.login = {
      host: $sessionStorage.getItem('host'),
      email: null,
      password: null
    };
    $scope.login_template = 'admin_login.html';
    $scope.login = function() {
      var params;
      $scope.alert = "";
      params = {
        email: $scope.login.email,
        password: $scope.login.password
      };
      return AdminLoginService.login(params).then(function(user) {
        if (user.company_id != null) {
          $scope.user = user;
          if ($scope.onSuccess) {
            return $scope.onSuccess();
          }
        } else {
          return user.getAdministratorsPromise().then(function(administrators) {
            $scope.administrators = administrators;
            return $scope.pickCompany();
          });
        }
      }, function(err) {
        return $scope.alert = "Sorry, either your email or password was incorrect";
      });
    };
    $scope.pickCompany = function() {
      return $scope.login_template = 'pick_company.html';
    };
    return $scope.selectedCompany = function() {
      var params;
      $scope.alert = "";
      params = {
        email: $scope.email,
        password: $scope.password
      };
      return $scope.selected_admin.$post('login', {}, params).then(function(login) {
        return $scope.selected_admin.getCompanyPromise().then(function(company) {
          $scope.bb.company = company;
          AdminLoginService.setLogin($scope.selected_admin);
          return $scope.onSuccess(company);
        });
      });
    };
  });

}).call(this);

(function() {
  angular.module('BBAdmin.Controllers').controller('SelectedBookingDetails', function($scope, $location, AdminBookingService, $rootScope) {
    return $scope.$watch('selectedBooking', (function(_this) {
      return function(newValue, oldValue) {
        if (newValue) {
          $scope.booking = newValue;
          return $scope.showItemView = "/view/dash/booking_details";
        }
      };
    })(this));
  });

}).call(this);

'use strict';


function SpaceMonitorCtrl($scope,  $location) {
  


  $scope.$on("Add_Space", function(event, message){
     console.log("got new space", message)
     $scope.$apply();
   });




}

SpaceMonitorCtrl.$inject = ['$scope', '$location', 'CompanyService'];

(function() {
  'use strict';
  angular.module('BBAdmin.Controllers').controller('DashTimeList', function($scope, $rootScope, $location, $q, $element, AdminTimeService) {
    var $loaded;
    $loaded = null;
    $scope.init = (function(_this) {
      return function(day) {
        var elem, prms, timeListDef;
        $scope.selected_day = day;
        elem = angular.element($element);
        elem.attr('id', "tl_" + $scope.bb.company_id);
        angular.element($element).show();
        prms = {
          company_id: $scope.bb.company_id,
          day: day
        };
        if ($scope.service_id) {
          prms.service_id = $scope.service_id;
        }
        timeListDef = $q.defer();
        $scope.slots = timeListDef.promise;
        prms.url = $scope.bb.api_url;
        $scope.aslots = AdminTimeService.query(prms);
        return $scope.aslots.then(function(res) {
          var i, k, len, slot, slots, x, xres;
          $scope.loaded = true;
          slots = {};
          for (i = 0, len = res.length; i < len; i++) {
            x = res[i];
            if (!slots[x.time]) {
              slots[x.time] = x;
            }
          }
          xres = [];
          for (k in slots) {
            slot = slots[k];
            xres.push(slot);
          }
          return timeListDef.resolve(xres);
        });
      };
    })(this);
    if ($scope.selected_day) {
      $scope.init($scope.selected_day);
    }
    $scope.format_date = (function(_this) {
      return function(fmt) {
        return $scope.selected_date.format(fmt);
      };
    })(this);
    $scope.selectSlot = (function(_this) {
      return function(slot, route) {
        $scope.pickTime(slot.time);
        $scope.pickDate($scope.selected_date);
        return $location.path(route);
      };
    })(this);
    $scope.highlighSlot = (function(_this) {
      return function(slot) {
        $scope.pickTime(slot.time);
        $scope.pickDate($scope.selected_date);
        return $scope.setCheckout(true);
      };
    })(this);
    $scope.clear = (function(_this) {
      return function() {
        $scope.loaded = false;
        $scope.slots = null;
        return angular.element($element).hide();
      };
    })(this);
    return $scope.popupCheckout = (function(_this) {
      return function(slot) {
        var dHeight, dWidth, dlg, item, k, src, url, v, wHeight, wWidth;
        item = {
          time: slot.time,
          date: $scope.selected_day.date,
          company_id: $scope.bb.company_id,
          duration: 30,
          service_id: $scope.service_id,
          event_id: slot.id
        };
        url = "/booking/new_checkout?";
        for (k in item) {
          v = item[k];
          url += k + "=" + v + "&";
        }
        wWidth = $(window).width();
        dWidth = wWidth * 0.8;
        wHeight = $(window).height();
        dHeight = wHeight * 0.8;
        dlg = $("#dialog-modal");
        src = dlg.html("<iframe frameborder=0 id='mod_dlg' onload='nowait();setTimeout(set_iframe_focus, 100);' width=100% height=99% src='" + url + "'></iframe>");
        dlg.attr("title", "Checkout");
        return dlg.dialog({
          my: "top",
          at: "top",
          height: dHeight,
          width: dWidth,
          modal: true,
          overlay: {
            opacity: 0.1,
            background: "black"
          }
        });
      };
    })(this);
  });


  /*
    var sprice = "&price=" + price;
    var slen = "&len=" + len
    var sid = "&event_id=" + id
    var str = pop_click_str + sid + slen + sprice + "&width=800"; // + "&style=wide";
  = "/booking/new_checkout?" + siarray + sjd + sitime ;
  
  function show_IFrame(myUrl, options, width, height){
    if (!height) height = 500;
    if (!width) width = 790;
    opts = Object.extend({className: "white", pctHeight:1, width:width+20,top:'5%', height:'90%',closable:true, recenterAuto:false}, options || {});
    x = Dialog.info("", opts);
      x.setHTMLContent("<iframe frameborder=0 id='mod_dlg' onload='nowait();setTimeout(set_iframe_focus, 100);' width=" + width + " height=96%" + " src='" + myUrl + "'></iframe>");
    x.element.setStyle({top:'5%'});
    x.element.setStyle({height:'90%'});
  }
   */

}).call(this);

(function() {
  angular.module('BBAdmin.Controllers').controller('TimeOptions', function($scope, $location, $rootScope, AdminResourceService, AdminPersonService) {
    AdminResourceService.query({
      company: $scope.bb.company
    }).then(function(resources) {
      return $scope.resources = resources;
    });
    AdminPersonService.query({
      company: $scope.bb.company
    }).then(function(people) {
      return $scope.people = people;
    });
    return $scope.block = function() {
      if ($scope.person) {
        AdminPersonService.block($scope.bb.company, $scope.person, {
          start_time: $scope.start_time,
          end_time: $scope.end_time
        });
      }
      return $scope.ok();
    };
  });

}).call(this);

(function() {
  angular.module('BBAdmin').directive('bookingTable', function(AdminCompanyService, AdminBookingService, $modal, $log, ModalForm) {
    var controller, link;
    controller = function($scope) {
      $scope.fields = ['id', 'datetime'];
      $scope.getBookings = function() {
        var params;
        params = {
          company: $scope.company
        };
        return AdminBookingService.query(params).then(function(bookings) {
          return $scope.bookings = bookings;
        });
      };
      $scope.newBooking = function() {
        return ModalForm["new"]({
          company: $scope.company,
          title: 'New Booking',
          new_rel: 'new_booking',
          post_rel: 'bookings',
          success: function(booking) {
            return $scope.bookings.push(booking);
          }
        });
      };
      return $scope.edit = function(booking) {
        return ModalForm.edit({
          model: booking,
          title: 'Edit Booking'
        });
      };
    };
    link = function(scope, element, attrs) {
      if (scope.company) {
        return scope.getBookings();
      } else {
        return AdminCompanyService.query(attrs).then(function(company) {
          scope.company = company;
          return scope.getBookings();
        });
      }
    };
    return {
      controller: controller,
      link: link,
      templateUrl: 'booking_table_main.html'
    };
  });

}).call(this);



angular.module('BBAdmin.Directives').controller('CalController', function($scope) {
    /* config object */
    $scope.calendarConfig = {
        height: 450,
        editiable: true,
        dayClick: function(){
            scope.$apply($scope.alertEventOnClick);
        }
    };
});

(function() {
  'use strict';
  angular.module('BBAdmin.Directives').directive('bbPeopleList', function($rootScope) {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      controller: function($scope, $rootScope, PersonService, $q, BBModel, PersonModel) {
        $rootScope.connection_started.then(function() {
          return $scope.bb.company.getPeoplePromise().then(function(people) {
            var i, len, person, results;
            $scope.people = people;
            results = [];
            for (i = 0, len = people.length; i < len; i++) {
              person = people[i];
              results.push(person.show = true);
            }
            return results;
          });
        });
        $scope.show_all_people = function() {
          var i, len, ref, results, x;
          ref = $scope.people;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            x = ref[i];
            results.push(x.show = true);
          }
          return results;
        };
        return $scope.hide_all_people = function() {
          var i, len, ref, results, x;
          ref = $scope.people;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            x = ref[i];
            results.push(x.show = false);
          }
          return results;
        };
      },
      link: function(scope, element, attrs) {}
    };
  });

  angular.module('BBAdmin.Directives').directive('bbBookingList', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        bookings: '=',
        cancelled: '=',
        params: '='
      },
      templateUrl: function(tElm, tAttrs) {
        return tAttrs.template;
      },
      controller: function($scope, $filter) {
        var status;
        $scope.title = $scope.params.title;
        status = $scope.params.status;
        return $scope.$watch(function() {
          return $scope.bookings;
        }, function() {
          var bookings, cancelled;
          bookings = $scope.bookings;
          cancelled = $scope.cancelled;
          if (cancelled == null) {
            cancelled = false;
          }
          if ((bookings != null)) {
            bookings = $filter('filter')(bookings, function(booking) {
              var ret;
              ret = booking.is_cancelled === cancelled;
              if ((status != null)) {
                ret &= booking.hasStatus(status);
              } else {
                ret &= (booking.multi_status == null) || Object.keys(booking.multi_status).length === 0;
              }
              ret &= booking.status === 4;
              return ret;
            });
            $scope.relevantBookings = $filter('orderBy')(bookings, 'datetime');
          }
          return $scope.relevantBookings != null ? $scope.relevantBookings : $scope.relevantBookings = [];
        });
      }
    };
  });

}).call(this);

(function() {
  'use strict';
  var bbAdminFilters;

  bbAdminFilters = angular.module('BBAdmin.Filters', []);

  bbAdminFilters.filter('rag', function() {
    return function(value, v1, v2) {
      if (value <= v1) {
        return "red";
      } else if (value <= v2) {
        return "amber";
      } else {
        return "green";
      }
    };
  });

  bbAdminFilters.filter('gar', function() {
    return function(value, v1, v2) {
      if (value <= v1) {
        return "green";
      } else if (value <= v2) {
        return "amber";
      } else {
        return "red";
      }
    };
  });

  bbAdminFilters.filter('time', function($window) {
    return function(v) {
      return $window.sprintf("%02d:%02d", Math.floor(v / 60), v % 60);
    };
  });

}).call(this);

(function() {
  'use strict';
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("Admin.BookingModel", function($q, BBModel, BaseModel) {
    var Admin_Booking;
    return Admin_Booking = (function(superClass) {
      extend(Admin_Booking, superClass);

      function Admin_Booking(data) {
        Admin_Booking.__super__.constructor.apply(this, arguments);
        this.datetime = moment(this.datetime);
        this.start = this.datetime;
        this.end = this.datetime.clone().add(this.duration, 'minutes');
        this.title = this.full_describe;
        this.time = this.start.hour() * 60 + this.start.minute();
        this.allDay = false;
        if (this.status === 3) {
          this.className = "status_blocked";
        } else if (this.status === 4) {
          this.className = "status_booked";
        }
      }

      Admin_Booking.prototype.getPostData = function() {
        var data, q;
        data = {};
        data.date = this.start.format("YYYY-MM-DD");
        data.time = this.start.hour() * 60 + this.start.minute();
        data.duration = this.duration;
        data.id = this.id;
        data.questions = (function() {
          var i, len, ref, results;
          ref = this.questions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            q = ref[i];
            results.push(q.getPostData());
          }
          return results;
        }).call(this);
        return data;
      };

      Admin_Booking.prototype.hasStatus = function(status) {
        return this.multi_status[status] != null;
      };

      Admin_Booking.prototype.statusTime = function(status) {
        if (this.multi_status[status]) {
          return moment(this.multi_status[status]);
        } else {
          return null;
        }
      };

      Admin_Booking.prototype.sinceStatus = function(status) {
        var s;
        s = this.statusTime(status);
        if (!s) {
          return 0;
        }
        return Math.floor((moment().unix() - s.unix()) / 60);
      };

      Admin_Booking.prototype.sinceStart = function(options) {
        var s, start;
        start = this.datetime.unix();
        if (!options) {
          return Math.floor((moment().unix() - start) / 60);
        }
        if (options.later) {
          s = this.statusTime(options.later).unix();
          if (s > start) {
            return Math.floor((moment().unix() - s) / 60);
          }
        }
        if (options.earlier) {
          s = this.statusTime(options.earlier).unix();
          if (s < start) {
            return Math.floor((moment().unix() - s) / 60);
          }
        }
        return Math.floor((moment().unix() - start) / 60);
      };

      Admin_Booking.prototype.$update = function() {
        var data;
        data = this.getPostData();
        return this.$put('self', {}, data).then((function(_this) {
          return function(res) {
            return _this.constructor(res);
          };
        })(this));
      };

      return Admin_Booking;

    })(BaseModel);
  });

}).call(this);

(function() {
  'use strict';
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("Admin.LoginModel", function($q, BBModel, BaseModel) {
    var Admin_Login;
    return Admin_Login = (function(superClass) {
      extend(Admin_Login, superClass);

      function Admin_Login(data) {
        Admin_Login.__super__.constructor.call(this, data);
      }

      return Admin_Login;

    })(BaseModel);
  });

}).call(this);

(function() {
  'use strict';
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  angular.module('BB.Models').factory("Admin.SlotModel", function($q, BBModel, BaseModel, TimeSlotModel) {
    var Admin_Slot;
    return Admin_Slot = (function(superClass) {
      extend(Admin_Slot, superClass);

      function Admin_Slot(data) {
        Admin_Slot.__super__.constructor.call(this, data);
        this.title = this.full_describe;
        if (this.status === 0) {
          this.title = "Available";
        }
        this.datetime = moment(this.datetime);
        this.start = this.datetime;
        this.end = this.datetime.clone().add(this.duration, 'minutes');
        this.time = this.start.hour() * 60 + this.start.minute();
        this.allDay = false;
        if (this.status === 3) {
          this.className = "status_blocked";
        } else if (this.status === 4) {
          this.className = "status_booked";
        } else if (this.status === 0) {
          this.className = "status_available";
        }
      }

      return Admin_Slot;

    })(TimeSlotModel);
  });

}).call(this);

(function() {
  angular.module('BBAdmin.Services').factory('AdminBookingService', function($q, $window, halClient, BookingCollections, BBModel, UriTemplate) {
    return {
      query: function(prms) {
        var deferred, existing, href, uri, url;
        if (prms.slot) {
          prms.slot_id = prms.slot.id;
        }
        if (prms.date) {
          prms.start_date = prms.date;
          prms.end_date = prms.date;
        }
        if (prms.per_page == null) {
          prms.per_page = 1024;
        }
        if (prms.include_cancelled == null) {
          prms.include_cancelled = false;
        }
        deferred = $q.defer();
        existing = BookingCollections.find(prms);
        if (existing) {
          deferred.resolve(existing);
        } else if (prms.company) {
          prms.company.$get('bookings').then(function(collection) {
            return collection.$get('bookings').then(function(bookings) {
              var b, models;
              models = (function() {
                var i, len, results;
                results = [];
                for (i = 0, len = bookings.length; i < len; i++) {
                  b = bookings[i];
                  results.push(new BBModel.Admin.Booking(b));
                }
                return results;
              })();
              return deferred.resolve(models);
            }, function(err) {
              return deferred.reject(err);
            });
          }, function(err) {
            return deferred.reject(err);
          });
        } else {
          url = "";
          if (prms.url) {
            url = prms.url;
          }
          href = url + "/api/v1/admin/{company_id}/bookings{?slot_id,start_date,end_date,service_id,resource_id,person_id,page,per_page,include_cancelled}";
          uri = new UriTemplate(href).fillFromObject(prms || {});
          halClient.$get(uri, {}).then((function(_this) {
            return function(found) {
              return found.$get('bookings').then(function(items) {
                var i, item, len, sitems, spaces;
                sitems = [];
                for (i = 0, len = items.length; i < len; i++) {
                  item = items[i];
                  sitems.push(new BBModel.Admin.Booking(item));
                }
                spaces = new $window.Collection.Booking(found, sitems, prms);
                BookingCollections.add(spaces);
                return deferred.resolve(spaces);
              });
            };
          })(this), (function(_this) {
            return function(err) {
              return deferred.reject(err);
            };
          })(this));
        }
        return deferred.promise;
      },
      getBooking: function(prms) {
        var deferred, href, uri;
        deferred = $q.defer();
        href = "/api/v1/admin/{company_id}/bookings/{id}{?embed}";
        uri = new UriTemplate(href).fillFromObject(prms || {});
        halClient.$get(uri, {
          no_cache: true
        }).then(function(item) {
          var booking;
          booking = new BBModel.Admin.Booking(item);
          BookingCollections.checkItems(booking);
          return deferred.resolve(booking);
        }, (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      cancelBooking: function(prms, booking) {
        var deferred, href, notify, uri;
        deferred = $q.defer();
        href = "/api/v1/admin/{company_id}/bookings/{id}?notify={notify}";
        if (prms.id == null) {
          prms.id = booking.id;
        }
        notify = prms.notify;
        if (notify == null) {
          notify = true;
        }
        uri = new UriTemplate(href).fillFromObject(prms || {});
        halClient.$del(uri, {
          notify: notify
        }).then(function(item) {
          booking = new BBModel.Admin.Booking(item);
          BookingCollections.checkItems(booking);
          return deferred.resolve(booking);
        }, (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      updateBooking: function(prms, booking) {
        var deferred, href, uri;
        deferred = $q.defer();
        href = "/api/v1/admin/{company_id}/bookings/{id}";
        if (prms.id == null) {
          prms.id = booking.id;
        }
        uri = new UriTemplate(href).fillFromObject(prms || {});
        halClient.$put(uri, {}, prms).then(function(item) {
          booking = new BBModel.Admin.Booking(item);
          BookingCollections.checkItems(booking);
          return deferred.resolve(booking);
        }, (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      blockTimeForPerson: function(prms, person) {
        var deferred, href, uri;
        deferred = $q.defer();
        href = "/api/v1/admin/{company_id}/people/{person_id}/block";
        if (prms.person_id == null) {
          prms.person_id = person.id;
        }
        prms.booking = true;
        uri = new UriTemplate(href).fillFromObject(prms || {});
        halClient.$put(uri, {}, prms).then(function(item) {
          var booking;
          booking = new BBModel.Admin.Booking(item);
          BookingCollections.checkItems(booking);
          return deferred.resolve(booking);
        }, (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      addStatusToBooking: function(prms, booking, status) {
        var deferred, href, uri;
        deferred = $q.defer();
        href = "/api/v1/admin/{company_id}/bookings/{booking_id}/multi_status";
        if (prms.booking_id == null) {
          prms.booking_id = booking.id;
        }
        uri = new UriTemplate(href).fillFromObject(prms || {});
        halClient.$put(uri, {}, {
          status: status
        }).then(function(item) {
          booking = new BBModel.Admin.Booking(item);
          BookingCollections.checkItems(booking);
          return deferred.resolve(booking);
        }, (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      addPrivateNoteToBooking: function(prms, booking, note) {
        var deferred, href, noteParam, uri;
        deferred = $q.defer();
        href = "/api/v1/admin/{company_id}/bookings/{booking_id}/private_notes";
        if (prms.booking_id == null) {
          prms.booking_id = booking.id;
        }
        if (note.note != null) {
          noteParam = note.note;
        }
        if (noteParam == null) {
          noteParam = note;
        }
        uri = new UriTemplate(href).fillFromObject(prms || {});
        halClient.$put(uri, {}, {
          note: noteParam
        }).then(function(item) {
          booking = new BBModel.Admin.Booking(item);
          BookingCollections.checkItems(booking);
          return deferred.resolve(booking);
        }, (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      updatePrivateNoteForBooking: function(prms, booking, note) {
        var deferred, href, uri;
        deferred = $q.defer();
        href = "/api/v1/admin/{company_id}/bookings/{booking_id}/private_notes/{id}";
        if (prms.booking_id == null) {
          prms.booking_id = booking.id;
        }
        if (prms.id == null) {
          prms.id = note.id;
        }
        uri = new UriTemplate(href).fillFromObject(prms || {});
        halClient.$put(uri, {}, {
          note: note.note
        }).then(function(item) {
          booking = new BBModel.Admin.Booking(item);
          BookingCollections.checkItems(booking);
          return deferred.resolve(booking);
        }, (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      deletePrivateNoteFromBooking: function(prms, booking, note) {
        var deferred, href, uri;
        deferred = $q.defer();
        href = "/api/v1/admin/{company_id}/bookings/{booking_id}/private_notes/{id}";
        if (prms.booking_id == null) {
          prms.booking_id = booking.id;
        }
        if (prms.id == null) {
          prms.id = note.id;
        }
        uri = new UriTemplate(href).fillFromObject(prms || {});
        halClient.$del(uri, {}).then(function(item) {
          booking = new BBModel.Admin.Booking(item);
          BookingCollections.checkItems(booking);
          return deferred.resolve(booking);
        }, (function(_this) {
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
  angular.module('BBAdmin.Services').factory('AdminClientService', function($q, $window, $rootScope, halClient, ClientCollections, BBModel, UriTemplate) {
    return {
      query: function(prms) {
        var deferred, href, uri, url;
        if (prms.company) {
          prms.company_id = prms.company.id;
        }
        url = "";
        if ($rootScope.bb.api_url) {
          url = $rootScope.bb.api_url;
        }
        href = url + "/api/v1/admin/{company_id}/client{/id}{?page,per_page,filter_by,filter_by_fields,order_by,order_by_reverse}";
        uri = new UriTemplate(href).fillFromObject(prms || {});
        deferred = $q.defer();
        halClient.$get(uri, {}).then((function(_this) {
          return function(resource) {
            var client;
            if (resource.$has('clients')) {
              return resource.$get('clients').then(function(items) {
                var clients, i, j, len, people;
                people = [];
                for (j = 0, len = items.length; j < len; j++) {
                  i = items[j];
                  people.push(new BBModel.Client(i));
                }
                clients = new $window.Collection.Client(resource, people, prms);
                clients.total_entries = resource.total_entries;
                ClientCollections.add(clients);
                return deferred.resolve(clients);
              });
            } else {
              client = new BBModel.Client(resource);
              return deferred.resolve(client);
            }
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      update: function(client) {
        var deferred;
        deferred = $q.defer();
        client.$put('self', {}, client).then((function(_this) {
          return function(res) {
            return deferred.resolve(new BBModel.Client(res));
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
  angular.module('BBAdmin.Services').factory('AdminCompanyService', function($q, BBModel, AdminLoginService, $rootScope, $sessionStorage) {
    return {
      query: function(params) {
        var base, base1, defer;
        defer = $q.defer();
        $rootScope.bb || ($rootScope.bb = {});
        $rootScope.bb.api_url = $sessionStorage.getItem("host");
        (base = $rootScope.bb).api_url || (base.api_url = params.apiUrl);
        (base1 = $rootScope.bb).api_url || (base1.api_url = "http://www.bookingbug.com");
        AdminLoginService.checkLogin(params).then(function() {
          var login_form, options;
          if ($rootScope.user && $rootScope.user.company_id) {
            $rootScope.bb || ($rootScope.bb = {});
            $rootScope.bb.company_id = $rootScope.user.company_id;
            return $rootScope.user.$get('company').then(function(company) {
              return defer.resolve(company);
            }, function(err) {
              return defer.reject(err);
            });
          } else {
            login_form = {
              email: params.adminEmail,
              password: params.adminPassword
            };
            options = {
              company_id: params.companyId
            };
            return AdminLoginService.login(login_form, options).then(function(user) {
              return user.$get('company').then(function(company) {
                return defer.resolve(company);
              }, function(err) {
                return defer.reject(err);
              });
            }, function(err) {
              return defer.reject(err);
            });
          }
        });
        return defer.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BBAdmin.Services').factory('AdminDayService', function($q, $window, halClient, BBModel, UriTemplate) {
    return {
      query: function(prms) {
        var deferred, href, uri, url;
        url = "";
        if (prms.url) {
          url = prms.url;
        }
        href = url + "/api/v1/{company_id}/day_data{?month,week,date,edate,event_id,service_id}";
        uri = new UriTemplate(href).fillFromObject(prms || {});
        deferred = $q.defer();
        halClient.$get(uri, {}).then((function(_this) {
          return function(found) {
            var item, j, len, mdays, ref;
            if (found.items) {
              mdays = [];
              ref = found.items;
              for (j = 0, len = ref.length; j < len; j++) {
                item = ref[j];
                halClient.$get(item.uri).then(function(data) {
                  var days, dcol, i, k, len1, ref1;
                  days = [];
                  ref1 = data.days;
                  for (k = 0, len1 = ref1.length; k < len1; k++) {
                    i = ref1[k];
                    if (i.type === prms.item) {
                      days.push(new BBModel.Day(i));
                    }
                  }
                  dcol = new $window.Collection.Day(data, days, {});
                  return mdays.push(dcol);
                });
              }
              return deferred.resolve(mdays);
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
  });

}).call(this);

(function() {
  angular.module('BBAdmin.Services').factory("AdminLoginService", function($q, halClient, $rootScope, BBModel, $sessionStorage, $cookies, UriTemplate) {
    return {
      login: function(form, options) {
        var deferred, url;
        deferred = $q.defer();
        url = $rootScope.bb.api_url + "/api/v1/login/admin";
        if ((options != null) && (options.company_id != null)) {
          url = url + "/" + options.company_id;
        }
        halClient.$post(url, options, form).then((function(_this) {
          return function(login) {
            var login_model;
            if (login.$has('administrator')) {
              return login.$get('administrator').then(function(user) {
                user = _this.setLogin(user);
                return deferred.resolve(user);
              });
            } else if (login.$has('administrators')) {
              login_model = new BBModel.Admin.Login(login);
              return deferred.resolve(login_model);
            } else {
              return deferred.reject("No admin account for login");
            }
          };
        })(this), (function(_this) {
          return function(err) {
            var login, login_model;
            if (err.status === 400) {
              login = halClient.$parse(err.data);
              if (login.$has('administrators')) {
                login_model = new BBModel.Admin.Login(login);
                return deferred.resolve(login_model);
              } else {
                return deferred.reject(err);
              }
            } else {
              return deferred.reject(err);
            }
          };
        })(this));
        return deferred.promise;
      },
      ssoLogin: function(options, data) {
        var deferred, url;
        deferred = $q.defer();
        url = $rootScope.bb.api_url + "/api/v1/login/sso/" + options['company_id'];
        halClient.$post(url, {}, data).then((function(_this) {
          return function(login) {
            var params;
            params = {
              auth_token: login.auth_token
            };
            return login.$get('user').then(function(user) {
              user = _this.setLogin(user);
              return deferred.resolve(user);
            });
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      isLoggedIn: function() {
        return this.checkLogin().then(function() {
          if ($rootScope.user) {
            return true;
          } else {
            return false;
          }
        });
      },
      setLogin: function(user) {
        var auth_token;
        auth_token = user.getOption('auth_token');
        user = new BBModel.Admin.User(user);
        $sessionStorage.setItem("user", user.$toStore());
        $sessionStorage.setItem("auth_token", auth_token);
        $rootScope.user = user;
        return user;
      },
      user: function() {
        return this.checkLogin().then(function() {
          return $rootScope.user;
        });
      },
      checkLogin: function(params) {
        var auth_token, defer, href, options, url, user;
        if (params == null) {
          params = {};
        }
        defer = $q.defer();
        if ($rootScope.user) {
          defer.resolve();
        }
        user = $sessionStorage.getItem("user");
        if (user) {
          $rootScope.user = halClient.createResource(user);
          defer.resolve();
        } else {
          auth_token = $cookies['Auth-Token'];
          if (auth_token) {
            if ($rootScope.bb.api_url) {
              url = $rootScope.bb.api_url + "/api/v1/login{?id,role}";
            } else {
              url = "/api/v1/login{?id,role}";
            }
            params.id = params.companyId || params.company_id;
            params.role = 'admin';
            href = new UriTemplate(url).fillFromObject(params || {});
            options = {
              auth_token: auth_token
            };
            halClient.$get(href, options).then((function(_this) {
              return function(login) {
                if (login.$has('administrator')) {
                  return login.$get('administrator').then(function(user) {
                    $rootScope.user = new BBModel.Admin.User(user);
                    return defer.resolve();
                  });
                } else {
                  return defer.resolve();
                }
              };
            })(this), function() {
              return defer.resolve();
            });
          } else {
            defer.resolve();
          }
        }
        return defer.promise;
      },
      logout: function() {
        $rootScope.user = null;
        $sessionStorage.removeItem("user");
        $sessionStorage.removeItem("auth_token");
        return $cookies['Auth-Token'] = null;
      },
      getLogin: function(options) {
        var defer, url;
        defer = $q.defer();
        url = $rootScope.bb.api_url + "/api/v1/login/admin/" + options.company_id;
        halClient.$get(url, options).then((function(_this) {
          return function(login) {
            if (login.$has('administrator')) {
              return login.$get('administrator').then(function(user) {
                user = _this.setLogin(user);
                return defer.resolve(user);
              }, function(err) {
                return defer.reject(err);
              });
            } else {
              return defer.reject();
            }
          };
        })(this), function(err) {
          return defer.reject(err);
        });
        return defer.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BBAdmin.Services').factory('AdminPurchaseService', function($q, halClient, BBModel) {
    return {
      query: function(params) {
        var defer, uri;
        defer = $q.defer();
        uri = params.url_root + "/api/v1/admin/purchases/" + params.purchase_id;
        halClient.$get(uri, params).then(function(purchase) {
          purchase = new BBModel.Purchase.Total(purchase);
          return defer.resolve(purchase);
        }, function(err) {
          return defer.reject(err);
        });
        return defer.promise;
      },
      markAsPaid: function(params) {
        var company_id, defer, uri;
        defer = $q.defer();
        if (!params.purchase || !params.url_root) {
          defer.reject("invalid request");
          return defer.promise;
        }
        if (params.company) {
          company_id = params.company.id;
        }
        uri = params.url_root + ("/api/v1/admin/" + company_id + "/purchases/" + params.purchase.id + "/pay");
        halClient.$put(uri, params).then(function(purchase) {
          purchase = new BBModel.Purchase.Total(purchase);
          return defer.resolve(purchase);
        }, function(err) {
          return defer.reject(err);
        });
        return defer.promise;
      }
    };
  });

}).call(this);

(function() {
  angular.module('BBAdmin.Services').factory('AdminSlotService', function($q, $window, halClient, SlotCollections, BBModel, UriTemplate) {
    return {
      query: function(prms) {
        var deferred, existing, href, uri, url;
        deferred = $q.defer();
        existing = SlotCollections.find(prms);
        if (existing) {
          deferred.resolve(existing);
        } else if (prms.user) {
          prms.user.$get('company').then(function(company) {
            return company.$get('slots', prms).then(function(slots_collection) {
              return slots_collection.$get('slots').then(function(slots) {
                var s, slot_models;
                slot_models = (function() {
                  var i, len, results;
                  results = [];
                  for (i = 0, len = slots.length; i < len; i++) {
                    s = slots[i];
                    results.push(new BBModel.Admin.Slot(s));
                  }
                  return results;
                })();
                return deferred.resolve(slot_models);
              }, function(err) {
                return deferred.reject(err);
              });
            });
          });
        } else {
          url = "";
          if (prms.url) {
            url = prms.url;
          }
          href = url + "/api/v1/admin/{company_id}/slots{?start_date,end_date,date,service_id,resource_id,person_id,page,per_page}";
          uri = new UriTemplate(href).fillFromObject(prms || {});
          halClient.$get(uri, {}).then((function(_this) {
            return function(found) {
              return found.$get('slots').then(function(items) {
                var i, item, len, sitems, slots;
                sitems = [];
                for (i = 0, len = items.length; i < len; i++) {
                  item = items[i];
                  sitems.push(new BBModel.Admin.Slot(item));
                }
                slots = new $window.Collection.Slot(found, sitems, prms);
                SlotCollections.add(slots);
                return deferred.resolve(slots);
              });
            };
          })(this), (function(_this) {
            return function(err) {
              return deferred.reject(err);
            };
          })(this));
        }
        return deferred.promise;
      },
      create: function(prms, data) {
        var deferred, href, uri, url;
        url = "";
        if (prms.url) {
          url = prms.url;
        }
        href = url + "/api/v1/admin/{company_id}/slots";
        uri = new UriTemplate(href).fillFromObject(prms || {});
        deferred = $q.defer();
        halClient.$post(uri, {}, data).then((function(_this) {
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
      "delete": function(item) {
        var deferred;
        deferred = $q.defer();
        item.$del('self').then((function(_this) {
          return function(slot) {
            slot = new BBModel.Admin.Slot(slot);
            SlotCollections.deleteItems(slot);
            return deferred.resolve(slot);
          };
        })(this), (function(_this) {
          return function(err) {
            return deferred.reject(err);
          };
        })(this));
        return deferred.promise;
      },
      update: function(item, data) {
        var deferred;
        deferred = $q.defer();
        item.$put('self', {}, data).then((function(_this) {
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
  angular.module('BBAdmin.Services').factory('AdminTimeService', function($q, $window, halClient, BBModel, UriTemplate) {
    return {
      query: function(prms) {
        var deferred, href, uri, url;
        if (prms.day) {
          prms.date = prms.day.date;
        }
        if (!prms.edate && prms.date) {
          prms.edate = prms.date;
        }
        url = "";
        if (prms.url) {
          url = prms.url;
        }
        href = url + "/api/v1/{company_id}/time_data{?date,event_id,service_id,person_id}";
        uri = new UriTemplate(href).fillFromObject(prms || {});
        deferred = $q.defer();
        halClient.$get(uri, {
          no_cache: false
        }).then((function(_this) {
          return function(found) {
            return found.$get('events').then(function(events) {
              var event, eventItem, eventItems, i, j, len, len1, ref, time, ts;
              eventItems = [];
              for (i = 0, len = events.length; i < len; i++) {
                eventItem = events[i];
                event = {};
                event.times = [];
                event.event_id = eventItem.event_id;
                event.person_id = found.person_id;
                ref = eventItem.times;
                for (j = 0, len1 = ref.length; j < len1; j++) {
                  time = ref[j];
                  ts = new BBModel.TimeSlot(time);
                  event.times.push(ts);
                }
                eventItems.push(event);
              }
              return deferred.resolve(eventItems);
            });
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
