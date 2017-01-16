$(function () {
    $.widget("earthserver.gisToolbar", {
        options: {
            container: $("#service-container")
        },
        _create: function () {

            this.element.append(
                $('<button>', {
                    id: "manage-layer-tool",
                    type: "button",
                    class: "btn btn-circle btn-sm opener-right active is-closed",
                    "data-toggle": "tooltip",
                    "data-placement": "left",
                    "data-container": "body",
                    "title": "Manage Layer",
                }).append($('<i>', {class: "fa fa-bars"})),
                $('<button>', {
                    id: "zoom-box-tool",
                    type: "button",
                    class: "btn btn-circle btn-sm opener-right active is-closed",
                    "data-toggle": "tooltip",
                    "data-placement": "left",
                    "data-container": "body",
                    "title": "Zoom Box",
                }).append($('<i>', {class: "fa fa-search-plus"})),
                $('<button>', {
                    id: "select-tool",
                    type: "button",
                    class: "btn btn-circle btn-sm opener-right active is-closed",
                    "data-toggle": "tooltip",
                    "data-placement": "left",
                    "data-container": "body",
                    "title": "Select Area",
                }).append($('<i>', {class: "fa fa-pencil-square-o"})), //  fg-white
                $('<button>', {
                    id: "hand-draw-tool",
                    type: "button",
                    class: "btn btn-circle btn-sm opener-right active is-closed",
                    "data-toggle": "tooltip",
                    "data-placement": "left",
                    "data-container": "body",
                    "title": "Draw Area",
                }).append($('<i>', {class: "fa fa-pencil"})), //  fg-white
                $('<button>', {
                    id: "pan-tool",
                    type: "button",
                    class: "btn btn-circle btn-sm opener-right active is-open",
                    "data-toggle": "tooltip",
                    "data-placement": "left",
                    "data-container": "body",
                    "title": "Pan",
                }).append($('<i>', {class: "fa fa-hand-paper-o"})), //  fg-white
                $('<button>', {
                    id: "eraser-tool",
                    type: "button",
                    class: "btn btn-circle btn-sm opener-right active is-closed",
                    "data-toggle": "tooltip",
                    "data-placement": "left",
                    "data-container": "body",
                    "title": "Clean",
                }).append($('<i>', {class: "fa fa-eraser"})), //  fg-white
                $('<button>', {
                    id: "shapefile-uploader-tool",
                    type: "button",
                    class: "btn btn-circle btn-sm opener-right active is-closed",
                    "data-toggle": "tooltip",
                    "data-placement": "left",
                    "data-container": "body",
                    "data-toggle": "modal",
                    "data-target": "#shapefileModal",
                    "title": "Upload Shapefile",
                }).append($('<i>', {class: "fa fa-upload"})) //  fg-white
            ).appendTo(this.options.container);

            $(document).ready(function () {
                $('[data-toggle="tooltip"]').tooltip();

                $( '#eraser-tool' ).on( 'click', function() {
                    $( document ).trigger( 'removeAllPolygonsEvent' );
                } );
            });
        },
        addClickHandler: function (selector, callback) {
            this.element.find(selector)
                .off("click")
                .click(function() {
                    callback()
                });
        },
        addTool: function (icon, title) {
            this.element.append(
                $("<div>", {
                    class: "gis-icon-container",
                    "data-toggle": "tooltip",
                    "data-placement": "left",
                    "data-container": "body",
                    "title": title
                }).append(
                    $("<img>", {class: "gis-icon", src: icon})
                )
            );
        }
    })
});
