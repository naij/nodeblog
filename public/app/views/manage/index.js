KISSY.add("app/views/manage/index", function (S, View) {
    return View.extend({
        render: function () {
            this.setViewPagelet();
        }
    });
},{
    requires:["mxext/view"]
});