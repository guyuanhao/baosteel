
/**
 * @ngdoc function
 * @name comosAngularjsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the comosAngularjsApp
 */
angular.module('comosAngularjsApp')
  .controller('MainCtrl', function ($scope, $http, shareDataService) {
    var self = this;
    self.maintenanceItems;


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
              for (var temp=0;temp<response.data.length;temp++){
                shareDataService.addItem(temp)
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
            shareDataService.setMaintenanceItems(response.data);
            console.log(shareDataService.getMaintenanceItems());
            e.success(self.maintenanceItems);
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
      toolbar: [
        {name:"create", text:"创建新点检"},
        {name:"excel", text:"导出excel"}
      ],
      pdf: {
        allPages: true
      },
      pageable: true,
      sortable:true,
      editable: "inline",
      scrollable: true,
      selectable:true,
      columns: [{
            field:"id",
            title:"id",
            width: "0px"
          },{
            field: "devicE_ID",
            title: "设备号",
            attributes: {"class": "displayDetail"},
            width: "120px",
            editable:checkDeviceIdIfEditable
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
            field: "period",
            title: "周期(天)",
            width: "80px"
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
            field: "creatE_DATE",
            title: "录入时间",
            width: "90px",
            template:"<span ng-bind='formatDate(dataItem.creatE_DATE)'></span>"
          },{
            field: "responsible",
            title: "责任人",
            attributes: {"class": "displayDetail"},
            width: "120px"
          },{
            field: "note",
            title: "备注",
            attributes: {"class": "displayDetail"},
            width: "120px"
          },{ 
              command: [
              {
                name: "添加点检",
                click: function(e) {
                    // prevent page scroll position change
                    e.preventDefault();
                    // e.target is the DOM element representing the button
                    this.$angular_scope.main.choosedItemId = $(e.target).closest("tr")[0].cells[0].textContent;
                    this.$angular_scope.main.choosedItemDeviceId = $(e.target).closest("tr")[0].cells[1].textContent;
                    this.$angular_scope.main.choosedItemProjectName = $(e.target).closest("tr")[0].cells[2].textContent;
                    console.log(this.$angular_scope);
                    $http.get(serverAddress + "info/checkInfo/" + this.$angular_scope.main.choosedItemId).then(function(response){
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
                },
                {name:"edit", text:"编辑"},
                {name:"destroy", text:"删除点检"}
              ],
              title: "&nbsp;",
              width: "260px" 
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
      console.log(self.choosedItemId, self.choosedTargetTime);
      if(self.choosedTargetTime != null){
        var item;
//        var item = self.maintenanceItems.find(x => x.id == self.choosedItemId);
        for(var tmp=0;tmp<self.maintenanceItems.length;tmp++){
          if(self.maintenanceItems[tmp].id == self.choosedItemId){
            item = self.maintenanceItems[tmp];
            break;
          }
        }
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
          "maintenancE_ITEM": self.choosedItemId
        }
        let temp = [];
        temp.push(tempItem);
        $http.post(serverAddress + "info", temp).then(function(response){
         // $('#tableInfo').data('kendoGrid').dataSource.read();
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

    $("#tableMaintenance").kendoTooltip({
      filter: ".displayDetail",
      content: function(e) {return e.target.html();}
    });

  });

