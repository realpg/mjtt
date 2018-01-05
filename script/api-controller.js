//获取主播详细信息
function getAnchorDetail(anchor_id){
    var param={
        anchor_id:anchor_id
    }
    anchor(param,function(data){
        // console.log("anchor is :"+JSON.stringify(data))
        if(data){
            var title=data.nickname+"-美景听听"
            $("title").html(title);
            // data.description="在美国混迹多年的旅游达人\n" +
            //     "        留学、租房不用愁，听老马给你解说美国当地人文趣事趣事趣事趣事趣事趣事趣事趣事留学、\n" +
            //     "        租房不用愁，听老马给你解说美国当地人文趣事趣事趣事趣事趣事趣事趣事趣事留学、\n" +
            //     "        租房不用愁，听老马给你解说美国。"                    //用于测试
            introduction_all=data.description
            if(data.description.length>0){
                data.description=showDescription(data.description)  //对主播简介做数据处理
                data.more=introduction_all!=data.description?true:false  //判断是否显示“显示更多”按钮
            }
            else{
                data.more=false
            }
            // console.log("anchor new is :"+JSON.stringify(data))
            var interText = doT.template($("#anchor_detail_content_template").text())
            $("#anchor_detail_content").html(interText(data))
        }
        else{

        }
        toast.hide();
    },function(){
        toast.hide();
        openDialog("请求失败",['确定'],function(ret){
            console.log(ret)
            return
        })
    })
}
//主播下所有可用的专辑列表
function getAnchorAllAlbum(anchor_id){
    var param={
        anchor_id:anchor_id
    }
    album(param,function(datas){
        // console.log("album is :"+JSON.stringify(datas))
        if(datas.count>0){
            var data=datas.results
            for(var i=0;i<data.length;i++){
                data[i].play_times=handleData(data[i].play_times)
                var interText = doT.template($("#anchor_special_template").text())
                $("#anchor_special").append(interText(data[i]))
            }
            var interText = doT.template($("#anchor_special_count_template").text())
            $("#anchor_special_count").html(interText("专辑（"+datas.count+"）"))
        }
        else{
            var interText = doT.template($("#anchor_special_count_template").text())
            $("#anchor_special_count").html(interText("专辑"))
            $("#anchor_special").html(nothing("暂时还没有上传专辑"))
        }
        toast.hide();
    },function(){
        toast.hide();
        openDialog("请求失败",['确定'],function(ret){
            console.log(ret)
            return
        })
    })
}
//主播下所有可用的节目列表（前10）
function getAnchorAllProgram(anchor_id){
    var param={
        anchor_id:anchor_id
    }
    program(param,function(datas){
        // console.log("album is :"+JSON.stringify(datas))
        if(datas.count>0){
            var data=datas.results
            var length
            if(data.length>=10){
                length=10
            }
            else{
                length=data.length
            }
            for(var i=0;i<length;i++){
                data[i].index=i;
                data[i].play_times=handleData(data[i].play_times);
                var interText = doT.template($("#anchor_program_template").text());
                $("#anchor_program").append(interText(data[i]));
            }
        }
        else{
            $("#anchor_program").html(nothing("暂时还没有上传节目"))
        }
        toast.hide();
    },function(){
        toast.hide();
        openDialog("请求失败",['确定'],function(ret){
            console.log(ret)
            return
        })
    })
}
//获取专辑详细信息
function getAlbumDetail(album_id){
    var param={
        album_id:album_id
    }
    getAlbumById(param,function(data){
        // console.log("albumDetail is :"+JSON.stringify(data))
        if(data){
            var title=data.name+"-美景听听"
            $("title").html(title);
            // data.description="在美国混迹多年的旅游达人\n" +
            //     "        留学、租房不用愁，听老马给你解说美国当地人文趣事趣事趣事趣事趣事趣事趣事趣事留学、\n" +
            //     "        租房不用愁，听老马给你解说美国当地人文趣事趣事趣事趣事趣事趣事趣事趣事留学、\n" +
            //     "        租房不用愁，听老马给你解说美国。"                    //用于测试
            introduction_all=data.description
            if(data.description.length>0){
                data.description=showDescription(data.description)  //对主播简介做数据处理
                data.more=introduction_all!=data.description?true:false  //判断是否显示“显示更多”按钮
            }
            else{
                data.more=false
            }
            data.play_times=handleData(data.play_times)
            // console.log("anchor new is :"+JSON.stringify(data))
            var interText = doT.template($("#album_detail_content_template").text())
            $("#album_detail_content").html(interText(data))
            var program={
                album_id:data.id,
                count:data.program_total,
                program:data.program,
                length:data.program.length,
                more:true
            }
            getAllProgramByAlbum(program)
            getMoreProgram(data.category.id)
        }
        else{

        }
        toast.hide();
    },function(){
        toast.hide();
        openDialog("请求失败",['确定'],function(ret){
            console.log(ret)
            return
        })
    })
}
//专辑页的节目列表
function getAllProgramByAlbum(data){
    // console.log("getAllProgramByAlbum data is : "+JSON.stringify(data))
    if(data.program){
        for(var i=0;i<data.program.length;i++){
            data.program[i].play_times=handleData(data.program[i].play_times);
        }
    }
    else{
        data.program=nothing("暂时还没有上传节目")
    }
    var interText = doT.template($("#album_program_lists_template").text())
    $("#album_program_lists").html(interText(data))
}
//点击加载更多
function showMoreProgramLists(album_id){
    var param={
        album_id:album_id
    }
    getAllProgram(param,function(datas){
        // console.log("getAllProgram datas is : "+JSON.stringify(datas))
        var program={
            album_id:album_id,
            count:datas.count,
            program:datas.results,
            length:datas.results.length,
            more:false
        }
        getAllProgramByAlbum(program)
    },function(){
        toast.hide();
        openDialog("请求失败",['确定'],function(ret){
            console.log(ret)
            return
        })
    })
}
//获取相关专辑+换一换
function getMoreProgram(category_id){
    var param={
        category_id:category_id
    }
    getMorecategory(param,function(datas){
        console.log("getMorecategory is : "+JSON.stringify(datas))
        if(datas.count>0){
            $("#category_program_lists").html("")

            var data=datas.results
            if(datas.count>=6){
                var str="<span onclick=\"getMoreProgram("+category_id+")\">\n" +
                    "        换一批\n" +
                    "        <img src=\"./image/replace.png\" />\n" +
                    "    </span>";
                $("#category_program_button").html(str);
            }
            else{
                $("#category_program_button").html("");
            }

            for(var i=0;i<data.length;i++){
                data[i].index=i;
                data[i].play_times=handleData(data[i].play_times);
                var interText = doT.template($("#category_program_lists_template").text());
                $("#category_program_lists").append(interText(data[i]));
            }
        }
        else{
            $("#anchor_program").html(nothing("暂时没有相关专辑"))
        }
        toast.hide();
    },function(){
        toast.hide();
        openDialog("请求失败",['确定'],function(ret){
            console.log(ret)
            return
        })
    })
}