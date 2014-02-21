KISSY.add("app/views/manage/picture/add", function (S, View, MM, VOM, Router, Node, Util) {
    var $ = Node.all;

    return View.extend({
        locationChange: function (e) {
            this.render();
        },
        render: function () {
            var me = this;
            me.setViewPagelet({
                pics: []
            }, function () {
                me.components();
            });
        },
        components: function () {
            
        },
        picPreview: function (file, index) {
            var me = this;
            var pagelet = me.getManaged('pagelet');

            if (file) {
                var fileSize = 0;
                if (file.size > 1024 * 1024) {
                    fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
                } else {
                    fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
                }
            }

            if (file.type.indexOf("image") == 0) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    pagelet.setChunkData('pics', [{picPath: e.target.result}], {renderType: 'append'});
                };
                reader.readAsDataURL(file);
            }
        },
        'fileChange<change>': function (e) {
            e.halt();
            var me = this;
            var files = $('#' + e.currentId)[0].files;

            S.each(files, function (v, k) {
                me.picPreview(v, k);
            });
        },
        'submit<click>': function (e) {
            e.halt();
            var me = this;
            var editor = me.getManaged('editor');
            editor.codemirror.save();
            var formData = S.unparam( S.IO.serialize('#addForm'));

            me.manage(MM.fetchAll([{
                name: "article_add",
                postParams: formData
            }], function (errs, MesModel) {
                me.navigate('/manage/article/list');
            }));
        }
    });
},{
    requires:["mxext/view", 'app/models/modelmanager', 'magix/vom', 'magix/router', 'node', 'app/util/util']
});