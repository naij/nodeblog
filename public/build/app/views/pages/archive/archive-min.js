KISSY.add("app/views/pages/archive/archive",function(e,a,i,t,n,r){r.all;return a.extend({locationChange:function(){this.render()},render:function(){var e=this;e.manage(i.fetchAll([{name:"archive"}],function(a,i){var t=i.get("data");e.setViewPagelet({list:t})}))}})},{requires:["mxext/view","app/models/modelmanager","magix/vom","magix/router","node","app/util/util"]});