KISSY.add("app/views/manage/picture/list",function(e,a,t,n,r,i,d,o){var m=i.all;return a.extend({init:function(){var e=this;e.on("destroy",function(){var a=e.getManaged("calendar");a.destructor()})},locationChange:function(){this.render()},render:function(){var a=this,n=a.location,r=e.clone(n.params),i=r.startTime,o=r.endTime;i&&o?(i=d.dateParse(i),o=d.dateParse(o)):(i=d.dateRecent(-6),o=d.dateRecent(0)),a.manage("startTime",i),a.manage("endTime",o),a.manage(t.fetchAll([{name:"picture_list",urlParams:{startTime:i,endTime:o}}],function(e,t){var n=t.get("data");a.setViewPagelet({list:n.list,startTime:d.dateFormat(i),endTime:d.dateFormat(o),pathPrefix:n.pathPrefix},function(){a.components()})}))},components:function(){var e=this,a=(e.getManaged("pagelet"),e.getManaged("startTime")),t=e.getManaged("endTime"),n=new o({maxDate:new Date,trigger:"#J_calendar",align:{points:["br","tr"],offset:[0,0]},pages:2,rangeSelect:!0,popup:!0,triggerType:["click"],range:{start:a,end:t},autoRender:!1});n.on("rangeSelect",function(a){n.hide();var t=o.Date.format(a.start,"yyyy-mm-dd"),r=o.Date.format(a.end,"yyyy-mm-dd");e.navigate("startTime="+t+"&endTime="+r)}),e.manage("calendar",n)},"add<click>":function(e){e.halt();var a=this,t=m("#"+e.currentId).parent(".toolbar").offset().top,n=d.getDefaultDialogConfig({width:620,top:t}),r="app/views/manage/picture/add",i={callback:function(){a.render()}};d.showDialog(n,r,i)}})},{requires:["mxext/view","app/models/modelmanager","magix/vom","magix/router","node","app/util/util","brix/gallery/calendar/index"]});