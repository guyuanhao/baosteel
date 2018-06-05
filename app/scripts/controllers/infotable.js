'use strict';

/**
 * @ngdoc function
 * @name comosAngularjsApp.controller:InfotablectrlCtrl
 * @description
 * # InfotablectrlCtrl
 * Controller of the comosAngularjsApp
 */
angular.module('comosAngularjsApp')
  .controller('InfotablectrlCtrl', function ($scope, $http, Upload, $timeout) {
    var self = this;
    var infoItems;
    
    self.searchText = "";
    self.searchOptions = ["All","Checked","Unchecked"];
    self.selectedSearchOption = "All";
    self.readForSearch = false;

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
            },
            attacheD_FILE:{
              editable:false
            }
          }
        }
      },
    })

    self.tableInfo={
      toolbar: [{
        name:"excel",
        text:"导出excel"
      }],
      pdf: {
        allPages: true
      },
      sortable:true,
      pageable: true,
      editable: "inline",
      scrollable: true,
      columns: [{
            field:"id",
            title:"id",
            width: "0px"
          },{
            field: "devicE_ID",
            title: "设备号",
            width: "120px",
            attributes: {"class": "displayDetail"},
          },{
            field: "projecT_NAME",
            title: "点检项目",
            attributes: {"class": "displayDetail"},
            width: "120px"
          },{
            field: "detail",
            title: "点检内容",
            attributes: {"class": "displayDetail"},
            width: "120px"
          },{
            field: "keY_POINT",
            title: "关键点",
            attributes: {"class": "displayDetail"},
            width: "120px"
          },{
            field: "indication",
            title: "特别说明",
            attributes: {"class": "displayDetail"},
            width: "120px"
          },{
            field: "checK_DATE",
            title: "点检时间",
            width: "90px",
            template:"<span ng-if='dataItem.checK_DATE' ng-bind='formatDate(dataItem.checK_DATE)'></span>"
          },{
            field: "targeT_TIME",
            title: "目标点检时间",
            width: "90px",
            template:"<span ng-if='dataItem.targeT_TIME' ng-bind='formatDate(dataItem.targeT_TIME)'></span>"
          },{
            field: "responsible",
            title: "责任人",
            attributes: {"class": "displayDetail"},
            width: "120px"
          },{
            field: "iF_CHECK",
            title: "确认",
            width: "60px",
            editable:checkIfCheckEditable,
            template:"<span ng-if='#: iF_CHECK #'>已确认</span><span ng-if='!#: iF_CHECK #'>未确认</span>"
          },{
            field: "note",
            title: "备注",
            attributes: {"class": "displayDetail"},
            width: "120px"
          },{
            field: "attacheD_FILE",
            title: "文档附件",
            width: "150px",
            attributes: {"class": "displayDetail"},
            template:"<span style='cursor: pointer;' ng-bind='main.displayFileName(this.dataItem)' ng-click='main.downloadFile(this.dataItem.attacheD_FILE)'></span>"
          },{ 
            command: [{
              template: '<button class="kendo-button" type="button" ngf-select="uploadFiles($file, $invalidFiles, this.dataItem)" accept="*" ngf-max-size="3MB">上传文档</button>'
              },{
              template: '<button class="kendo-button" type="button" ng-click="main.deleteFile(this.dataItem)" ">删除附件</button>'
              },{
                name:"edit",
                text:"编辑"
              }],
            title: "&nbsp;",
            width: "255px" 
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
          sheet.rows[0].cells.splice(11,1) //eliminate the attached file header
          for (var rowIndex = 1; rowIndex < sheet.rows.length; rowIndex++) {
            sheet.rows[rowIndex].cells.splice(11,1)
            sheet.rows[rowIndex].cells[9].value = sheet.rows[rowIndex].cells[9].value?"已确认":"未确认";
            if(sheet.rows[rowIndex].cells[6].value != null){
              sheet.rows[rowIndex].cells[6].value = $scope.formatDate(sheet.rows[rowIndex].cells[6].value);
            }
            if(sheet.rows[rowIndex].cells[7].value != null){
              sheet.rows[rowIndex].cells[7].value = $scope.formatDate(sheet.rows[rowIndex].cells[7].value);
            }
          }
        }
    };
    /*************************** Info Table End **********************************/

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
    function checkIfCheckEditable(dataItem){
      return (!dataItem.iF_CHECK)
    }

    self.searchRecord = function(){
      $('#tableInfo').data('kendoGrid').dataSource.read();
    }

    self.searchFieldKeyUp = function(e){
      var keycode = window.event?e.keyCode:e.which;
            if(keycode==13){
              self.searchRecord();
            }
    }

    //upload
    $scope.uploadFiles = function(file, errFiles, item) {
      console.log(item);
      $scope.f = file;
      $scope.errFile = errFiles && errFiles[0];
      if (file) {
          file.upload = Upload.upload({
              url: serverAddress + 'info/uploadFile',
              data: {file: file, id:item.id}
          });

          file.upload.then(function (response) {
              $timeout(function () {
                  //file.result = response.data;
                  $('#tableInfo').data('kendoGrid').dataSource.read();
              });
          }, function (response) {
              if (response.status > 0)
                  $scope.errorMsg = response.status + ': ' + response.data;
          }, function (evt) {
              file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
          });
      }   
    }

    self.displayFileName = function(dataItem){
      if(dataItem.attacheD_FILE!=null){
        return (dataItem.attacheD_FILE.slice(dataItem.attacheD_FILE.indexOf('M')+1));
      }
      else{
        return "";
      }
    }

    self.downloadFile = function(fileName){
      if(fileName)
        window.open(serverAddress + "info/downloadFile/" + fileName);
    }

    self.deleteFile = function(dataItem){
      $http.delete(serverAddress + "info/" + dataItem.id).then(function(response){
        $('#tableInfo').data('kendoGrid').dataSource.read();
      })
    }
    //popup
    $("#tableInfo").kendoTooltip({
      filter: ".displayDetail",
      content: function(e) {
        if(e.target[0].cellIndex != 12){
          return e.target.html();
        }
      }
    });

  });
