'use strict';

/**
 * @ngdoc function
 * @name comosAngularjsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the comosAngularjsApp
 */
angular.module('comosAngularjsApp')
  .controller('MainCtrl', function ($scope) {
    var self = this;

    self.mainGridOptions = {
      dataSource: {
          type: "odata",
          transport: {
              read: "//demos.telerik.com/kendo-ui/service/Northwind.svc/Employees"
          }
      },
      columns: [{
          field: "FirstName",
          title: "First Name {{1+1}}",
          headerAttributes: {"ng-non-bindable": true},
          width: "180px"
          },{
          field: "LastName",
          title: "Last Name",
          width: "120px"
          },{
          field: "Country",
          width: "120px"
          },{
          field: "City",
          width: "120px"
          }]
    };

    $scope.$on('$viewContentLoaded', function(event)
    { 
      // code that will be executed ... 
      // every time this view is loaded
      console.log(self);
    });

  });
