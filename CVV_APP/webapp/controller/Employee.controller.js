sap.ui.define([
	"./BaseController",
	"../model/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (BaseController, formatter, JSONModel, MessageBox, MessageToast) {
	"use strict";

	return BaseController.extend("infopulse.cv.infopulse-cvapp-ui.controller.Employee", {

		formatter: formatter,

		onInit: function () {
			BaseController.prototype.onInit.apply(this, arguments);
			this.getOwnerComponent().getService("ShellUIService").then(this._setNavToEmployeeList.bind(this)).catch(function () {
				this.getRouter().navTo("notFound");
			});
			this.getRouter().getRoute("employee").attachPatternMatched(this._onPersonMatched, this);
		},

		_setNavToEmployeeList: function (oShellService) {
			oShellService.setBackNavigation(function () {
				this.getRouter().navTo("employeelist", null, true);
			}.bind(this));
		},

		_onPersonMatched: function (oEvent) {
			var iEmployeeId = oEvent.getParameter("arguments").id;

			this.getView().bindElement({
				path: "/CVData(" + iEmployeeId + ")/",
				events: {
					dataRequested: function () {
						this.getModel("Default").setProperty("/busy", true);
					},
					dataReceived: function (oData) {
						var oError = oData.getParameter("error");

						if (oError === undefined) {
							this.getRouter().navTo("notFound", null, true);
						} else {
							this.getModel("Default").setProperty("/busy", false);
						}
					}.bind(this)
				}
			});
		},
		
				reject: function (oEvent) {
			var status = this.getView().getBindingContext().getProperty("cvstatus"),
				id = this.getView().getBindingContext().getProperty("id"),
				CurrentDate = new Date(),
				that = this,
				Model = this.getModel(),
				bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length,
				emailPerson = this.getView().getBindingContext().getProperty("email"),
				name = this.getView().getBindingContext().getProperty("name");

			MessageBox.warning(
				"This CV will be rejected", {
					actions: ["Reject", sap.m.MessageBox.Action.CANCEL],
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					onClose: function (sAction) {
						if (sAction === "Reject") {
							sap.m.URLHelper.triggerEmail(
								emailPerson,
								"Please, update your CV",
								"Dear " + name + "\n" +
								"Unfortunately, your last CV was not approved. \n" +
								"Could you please update and upload your CV again? \n" +
								"You can find your last CV on the page hear https://dbforfioris0020936305trial.hanatrial.ondemand.com/Bind/webapp/test/flpSandbox.html#Bind-display \n" +
								"After update, you can upload your new CV on the same page  https://dbforfioris0020936305trial.hanatrial.ondemand.com/Bind/webapp/test/flpSandbox.html#Bind-display \n\n" +
								"Here you can find the manager's notes below:"
							);
							var oEntry = {};
							oEntry.cvstatusid = 1;
							oEntry.cvstatus = "InProgress";

							Model.update("/CVData(id=" + id + ")", oEntry, null, function () {
								
								var msg ="Status updated."
								
								sap.m.MessageBox.show(msg);} , function(){
									
									alert("Error!");
								}
							);

						}
					}
				}
			);
		},
		confirm: function (oEvent) {
			console.log(this.getView().getBindingContext().getProperty("cvstatus"))
			var status = this.getView().getBindingContext().getProperty("cvstatus"),
				id = this.getView().getBindingContext().getProperty("id"),
				CurrentDate = new Date(),
				Model = this.getModel(),
				that = this,
				bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length,
				emailPerson = this.getView().getBindingContext().getProperty("name"),
				name = this.getView().getBindingContext().getProperty("id");
				
			var mParameters = {
				context:{},
				success: function () {
					var msg ="Status updated."
					sap.m.MessageBox.show(msg);
				},
			    error: function(){
					alert("Error!");
			    },
			    merge: false
			};
			
			MessageBox.warning(
				"This CV will be confirmed", {
					actions: ["Accept", sap.m.MessageBox.Action.CANCEL],
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					onClose: function (sAction) {
						if (sAction === "Accept") {
							var oEntry = {};
							oEntry.cvstatus = "Complete";
							//oEntry.updated = CurrentDate;
							oEntry.cvstatusid = 3;
							oEntry.id = id;
							//oEntry.request = null;

							Model.update("/CVData(id=" + id + ")", oEntry, mParameters);
						}
					}
				}
			);
		},
		
				reSend: function (oEvent) {
			var status = this.getView().getBindingContext().getProperty("cvstatus"),
				id = this.getView().getBindingContext().getProperty("id"),
				CurrentDate = new Date(),
				bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length,
				emailPerson = this.getView().getBindingContext().getProperty("email"),
				name = this.getView().getBindingContext().getProperty("name");
			//Select=oEvent.getSource().indexOf();

			MessageBox.warning(
				"You will send E-mail", {
					actions: ["Resend Email", sap.m.MessageBox.Action.CANCEL],
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					onClose: function (sAction) {
						if (sAction === "Resend Email") {
							//oEvent.removeSelection();
							sap.m.URLHelper.triggerEmail(
								emailPerson,
								"Please, update your CV",
								"Dear " + name + "\n" +
								"Kind reminder.\n" +
								"You should update your CV as soon as possible.\n" +
								"You can find your current CV on the page https://dbforfioris0020936305trial.hanatrial.ondemand.com/Bind/webapp/test/flpSandbox.html#Bind-display \n" +
								"After update, please, upload your  new CV on the same page https://dbforfioris0020936305trial.hanatrial.ondemand.com/Bind/webapp/test/flpSandbox.html#Bind-display"
							);
						}
					}
				}
			);
			this.onRefresh();
		},
		
		onClick: function (oEvent) {
			console.log("start");
			var status = this.getView().getBindingContext().getProperty("cvstatus"),
				id = this.getView().getBindingContext().getProperty("id"),
				CurrentDate = new Date(),
				model = this.getModel(),
				bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length,
				emailPerson = this.getView().getBindingContext().getProperty("email"),
				name = this.getView().getBindingContext().getProperty("name"),
				that = this;
				
			console.log(id);
			MessageBox.warning(
				"You will send E-mail", {
					actions: ["Send email", sap.m.MessageBox.Action.CANCEL],
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					onClose: function (sAction) {
						if (sAction === "Send email") {
	//						oIteam.setSelected(false);
							sap.m.URLHelper.triggerEmail(
								emailPerson,
								"Dear, " + name + "! \n",
								"Could you please update your CV as soon as possible? \n" +
								"You can find your current CV on the page hear " +
								"https://dbforfioris0020936305trial.hanatrial.ondemand.com/Bind/webapp/test/flpSandbox.html#Bind-display" + "\n" +
								"After update, please, upload your  new CV on the same page " +
								"https://dbforfioris0020936305trial.hanatrial.ondemand.com/Bind/webapp/test/flpSandbox.html#Bind-display"
							);
							var oEntry = {};

							oEntry.cvstatus = "InProgress";
							oEntry.request = CurrentDate;
							oEntry.cvstatusid = 1;
							model.update("/CVData(id=" + id + ")", oEntry, null, function() {
								
								var msg ="Status updated."
								
								sap.m.MessageBox.show(msg);} , function(){
									
									alert("Error!");
								}
							);
						}

					}

				}
			);
		},
		


		handleFileUploaderChangePDF: function (oEvent) {
			var name = this.getView().byId("name").getObjectTitle();
			//	var oFileUploader = oEvent.getSource(),

			var sFileType = oEvent.getParameters().files[0].type,
				bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length,
				sFileName = oEvent.getParameters().files[0].name;

			if (sFileName.search(name.replace(" ", ".")) != -1) {
				this.gsFileType = sFileType;
				this.gsFileName = sFileName;
			} else {
				MessageBox.warning(
					"File name should be '" + name.replace(" ", ".") + "'", {
						actions: [sap.m.MessageBox.Action.OK],
						styleClass: bCompact ? "sapUiSizeCompact" : "",
						onClose: function (sAction) {
							if (sAction === "OK") {

							}
						}
					}
				);
				this.byId("fileUploaderPDF").destroyHeaderParameters();
				this.byId("fileUploaderPDF").setValue("");
			}
		},
		handlePress: function (oEvent) {

			var sFileId = oEvent.getSource().getBindingContext().getProperty("cvid");
			var sId = oEvent.getSource().getBindingContext().getProperty("id");
			var date = oEvent.getSource().getBindingContext().getProperty("updated");
			
			var sUrl = "/FilesList(id="+ sId+",cvid="+ sFileId + ")";

			this.getModel().read(sUrl, {
				success: function (oData) {
					var sFileName = oData.cvname;

					var month = date.getMonth() + 1;

					var Name = sFileName.slice(0, sFileName.lastIndexOf(".")) + " (" + date.getFullYear() + "." + month + "." + date.getDate() +
						")";
					var sFileExtension = sFileName.substring(sFileName.lastIndexOf(".") + 1);
					var sFileType = oData.cvftype;
					var sFileContent = atob(oData.cvcontent);
					var aByteNumbers = new Array(sFileContent.length);

					for (var i = 0; i < sFileContent.length; i++) {
						aByteNumbers[i] = sFileContent.charCodeAt(i);
					}
					var aByteArray = new Uint8Array(aByteNumbers);
					
					var blob = new Blob([sFileContent],{type: sFileType});
					var a = window.document.createElement('a');
					a.href = window.URL.createObjectURL(blob);
					
					a.download = sFileName;

						document.body.appendChild(a);
						a.click();
						
						document.body.removeChild(a);
					
				    //File.save(aByteArray, Name, sFileExtension, sFileType);
				},
				error: function (oError) {
					MessageToast.show(oError);
				}
			});
		},
		
		// 		handleDownload: function (oEvent) {

		// 	// get id - временно, для тестирования
		// 	var oInputField = this.byId("cvIDfield");
		// 	var cvID = oInputField.getValue();

		// 	var itemString = "/CVFileGet(" + cvID + ")";
		// 	var serviceURI = "/fiori/xs/cv.xsodata/";
		// 	var oModelFile = new sap.ui.model.odata.v2.ODataModel(serviceURI);

		// 	oModelFile.read(itemString, {
		// 		success: function (oData, response) {
		// 			var fName = oData.CVNAME;
		// 			var fType = oData.CVFTYPE;
		// 			var fCont = window.atob(oData.CVCONTENT);
		// 			//var fCont = hexToBase64(oData.CVCONTENT); //atob(atob(oData.CVCONTENT));
		// 			if (fType === "text/plain") {
		// 				sap.ui.core.util.file.save(fCont, fName.replace(".txt", ""), "txt", fType, "utf-8", true);
		// 			} else {
		// 				var byteNumbers = new Array(fCont.length);
		// 				for (var i = 0; i < fCont.length; i++) {
		// 					byteNumbers[i] = fCont.charCodeAt(i);
		// 				}
		// 				var byteArray = new Uint8Array(byteNumbers);
		// 				var blob = new Blob([byteArray], {
		// 					type: fType
		// 				});
		// 				var url = URL.createObjectURL(blob);
		// 				window.open(url, "_blank");
		// 				//window.openDialog(url, "_blank");

		// 			}
		// 		},
		// 		error: function (oError) {}
		// 	});

		// },

		handleUploadPDFPress: function (oEvent) {
			var oFileUploader = this.getView().byId("fileUploaderPDF");
			var text = oFileUploader.getValue();
			var base64;
			var statusid = this.getView().getBindingContext().getProperty("cvstatusid");
			var id = this.getView().getBindingContext().getProperty("id");
			

			if (text) {
				MessageToast.show("Upload start");
				this.getView().setBusy(true);

				var oModel = this.getModel();

				var csrfToken = this.getView().getModel().oHeaders["x-csrf-token"];
				oFileUploader.setSendXHR(true);

				oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
					name: "x-csrf-token",
					value: csrfToken
				}));

				//Read File
				var file = oFileUploader.oFileUpload.files[0];
				var base64Marker = "data:" + file.type + ";base64,";
				var reader = new FileReader();

				var oUrlParameters = {
					id: oEvent.getSource().getBindingContext().getProperty("id"),
					cvid: 1,
					cvname: file.name,
					cvftype: file.type
				};

				reader.onload = function () {
					var base64index = reader.result.indexOf(base64Marker) + base64Marker.length;
					base64 = reader.result.substring(base64index);

					oUrlParameters.cvcontent = base64;

					oModel.callFunction("/upload", {
						method: "POST",
						urlParameters: oUrlParameters
					});
					
					
					var oEntry = {};

					oEntry.cvstatus = "ForApproval";
					//oEntry.request = CurrentDate;
					oEntry.cvstatusid = 2;
					
					if (statusid == 1){
						oModel.update("/CVData(id=" + id + ")", oEntry, null, function() {
								
							var msg ="Status updated."
								
							sap.m.MessageBox.show(msg);} , function(){
									
								alert("Error!");
							}
						);
					}
					
				};

				reader.readAsDataURL(file);
				this.getView().setBusy(false);

				this.getView().setBusy(false);
			} else {
				MessageToast.show("Choose file");
			}
		}
	});
});

// sap.ui.define([
// 	"./BaseController",
// 	"sap/ui/model/json/JSONModel",
// 	"../model/formatter",
// 	"sap/ui/model/Filter",
// 	"sap/ui/model/FilterOperator",
// 	"sap/m/MessageBox",
// 	"sap/m/MessagePopover",
// 	"sap/m/MessagePopoverItem",
// 	"sap/m/MessageToast",
// 	"sap/m/Label",
// 	"sap/ui/core/Fragment",
// 	"sap/ui/model/Sorter",
// 	"sap/ui/core/util/File"
// ], function (BaseController, JSONModel, formatter, Filter, FilterOperator, MessageBox, MessagePopover, MessagePopoverItem, MessageToast,
// 	Label, Fragment, Sorter, File) {
// 	"use strict";

// 	return BaseController.extend("infopulse.cv.infopulse-cvapp-ui.controller.Employee", {

// 		formatter: formatter,

// 		/* =========================================================== */
// 		/* lifecycle methods                                           */
// 		/* =========================================================== */

// 		/**
// 		 * Called when the worklist controller is instantiated.
// 		 * @public
// 		 */
// 		onInit: function () {
// 			var oList = this.byId("List");

// 			this._oList = oList;
// 			this._oListFilterState = {
// 				aFilter: [],
// 				aSearch: []
// 			};
// 			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
// 			this.getOwnerComponent().getService("ShellUIService").then(function (oShellService) {
// 				oShellService.setBackNavigation(function () {

// 					oRouter.navTo("employeelist", {}, true);
// 				});
// 			});
// 			this.getRouter().getRoute("employee").attachPatternMatched(this._onPersonMatched, this);
// 		},

// 		_onPersonMatched: function (oEvent) {
// 			var personId = oEvent.getParameter("arguments").id;

// 			this.getView().bindElement({
// 				path: "/CVData(" + personId + ")/"
// 			});
// 			//this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
// 		},

// 		onClik: function (oEvent) {
// 			console.log("start");
// 			var status = this.getView().getBindingContext().getProperty("cvstatus"),
// 				id = this.getView().getBindingContext().getProperty("id"),
// 				CurrentDate = new Date(),
// 				model = this.getModel(),
// 				bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length,
// 				emailPerson = this.getView().getBindingContext().getProperty("EMAIL"),
// 				name = this.getView().getBindingContext().getProperty("name"),
// 				that = this;
// 			console.log(id);
// 			MessageBox.warning(
// 				"You will send E-mail", {
// 					actions: ["Send email", sap.m.MessageBox.Action.CANCEL],
// 					styleClass: bCompact ? "sapUiSizeCompact" : "",
// 					onClose: function (sAction) {
// 						if (sAction === "Send email") {
// 							oIteam.setSelected(false);
// 							sap.m.URLHelper.triggerEmail(
// 								emailPerson,
// 								"Dear, " + name + "! \n",
// 								"Could you please update your CV as soon as possible? \n" +
// 								"You can find your current CV on the page hear " +
// 								"https://dbforfioris0020936305trial.hanatrial.ondemand.com/Bind/webapp/test/flpSandbox.html#Bind-display" + "\n" +
// 								"After update, please, upload your  new CV on the same page " +
// 								"https://dbforfioris0020936305trial.hanatrial.ondemand.com/Bind/webapp/test/flpSandbox.html#Bind-display"
// 							);
// 							var oEntry = {};

// 							oEntry.cvstatus = "InProgress";
// 							oEntry.request = CurrentDate;
// 							oEntry.cvstatusid = 3;
// 							model.update('/CVData(' + id + ')', oEntry, null, function () {
// 								console.log("say hello");
// 							}, function () {
// 								console.log("say hello");
// 							});
// 						}

// 					}

// 				}
// 			);
// 		},
// 		reject: function (oEvent) {
// 			var status = this.getView().getBindingContext().getProperty("cvstatus"),
// 				id = this.getView().getBindingContext().getProperty("id"),
// 				CurrentDate = new Date(),
// 				that = this,
// 				Model = this.getModel(),
// 				bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length,
// 				emailPerson = this.getView().getBindingContext().getProperty("EMAIL"),
// 				name = this.getView().getBindingContext().getProperty("name");

// 			MessageBox.warning(
// 				"This CV will be rejected", {
// 					actions: ["Reject", sap.m.MessageBox.Action.CANCEL],
// 					styleClass: bCompact ? "sapUiSizeCompact" : "",
// 					onClose: function (sAction) {
// 						if (sAction === "Reject") {
// 							sap.m.URLHelper.triggerEmail(
// 								emailPerson,
// 								"Please, update your CV",
// 								"Dear " + name + "\n" +
// 								"Unfortunately, your last CV was not approved. \n" +
// 								"Could you please update and upload your CV again? \n" +
// 								"You can find your last CV on the page hear https://dbforfioris0020936305trial.hanatrial.ondemand.com/Bind/webapp/test/flpSandbox.html#Bind-display \n" +
// 								"After update, you can upload your new CV on the same page  https://dbforfioris0020936305trial.hanatrial.ondemand.com/Bind/webapp/test/flpSandbox.html#Bind-display \n\n" +
// 								"Here you can find the manager's notes below:"
// 							);
// 							var oEntry = {};
// 							oEntry.cvstatusid = 3;
// 							oEntry.cvstatus = "InProgress";

// 							Model.update('/CVData(' + id + ')', oEntry, null, function () {}, function () {});

// 						}
// 					}
// 				}
// 			);
// 		},
// 		confirm: function (oEvent) {
// 			console.log(this.getView().getBindingContext().getProperty("cvstatus"))
// 			var status = this.getView().getBindingContext().getProperty("cvstatus"),
// 				id = this.getView().getBindingContext().getProperty("id"),
// 				CurrentDate = new Date(),
// 				Model = this.getModel(),
// 				that = this,
// 				bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length,
// 				emailPerson = this.getView().getBindingContext().getProperty("name"),
// 				name = this.getView().getBindingContext().getProperty("id");

// 			MessageBox.warning(
// 				"This CV will be confirmed", {
// 					actions: ["Accept", sap.m.MessageBox.Action.CANCEL],
// 					styleClass: bCompact ? "sapUiSizeCompact" : "",
// 					onClose: function (sAction) {
// 						if (sAction === "Accept") {
// 							var oEntry = {};
// 							oEntry.cvstatus = "Complete";
// 							oEntry.updated = CurrentDate;
// 							oEntry.cvstatusid = 2;
// 							//oEntry.request = null;

// 							Model.update('/CVData(' + id + ')', oEntry, null, function () {}, function () {});
// 							that.onRefresh();
// 						}
// 					}
// 				}
// 			);
// 		},
// 		reSend: function (oEvent) {
// 			var status = this.getView().getBindingContext().getProperty("cvstatus"),
// 				id = this.getView().getBindingContext().getProperty("id"),
// 				CurrentDate = new Date(),
// 				bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length,
// 				emailPerson = this.getView().getBindingContext().getProperty("EMAIL"),
// 				name = this.getView().getBindingContext().getProperty("name");
// 			//Select=oEvent.getSource().indexOf();

// 			MessageBox.warning(
// 				"You will send E-mail", {
// 					actions: ["Resend Email", sap.m.MessageBox.Action.CANCEL],
// 					styleClass: bCompact ? "sapUiSizeCompact" : "",
// 					onClose: function (sAction) {
// 						if (sAction === "Resend Email") {
// 							//oEvent.removeSelection();
// 							sap.m.URLHelper.triggerEmail(
// 								emailPerson,
// 								"Please, update your CV",
// 								"Dear " + name + "\n" +
// 								"Kind reminder.\n" +
// 								"You should update your CV as soon as possible.\n" +
// 								"You can find your current CV on the page https://dbforfioris0020936305trial.hanatrial.ondemand.com/Bind/webapp/test/flpSandbox.html#Bind-display \n" +
// 								"After update, please, upload your  new CV on the same page https://dbforfioris0020936305trial.hanatrial.ondemand.com/Bind/webapp/test/flpSandbox.html#Bind-display"
// 							);
// 						}
// 					}
// 				}
// 			);
// 			this.onRefresh();
// 		},
// 		_onObjectMatched: function (oEvent) {
// 			var sObjectId = 20;
// 			this.Model.metadataLoaded().then(function () {
// 				var sObjectPath = this.getModel().createKey("CV", {
// 					EmployeeID: sObjectId
// 				});
// 				this._bindView("/" + sObjectPath);
// 			}.bind(this));
// 		},
// 		_bindView: function (sObjectPath) {
// 			var oViewModel = this.getModel("worklistView"),
// 				oDataModel = this.getModel();

// 			this.getView().bindElement({
// 				path: sObjectPath,
// 				events: {
// 					change: this._onBindingChange.bind(this),
// 					dataRequested: function () {
// 						oDataModel.metadataLoaded().then(function () {
// 							// Busy indicator on view should only be set if metadata is loaded,
// 							// otherwise there may be two busy indications next to each other on the
// 							// screen. This happens because route matched handler already calls '_bindView'
// 							// while metadata is loaded.
// 							oViewModel.setProperty("/busy", true);
// 						});
// 					},
// 					dataReceived: function () {
// 						oViewModel.setProperty("/busy", false);
// 					}
// 				}
// 			});
// 		},

// 		_onBindingChange: function () {
// 			var oView = this.getView(),
// 				oViewModel = this.getModel("worklistView"),
// 				oElementBinding = oView.getElementBinding();

// 			// No data for the binding
// 			if (!oElementBinding.getBoundContext()) {
// 				this.getRouter().getTargets().display("objectNotFound");
// 				return;
// 			}

// 			var oResourceBundle = this.getResourceBundle(),
// 				oObject = oView.getBindingContext().getObject(),
// 				sObjectId = oObject.EmployeeID,
// 				sObjectName = oObject.FirstName;

// 			oViewModel.setProperty("/busy", false);

// 			oViewModel.setProperty("/shareSendEmailSubject",
// 				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
// 			oViewModel.setProperty("/shareSendEmailMessage",
// 				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
// 		},
// 		onUploadComplete: function (oEvent) {
// 			console.log("hi");
// 			this.byId("fileUploader").destroyHeaderParameters();
// 			this.byId("fileUploader").setValue("");
// 			var oTable = this.byId("List");
// 			oTable.getBinding("items").refresh();
// 			var CurrentDate = new Date();
// 			var model = this.getModel();
// 			var oEntry = {};
// 			var id = 20;
// 			oEntry.cvstatus = "ForApproval";
// 			//oEntry.request = CurrentDate;
// 			oEntry.cvstatusid = 4;
// 			oEntry.UPLOAD = CurrentDate;
// 			model.update("/CVData(" + id + ")", oEntry, null, function () {}, function () {});

// 		},
// 		onUploadPDFComplete: function (oEvent) {
// 			var CurrentDate = new Date();
// 			MessageToast.show("Upload finish");
// 			this.getView().setBusy(false);
// 			this.byId("fileUploaderPDF").destroyHeaderParameters();
// 			this.byId("fileUploaderPDF").setValue("");
// 			var oTable = this.byId("List");
// 			oTable.getBinding("items").refresh();
// 			var model = this.getModel();
// 			var oEntry = {};
// 			var id = oEvent.getSource().getBindingContext().getProperty("id");
// 			oEntry.cvstatus = "ForApproval";
// 			//oEntry.request = CurrentDate;
// 			oEntry.cvstatusid = 4;
// 			oEntry.UPLOAD = CurrentDate;

// 			//oEntry.request = CurrentDate;
// 			oEntry.cvstatusid = 4;
// 			model.update("/CVData(" + id + ")", oEntry, null, function () {}, function () {});

// 		},
// 		handleDownload: function (oEvent) {

// 			// get id - временно, для тестирования
// 			var oInputField = this.byId("cvIDfield");
// 			var cvID = oInputField.getValue();

// 			var itemString = "/CVFileGet(" + cvID + ")";
// 			var serviceURI = "/fiori/xs/cv.xsodata/";
// 			var oModelFile = new sap.ui.model.odata.v2.ODataModel(serviceURI);

		// 	oModelFile.read(itemString, {
		// 		success: function (oData, response) {
		// 			var fName = oData.CVNAME;
		// 			var fType = oData.CVFTYPE;
		// 			var fCont = window.atob(oData.CVCONTENT);
		// 			//var fCont = hexToBase64(oData.CVCONTENT); //atob(atob(oData.CVCONTENT));
		// 			if (fType === "text/plain") {
		// 				sap.ui.core.util.file.save(fCont, fName.replace(".txt", ""), "txt", fType, "utf-8", true);
		// 			} else {
		// 				var byteNumbers = new Array(fCont.length);
		// 				for (var i = 0; i < fCont.length; i++) {
		// 					byteNumbers[i] = fCont.charCodeAt(i);
		// 				}
		// 				var byteArray = new Uint8Array(byteNumbers);
		// 				var blob = new Blob([byteArray], {
		// 					type: fType
		// 				});
		// 				var url = URL.createObjectURL(blob);
		// 				window.open(url, "_blank");
		// 				//window.openDialog(url, "_blank");

		// 			}
		// 		},
		// 		error: function (oError) {}
		// 	});

		// },
// 		onOpenViewSettings: function (oEvent) {
// 			if (!this._oViewSettingsDialog) {
// 				this._oViewSettingsDialog = sap.ui.xmlfragment("DownloadTest.DownloadTest.view.CopyOfViewSettingsDilog", this);
// 				this.getView().addDependent(this._oViewSettingsDialog);
// 				// forward compact/cozy style into Dialog
// 				this._oViewSettingsDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
// 			}
// 			var sDialogTab = "sort";
// 			if (oEvent.getSource() instanceof sap.m.Button) {
// 				var sButtonId = oEvent.getSource().sId;
// 				if (sButtonId.match("filter")) {
// 					sDialogTab = "filter";
// 				} else if (sButtonId.match("group")) {
// 					sDialogTab = "group";
// 				}
// 			}
// 			this._oViewSettingsDialog.open(sDialogTab);
// 		},
// 		onConfirmViewSettingsDialog: function (oEvent) {
// 			var aFilterItems = oEvent.getParameters().filterItems,
// 				aFilters = [],
// 				aCaptions = [];
// 			console.log(oEvent);
// 			// update filter state:
// 			// combine the filter array and the filter string
// 			aFilterItems.forEach(function (oItem) {
// 				switch (oItem.getKey()) {
// 				case "Filter1":
// 					aFilters.push(new Filter("id", FilterOperator.LE, 100));
// 					break;
// 				case "Filter2":
// 					aFilters.push(new Filter("id", FilterOperator.GT, 100));
// 					break;
// 				default:
// 					break;
// 				}
// 				aCaptions.push(oItem.getText());
// 			});

// 			this._oListFilterState.aFilter = aFilters;
// 			this._applySortGroup(oEvent);
// 		},
// 		_applySortGroup: function (oEvent) {
// 			var mParams = oEvent.getParameters(),
// 				sPath,
// 				bDescending,
// 				aSorters = [];
// 			// apply sorter to binding
// 			// (grouping comes before sorting)
// 			if (mParams.groupItem) {
// 				sPath = mParams.groupItem.getKey();
// 				console.log(mParams.groupItem.getKey().valueOf().toString());
// 				bDescending = mParams.groupDescending;
// 				aSorters.push(new Sorter(sPath, bDescending, true));
// 			}
// 			sPath = mParams.sortItem.getKey();
// 			bDescending = mParams.sortDescending;
// 			aSorters.push(new Sorter(sPath, bDescending));
// 			this._oList.getBinding("items").sort(aSorters);
// 		},
// 		handleFileUploaderChangePDF: function (oEvent) {
// 			var name = this.getView().byId("name").getObjectTitle()
// 				//	var oFileUploader = oEvent.getSource(),

// 			var sFileType = oEvent.getParameters().files[0].type,
// 				bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length,
// 				sFileName = oEvent.getParameters().files[0].name;
// 			console.log(sFileName.search(name.replace(' ', '.')) != -1);
// 			if (sFileName.search(name.replace(' ', '.')) != -1) {
// 				this.gsFileType = sFileType;
// 				this.gsFileName = sFileName;
// 			} else {
// 				MessageBox.warning(
// 					"File name should be '" + name.replace(' ', '.') + "'", {
// 						actions: [sap.m.MessageBox.Action.OK],
// 						styleClass: bCompact ? "sapUiSizeCompact" : "",
// 						onClose: function (sAction) {
// 							if (sAction === "OK") {

// 							}
// 						}
// 					}
// 				);
// 				this.byId("fileUploaderPDF").destroyHeaderParameters();
// 				this.byId("fileUploaderPDF").setValue("");
// 			}
// 		},
// 		handlePress: function (oEvent) {

// 			var sFileId = oEvent.getSource().getBindingContext().getProperty("cvid");
// 			var date = oEvent.getSource().getBindingContext().getProperty("updated");

// 			var sUrl = "/CVFileGet(" + sFileId + ")";

// 			this.getModel().read(sUrl, {
// 				success: function (oData) {
// 					var sFileName = oData.CVNAME;

// 					var month = date.getMonth() + 1;

// 					var Name = sFileName.slice(0, sFileName.lastIndexOf(".")) + " (" + date.getFullYear() + "." + month + "." + date.getDate() +
// 						")";
// 					var sFileExtension = sFileName.substring(sFileName.lastIndexOf(".") + 1);
// 					var sFileType = oData.CVFTYPE;
// 					var sFileContent = atob(oData.CVCONTENT);
// 					var aByteNumbers = new Array(sFileContent.length);

// 					for (var i = 0; i < sFileContent.length; i++) {
// 						aByteNumbers[i] = sFileContent.charCodeAt(i);
// 					}
// 					var aByteArray = new Uint8Array(aByteNumbers);
// 					File.save(aByteArray, Name, sFileExtension, sFileType);
// 				},
// 				error: function (oError) {
// 					MessageToast.show(oError);
// 				}
// 			});
// 		},
// 		handleUploadPDFPress: function (oEvent) {
// 			var oFileUploader = this.getView().byId("fileUploaderPDF");
// 			var text = oFileUploader.getValue();
// 			var id = oEvent.getSource().getBindingContext().getProperty("id");
// 			if (text) {
// 				MessageToast.show("Upload start");
// 				this.getView().setBusy(true);

// 				//console.log(id);
// 				// get id - временно, для тестирования

// 				oFileUploader.setUploadUrl("/upload");
// 				// oFileUploader.setUploadUrl("/fiori/xs/cv_file.xsjs?cmd=put&id=" + id + "&fname=" + this.gsFileName + "&mType=" + this.gsFileType);
// 				oFileUploader.upload();
// 			} else {
// 				MessageToast.show("Choose file");
// 			}
// 			// MessageToast.show("Upload start");
// 			// this.getView().setBusy(true);
// 			// var id = 20;
// 			// //console.log(id);
// 			// // get id - временно, для тестирования

// 			// var oFileUploader = this.getView().byId("fileUploaderPDF");

// 			// oFileUploader.setUploadUrl("/fiori/xs/cv_file.xsjs?cmd=put&id=" + id + "&fname=" + this.gsFileName + "&mType=" + this.gsFileType);
// 			// oFileUploader.upload();
// 		},
// 		/* =========================================================== */
// 		/* event handlers                                              */
// 		/* =========================================================== */

// 		/**
// 		 * Triggered by the table's 'updateFinished' event: after new table
// 		 * data is available, this handler method updates the table counter.
// 		 * This should only happen if the update was successful, which is
// 		 * why this handler is attached to 'updateFinished' and not to the
// 		 * table's list binding's 'dataReceived' method.
// 		 * @param {sap.ui.base.Event} oEvent the update finished event
// 		 * @public
// 		 */
// 		onUpdateFinished: function (oEvent) {
// 			// update the worklist's object counter after the table update
// 			// var sTitle,
// 			// 	oTable = oEvent.getSource(),
// 			// 	iTotalItems = oEvent.getParameter("total");
// 			// // only update the counter if the length is final and
// 			// // the table is not empty
// 			// if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
// 			// 	sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
// 			// } else {
// 			// 	sTitle = this.getResourceBundle().getText("worklistTableTitle");
// 			// }
// 			// this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
// 		},

// 		/**
// 		 * Event handler when a table item gets pressed
// 		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
// 		 * @public
// 		 */
// 		onPress: function (oEvent) {
// 			// The source is the list item that got pressed
// 			this._showObject(oEvent.getSource());
// 		},

// 		/**
// 		 * Event handler when the share in JAM button has been clicked
// 		 * @public
// 		 */
// 		onShareInJamPress: function () {
// 			var oViewModel = this.getModel("worklistView"),
// 				oShareDialog = sap.ui.getCore().createComponent({
// 					name: "sap.collaboration.components.fiori.sharing.dialog",
// 					settings: {
// 						object: {
// 							id: location.href,
// 							share: oViewModel.getProperty("/shareOnJamTitle")
// 						}
// 					}
// 				});
// 			oShareDialog.open();
// 		},

// 		onSearch: function (oEvent) {
// 			if (oEvent.getParameters().refreshButtonPressed) {
// 				// Search field's 'refresh' button has been pressed.
// 				// This is visible if you select any master list item.
// 				// In this case no new search is triggered, we only
// 				// refresh the list binding.
// 				this.onRefresh();
// 			} else {
// 				var aTableSearchState = [];
// 				var sQuery = oEvent.getParameter("query");

// 				if (sQuery && sQuery.length > 0) {
// 					aTableSearchState = [new Filter("cvstatus", FilterOperator.Contains, sQuery)];
// 				}
// 				this._applySearch(aTableSearchState);
// 			}

// 		},

// 		/**
// 		 * Event handler for refresh event. Keeps filter, sort
// 		 * and group settings and refreshes the list binding.
// 		 * @public
// 		 */
// 		onRefresh: function () {
// 			var oTable = this.byId("table");
// 			oTable.getBinding("items").refresh();
// 		},

// 		/* =========================================================== */
// 		/* internal methods                                            */
// 		/* =========================================================== */

// 		/**
// 		 * Shows the selected item on the object page
// 		 * On phones a additional history entry is created
// 		 * @param {sap.m.ObjectListItem} oItem selected Item
// 		 * @private
// 		 */
// 		_showObject: function (oItem) {
// 			this.getRouter().navTo("object", {
// 				objectId: oItem.getBindingContext().getProperty("id")
// 			});
// 		},

// 		/**
// 		 * Internal helper method to apply both filter and search state together on the list binding
// 		 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
// 		 * @private
// 		 */
// 		_applySearch: function (aTableSearchState) {
// 			var oTable = this.byId("table"),
// 				oViewModel = this.getModel("worklistView");
// 			oTable.getBinding("items").filter(aTableSearchState, "Application");
// 			// changes the noDataText of the list in case there are no filter results
// 			if (aTableSearchState.length !== 0) {
// 				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
// 			}
// 		}

// 	});
// });
