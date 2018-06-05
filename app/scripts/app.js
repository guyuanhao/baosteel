'use strict';

/**
 * @ngdoc overview
 * @name comosAngularjsApp
 * @description
 * # comosAngularjsApp
 *
 * Main module of the application.
 */
angular
  .module('comosAngularjsApp', [
    'ngRoute',
    'kendo.directives',
    'ngFileUpload'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/infoTable', {
        templateUrl: 'views/infoTable.html',
        controller: 'InfotablectrlCtrl',
        controllerAs: 'info'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
