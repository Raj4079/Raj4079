sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginControllerExtension",
    "sap/ui/core/mvc/OverrideExecution",
    "sap/dm/dme/plugins/operationListPlugin/controller/extensions/PluginEventExtensionConstants",
    "sap/m/Text",
    "sap/m/Button",
    "sap/m/MessageBox"
], function (PluginControllerExtension, OverrideExecution, PluginEventConstants, Text, Button, MessageBox) {
    "use strict";

    return PluginControllerExtension.extend("rits.custom.plugin.operationlistpluginextension.operationListExtensionProvider.PluginEventExtension", {
        constructor: function (oExtensionUtilities) {
            this._oExtensionUtilities = oExtensionUtilities;
        },

        getOverrideExecution: function (sOverrideMember) {
            if (sOverrideMember === PluginEventConstants.ON_POD_SELECTION_CHANGE_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_WORKLIST_SELECT_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_WORKLIST_REFRESHED_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_WORKLIST_REFRESH_EVENT) {
                return OverrideExecution.After;
            } else if (sOverrideMember === PluginEventConstants.ON_WORK_CENTER_CHANGE_EVENT) {
                return OverrideExecution.After;
            };
            return null;
        },

        /**
         * Returns the name of the core extension this overrides
         *
         * @returns {string} core extension name
         * @public
         */
        getExtensionName: function () {
            return PluginEventConstants.EXTENSION_NAME;
        },

        onPodSelectionChangeEvent: function (oData) {
            this._oExtensionUtilities.logMessage("PluginEventExtension.onPodSelectionChangeEvent: Operation List extension");
        },

        onWorklistSelectEvent: function (oData) {
            this._oExtensionUtilities.logMessage("PluginEventExtension.onWorklistSelectEvent: Operation List extension");
        },

        onWorklistRefreshedEvent: function (oData) {
            this._oExtensionUtilities.logMessage("PluginEventExtension.onWorklistRefreshedEvent: Operation List extension");
        },

        onWorklistRefreshEvent: function (oData) {
            this._oExtensionUtilities.logMessage("PluginEventExtension.onWorklistRefreshEvent: Operation List extension");
        },

        onWorkCenterChangeEvent: function (oData) {
            this._oExtensionUtilities.logMessage("PluginEventExtension.onWorkCenterChangeEvent: Operation List extension");
        },

        updateColumnConfiguration: function (aColumnConfiguration) {
            let that = this;
            let oTextControl = new Text().bindProperty("text", {
                parts: [
                    { path: "customText", type: new sap.ui.model.type.String() }
                ],
                wrapping: false
            });
            aColumnConfiguration.push({
                columnId: "CUSTOM_TEXT",
                description: "Custom Text",
                hAlign: "Begin",
                vAlign: "Middle",
                wrapping: false,
                width: "15em",
                label: "Custom Text",
                columnListItem: oTextControl
            });

            let oButtonControl = new Button({
                text: "Show Data",
                tooltip: "Press to show operation information",
                type: "Accept"
            }).attachPress(that.onShowOperationPress, that);
            aColumnConfiguration.push({
                columnId: "CUSTOM_BUTTON",
                description: "Custom Button",
                hAlign: "Begin",
                vAlign: "Middle",
                wrapping: false,
                width: "15em",
                label: "Custom Button",
                columnListItem: oButtonControl
            });
            this._oExtensionUtilities.logMessage("PluginEventExtension.updateColumnConfiguration: Operation List extension");
        },

        updateListConfiguration: function (oListConfiguration) {
            let iSequence = -1;
            for (let oColumn of oListConfiguration.columns) {
                if (oColumn.sequence > iSequence) {
                    iSequence = oColumn.sequence;
                }
                if (oColumn.columnId === "STATUS_ICON") {
                    break;
                }
            }
            iSequence++;
            oListConfiguration.columns.push({
                columnId: 'CUSTOM_TEXT',
                sequence: iSequence,
                sortOrder: null,
                label: "Custom Text",
                showSort: true,
                binding: "customText"
            });
            iSequence++;
            oListConfiguration.columns.push({
                columnId: 'CUSTOM_BUTTON',
                sequence: iSequence,
                sortOrder: null,
                label: "Show Data",
                showSort: false // to not show column in sort
            });
            this._oExtensionUtilities.logMessage("PluginEventExtension.updateListConfiguration: Operation List extension - oListConfiguration = ", oListConfiguration);
        },

        updateTableConfiguration: function (oTableConfiguration) {
            this._oExtensionUtilities.logMessage("PluginEventExtension.updateTableConfiguration: Operation List extension - oTableConfiguration = ", oTableConfiguration);
        },

        getBindingPath: function (vBinding) {
            this._oExtensionUtilities.logMessage("PluginEventExtension.getBindingPath: Operation List extension");
            return vBinding;
        },

        updateOperationsResponse: function (aResponseData) {
            if (aResponseData && aResponseData.length > 0) {
                for (let oResponse of aResponseData) {
                    oResponse.customText = this._getCustomText()
                }
            }
            this._oExtensionUtilities.logMessage("PluginEventExtension.updateOperationsResponse: Operation List extension - aResponseData = ", aResponseData);
        },

        _getCustomText: function () {
            return parseInt(Math.random() * Math.pow(10, 5));
        },

        onOperationListSelection: function (aSelections) {
            this._oExtensionUtilities.logMessage("PluginEventExtension.onOperationListSelection: Operation List extension - aSelections = ", aSelections);
        },

        onShowOperationPress: function (oEvent) {
            let oControl = oEvent.getSource();
            let oRowData = oControl.getBindingContext().getObject();
            let operationref = oRowData.operationRef || "";
            let oDetailsarray = operationref.split(",");
            var sUrl = this.getController().getPublicApiRestDataSourceUri() + '/pe/api/v1/process/processDefinitions/start?key=REG_2f9f423b-eb61-452c-9e11-6e52578e57a6&async=false';
            var oPayload = {
                InOperation: oDetailsarray[1],
                InPlant: oDetailsarray[0].split(":")[1]
            };
            return new Promise((resolve, reject) => {
                this.getController().ajaxPostRequest(sUrl, oPayload, resolve, reject);
            }).then(function (oResponse) {
                if (oResponse.OutResponse.length != 0) {
                    // let sDetails = `CUSTOM ATTRIBUTE ${oResponse.OutResponse.attribute}, Custom VALUE = ${oResponse.OutResponse.value}`;
                    // this.showMessage("Operation Custom Data", "Select to show details", sDetails);
                    // let sDetails = "Attribute".padEnd(50) + "Value\n";
                    // oResponse.OutResponse.forEach(function (item) {
                    //     let attr = (item.attribute || "").toString().padEnd(50);
                    //     let val = (item.value || "").toString();
                    //     sDetails += attr + val + "\n";
                    // });
                    //this.showMessage("Operation Custom Data", "Select to show details", "<pre>" + sDetails + "</pre>");
                    const oModel = new sap.ui.model.json.JSONModel(oResponse.OutResponse);
                    this.showCustomData(oModel);
                }
                else {
                    // let sDetails = "NO CUSTOM DATA AVAIABLE";
                    // this.showMessage("Operation Custom Data", "Select to show details", "<pre>" + sDetails + "</pre>");
                    const oModel = new sap.ui.model.json.JSONModel([]);
                    this.showCustomData(oModel);
                    return;
                }
            }.bind(this));

            // let sDetails = `Operation ${oRowData.operation}, Custom Text = ${oRowData.customText}`;
            // this.showMessage("Operation Data", "Select to show details", sDetails);
       },

        // showMessage: function (sTitle, sMessage, sDetails) {
        //     MessageBox.information(sMessage, {
        //         title: sTitle,
        //         id: "messageBoxId2",
        //         details: sDetails,
        //         contentWidth: "100px"
        //     });
        // }

        showCustomData:function(oModel){
            if (this.oDialog) {
                this.oDialog.destroy();
            }
            const oTable = new sap.m.Table({
                columns: [
                    new sap.m.Column({
                        header: new sap.m.Label({ text: "Attribute" })
                    }),
                    new sap.m.Column({
                        header: new sap.m.Label({ text: "Value" })
                    })
                ],
                items: {
                    path: "/",
                    template: new sap.m.ColumnListItem({
                        cells: [
                            new sap.m.Text({ text: "{attribute}" }),
                            new sap.m.Text({ text: "{value}" })
                        ]
                    })
                }
            });
    
            oTable.setModel(oModel);
    
            this.oDialog = new sap.m.Dialog({
                title: "Custom Data",
                contentWidth: "50%",
                contentHeight: "auto",
                resizable: true,
                draggable: true,
                content: [oTable],
                beginButton: new sap.m.Button({
                    text: "Close",
                    press: function () {
                        this.oDialog.close();
                    }.bind(this)
                }),
                afterOpen: function () {
                   
                    const oHeaderDom = this.$().find(".sapMDialogHdr");
                    oHeaderDom.css({
                        "background-color": "#0d47a1",  // Blue background
                        "color": "white"               // White text
                    });
            
                    oHeaderDom.find(".sapMTitle").css({
                        "color": "white",
                        "font-weight": "bold"
                    });
                }
            });
    
            this.oDialog.open();
        }
    })
});
