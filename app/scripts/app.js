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
    'kendo.directives'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
