 sap.ui.define([
    "sap/dm/dme/podfoundation/extension/PluginExtensionProvider",
    "rits/custom/plugin/operationlistpluginextension/operationListExtensionProvider/LifecycleExtension",
    "rits/custom/plugin/operationlistpluginextension/operationListExtensionProvider/PluginEventExtension",
    "rits/custom/plugin/operationlistpluginextension/operationListExtensionProvider/PropertyEditorExtension",
    "rits/custom/plugin/operationlistpluginextension/utils/ExtensionUtilities"
], function (PluginExtensionProvider, LifecycleExtension, PluginEventExtension, 
             PropertyEditorExtension, ExtensionUtilities) {
    "use strict";
    return PluginExtensionProvider.extend("rits.custom.plugin.operationlistpluginextension.operationListExtensionProvider.ExtensionProvider", {
        constructor: function () {
            this.oExtensionUtilities = new ExtensionUtilities();
        },
        getExtensions: function () {
            let oLifecycleExtension = new LifecycleExtension(this.oExtensionUtilities);
            let oPluginEventExtension = new PluginEventExtension(this.oExtensionUtilities);
            oLifecycleExtension.setPluginEventExtension(oPluginEventExtension);
            let oPropertyEditorExtension = new PropertyEditorExtension(this.oExtensionUtilities);
            return [oLifecycleExtension, oPluginEventExtension, oPropertyEditorExtension];
        }
    })
});
