KISSY.add("app/views/pages/tags/tags",function(a,t,e,i,s,l){l.all;return function(a){return a.prototype.template='<div bx-tmpl="tag" bx-datakey="tag,list"> {{#tag}} <div class="wrap-hd clearfix"> <div class=title-bar> <h2 class=title>\u6807\u7b7e\u201c{{tag}}\u201d\u7684\u6587\u7ae0\u5217\u8868</h2> </div> </div> <ul class=article-list bx-name="code_prettify" bx-path="components/code_prettify/"> {{#list}} <li class=list-item> <div class=hd> <h3 class=title> <a href="#!/pages/kiwiobject/article_detail?id={{_id}}">{{title}}</a> </h3> <div class=meta> <span class=date>{{publishDate}}</span> <span class=divide></span> <a class=tag href="#!/pages/tags/tags?tag={{tag}}">{{tag}}</a> </div> </div> <div class="bd markdown-body"> {{{content}}} </div> <div class=ft> <a href="#!/pages/{{type}}/article_detail?id={{_id}}" class=continue-reading>Read more \u2192</a> </div> </li> {{/list}} </ul> {{/tag}} {{^tag}} <div class="wrap-hd clearfix"> <div class=title-bar> <h2 class=title>\u6807\u7b7e</h2> </div> </div> <div class=tag-list> <ul class=clearfix> {{#list}} <li> <a href="#!/pages/tags/tags?tag={{tag}}"> <span class=count>{{count}}</span> {{tag}} </a> </li> {{/list}} </ul> </div> {{/tag}} </div>',a}(t.extend({locationChange:function(){this.render()},render:function(){var a=this,t=a.location,i=t.params,s=i.tag;a.manage(s?e.fetchAll([{name:"article_list_by_tag",urlParams:{tag:s}}],function(t,e){for(var i=e.get("data"),l=0;l<i.length;l++)i[l].content=i[l].content.replace(/<[^>]+>/g,""),i[l].content=i[l].content.substring(0,300)+" ... ...";a.setViewPagelet({tag:s,list:i})}):e.fetchAll([{name:"tag_list"}],function(t,e){var i=e.get("data");a.setViewPagelet({tag:"",list:i})}))}}))},{requires:["mxext/view","app/models/modelmanager","magix/vom","magix/router","node","app/util/util"]});