KISSY.add("app/views/manage/article/list", function (S, View, MM, VOM, Router, Node, Util) {
    var $ = Node.all;

    return View.extend({
        locationChange: function (e) {
            this.render();
        },
        render: function () {
            var me = this;
            var loc = me.location;
            var params = loc.params;
            var typeId = params.typeId || 'f2e';
            var typeList = [
                {
                    typeId: 'f2e',
                    typeName: 'f2e'
                },
                {
                    typeId: 'discovery',
                    typeName: 'discovery'
                },
                {
                    typeId: 'life',
                    typeName: 'life'
                }
            ]

            S.each(typeList, function (item) {
                if (item.typeId == typeId) {
                    item.selected = true;
                    return false;
                }
            });

            me.manage(MM.fetchAll([{
                name: "manage_article_list",
                urlParams: {
                    type: typeId
                }
            }], function (errs, MesModel) {
                var data = MesModel.get('data');

                me.setViewPagelet({
                    list: data,
                    typeList: typeList
                }, function () {
                    me.components();
                });
            }));
        },
        components: function () {
            var me = this;
            var pagelet = me.getManaged('pagelet');
            var typeDropdown = pagelet.getBrick('J_type_dropdown');
            typeDropdown.on('selected', function (ev) {
                me.navigate('typeId=' + ev.value);
            });
        },
        'del<click>': function (e) {
            e.halt();
            var me = this;
            var top = $('#' + e.currentId).parent('tr').offset().top;
            var dialogConfig = Util.getDefaultDialogConfig({
                width: 400, 
                top: top
            });
            var viewName = 'app/views/util/confirm';
            var viewOptions = {
                confirmFn: function(){
                    me.manage(MM.fetchAll([{
                        name: "article_del",
                        postParams: {
                            id: e.params.id
                        }
                    }], function(MesModel) {
                        Util.hideDialog();
                        me.render();
                    }));
                },
                cancelFn: function(){
                    Util.hideDialog();
                },
                confirmTitle: '删除文章',
                confirmContent: '您确定要删除这篇文章？'
            };
            Util.showDialog(dialogConfig, viewName, viewOptions);
        }
    });
},{
    requires:["mxext/view", 'app/models/modelmanager', 'magix/vom', 'magix/router', 'node', 'app/util/util']
});