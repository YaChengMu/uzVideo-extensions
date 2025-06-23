// ignore
//@name:[禁] 黄AV资源
//@version:5
//@webSite:https://www.pgxdy.com/api/json.php
//@remark:
//@isAV:1
//@order: E
//@type:101
//@noHistory:1
//@isLock:1

// 不支持导入，这里只是本地开发用于代码提示
// 如需添加通用依赖，请联系 https://t.me/uzVideoAppbot
import {} from '../uzVideo.js'
import {} from '../uzUtils.js'
import {} from '../uz3lib.js'
// ignore
const appConfig = {
    headers: {
        'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    },
    _webSite: 'https://www.pgxdy.com/api/json.php',
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
        backData.data=[
            {
                type_name:'最新',
                type_id:0
            },
            {
                type_name:'国产直播',
                type_id:20
            },
            {
                type_name:'明星换脸',
                type_id:21
            },
            {
                type_name:'国产门事件',
                type_id:22
            },
            {
                type_name:'无码破解',
                type_id:23
            },
            {
                type_name:'骑兵有码',
                type_id:24
            },
            {
                type_name:'名优中字',
                type_id:25
            },
            {
                type_name:'精彩剧情',
                type_id:26
            },
            {
                type_name:'角色扮演',
                type_id:27
            },
            {
                type_name:'唯美三级',
                type_id:28
            },
            {
                type_name:'重口味',
                type_id:29
            },
            {
                type_name:'卡通动画',
                type_id:30
            },
            {
                type_name:'金发幼齿',
                type_id:31
            },
            {
                type_name:'亚洲视频',
                type_id:32
            }
        ]
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
        let url=`${appConfig.webSite}?ac=list&pg=${args.page}&t=${args.url}`
        const res=await req(url);
        backData.data = JSON.parse(res.data).list
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
            video.vod_play_url=`播放$${video.vod_play_url}`
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
        backData.data = JSON.parse(res.data).list
    } catch (error) {
        backData.error = error.toString()
    }
    return JSON.stringify(backData)
}