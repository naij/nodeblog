KISSY.add("app/views/header",function(e,a,i){var t=i.all;return function(e){return e.prototype.template='<div class=header> <h1 class=title><a href="/">Kiwi Blog</a></h1> <ul class="site-nav clearfix"> <li><a href="#!/pages/kiwiobject/article_list">F2E</a></li> <li><a href="#!/pages/discovery/article_list">Discovery</a></li> <li><a href="#!/pages/life/article_list">Life</a></li> <li><a href="#!/pages/about/about">About</a></li> <li><a href="#!/pages/tags/tags">Tags</a></li> <li><a href="#!/pages/archive/archive">Archive</a></li> </ul> </div>',e}(a.extend({locationChange:function(){this.render()},render:function(){function e(){var e=t(".site-nav li");e.each(function(a){var i=a.one("a").attr("href");return i=i.substring(2),e.removeClass("selected"),l&&i!=l&&i!=r[l]?void 0:(a.addClass("selected"),!1)})}var a=this,i=a.location,l=i.pathname,r={"/pages/kiwiobject/article_detail":"/pages/kiwiobject/article_list","/pages/discovery/article_detail":"/pages/discovery/article_list","/pages/life/article_detail":"/pages/life/article_list"};a.setViewPagelet({},function(){e()},function(){e()})}}))},{requires:["mxext/view","node","app/models/modelmanager"]});