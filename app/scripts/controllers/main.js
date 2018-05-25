'use strict';

/**
 * @ngdoc function
 * @name comosAngularjsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the comosAngularjsApp
 */
angular.module('comosAngularjsApp')
  .controller('MainCtrl', function ($scope, $http) {
    var self = this;
    var maintenanceItems;
    
    /*************************** Maintenance Table  **********************************/
    self.maintenanceDataSource = new kendo.data.DataSource({
      pageSize: 20,
      transport: {
        create:function(e){
          var temp = [];
          delete e.data.id;
          temp.push(e.data)
          console.log(temp);
          $http.post(serverAddress + "maintenance", temp).then(function(response){
            e.success();
            self.maintenanceItems.push(response.data);
            console.log(self.maintenanceItems)
          })
        },
        read:function(e) {
          //use AngularJS $http/$resource to fetch the data
          //when data is fetched call o.success(result); where result is the data array
          $http.get(serverAddress + "maintenance").then(function(response){
            self.maintenanceItems = response.data;
            e.success(self.maintenanceItems);
            console.log(self.maintenanceItems);
          })
        },
        update:function (e) {
          $http.put(serverAddress + "maintenance/" + e.data.id, e.data).then(function(response){
            e.success();
          })
        },
        destroy:function (e){
          $http.delete(serverAddress + "maintenance/" + e.data.id).then(function(response){
            e.success();
          },function(error){
            console.log("error");
            e.error();
          })
        }
          
      },
      schema: {
        model: {
          id: "id",
          fields: {
            devicE_ID: { type: "string" },
            creatE_DATE: { type:"date" }
          }
        }
      },
    })

    self.tableMaintenance={
      toolbar: ["create","save","cancel","pdf"],
      pageable: true,
      editable: true,
      scrollable: true,
      columns: [{
            field: "devicE_ID",
            title: "设备号",
            headerAttributes: {"ng-non-bindable": true},
            width: "120px"
          },{
            field: "projecT_NAME",
            title: "点检项目",
            width: "120px"
          },{
            field: "detail",
            title: "点检内容",
            width: "120px"
          },{
            field: "period",
            title: "周期(天)",
            width: "80px"
          },{
            field: "keY_POINT",
            title: "关键点",
            width: "120px"
          },{
            field: "indication",
            title: "特别说明",
            width: "120px"
          },{
            field: "creatE_DATE",
            title: "录入时间",
            width: "200px"
          },{
            field: "responsible",
            title: "责任人",
            width: "120px"
          },{
            field: "note",
            title: "备注",
            width: "120px"
          },{ 
              command: ["destroy"],
              title: "&nbsp;",
              width: "100px" 
            }
        ]
    };
    /*************************** Maintenance Table End  **********************************/

    /*************************** Info Table **********************************/
    self.tableInfo={
      editable: true,
      scrollable: true,
      dataSource: {
        transport: {
          read: serverAddress + "info"
      }
    },
    columns: [{
          field: "devicE_ID",
          title: "设备号",
          headerAttributes: {"ng-non-bindable": true},
          width: "120px",
          type: "string"
        },{
          field: "projecT_NAME",
          title: "点检项目",
          width: "120px"
        },{
          field: "detail",
          title: "点检内容",
          width: "120px"
        },{
          field: "keY_POINT",
          title: "关键点",
          width: "120px"
        },{
          field: "indication",
          title: "特别说明",
          width: "120px"
        },{
          field: "checK_DATE",
          title: "当前时间",
          width: "200px",
          type:"date"
        },{
          field: "responsible",
          title: "责任人",
          width: "120px"
        },{
          field: "iF_CHECK",
          title: "确认",
          width: "120px"
        },{
          field: "note",
          title: "备注",
          width: "120px"
        }]
    };
    /*************************** Info Table End **********************************/


    $scope.$on('$viewContentLoaded', function(event)
    { 
      // code that will be executed ... 
      // every time this view is loaded
    });

    //filter table
    $scope.searchMaintenanceTable = function(){
      console.log("aa");
      self.maintenanceDataSource.filter({
        logic: "or",
        filters: [
          { field:"devicE_ID", operator:"contains",value:self.maintenanceSearch },
          { field: "projecT_NAME", operator: "contains", value:self.maintenanceSearch },
          { field: "detail", operator: "contains", value:self.maintenanceSearch },
          { field: "keY_POINT", operator: "contains", value:self.maintenanceSearch }
        ]
      });
    };



  });
