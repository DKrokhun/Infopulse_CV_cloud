sap.ui.define([
    "./BaseController",
    "../model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/m/GroupHeaderListItem",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter"
], function (BaseController, formatter, JSONModel, GroupHeaderListItem, FilterOperator, Filter) {
    "use strict";
    return BaseController.extend("infopulse.cv.infopulse-cvapp-ui.controller.EmployeeList", {
        formatter: formatter,
        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */
        /**
         * Called when the EmployeeList controller is instantiated.
         * @public
         */
        onInit: function () {
            BaseController.prototype.onInit.apply(this, arguments);
            this._initializeFilterModel();
        },

        _initializeFilterModel: function () {
            this.setModel(new JSONModel({
                departmentFilter: "ALL",
                statusFilter: "ALL",
                searchFilter: ""
            }), "filterModel");
        },

        onShowEmployeePage: function (oEvent) {
            var iItemId = oEvent.getSource().getBindingContext().getProperty("id");
            this.getRouter().navTo("employee", { id: iItemId }, true);
        },

        onSelectDepartmentChange: function (oEvent) {
            var sDepartmentKey = oEvent.getSource().getSelectedKey();
            this.setFilterModelProprety("departmentFilter", sDepartmentKey);
        },

        onSelectStatusChange: function (oEvent) {
            var sStatusKey = oEvent.getSource().getSelectedKey();
            this.setFilterModelProprety("statusFilter", sStatusKey);
        },

        onSearchByName: function (oEvent) {
            var sSearchByNameKey = oEvent.getSource().getValue();
            this.setFilterModelProprety("searchFilter", sSearchByNameKey);
        },

        setFilterModelProprety: function (sProperty, sFilterKey) {
            this.getModel("filterModel").setProperty("/" + sProperty, sFilterKey);
            this.onFilterSearch();
        },

        onFilterSearch: function () {
            var aFilters = [
                this.createFilterFromFilterBar("DEPARTMENT", this.getModel("filterModel").getProperty("/departmentFilter"), false),
                this.createFilterFromFilterBar("CVSTATUS", this.getModel("filterModel").getProperty("/statusFilter"), false),
                this.createFilterFromFilterBar("NAME", this.getModel("filterModel").getProperty("/searchFilter"), true)
            ];
            this.getEmployeeListItemsBinding().filter(aFilters);
        },

        getEmployeeListItemsBinding: function () {
            return this.byId("employeeListTable").getBinding("items");
        },

        createFilterFromFilterBar: function (sKey, sFilterValue, bSearchField) {
            var sFilterOperator = bSearchField || sFilterValue === "ALL" ? FilterOperator.Contains : FilterOperator.EQ;
            var sAllValue = sFilterValue === "ALL" ? "" : sFilterValue;
            return new Filter({
                path: sKey,
                operator: sFilterOperator,
                value1: sAllValue,
                caseSensitive: false
            });
        },

        onCompletedFromDateChange: function (oEvent) {
            var sDateForCompare = oEvent.getSource().getDateValue();
            this.getEmployeeListItemsBinding().filter();
            this.getEmployeeListItemsBinding().attachEventOnce("dataReceived", this.getModel(), function () {
                this._changeEmployeeStatus(sDateForCompare);
            }.bind(this));
        },

        _changeEmployeeStatus: function (sDateForCompare) {
            this.onRefresh();
            var oEmployeeList = this.getView().byId("employeeListTable");
            var iDateForCompare = sDateForCompare.valueOf();
            var aEmloyeeListItems = oEmployeeList.getItems();

            this.getModel("viewModel").setProperty("/outdateDate", sDateForCompare);
            aEmloyeeListItems.forEach(function (oItem) {
                var oItemBindingContext = oItem.getBindingContext();
                var sCvStatusId = oItemBindingContext ? oItemBindingContext.getProperty("CVSTATUS") : null;
                var bIsStatusChangeable = sCvStatusId === "NeedToUpdate" || sCvStatusId === "Complete";

                if (bIsStatusChangeable) {
                    var sStatus = oItemBindingContext.getProperty("updated").valueOf() > iDateForCompare ? "Complete" : "NeedToUpdate";
                    var ID = oItemBindingContext.getProperty("ID");
                    var oEntry = {
                        CVSTATUS: sStatus
                    };

                    this.getModel().update("/CVData(" + ID + ")", oEntry);
                }
            }.bind(this));
            this.onFilterSearch();
            this.onRefresh();
        },

        onUpdateFinished: function (oEvent) {
            var iEmployeeListBindingLength = oEvent.getParameter("total");
            this.getModel("viewModel").setProperty("/listLength", iEmployeeListBindingLength);
        },

        onRefresh: function () {
            var oTable = this.byId("employeeListTable");
            oTable.getBinding("items").refresh();
        }
    });
});

// sap.ui.define([
//     "infopulse/cv/infopulse-cvapp-ui/controller/BaseController",
//     "infopulse/cv/infopulse-cvapp-ui/model/formatter",
//     "sap/ui/model/json/JSONModel",
//     "sap/m/GroupHeaderListItem",
//     "sap/ui/model/FilterOperator",
//     "sap/ui/model/Filter"
// ], function (BaseController, formatter, JSONModel, GroupHeaderListItem, FilterOperator, Filter) {
//     "use strict";
//     return BaseController.extend("infopulse.cv.infopulse-cvapp-ui.controller.EmployeeList", {
//         formatter: formatter,
//         /* =========================================================== */
//         /* lifecycle methods                                           */
//         /* =========================================================== */
//         /**
//          * Called when the EmployeeList controller is instantiated.
//          * @public
//          */
//         onInit: function () {
//             this._initializeViewModel();
//             this._initializeFilterModel();
//         },
//         _initializeViewModel: function () {
//             var dtOutdateDate = new Date();
//             dtOutdateDate.setMonth(dtOutdateDate.getMonth() - 6);
//             this.setModel(new JSONModel({
//                 worklistTableTitle: this.getResourceBundleText("manageResume.employeeTable.title"),
//                 listLength: 0,
//                 outdateDate: dtOutdateDate.toLocaleDateString()
//             }), "employeeView");
//         },
//         _initializeFilterModel: function () {
//             this.setModel(new JSONModel({
//                 departmentFilter: "ALL",
//                 statusFilter: "ALL",
//                 searchFilter: ""
//             }), "filterModel");
//         },
//         onSelectDepartmentChange: function (oEvent) {
//             var sDepartmentKey = oEvent.getSource().getSelectedKey();
//             this.setFilterModelProprety("departmentFilter", sDepartmentKey);
//         },
//         onSelectStatusChange: function (oEvent) {
//             var sStatusKey = oEvent.getSource().getSelectedKey();
//             this.setFilterModelProprety("statusFilter", sStatusKey);
//         },
//         onSearchByName: function (oEvent) {
//             var sSearchByNameKey = oEvent.getSource().getValue();
//             this.setFilterModelProprety("searchFilter", sSearchByNameKey);
//         },
//         setFilterModelProprety: function (sProperty, sFilterKey) {
//             this.getModel("filterModel").setProperty("/" + sProperty, sFilterKey);
//             this.onFilterSearch();
//         },
//         onFilterSearch: function () {
//             var aFilters = [
//                 this.createFilterFromFilterBar("department", this.getModel("filterModel").getProperty("/departmentFilter"), false),
//                 this.createFilterFromFilterBar("cvstatus", this.getModel("filterModel").getProperty("/statusFilter"), false),
//                 this.createFilterFromFilterBar("name", this.getModel("filterModel").getProperty("/searchFilter"), true)
//             ];
//             this.getEmployeeListItemsBinding().filter(aFilters);
//         },
//         getEmployeeListItemsBinding: function () {
//             return this.byId("employeeListTable").getBinding("items");
//         },
//         createFilterFromFilterBar: function (sKey, sFilterValue, bSearchField) {
//             var sFilterOperator = bSearchField || sFilterValue === "ALL" ? FilterOperator.Contains : FilterOperator.EQ;
//             var sAllValue = sFilterValue === "ALL" ? "" : sFilterValue;
//             return new Filter({
//                 path: sKey,
//                 operator: sFilterOperator,
//                 value1: sAllValue,
//                 caseSensitive: false
//             });
//         },
//         onCompletedFromDateChange: function (oEvent) {
//             var sDateForCompare = oEvent.getSource().getDateValue().toLocaleDateString();
//             var oEmployeeList = this.getView().byId("employeeListTable");
//             var aEmloyeeListItems = oEmployeeList.getItems();
//             this.getModel("employeeView").setProperty("/outdateDate", sDateForCompare);
//             aEmloyeeListItems.forEach(function (oItem) {
//                 var oItemBindingContext = oItem.getBindingContext();
//                 var sCvStatusId = oItemBindingContext ? oItemBindingContext.getProperty("cvstatus") : null;
//                 var bIsStatusChangeable = sCvStatusId === "NeedToUpdate" || sCvStatusId === "Complete";
//                 if (bIsStatusChangeable) {this._changeEmployeeStatus(oItemBindingContext, sDateForCompare);}
//             }.bind(this));
//         },
//         _changeEmployeeStatus: function (oContext, sDateForCompare) {
//             var sEmployeeID = oContext.getProperty("id");
//             var sPath = "/CVData(" + sEmployeeID + ")/cvstatus";
//             var bIsCvOutdated = oContext.getProperty("updated").valueOf() > sDateForCompare;
//             var sEmployeeStatus = bIsCvOutdated ? "NeedToUpdate" : "Complete";
//             this.getModel().setProperty(sPath, sEmployeeStatus);
//         },
//         onUpdateFinished: function (oEvent) {
//             var iEmployeeListBindingLength = oEvent.getParameter("total");
//             this.getModel("employeeView").setProperty("/listLength", iEmployeeListBindingLength);
//         },
        
// 		showPerson: function(oEvent){
// 			var oItem = oEvent.getSource().getBindingContext().getProperty("id");
// 			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

// 			oRouter.navTo("employee",{
// 				id : oItem
// 				},true);
// 		}        
//     });
// });
