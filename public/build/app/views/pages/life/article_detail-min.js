KISSY.add("app/views/pages/life/article_detail",function(e,a,i,t,n,l){l.all;return a.extend({locationChange:function(){this.render()},render:function(){var e=this,a=e.location,t=a.params,n=t.id;e.manage(i.fetchAll([{name:"article_detail",urlParams:{id:n}}],function(a,i){var t=i.get("data");e.setViewPagelet({list:t,aid:n})}))}})},{requires:["mxext/view","app/models/modelmanager","magix/vom","magix/router","node","app/util/util"]});