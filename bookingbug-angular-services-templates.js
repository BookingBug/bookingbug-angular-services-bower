angular.module("BB").run(["$templateCache", function($templateCache) {$templateCache.put("person_table_main.html","<button class=\"btn btn-default\" ng-click=\"newPerson()\">New Person</button>\r\n<table tr-ng-grid=\"\" items=\"people\" fields=\"fields\">\r\n   <tbody>\r\n    <tr>\r\n      <td>\r\n        <button class=\"btn btn-default btn-sm\"\r\n          ng-click=\"delete(gridItem)\">\r\n            Delete\r\n        </button>\r\n        <button class=\"btn btn-default btn-sm\"\r\n          ng-click=\"edit(gridItem)\">\r\n            Edit\r\n        </button>\r\n        <button class=\"btn btn-default btn-sm\"\r\n          ng-click=\"schedule(gridItem)\">\r\n            Schedule\r\n        </button>\r\n      </td>\r\n    </tr>\r\n  </tbody>\r\n</table>\r\n");
$templateCache.put("resource_table_main.html","<button class=\"btn btn-default\" ng-click=\"newResource()\">New Resource</button>\r\n<table tr-ng-grid=\"\" items=\"resources\" fields=\"fields\">\r\n   <tbody>\r\n    <tr>\r\n      <td>\r\n        <button class=\"btn btn-default btn-sm\"\r\n          ng-click=\"delete(gridItem)\">\r\n            Delete\r\n        </button>\r\n        <button class=\"btn btn-default btn-sm\"\r\n          ng-click=\"edit(gridItem)\">\r\n            Edit\r\n        </button>\r\n        <button class=\"btn btn-default btn-sm\"\r\n          ng-click=\"schedule(gridItem)\">\r\n            Schedule\r\n        </button>\r\n      </td>\r\n    </tr>\r\n  </tbody>\r\n</table>\r\n");
$templateCache.put("schedule_cal_main.html","<div ui-calendar=\"options.calendar\" ng-model=\"eventSources\"\r\n  ng-if=\"eventSources\" calendar=\"{{calendarName}}\"></div>\r\n");
$templateCache.put("schedule_edit_form.html","<div class=\"form-group\" ng-class=\"{\'has-error\': hasError()}\">\r\n  <label class=\"control-label\" ng-show=\"showTitle()\">{{form.title}}</label>\r\n\r\n  <div schedule-edit ng-model=\"$$value$$\"></div>\r\n\r\n  <span class=\"help-block\">{{ (hasError() && errorMessage(schemaError())) || form.description}}</span>\r\n</div>\r\n");
$templateCache.put("schedule_edit_main.html","<tabset>\r\n  <tab heading=\"dates\" select=\"renderDates()\">\r\n    <div schedule-calendar ng-model=\"$$value$$\" render=\"renderDates\"></div>\r\n  </tab>\r\n  <tab heading=\"weekdays\" select=\"renderWeekdays()\">\r\n    <div schedule-weekdays ng-model=\"$$value$$\" render=\"renderWeekdays\"></div>\r\n  </tab>\r\n</tabset>\r\n");
$templateCache.put("schedule_table_main.html","<button class=\"btn btn-default\" ng-click=\"newSchedule()\">New Schedule</button>\r\n<table tr-ng-grid=\"\" items=\"schedules\" fields=\"fields\">\r\n   <tbody>\r\n    <tr>\r\n      <td>\r\n        <button class=\"btn btn-default btn-sm\"\r\n          ng-click=\"delete(gridItem)\">\r\n            Delete\r\n        </button>\r\n        <button class=\"btn btn-default btn-sm\"\r\n          ng-click=\"edit(gridItem)\">\r\n            Edit\r\n        </button>\r\n      </td>\r\n    </tr>\r\n  </tbody>\r\n</table>\r\n");
$templateCache.put("service_table_main.html","<button class=\"btn btn-default\" ng-click=\"newService()\">New Service</button>\r\n<table tr-ng-grid=\"\" items=\"services\" fields=\"fields\">\r\n	<tbody>\r\n		<tr>\r\n			<td>\r\n				<button class=\"btn btn-default btn-sm\" ng-click=\"edit(gridItem)\">Edit</button>\r\n			</td>\r\n		</tr>\r\n	</tbody>\r\n</table>\r\n");}]);