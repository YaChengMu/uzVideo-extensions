// ignore
//@name:[禁] 玉兔资源
//@version:1
//@webSite:https://apiyutu.com/api.php/provide/vod
//@remark:
//@isAV:1
//@order: E
//@noHistory:1
//@isLock:1
// ignore
const appConfig = {
    headers: {
        'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    },
    _webSite: 'https://apiyutu.com/api.php/provide/vod',
    /**
     * 网站主页，uz 调用每个函数前都会进行赋值操作
     * 如果不想被改变 请自定义一个变量
     */
    get webSite() {
        return this._webSite
    },
    set webSite(value) {
        this._webSite = value
    },

    _uzTag: '',
    /**
     * 扩展标识，初次加载时，uz 会自动赋值，请勿修改
     * 用于读取环境变量
     */
    get uzTag() {
        return this._uzTag
    },
    set uzTag(value) {
        this._uzTag = value
    },
}

/**
 * 异步获取分类列表的方法。
 * @param {UZArgs} args
 * @returns {@Promise<JSON.stringify(new RepVideoClassList())>}
 */
async function getClassList(args) {
    var backData = new RepVideoClassList()
    try {
        let url=`${appConfig.webSite}?ac=list&pg=1&t=99`
        const res=await req(url);
        let classList=JSON.parse(res.data).class;
        classList.unshift({type_id:0,type_name:'最新'})
        backData.data = classList
    } catch (error) {
        backData.error = error.toString()
    }
    return JSON.stringify(backData)
}

/**
 * 获取二级分类列表筛选列表的方法。
 * @param {UZArgs} args
 * @returns {@Promise<JSON.stringify(new RepVideoSubclassList())>}
 */
async function getSubclassList(args) {
    var backData = new RepVideoSubclassList()
    try {
    } catch (error) {
        backData.error = error.toString()
    }
    return JSON.stringify(backData)
}

/**
 * 获取分类视频列表
 * @param {UZArgs} args
 * @returns {@Promise<JSON.stringify(new RepVideoList())>}
 */
async function getVideoList(args) {
    var backData = new RepVideoList()
    try {
        let url=`${appConfig.webSite}?ac=list&pg=${args.page}&t=${args.url}`;
        const res=await req(url);
        let list=JSON.parse(res.data).list;
        let ids=list.map(item=>item.vod_id).join(',')
        let detailRes=await req(`${appConfig.webSite}?ac=detail&ids=${ids}`)
        let detailList=JSON.parse(detailRes.data).list;
        let videos = []
        list.forEach(item=>{
            let detail=detailList.find(d=>d.vod_id==item.vod_id)
            let videoDet = new VideoDetail()
            videoDet.vod_id = item.vod_id
            videoDet.type_id = item.type_id
            videoDet.vod_name = item.vod_name
            videoDet.vod_en = item.vod_en
            videoDet.vod_pic = detail.vod_pic
            videoDet.vod_remarks = item.vod_remarks
            videoDet.vod_year = item.vod_year
            videos.push(videoDet);
        });
        backData.data = videos
    } catch (error) {
        backData.error = error.toString()
    }
    return JSON.stringify(backData)
}

/**
 * 获取二级分类视频列表 或 筛选视频列表
 * @param {UZSubclassVideoListArgs} args
 * @returns {@Promise<JSON.stringify(new RepVideoList())>}
 */
async function getSubclassVideoList(args) {
    var backData = new RepVideoList()
    try {
    } catch (error) {
        backData.error = error.toString()
    }
    return JSON.stringify(backData)
}

/**
 * 获取视频详情
 * @param {UZArgs} args
 * @returns {@Promise<JSON.stringify(new RepVideoDetail())>}
 */
async function getVideoDetail(args) {
    var backData = new RepVideoDetail()
    try {
        let url=`${appConfig.webSite}?ac=detail&ids=${args.url}`
        const res=await req(url);
        let video={};
        JSON.parse(res.data).list.forEach(item=>{
            video=item;
            return;
        })
        backData.data = video
    } catch (error) {
        backData.error = error.toString()
    }
    return JSON.stringify(backData)
}

/**
 * 获取视频的播放地址
 * @param {UZArgs} args
 * @returns {@Promise<JSON.stringify(new RepVideoPlayUrl())>}
 */
async function getVideoPlayUrl(args) {
    var backData = new RepVideoPlayUrl()
    try {
        backData.data = args.url;
    } catch (error) {
        backData.error = error.toString()
    }
    return JSON.stringify(backData)
}

/**
 * 搜索视频
 * @param {UZArgs} args
 * @returns {@Promise<JSON.stringify(new RepVideoList())>}
 */
async function searchVideo(args) {
    var backData = new RepVideoList()
    try {
        let searchUrl=`${appConfig.webSite}?ac=list&pg=${args.page}&wd=${args.searchWord}`
        let res = await req(searchUrl, {
            headers: appConfig.headers
        })
        let list=JSON.parse(res.data).list;
        let ids=list.map(item=>item.vod_id).join(',')
        let detailRes=await req(`${appConfig.webSite}?ac=detail&ids=${ids}`)
        let detailList=JSON.parse(detailRes.data).list;
        let videos = []
        list.forEach(item=>{
            let detail=detailList.find(d=>d.vod_id==item.vod_id)
            let videoDet = new VideoDetail()
            videoDet.vod_id = item.vod_id
            videoDet.type_id = item.type_id
            videoDet.vod_name = item.vod_name
            videoDet.vod_en = item.vod_en
            videoDet.vod_pic = detail.vod_pic
            videoDet.vod_remarks = item.vod_remarks
            videoDet.vod_year = item.vod_year
            videos.push(videoDet);
        });
        backData.data = videos
    } catch (error) {
        backData.error = error.toString()
    }
    return JSON.stringify(backData)
}