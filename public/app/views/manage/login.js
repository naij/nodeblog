KISSY.add("app/views/manage/login", function (S, View, MM) {
    return View.extend({
        render: function () {
            var me = this;

            me.manage(MM.fetchAll([{
                name: "login_msg"
            }], function (errs, MesModel) {
                var data = MesModel.get('data');

                me.setViewPagelet({
                    admin: data.admin,
                    error: data.error
                });
            }));
        },
        'submit<click>': function (e) {
            e.halt();
            var me = this;
            var formData = S.unparam( S.IO.serialize('#loginForm'));

            me.manage(MM.fetchAll([{
                name: "login",
                postParams: formData
            }], function (errs, MesModel) {
                
            }));
        }
    });
},{
    requires:["mxext/view", 'app/models/modelmanager']
});