// ignore
//@name:「直」 金牌影视
//@webSite:https://www.ghw9zwp5.com
//@version:3
//@remark:
//@codeID:
//@env:
//@isAV:0
//@order: C
//@deprecated:0
// ignore

// ignore
// 不支持导入，这里只是本地开发用于代码提示
// 如需添加通用依赖，请联系 https://t.me/uzVideoAppbot
import {
    FilterLabel,
    FilterTitle,
    VideoClass,
    VideoSubclass,
    VideoDetail,
    RepVideoClassList,
    RepVideoSubclassList,
    RepVideoList,
    RepVideoDetail,
    RepVideoPlayUrl,
    UZArgs,
    UZSubclassVideoListArgs,
} from '../core/uzVideo.js'

import {
    UZUtils,
    ProData,
    ReqResponseType,
    ReqAddressType,
    req,
    getEnv,
    setEnv,
    goToVerify,
    openWebToBindEnv,
    toast,
    kIsDesktop,
    kIsAndroid,
    kIsIOS,
    kIsWindows,
    kIsMacOS,
    kIsTV,
    kLocale,
    kAppVersion,
    formatBackData,
} from '../core/uzUtils.js'

import { cheerio, Crypto, Encrypt, JSONbig } from '../core/uz3lib.js'
// ignore


//MARK: 注意
// 直接复制该文件进行扩展开发
// 请保持以下 变量 及 函数 名称不变
// 请勿删减，可以新增

const appConfig = {
    _webSite: 'https://www.ghw9zwp5.com',
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
    headers: {
        Referer: 'https://www.ghw9zwp5.com',
        'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    },
    ignoreClassName: ['首页'],
    base64Decode: function base64Decode(text) {
        return Crypto.enc.Utf8.stringify(Crypto.enc.Base64.parse(text))
    },
    isIgnoreClassName: function isIgnoreClassName(className) {
        for (let index = 0; index < appConfig.ignoreClassName.length; index++) {
            const element = appConfig.ignoreClassName[index]
            if (className.indexOf(element) !== -1) {
                return true
            }
        }
        return false
    }
}

/**
 * 异步获取分类列表的方法。
 * @param {UZArgs} args
 * @returns {@Promise<JSON.stringify(new RepVideoClassList())>}
 */
async function getClassList(args) {
    var backData = new RepVideoClassList()
    const webUrl = args.url
    appConfig.webSite = UZUtils.removeTrailingSlash(webUrl)
    try {
        const pro = await req(webUrl, { headers: appConfig.headers })
        backData.error = pro.error
        const proData = pro.data
        if (proData) {
            let document = parse(proData)
            let allClass = document.querySelectorAll('header > div > div[class^="header__HeaderLeftBox"] a')
            let list = []
            for (let index = 0; index < allClass.length; index++) {
                const element = allClass[index]
                let isIgnore = appConfig.isIgnoreClassName(element.text)
                if (isIgnore) {
                    continue
                }
                let type_name = element.text
                let url = element.getAttribute('href') ?? ''
                if (url.length > 0 && type_name.length > 0) {
                    let videoClass = new VideoClass()
                    videoClass.hasSubclass = true
                    videoClass.type_id = url.match(/type\/(\d+)/)[1]
                    videoClass.type_name = type_name.trim()
                    list.push(videoClass)
                }
            }
            backData.data = list
        }
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
    backData.data = new VideoSubclass()
    const id = args.url
    try {
        let url = UZUtils.removeTrailingSlash(appConfig.webSite) + `/vod/show/id/${id}`
        const pro = await req(url, { headers: appConfig.headers })
        backData.error = pro.error
        let proData = pro.data
        if (proData) {
            const $ = cheerio.load(proData)
            let allFilterBox = $('.filter-box')
            allFilterBox.each((index, element) => {
                let name = $(element).find('.filter-title').text()
                let items = $(element).find('.filter-li')

                let filterTitle = new FilterTitle()
                filterTitle.name = name
                filterTitle.list = []
                filterTitle.list.push({ name: '全部', id: '' })
                items.each((index, element) => {
                    const name = $(element).text()
                    const path = $(element).attr('href')
                    const regex = new RegExp(`vod/show/id/${id}(.*)`)
                    const match = path.match(regex)
                    const parsStr = match ? match[1] : null
                    if (parsStr) {
                        let filterLab = new FilterLabel()
                        filterLab.name = name
                        filterLab.id = parsStr
                        filterTitle.list.push(filterLab)
                    }
                })
                backData.data.filter.push(filterTitle)
            })
        }
    } catch (error) {
        backData.error = '获取分类失败～ ' + error
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
    backData.data = []
    try {
        let pList = [args.mainClassId]
        if (args.filter.length > 0) {
            // 筛选
            for (let index = 0; index < args.filter.length; index++) {
                const element = args.filter[index]
                pList.push(element.id)
            }
        } else {
            pList.push(args.subclassId)
            for (let index = 0; index < 4; index++) {
                pList.push('')
            }
        }

        let path = pList.join('')
        const url = UZUtils.removeTrailingSlash(appConfig.webSite) + '/vod/show/id/' + path + '/page/' + args.page

        const pro = await req(url, { headers: appConfig.headers })
        backData.error = pro.error
        let proData = pro.data
        if (proData) {
            const $ = cheerio.load(proData)
            let videos = []
            let data = ''
            $('script').each((index, element) => {
                if ($(element).text().indexOf('操作成功') > -1) {
                    data = $(element)
                        .text()
                        .replace(/self\.__next_f\.push\(|\)|\\/g, '')
                }
            })
            let ids = data.match(/"vodId":\d+/gm)
            let name = data.match(/"vodName":"([^"]*)/gm)
            let pics = data.match(/"vodPic":"([^"]*)/gm)
            let remarks = data.match(/"vodRemarks":"([^"]*)/gm)

            ids.forEach((item, index) => {
                let video = {}
                video.vod_id = item.replace('"vodId":', '')
                video.vod_name = name[index].replace('"vodName":', '').replace('"', '')
                video.vod_pic = pics[index].replace('"vodPic":', '').replace('"', '')
                video.vod_remarks = remarks[index].replace('"vodRemarks":', '').replace('"', '')
                videos.push(video)
            })
            backData.data = videos
        }
    } catch (error) {
        backData.error = '获取视频列表失败～ ' + error
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
    const webUrl = UZUtils.removeTrailingSlash(appConfig.webSite) + `/detail/${args.url}`
    try {
        const pro = await req(webUrl, { headers: appConfig.headers })
        backData.error = pro.error
        const proData = pro.data
        if (proData) {
            const $ = cheerio.load(proData)
            let json = {}
            for (const script of $('script')) {
                if ($(script).text().indexOf('操作成功') > -1) {
                    json = JSON.parse(eval($(script).text().replaceAll('self.__next_f.push(', '').replaceAll(')', ''))[1].replaceAll('6:', ''))
                }
            }
            let vodJson = json[3].data.data
            let vod_content = vodJson.vodBlurb || ''
            let vod_pic = vodJson.vodPic
            let vod_name = vodJson.vodName
            // let detList = document.querySelectorAll('ewave-content__detail p.data')
            let vod_year = vodJson.vodYear
            let vod_director = vodJson.vodDirector
            let vod_actor = vodJson.vodActor
            let vod_area = vodJson.vodArea
            let vod_lang = vodJson.vodLang
            let vod_douban_score = vodJson.vodScore
            let type_name = ''

            let vod_play_url = ''
            let playDetailUrl = $('div[class^="detail__PlayBox"] > div > a').attr('href')
            const detail = await req(UZUtils.removeTrailingSlash(appConfig.webSite) + playDetailUrl, { headers: appConfig.headers })
            const detailData = detail.data
            if (detailData) {
                const $1 = cheerio.load(detailData)
                let juJiDson = {}
                for (const script of $('script')) {
                    if ($(script).text().indexOf('操作成功') > -1) {
                        juJiDson = JSON.parse(eval($(script).text().replaceAll('self.__next_f.push(', '').replaceAll(')', ''))[1].replaceAll('6:', ''))
                        let juJiInfo = juJiDson[3].data.data;
                        let vodId = juJiInfo.vodId;
                        let juJiJson = juJiInfo.episodeList;
                        for (let i = 0; i < juJiJson.length; i++) {
                            let juJi = juJiJson[i];
                            vod_play_url += juJi.name
                            vod_play_url += '$'
                            vod_play_url += '/vod/play/' + vodId + '/sid/' + juJi.nid
                            vod_play_url += '#'
                        }
                    }
                }
            }

            let detModel = new VideoDetail()
            detModel.vod_year = vod_year
            detModel.type_name = type_name
            detModel.vod_director = vod_director
            detModel.vod_actor = vod_actor
            detModel.vod_area = vod_area
            detModel.vod_lang = vod_lang
            detModel.vod_douban_score = vod_douban_score
            detModel.vod_content = vod_content
            detModel.vod_pic = vod_pic
            detModel.vod_name = vod_name
            detModel.vod_play_url = vod_play_url
            detModel.vod_id = args.url

            backData.data = detModel
        }
    } catch (e) {
        backData.error = '获取视频详情失败' + e.message
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
    const parts = args.url.match(/vod\/play\/(.*)\/sid\/(.*)/)
    const id = parts[1]
    const sid = parts[2]
    let reqUrl = `${UZUtils.removeTrailingSlash(appConfig.webSite)}/api/mw-movie/anonymous/v2/video/episode/url?clientType=3&id=${id}&nid=${sid}`
    try {
        const signKey = appConfig.base64Decode('Y2I4MDg1MjliYWU2YjZiZTQ1ZWNmYWIyOWE0ODg5YmM=')
        const dataStr = reqUrl.split('?')[1]
        const t = Date.now()
        const signStr = dataStr + `&key=${signKey}` + `&t=${t}`
        const headers = {
            'User-Agent': appConfig.headers['User-Agent'],
            deviceId: getUUID(),
            t: t,
            sign: Crypto.SHA1(Crypto.MD5(signStr).toString()).toString(),
        }

        function getUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (e) => ('x' === e ? (16 * Math.random()) | 0 : 'r&0x3' | '0x8').toString(16))
        }

        const pro = await req(reqUrl, { headers: headers })
        backData.error = pro.error
        let proData = pro.data
        if (proData) {
            let playUrl = proData.data.list[0].url
            backData.data = playUrl
            backData.headers = appConfig.headers
        }
    } catch (e) {
        UZUtils.debugLog(e)
        backData.error = e.message
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
        let searchUrl = `${UZUtils.removeTrailingSlash(appConfig.webSite)}/vod/search/${args.searchWord}`
        let pro = await req(searchUrl, { headers: appConfig.headers })
        backData.error = pro.error
        let body = pro.data
        if (body) {
            let $ = cheerio.load(body)
            let videos = []
            let data = ''
            $('script').each((index, element) => {
                if ($(element).text().indexOf('操作成功') > -1) {
                    data = $(element)
                        .text()
                        .replace(/self\.__next_f\.push\(|\)|\\/g, '')
                }
            })
            let ids = data.match(/"vodId":\d+/gm)
            let name = data.match(/"vodName":"([^"]*)/gm)
            let pics = data.match(/"vodPic":"([^"]*)/gm)
            let remarks = data.match(/"vodRemarks":"([^"]*)/gm)

            ids.forEach((item, index) => {
                let video = {}
                video.vod_id = item.replace('"vodId":', '')
                video.vod_name = name[index].replace('"vodName":', '').replace('"', '')
                video.vod_pic = pics[index].replace('"vodPic":', '').replace('"', '')
                video.vod_remarks = remarks[index].replace('"vodRemarks":', '').replace('"', '')
                videos.push(video)
            })
            backData.data = videos
        }
    } catch (e) {
        backData.error = e.message
    }
    return JSON.stringify(backData)
}
