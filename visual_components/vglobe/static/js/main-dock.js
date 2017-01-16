$(function () {
    $.widget("dock.mainDock", $.earthserver.dock, {
        options: {
            position: "right",
            toggleId: undefined,
            toggleIcon: "fa fa-map",
            projections: true,
        },

        /* Initializes the main dock and by default creates the projections, the coverages and the query terminal panels */
        _create: function () {
            this._super({
                toggleId: this.options.toggleId,
                position: this.options.position,
            });

            this.dockToggleIconWrapper.append(
                $("<span>", {
                    class: this.options.toggleIcon, // + " dock-toggle-icon",
                })
            );

            if(this.options.projections) {
                this.addProjectionSelectPanel();
            }
        },

        addProjectionSelectPanel: function () {
            this.projectionSelectPanel = $("<div>").selectPanel({
                dock: this.dock,
                panelId: "projection-selector",
                toggleId: this.options.toggleId,
                panelTitle: "Projections",
                dropdownId: "projectionDropdown",
                position: this.options.position
            }).selectPanel("instance");

            var self = this;
            $.each(projectionNames, function (index, projection) {
                if (index == 0) {
                    self.projectionSelectPanel.setButtonContent(projection);
                }
                self.projectionSelectPanel.addSelectOption(projection.replace(/ /g, '').toLowerCase(), projection);
            });
            return this;
        },
        getProjectionSelectPanel: function() {
            return this.projectionSelectPanel;
        },
    })
});
