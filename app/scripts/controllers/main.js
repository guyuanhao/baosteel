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

    self.tableMaintenance={
      scrollable: true,
      dataSource: {
        type: "odata",
        // transport: {
        //   // read: "//demos.telerik.com/kendo-ui/service/Northwind.svc/Employees"
        // }
    },
    columns: [{
          field: "",
          title: "设备号",
          headerAttributes: {"ng-non-bindable": true},
          width: "180px"
        },{
          field: "",
          title: "点检项目",
          width: "120px"
        },{
          field: "",
          title: "点检内容",
          width: "120px"
        },{
          field: "",
          title: "周期",
          width: "120px"
        },{
          field: "",
          title: "关键点",
          width: "120px"
        },{
          field: "",
          title: "特别说明",
          width: "120px"
        },{
          field: "",
          title: "录入时间",
          width: "120px" 
        },{
          field: "",
          title: "责任人",
          width: "120px"
        },{
          field: "",
          title: "备注",
          width: "120px"
        }]
    };

    self.tableInfo={
      scrollable: true,
      dataSource: {
        type: "odata",
        // transport: {
        //   // read: "//demos.telerik.com/kendo-ui/service/Northwind.svc/Employees"
        // }
    },
    columns: [{
          field: "",
          title: "设备号",
          headerAttributes: {"ng-non-bindable": true},
          width: "180px"
        },{
          field: "",
          title: "点检项目",
          width: "120px"
        },{
          field: "",
          title: "点检内容",
          width: "120px"
        },{
          field: "",
          title: "关键点",
          width: "120px"
        },{
          field: "",
          title: "特别说明",
          width: "120px"
        },{
          field: "",
          title: "当前时间",
          width: "120px" 
        },{
          field: "",
          title: "责任人",
          width: "120px"
        },{
          field: "",
          title: "确认",
          width: "120px"
        },{
          field: "",
          title: "备注",
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
