KISSY.add("app/util/dialog/dialog",function(t,e,i,n){var o=t.all,d={entity:null},a=function(t){27===t.keyCode&&d.hideDialog()};return t.mix(d,{showDialog:function(o,r,l){function u(){i.remove(c),m&&m.view&&(m.unmountView(),m=null),d.entity.detach(),d.entity.destroy(),d.entity=null}var c="vf-dialog",f={mask:!0,zIndex:9998,duration:.25,easing:"easeOut",width:500,tmpl:'<vframe id="'+c+'"></vframe>',closable:!0},s=t.merge(f,o);if(s.start=s.start||{},s.end=s.end||{},s.direction){var y=t.all(s.direction.node);y=y.length>0?y:t.all("body");var g=y.offset(),h=y.outerWidth(),v=t.DOM.docWidth(),w=s.direction.value||"left";switch(w){case"left":s.start.left=-s.width,s.end.left=g.left;break;case"right":s.start.left=v,s.end.left=h+g.left-s.width}if(void 0===s.start.top&&void 0===s.end.top){var p=t.one(window).scrollTop();s.start.top=s.end.top=p+5}}var m;return d.entity&&u(),d.entity=new n(s),d.entity.on("afterRenderUI",function(){m=new e(c),i.add(m),m&&r&&(m.mountView(r,l),m.on("created",function(){var e=t.all("#"+m.view.id).parent(".dialog-overlay").outerHeight(),i=t.one(window).scrollTop(),n=t.one(window).innerHeight();!s.direction||"left"!=s.direction.value&&"right"!=s.direction.value||d.entity.userConfig.end.top+e>i+n&&(d.entity.userConfig.start.top=d.entity.userConfig.end.top=i+n-e),d.entity.show()}))}),d.entity.render(),d.entity.on("hide",function(){u()}),s.closable&&t.all(document).on("keydown",a),d.entity},hideDialog:function(e){d.entity&&(d.entity.on("hide",function(){e&&e()}),d.entity.hide(),t.all(document).detach("keydown",a))},getDefaultDialogConfig:function(t){var e={start:{top:t.top,opacity:0},end:{top:t.top,opacity:1},direction:{node:o("#content"),value:t.direction||"right"},width:t.width||600};return e}}),d},{requires:["magix/vframe","magix/vom","brix/gallery/dialog/index"]});