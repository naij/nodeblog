KISSY.add("app/views/pages/life/article_list",function(e,t,n,a,i,l){l.all;return t.extend({locationChange:function(){this.render()},render:function(){var e=this;e.manage(n.fetchAll([{name:"article_list",urlParams:{type:"life"}}],function(t,n){for(var a=n.get("data"),i=0;i<a.length;i++)a[i].content=a[i].content.replace(/<[^>]+>/g,""),a[i].content=a[i].content.substring(0,300)+" ... ...";e.setViewPagelet({list:a})}))}})},{requires:["mxext/view","app/models/modelmanager","magix/vom","magix/router","node","app/util/util"]});