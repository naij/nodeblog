KISSY.add("app/views/util/confirm",function(n,e){return e.extend({init:function(n){this.manage("data",n)},render:function(){var n=this,e=n.getManaged("data");n.setViewPagelet({confirmTitle:e.confirmTitle,confirmContent:e.confirmContent})},"confirm<click>":function(){var n=this,e=n.getManaged("data"),t=e.confirmFn;t&&t()},"cancel<click>":function(){var n=this,e=n.getManaged("data"),t=e.cancelFn;t&&t()}})},{requires:["mxext/view","app/models/modelmanager"]});