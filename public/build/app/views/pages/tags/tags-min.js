KISSY.add("app/views/pages/tags/tags",function(t,e,a,n,i,l){l.all;return e.extend({locationChange:function(){this.render()},render:function(){var t=this,e=t.location,n=e.params,i=n.tag;t.manage(i?a.fetchAll([{name:"article_list_by_tag",urlParams:{tag:i}}],function(e,a){for(var n=a.get("data"),l=0;l<n.length;l++)n[l].content=n[l].content.replace(/<[^>]+>/g,""),n[l].content=n[l].content.substring(0,300)+" ... ...";t.setViewPagelet({tag:i,list:n})}):a.fetchAll([{name:"tag_list"}],function(e,a){var n=a.get("data");t.setViewPagelet({tag:"",list:n})}))}})},{requires:["mxext/view","app/models/modelmanager","magix/vom","magix/router","node","app/util/util"]});