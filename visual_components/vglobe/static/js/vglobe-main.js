$(function () {
    $.widget("earthserver.service", {
        options: {},
        _create: function () {
            var self = this;
            
            var parent = $("<div>", {
                'id': 'v-main-dock',
                'class': "btn-group-vertical button-menu",
            });
            
            /* main dock (required) */
            var leftDock = parent.mainDock({
                toggleId: 'v-opener'
            }).mainDock("instance");
            
            /* gis toolbar (required) */
            var gisToolbar = parent.gisToolbar().gisToolbar("instance");
//            gisToolbar.addClickHandler("#zoom-in-tool", function() {
//                console.log("Zoom in.")
//            });
            
            /* coordinates overlay (required) */
            var coordinates = $("<div>").coordinateOverlay().coordinateOverlay("instance");
        }
    })
});

function init(){
    $("#service-container").service();
    
    www.__init__()
}