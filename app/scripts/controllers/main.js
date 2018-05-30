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
    var infoItems;
    self.searchOptions = ["All","Checked","Unchecked"];
    self.selectedSearchOption = "All";
    self.searchText = "";
    self.readForSearch = false;


    /*************************** Maintenance Table  **********************************/
    self.maintenanceDataSource = new kendo.data.DataSource({
      pageSize: 20,
      transport: {
        create:function(e){
          if(!e.data.hasOwnProperty("devicE_ID") && e.data.devicE_ID!=""){
            alert("请输入正确的设备号");
            e.error();
          }
          else if (!(e.data.hasOwnProperty("period")&& isNumber(e.data.period))){
            alert("请输入正确的周期（天）");
            e.error();
          }
          else{
            var temp = [];
            delete e.data.id;
            temp.push(e.data)
            console.log(temp);
            $http.post(serverAddress + "maintenance", temp).then(function(response){
              e.success();
              for (var temp of response.data){
                self.maintenanceItems.push(temp);
              }
              $('#tableMaintenance').data('kendoGrid').dataSource.read();
              console.log(self.maintenanceItems)
            })
          }
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
          if(!e.data.hasOwnProperty("devicE_ID") || e.data.devicE_ID==""){
            alert("请输入正确的设备号");
            e.error();
          }
          else if (!(e.data.hasOwnProperty("period")&& isNumber(e.data.period))){
            alert("请输入正确的周期（天）");
            e.error();
          }
          else{
            $http.put(serverAddress + "maintenance/" + e.data.id, e.data).then(function(response){
              e.success();
            })
          }
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
            creatE_DATE: { type:"date" }
          }
        }
      },
    })

    self.tableMaintenance={
      toolbar: ["create","save","cancel","excel"],
      pdf: {
        allPages: true
      },
      pageable: true,
      sortable:true,
      editable: true,
      scrollable: true,
      selectable:true,
      columns: [{
            field:"id",
            title:"id"
          },{
            field: "devicE_ID",
            title: "设备号",
            headerAttributes: {"ng-non-bindable": true},
            width: "120px",
            editable:checkDeviceIdIfEditable
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
            width: "200px",
            template:"<span ng-bind='formatDate(dataItem.creatE_DATE)'></span>"
          },{
            field: "responsible",
            title: "责任人",
            width: "120px"
          },{
            field: "note",
            title: "备注",
            width: "120px"
          },{ 
              command: [
              {
                name: "添加点检",
                click: function(e) {
                    // prevent page scroll position change
                    e.preventDefault();
                    // e.target is the DOM element representing the button
                    this.$angular_scope.choosedItemId = $(e.target).closest("tr")[0].cells[0].textContent;
                    
                    $http.get(serverAddress + "info/checkInfo/" + this.$angular_scope.choosedItemId).then(function(response){
                      if(response.data.length==0){
                        // Get the modal
                        var modal = document.getElementById('myModal');
                        // When the user clicks on the button, open the modal 
                        modal.style.display = "block";
                      }
                      else{
                        alert("基础点检项目已有点检实绩");
                      }
                    })
                  }
                },"destroy"],
              title: "&nbsp;",
              width: "200px" 
          }
        ],
        excelExport: function(e) {
          //change excel data format
          console.log(e);
          var sheet = e.workbook.sheets[0];
          for (var rowIndex = 1; rowIndex < sheet.rows.length; rowIndex++) {
            if(sheet.rows[rowIndex].cells[7].value != null){
              sheet.rows[rowIndex].cells[7].value = $scope.formatDate(sheet.rows[rowIndex].cells[7].value);
            }
          }
        }
    };
    /*************************** Maintenance Table End  **********************************/

    /*************************** Info Table **********************************/
    self.infoDataSource = new kendo.data.DataSource({
      pageSize: 20,
      transport: {
        create:function(e){
          var temp = [];
          delete e.data.id;
          temp.push(e.data)
          console.log(temp);
          $http.post(serverAddress + "info", temp).then(function(response){
            e.success();
            for (var temp of response.data){
              self.infoItems.push(temp);
            }
            console.log(self.infoItems);
            $('#tableInfo').data('kendoGrid').dataSource.read();
          })
        },
        read:function(e) {
          if(self.searchText == ""){
            console.log("no text, call getAll");
            self.readForSearch = false;
            $http.get(serverAddress + "info/GetAll/" + self.selectedSearchOption).then(function(response){
              self.infoItems = response.data;
              e.success(self.infoItems);
              console.log(self.infoItems);
            })
          }
          else{
            console.log("with text, call getByDeviceID")
            //use AngularJS $http/$resource to fetch the data
            //when data is fetched call o.success(result); where result is the data array
            $http.get(serverAddress + "info/getByDeviceId/" + self.searchText
               +"/"+ self.selectedSearchOption).then(function(response){
                  self.infoItems = response.data;
                  e.success(self.infoItems);
                  console.log(self.infoItems);
            })
          }
        },
        update:function (e) {
          if(e.data.checkModifiedFlag){
            delete e.data.checkModifiedFlag;
            console.log(e.data);
            $http.put(serverAddress + "info/" + e.data.id, e.data).then(function(response){
              e.success();
              /*  create new record */
              var temp = [];
              e.data.iF_CHECK = 0;
              delete e.data.checK_DATE;
              delete e.data.id;
              e.data.targeT_TIME = (new Date()).addDays(
                self.maintenanceItems.find(x => x.id == e.data.maintenancE_ITEM).period
              )
              temp.push(e.data)
              console.log(temp);
              $http.post(serverAddress + "info", temp).then(function(response){
                self.infoItems.push(response.data);
                console.log(self.infoItems);
                e.success();
                $('#tableInfo').data('kendoGrid').dataSource.read();
              })
            })
          }
          else{
            delete e.data.checkModifiedFlag;
            console.log(e.data);
            $http.put(serverAddress + "info/" + e.data.id, e.data).then(function(response){
              e.success();
            })
          }
        }
/*         ,
        destroy:function (e){
          $http.delete(serverAddress + "info/" + e.data.id).then(function(response){
            e.success();
          },function(error){
            console.log("error");
            e.error();
          })
        } */
          
      },
      sort: { field: "iF_CHECK", dir: "asce" },
      schema: {
        model: {
          id: "id",
          fields: {
            checK_DATE: { 
              type:"date",
              editable:false
            },
            iF_CHECK: {
              type:"boolean"
            },
            devicE_ID:{
              editable:false
            },
            projecT_NAME:{
              editable:false
            },
            detail:{
              editable:false
            },
            keY_POINT:{
              editable:false
            },
            indication:{
              editable:false
            },
            checK_DATE:{
              editable:false
            },
            responsible:{
              editable:false
            },
            targeT_TIME:{
              editable:false
            }
          }
        }
      },
    })

    self.tableInfo={
      toolbar: ["excel"],
      pdf: {
        allPages: true
      },
      sortable:true,
      pageable: true,
      editable: "inline",
      scrollable: true,
      columns: [{
            field: "devicE_ID",
            title: "设备号",
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
            field: "keY_POINT",
            title: "关键点",
            width: "120px"
          },{
            field: "indication",
            title: "特别说明",
            width: "120px"
          },{
            field: "checK_DATE",
            title: "点检时间",
            width: "200px",
            template:"<span ng-if='dataItem.checK_DATE' ng-bind='formatDate(dataItem.checK_DATE)'></span>"
          },{
            field: "targeT_TIME",
            title: "目标点检时间",
            width: "200px",
            template:"<span ng-if='dataItem.targeT_TIME' ng-bind='formatDate(dataItem.targeT_TIME)'></span>"
          },{
            field: "responsible",
            title: "责任人",
            width: "120px"
          },{
            field: "iF_CHECK",
            title: "确认",
            width: "120px",
            editable:checkIfCheckEditable,
            template:"<span ng-if='#: iF_CHECK #'>已确认</span><span ng-if='!#: iF_CHECK #'>未确认</span>"
          },{
            field: "note",
            title: "备注",
            width: "120px"
          },{ 
            command: ["edit"],
            title: "&nbsp;",
            width: "100px" 
          }
        ],
        selectable:true,
        save:function(data){
          //check if it's checked be modified
          data.model.checkModifiedFlag = false;
          if(data.model.iF_CHECK && data.model.checK_DATE==null){
            data.model.checK_DATE = new Date();
            data.model.checkModifiedFlag = true;
          }

          /* console.log(data.values);
          if('iF_CHECK' in data.values){
            if(data.values.iF_CHECK){
              console.log("data checked!");
              data.model.checK_DATE = new Date();
              data.model.checkModifiedFlag = true;
            }
            else{
              console.log("data unchecked!")
              data.model.checK_DATE = null;
              data.model.checkModifiedFlag = false;
            }
          }
          else{
            data.model.checkModifiedFlag = false;
          } */
        },
        excelExport: function(e) {
          //change excel data format
          console.log(e);
          var sheet = e.workbook.sheets[0];
          for (var rowIndex = 1; rowIndex < sheet.rows.length; rowIndex++) {
            sheet.rows[rowIndex].cells[8].value = sheet.rows[rowIndex].cells[8].value?"已确认":"未确认";
            if(sheet.rows[rowIndex].cells[5].value != null){
              sheet.rows[rowIndex].cells[5].value = $scope.formatDate(sheet.rows[rowIndex].cells[5].value);
            }
            if(sheet.rows[rowIndex].cells[6].value != null){
              sheet.rows[rowIndex].cells[6].value = $scope.formatDate(sheet.rows[rowIndex].cells[6].value);
            }
          }
        }
    };
    /*************************** Info Table End **********************************/


    $scope.$on('$viewContentLoaded', function(event)
    { 
      // code that will be executed ... 
      // every time this view is loaded
    });

    //filter table
    self.searchMaintenanceTable = function(){
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

    self.searchInfoTable = function(){
      self.infoDataSource.filter({
        logic: "or",
        filters: [
          { field:"devicE_ID", operator:"contains",value:self.infoSearch },
          { field: "projecT_NAME", operator: "contains", value:self.infoSearch },
          { field: "detail", operator: "contains", value:self.infoSearch },
          { field: "keY_POINT", operator: "contains", value:self.infoSearch }
        ]
      });
    };

    //close modal
    // Get the modal
    var modal = document.getElementById('myModal');
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
    }

    self.createNewRecord = function(){
      console.log($scope.choosedItemId, self.choosedTargetTime);
      if(self.choosedTargetTime != null){
        var item = self.maintenanceItems.find(x => x.id == $scope.choosedItemId);
        var tempItem = {
          "devicE_ID": item.devicE_ID,
          "projecT_NAME": item.projecT_NAME,
          "detail": item.detail,
          "keY_POINT": item.keY_POINT,
          "indication": item.indication,
          "targeT_TIME": self.choosedTargetTime,
          "responsible": item.responsible,
          "iF_CHECK": 0,
          "note": item.note,
          "maintenancE_ITEM": $scope.choosedItemId
        }
        let temp = [];
        temp.push(tempItem);
        $http.post(serverAddress + "info", temp).then(function(response){
          self.infoItems.push(response.data);
          $('#tableInfo').data('kendoGrid').dataSource.read();
          modal.style.display = "none";
          alert("成功录入点检实绩");
        })
      }
      else{
        alert("请输入目标时间")
      }
    }

    Date.prototype.addDays = function(days) {
      var dat = new Date(this.valueOf());
      dat.setDate(dat.getDate() + days);
      return dat;
    }
    $scope.formatDate = function(date) {
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();
  
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
  
      return [year, month, day].join('-');
    }

    function isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0) }
    function checkDeviceIdIfEditable(dataItem){
      return (!dataItem.hasOwnProperty("devicE_ID"));
    }

    function checkIfCheckEditable(dataItem){
      return (!dataItem.iF_CHECK)
    }

    self.searchRecord = function(){
      $('#tableInfo').data('kendoGrid').dataSource.read();
    }

  });
