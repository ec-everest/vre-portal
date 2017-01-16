$(function () {
    $.widget("dock.panel", {
        options: {
            dock: undefined,
            toggleId: undefined,
            panelId: undefined,
//            panelType: "empty",
            panelTitle: "",
            panelSubtitle: "",
//            collapsible: false,
            position: "right",
        },
        
        _create: function () {
            var panel = this._buildPanel();
            
            this.toogleIdFull = '#' + this.options.toggleId;
            
            var container;
//            if (this.options.dock.find(".mCSB_container").length > 0) {
//                container = this.options.dock.find(".mCSB_container");
//            } else {
                container = this.options.dock;
//            }
            
            panel.panel.appendTo(container);
            this.panel = panel.panel;
            this.panelBody = panel.panelBody;
        },
        
//        addButton: function(buttonId, buttonContent) {
//            var buttonContainer = this.panelBody.find(".panel-btn-container");
//            if (buttonContainer.length == 0) {
//                buttonContainer = $("<div>", {class: "panel-btn-container"}).appendTo(this.panelBody);
//            }
//            var button = $("<button>", {
//                id: buttonId,
//                class: "btn btn-default panel-btn btn-circle btn-sm opener-" + this.options.position + " active is-closed",
//            }).append(buttonContent).appendTo(buttonContainer);
//            
//            return this;
//        },
        
        _buildPanel: function() {
            var panel = $("<div>", {
                id: this.options.panelId,
                class: "col-md-11 eecontainer-" + this.options.position, // panel panel-default " + this.options.panelType + "-panel 
            });
            
            if (this.options.panelType != "tab") {
                var self = this;
                
                // Close Panel row
                var closer = $('<i>', { id: 'v-closer', class: 'fa fa-times fg-ee-primary float-right cursor-pointer closer' });
                panel.append($('<div>', { class: 'row' }).append(
                    $('<div>', { class: 'col-sm-12' }).append(
                        closer
                    )
                ));
                
                closer.on('click', function() {
                    $(self.toogleIdFull).addClass('animated flip');
                    $(self.toogleIdFull).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() { $(self.toogleIdFull).removeClass('animated flip'); });
                    
                    $(self.toogleIdFull).removeClass('is-open');
                    $(self.toogleIdFull).addClass('is-closed');
                    
                    var panel = self.options.dock.find('.eecontainer-'+ self.options.position).filter(":first");
                    panel.toggle('slide', { direction: self.options.position }, 350);
                });
                
                // Title row
                panel.append($('<div>', { class: 'row' }).append(
                    $('<div>', { class: 'col-sm-12' }).append(
                        $('<div>', { class: 'form-group' }).append(
                            $('<div>', { class: 'col-sm-12' }).append(
                                $('<h3>'/*, { class: 'panel-title' }*/).text(this.options.panelTitle)
                            ).append(
                                $('<h4>'/*, { class: 'panel-title panel-subtitle' }*/).text(this.options.panelSubtitle)
                            )
                        )
                    )
                ));
                
//                panel.append(
//                    $("<div>", {class: "panel-heading"}).append(
//                        $("<h3>", {class: "panel-title"}).append(this.options.panelTitle)
//                    ).append(
//                        $("<h4>", {class: "panel-title panel-subtitle"}).append(this.options.panelSubtitle)
//                    )
//                );
            }
            
//            var panelBody = $("<div>", { class: "panel-body" }).appendTo(panel);
            var panelBody = $("<form>", { id: 'v-form', class: 'form-horizontal', 'role': 'form' }).appendTo(panel);
            
//            if (this.options.collapsible) {
//                panel.addClass("collapsible");
//                panelBody.uniqueId().addClass("collapse in");
//                /*panel.children(".panel-heading").attr({"data-toggle":"collapse", "data-target": "#" + panelBody.attr("id"), "aria-expanded": false, "aria-controls": "panelCollapse"});*/
//                panel.find(".panel-title:not(.panel-subtitle)")
//                    .addClass("panel-collapser")
//                    .append($("<span>", {
//                        class: "glyphicon glyphicon-minus",
//                        "data-toggle": "collapse",
//                        "data-target": "#" + panelBody.attr("id"),
//                        "aria-expanded": false,
//                        "aria-controls": "panelCollapse"
//                    }).hover(function() {
//                            $(this).parents(".collapsible").addClass("hovered");
//                        }, function() {
//                            $(this).parents(".collapsible").removeClass("hovered");
//                        })
//                        .click(function() {
//                            if (panelBody.hasClass("in")) {
//                                $(this).removeClass("glyphicon glyphicon-minus");
//                                $(this).addClass("glyphicon glyphicon-modal-window");
//                            } else {
//                                $(this).removeClass("glyphicon glyphicon-modal-window");
//                                $(this).addClass("glyphicon glyphicon-minus");
//                            }
//                        }));
//            }

            return {panel: panel, panelBody: panelBody};
        },
        
        
        // Add a row to the panel body
        _addRow: function (html) {
            $("<div>", { class: 'row' }).append(
                $("<div>", { class: 'col-sm-12' }).append(
                    $("<div>", { class: 'form-group' }).append(
                        html
                    )
                )
            ).appendTo(this.panelBody);
        },
    })
});