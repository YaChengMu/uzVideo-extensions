// ignore
//@name:[禁] 淫水机资源
//@version:5
//@webSite:https://www.xrbsp.com/api/json.php
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

//MARK: 注意
// 直接复制该文件进行扩展开发
// 请保持以下 变量 及 函数 名称不变
// 请勿删减，可以新增

const appConfig = {
    headers: {
        'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    },
    _webSite: 'https://www.xrbsp.com/api/json.php',
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
                type_name:'中文偷拍',
                type_id:20
            },
            {
                type_name:'中文无码',
                type_id:21
            },
            {
                type_name:'中文有码',
                type_id:22
            },
            {
                type_name:'中文乱伦',
                type_id:23
            },
            {
                type_name:'中文人妻',
                type_id:24
            },
            {
                type_name:'中文强奸',
                type_id:25
            },
            {
                type_name:'中文出轨',
                type_id:26
            },
            {
                type_name:'中文制服',
                type_id:27
            },
            {
                type_name:'中文群交',
                type_id:28
            },
            {
                type_name:'欧美视频',
                type_id:29
            },
            {
                type_name:'中文动画',
                type_id:30
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