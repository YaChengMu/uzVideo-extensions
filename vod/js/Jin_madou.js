// ignore
//@name:[禁] 麻豆
//@version:2
//@webSite:https://madou.club
//@remark:需海外IP
//@isAV:1
//@order: E
//@noHistory:1
//@isLock:1
//@deprecated:1
// ignore
const appConfig = {
    _webSite: 'https://madou.club',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
    },
    ignoreClassName: ['首页', '其他', '热门标签', '筛选'],
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
    let webUrl = args.url
    // 如果通过首页获取分类的话，可以将对象内部的首页更新
    appConfig.webSite = UZUtils.removeTrailingSlash(webUrl)
    let backData = new RepVideoClassList()
    try {
        const pro = await req(webUrl, { headers: appConfig.headers })
        backData.error = pro.error
        let proData = pro.data
        if (proData) {
            let document = parse(proData)
            let allClass = document.querySelectorAll('.sitenav a')
            let list = []
            for (let index = 0; index < allClass.length; index++) {
                const element = allClass[index]
                let isIgnore = isIgnoreClassName(element.text)
                if (isIgnore) {
                    continue
                }
                let type_name = element.text
                let url = element.attributes['href']

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
        backData.error = '获取分类失败～' + error.message
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
    let listUrl = UZUtils.removeTrailingSlash(args.url) + '/page/' + args.page
    let backData = new RepVideoList()
    try {
        let pro = await req(listUrl, { headers: appConfig.headers })
        backData.error = pro.error
        let proData = pro.data
        if (proData) {
            let document = parse(proData)
            let allVideo = document.querySelector('.excerpts-wrapper').querySelectorAll('article')
            let videos = []
            for (let index = 0; index < allVideo.length; index++) {
                const element = allVideo[index]
                let vodUrl = element.querySelector('a')?.attributes['href'] ?? ''
                let vodPic = element.querySelector('img')?.attributes['data-src'] ?? ''
                let vodName = element.querySelector('h2')?.text ?? ''
                let vodDiJiJi = element.querySelector('.post-view')?.text ?? ''

                let videoDet = {}
                videoDet.vod_id = vodUrl
                videoDet.vod_pic = vodPic
                videoDet.vod_name = vodName
                videoDet.vod_remarks = vodDiJiJi.trim()
                videos.push(videoDet)
            }
            backData.data = videos
        }
    } catch (error) {
        backData.error = '获取列表失败～' + error.message
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
    let backData = new RepVideoDetail()
    try {
        let webUrl = args.url
        let pro = await req(webUrl, { headers: appConfig.headers })
        backData.error = pro.error
        let proData = pro.data
        if (proData) {
            let document = parse(proData)
            let vod_content = ''
            let vod_pic = document.querySelectorAll('body > script')[0].text.match(/shareimage\s+:\s+'(.+)',/)[1] ?? ''
            let vod_name = document.querySelector('.article-title')?.textContent ?? ''
            let vod_year = ''
            let vod_director = ''
            let vod_actor = ''
            let vod_area = ''
            let vod_lang = ''
            let vod_douban_score = ''
            let type_name = document.querySelector('.article-tags')?.textContent ?? ''

            let detModel = new VideoDetail()
            detModel.vod_year = vod_year
            detModel.type_name = type_name
            detModel.vod_director = vod_director
            detModel.vod_actor = vod_actor
            detModel.vod_area = vod_area
            detModel.vod_lang = vod_lang
            detModel.vod_douban_score = vod_douban_score
            detModel.vod_content = vod_content.trim()
            detModel.vod_pic = vod_pic
            detModel.vod_name = vod_name
            detModel.vod_play_url = `$${webUrl}#`
            detModel.vod_id = webUrl

            backData.data = detModel
        }
    } catch (error) {
        backData.error = '获取视频详情失败' + error.message
    }
    return JSON.stringify(backData)
}

/**
 * 获取视频的播放地址
 * @param {UZArgs} args
 * @returns {@Promise<JSON.stringify(new RepVideoPlayUrl())>}
 */
async function getVideoPlayUrl(args) {
    let backData = new RepVideoPlayUrl()
    let url = args.url
    try {
        let html = await req(url, { headers: appConfig.headers })
        backData.error = html.error
        let document = parse(html.data)

        let w = document.querySelector('.article-content iframe').getAttribute('src')
        let dash = UZUtils.getHostFromURL(w)
        let dashResp = (await req(w, { headers: appConfig.headers })).data
        let dashHtml = parse(dashResp)
        let html2 = dashHtml.querySelectorAll('body script')[5].text
        let token = html2.match(/var token = (.+);/)[1]
        let m3u8 = html2.match(/var m3u8 = (.+);/)[1]

        let play_url = dash + m3u8 + '?token=' + token

        backData.data = play_url.replace(/'|"/gm, '')
    } catch (error) {
        backData.error = error.message
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
    let url = UZUtils.removeTrailingSlash(appConfig.webSite) + `/page/${args.page}?s=${args.searchWord}`
    try {
        let pro = await req(url, { headers: appConfig.headers })
        backData.error = pro.error
        let proData = pro.data
        if (proData) {
            let document = parse(proData)
            let allVideo = document.querySelector('.excerpts-wrapper').querySelectorAll('article')
            let videos = []
            for (let index = 0; index < allVideo.length; index++) {
                const element = allVideo[index]
                let vodUrl = element.querySelector('a')?.attributes['href'] ?? ''
                let vodPic = element.querySelector('img')?.attributes['data-src'] ?? ''
                let vodName = element.querySelector('h2')?.text ?? ''
                let vodDiJiJi = element.querySelector('.post-view')?.text ?? ''

                let videoDet = {}
                videoDet.vod_id = vodUrl
                videoDet.vod_pic = vodPic
                videoDet.vod_name = vodName
                videoDet.vod_remarks = vodDiJiJi.trim()
                videos.push(videoDet)
            }
            backData.data = videos
        }
    } catch (error) {
        backData.error = e.message
    }
    return JSON.stringify(backData)
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