sap.ui.define([], function () {
	"use strict";
	return {
		status: function (status) {
			switch (status) {
			case "InProgress":
				return "sap-icon://history";
			case "ForApproval":
				return "sap-icon://sys-help";
			case "Complete":
				return "sap-icon://accept";
			default:
				return "sap-icon://sys-minus";
			}
		},
		color: function (status) {
			switch (status) {
			case "InProgress":
				return "Critical";
			case "ForApproval":
				return "Critical";
			case "Complete":
				return "Positive";
			default:
				return "Negative";
			}
		},
		time: function (Date) {
			var Result = Date.toLocaleDateString();
			Result = Result + "  " + Date.getHours() + ":" + Date.getMinutes() + ":" + Date.getSeconds();
			return Result;
		},
		tooltip: function (status) {
			switch (status) {
			case "InProgress":
				return this.getResourceBundleText("manageResumes.filterBar.status.inProgress");
			case "ForApproval":
				return this.getResourceBundleText("manageResumes.filterBar.status.forApproval");
			case "Complete":
				return this.getResourceBundleText("manageResumes.filterBar.status.complete");
			default:
				return this.getResourceBundleText("manageResumes.filterBar.status.needToUpdate");
			}
		}
	};
});