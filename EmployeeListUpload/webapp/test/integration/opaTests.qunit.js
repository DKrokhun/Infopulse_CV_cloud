/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function() {
	"use strict";

	sap.ui.require([
		"infopulse/cv/EmployeeListUpload/test/integration/AllJourneys"
	], function() {
		QUnit.start();
	});
});