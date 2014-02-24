KISSY.add("app/views/manage/picture/add", function (S, View, MM, VOM, Router, Node, Util) {
    var $ = Node.all;

    return View.extend({
        locationChange: function (e) {
            this.render();
        },
        render: function () {
            var me = this;
            me.setViewPagelet({
                pics: []
            }, function () {
                me.components();
            });
        },
        components: function () {
            
        },
        picPreview: function (files) {
            var me = this;
            var pagelet = me.getManaged('pagelet');
            var filesLength = files.length;
            var pics = [];

            for (var i = 0; i < filesLength; i ++) {
                var file = files[i];
                var fileObj = {};

                if (file) {
                    var fileSize = 0;
                    if (file.size > 1024 * 1024) {
                        fileObj.fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
                    } else {
                        fileObj.fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
                    }
                }

                if (file.type.indexOf("image") == 0) {
                    var reader = new FileReader();
                    reader.readAsDataURL(file);

                    (function (fileObj, index) {
                        reader.onload = function (e) {
                            fileObj.filePath = e.target.result;
                            pics.push(fileObj);

                            if (index == filesLength -1) {
                                pagelet.setChunkData('pics', pics);
                            }
                        };
                    }(fileObj, i));
                }
            }
        },
        uploadFile: function (files) {
            var me = this;
            var pagelet = me.getManaged('pagelet');

            //创建FormData()对象
            var fd = new FormData();
            fd.append("author", "Shiv Kumar");
            fd.append("name", "Html 5 File API/FormData");
            //文件对象 file            
            fd.append("fileToUpload", files[0]);
            //准备使用ajax上传
            var xhr = new XMLHttpRequest();
            //进度条            
            xhr.upload.addEventListener("progress", uploadProgress, false);
            //下载
            xhr.addEventListener("load", uploadComplete, false);
            //错误信息
            xhr.addEventListener("error", uploadFailed, false);
            //取消，此功能没有做
            xhr.addEventListener("abort", uploadCanceled, false);
            //上传
            xhr.open("POST", "/manage/pictureAdd");
            //发送
            xhr.send(fd);

            function uploadProgress(evt) {
                if (evt.lengthComputable) {
                    //evt.loaded：文件上传的大小   
                    //evt.total：文件总的大小
                    var percentComplete = Math.round((evt.loaded) * 100 / evt.total);
                    //加载进度条，同时显示信息
                    pagelet.setChunkData('progress', percentComplete.toString());

                    //如果上传的结果是100时才让加载下一个文件。如果不够100会继续上传原来的文档。
                    if (percentComplete == 100) {
                        // a++;
                        // //加载下一个文档
                        // uploadFile(file[a])
                    }
                }
            }

            function uploadComplete(evt) {

            }

            function uploadFailed(evt) {

            }

            function uploadCanceled(evt) {

            }
        },
        'fileChange<change>': function (e) {
            e.halt();
            var me = this;
            var files = $('#J_upload')[0].files;

            me.picPreview(files);
        },
        'upload<click>': function (e) {
            e.halt();
            var me = this;
            var files = $('#J_upload')[0].files;

            me.uploadFile(files);
        }
    });
},{
    requires:["mxext/view", 'app/models/modelmanager', 'magix/vom', 'magix/router', 'node', 'app/util/util']
});