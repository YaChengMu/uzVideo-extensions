// ignore
//@name:[禁] 玩偶姐姐
//@version:7
//@webSite:https://hongkongdollvideo.com
//@remark:需海外IP
//@isAV:1
//@order: E
//@noHistory:1
//@isLock:1
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

const appConfig = {
    _webSite: 'https://hongkongdollvideo.com',
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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    },
    ignoreClassName: ['亚洲成人视频']
}
function isIgnoreClassName(className) {
    for (let index = 0; index < appConfig.ignoreClassName.length; index++) {
        const element = appConfig.ignoreClassName[index]
        if (className.indexOf(element) !== -1) {
            return true
        }
    }
    return false
}
/**
 * 异步获取分类列表的方法。
 * @param {UZArgs} args
 * @returns {@Promise<JSON.stringify(new RepVideoClassList())>}
 */
async function getClassList(args) {
    var backData = new RepVideoClassList()
    let webUrl = args.url
    appConfig.webSite = UZUtils.removeTrailingSlash(webUrl)
    try {
        const pro = await req(webUrl, { headers: appConfig.headers })
        backData.error = pro.error
        let proData = pro.data
        if (proData) {
            let document = parse(proData)
            let allClass = document.querySelector('.scrollbar').querySelectorAll('a')
            let list = []
            for (let index = 0; index < allClass.length; index++) {
                const element = allClass[index]
                let isIgnore = isIgnoreClassName(element.text)
                if (isIgnore) {
                    continue
                }
                let type_name = element.text
                let url = element.attributes['href']

                // url = this.combineUrl(url)
                // url = url.slice(0, -5)

                if (url.length > 0 && type_name.length > 0) {
                    let videoClass = new VideoClass()
                    videoClass.type_id = url
                    videoClass.type_name = type_name
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
    let listUrl = UZUtils.removeTrailingSlash(args.url) + '/' + args.page + '.html'
    try {
        let pro = await req(listUrl, { headers: appConfig.headers })
        backData.error = pro.error
        let proData = pro.data
        if (proData) {
            let document = parse(proData)
            let allVideo = document.querySelectorAll('.video-item')
            let videos = []
            for (let index = 0; index < allVideo.length; index++) {
                const element = allVideo[index]
                let vodUrl = element.querySelector('.thumb a')?.attributes['href'] ?? ''
                let vodPic = element.querySelector('.thumb img')?.attributes['data-src'] ?? ''
                let vodName = element.querySelector('.thumb a')?.attributes['title'] ?? ''
                let vodDiJiJi = element.querySelector('.duration')?.text ?? ''

                let videoDet = new VideoDetail()
                videoDet.vod_id = vodUrl
                videoDet.vod_pic = vodPic
                videoDet.vod_name = vodName
                videoDet.vod_remarks = vodDiJiJi

                videos.push(videoDet)
            }
            backData.data = videos
        }
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
        let webUrl = args.url
        let pro = await req(webUrl, { headers: appConfig.headers })
        backData.error = pro.error
        let proData = pro.data
        if (proData) {
            let document = parse(proData)
            let vod_content = ''
            let vod_pic = document.querySelector('meta[property="og:image"]').getAttribute('content') ?? ''
            let vod_name = document.querySelector('h1.page-title')?.text ?? ''
            // let detList = document.querySelectorAll('ewave-content__detail p.data')
            let vod_year = ''
            let vod_director = ''
            let vod_actor = ''
            let vod_area = ''
            let vod_lang = ''
            let vod_douban_score = ''
            let type_name = ''

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
            detModel.vod_play_url = '播放$' + webUrl + '#'
            detModel.vod_id = webUrl

            backData.data = detModel
        }
    } catch (error) {
        backData.error = error.toString()
    }
    return JSON.stringify(backData)
}

function xorDec(_0x3b697f, _0x37f8e7) {
    let _0x2bec78 = ''
    const _0x1f8156 = _0x37f8e7.length
    for (let _0x4b08c8 = 0; _0x4b08c8 < _0x3b697f.length; _0x4b08c8 += 2) {
        const _0x312f0e = _0x3b697f.substr(_0x4b08c8, 2),
            _0x33eb88 = String.fromCharCode(parseInt(_0x312f0e, 16)),
            _0x323ef5 = _0x37f8e7[(_0x4b08c8 / 2) % _0x1f8156]
        _0x2bec78 += String.fromCharCode(
            _0x33eb88.charCodeAt(0) ^ _0x323ef5.charCodeAt(0)
        )
    }
    return _0x2bec78
}
/**
 * 获取视频的播放地址
 * @param {UZArgs} args
 * @returns {@Promise<JSON.stringify(new RepVideoPlayUrl())>}
 */
async function getVideoPlayUrl(args) {
    var backData = new RepVideoPlayUrl()
    let reqUrl = args.url
    try {
        const pro = await req(reqUrl, { headers: appConfig.headers })
        backData.error = pro.error
        let proData = pro.data
        if (proData) {
            const $ = cheerio.load(proData)
            // const script = $('.video-player-container script').text()
            var cipherText = $("#footer-banner").next().text().match(/__PAGE__PARAMS__=(.*?);/)[1].replace('"', "").replace('"', "")

            var md5 = cipherText.slice(-32)
            var context = cipherText.substring(0, cipherText.length - 32)
            // const playConfig = JSON.parse(xorDec(context, md5)).player.param
            let playConfig = JSON.parse(xorDec(context, md5)).player
            // let video_id = reqUrl.match(/\/video\/([0-9a-f]+)\.html/)[1]
            let embedUrl = playConfig.embedUrl
            UZUtils.debugLog(embedUrl)
            // let video_arg = embedUrl.match(/.*?\/([a-f0-9]{20,})$/)[1]
            // let timestamp = video_arg.substr(-10)
            // let key = base64Encode((video_id + '-' + timestamp.toString()).split('').reverse().join('')).replaceAll('=', '')

            // let videoSrc = strDecode(playConfig.arg, key)

            // function strDecode(string, key) {
            //     string = base64Decode(string)
            //     let len = key.length
            //     let code = ''
            //     for (let i = 0; i < string.length; i++) {
            //         let k = i % len
            //         code += String.fromCharCode(string.charCodeAt(i) ^ key.charCodeAt(k))
            //     }
            //     return decodeURIComponent(base64Decode(code))
            // }
            // function base64Encode(text) {
            //     return Crypto.enc.Base64.stringify(Crypto.enc.Utf8.parse(text))
            // }
            // function base64Decode(text) {
            //     return Crypto.enc.Utf8.stringify(Crypto.enc.Base64.parse(text))
            // }
            let token=embedUrl.match(/[?&]token=([a-f0-9]+)/i)[1];
            let _0x1df1c5 = token.slice(-10)
            UZUtils.debugLog(Crypto.MD5(_0x1df1c5).toString())
            let _0x2c272d = Crypto.MD5(_0x1df1c5).toString().slice(8, 24).split('').reverse().join(''),
            _0x32366e = token.slice(0, -10)
            let _0x4049bd = xorDec(_0x32366e, _0x2c272d)
            let videoSrc = JSON.parse(_0x4049bd).stream

            backData.data = videoSrc
        }
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
    let url = `https://hongkongdollvideo.com/search/${args.searchWord}/${args.page}.html`
    try {
        let pro = await req(url, { headers: appConfig.headers })
        backData.error = pro.error
        let proData = pro.data
        if (proData) {
            let document = parse(proData)
            let allVideo = document.querySelectorAll('.video-item')
            let videos = []
            for (let index = 0; index < allVideo.length; index++) {
                const element = allVideo[index]
                let vodUrl = element.querySelector('.thumb a')?.attributes['href'] ?? ''
                let vodPic = element.querySelector('.thumb img')?.attributes['data-src'] ?? ''
                let vodName = element.querySelector('.thumb a')?.attributes['title'] ?? ''
                let vodDiJiJi = element.querySelector('.duration')?.text ?? ''

                let videoDet = new VideoDetail()
                videoDet.vod_id = vodUrl
                videoDet.vod_pic = vodPic
                videoDet.vod_name = vodName
                videoDet.vod_remarks = vodDiJiJi

                videos.push(videoDet)
            }
            backData.data = videos
        }
    } catch (error) {
        backData.error = error.toString()
    }
    return JSON.stringify(backData)
}