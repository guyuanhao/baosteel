'use strict';

/**
 * @ngdoc service
 * @name comosAngularjsApp.shareDataService
 * @description
 * # shareDataService
 * Service in the comosAngularjsApp.
 */
angular.module('comosAngularjsApp')
  .service('shareDataService', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var maintenanceItems;
    return maintenanceItems;
  });
