KISSY.add("app/views/header", function (S, View, MM) {
    return View.extend({
        render: function () {
            var self = this;
            self.setViewPagelet();
        }
    });
}, {
    requires: ["mxext/view", "app/models/modelmanager"]
});