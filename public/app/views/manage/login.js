KISSY.add("app/views/manage/login", function (S, View, MM) {
    return View.extend({
        render: function () {
            var me = this;

            me.setViewPagelet();
        },
        'submit<click>': function (e) {
            e.halt();
            var me = this;
            var pagelet = me.getManaged('pagelet');
            var formData = S.unparam( S.IO.serialize('#loginForm'));

            me.manage(MM.fetchAll([{
                name: "login",
                postParams: formData
            }], function (errs, MesModel) {
                var data = MesModel.get('data');

                if (data && data.error) {
                    pagelet.setChunkData('error', data.error);
                } else {
                    me.navigate('/manage/index');
                }
            }));
        }
    });
},{
    requires:["mxext/view", 'app/models/modelmanager']
});