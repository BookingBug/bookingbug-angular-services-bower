angular.module("BB").run(["$templateCache", function($templateCache) {$templateCache.put("person_table_main.html","<button class=\"btn btn-default\" ng-click=\"newPerson()\" translate=\"NEW_PERSON\"></button>\n<table tr-ng-grid=\"\" items=\"people\" fields=\"fields\">\n   <tbody>\n    <tr>\n      <td>\n        <button class=\"btn btn-default btn-sm\"\n          ng-click=\"delete(gridItem)\" ng-translate=\"DELETE\">\n        </button>\n        <button class=\"btn btn-default btn-sm\"\n          ng-click=\"edit(gridItem)\" ng-translate=\"EDIT\">\n        </button>\n        <button class=\"btn btn-default btn-sm\"\n          ng-click=\"schedule(gridItem)\" ng-translate=\"SCHEDULE\">\n        </button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n");
$templateCache.put("resource_table_main.html","<button class=\"btn btn-default\" ng-click=\"newResource()\" translate=\"NEW_RESOURCE\"></button>\n<table tr-ng-grid=\"\" items=\"resources\" fields=\"fields\">\n   <tbody>\n    <tr>\n      <td>\n        <button class=\"btn btn-default btn-sm\"\n          ng-click=\"delete(gridItem)\" ng-translate=\"DELETE\">\n        </button>\n        <button class=\"btn btn-default btn-sm\"\n          ng-click=\"edit(gridItem)\" ng-translate=\"EDIT\">\n        </button>\n        <button class=\"btn btn-default btn-sm\"\n          ng-click=\"schedule(gridItem)\" ng-translate=\"SCHEDULE\">\n        </button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n");
$templateCache.put("schedule_cal_main.html","<div ui-calendar=\"options.calendar\" ng-model=\"eventSources\"\n  ng-if=\"eventSources\" calendar=\"{{calendarName}}\"></div>\n");
$templateCache.put("schedule_edit_form.html","<div class=\"form-group\" ng-class=\"{\'has-error\': hasError()}\">\n  <label class=\"control-label\" ng-show=\"showTitle()\">{{form.title}}</label>\n\n  <div schedule-edit ng-model=\"$$value$$\"></div>\n\n  <span class=\"help-block\">{{ (hasError() && errorMessage(schemaError())) || form.description}}</span>\n</div>\n");
$templateCache.put("schedule_edit_main.html","<tabset>\n  <tab heading=\"dates\" select=\"renderDates()\">\n    <div schedule-calendar ng-model=\"$$value$$\" render=\"renderDates\"></div>\n  </tab>\n  <tab heading=\"weekdays\" select=\"renderWeekdays()\">\n    <div schedule-weekdays ng-model=\"$$value$$\" render=\"renderWeekdays\"></div>\n  </tab>\n</tabset>\n");
$templateCache.put("schedule_table_main.html","<button class=\"btn btn-default\" ng-click=\"newSchedule()\">New Schedule</button>\n<table tr-ng-grid=\"\" items=\"schedules\" fields=\"fields\">\n   <tbody>\n    <tr>\n      <td>\n        <button class=\"btn btn-default btn-sm\"\n          ng-click=\"delete(gridItem)\">\n            Delete\n        </button>\n        <button class=\"btn btn-default btn-sm\"\n          ng-click=\"edit(gridItem)\">\n            Edit\n        </button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n");
$templateCache.put("service_table_main.html","<button class=\"btn btn-default\" ng-click=\"newService()\" translate=\"NEW_SERVICE\"></button>\n<table tr-ng-grid=\"\" items=\"services\" fields=\"fields\">\n	<tbody>\n		<tr>\n			<td>\n				<button class=\"btn btn-default btn-sm\" ng-click=\"edit(gridItem)\" translate=\"EDIT\"></button>\n			</td>\n		</tr>\n	</tbody>\n</table>\n");}]);