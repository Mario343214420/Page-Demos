/**
 * vue 实例mixin ，抽象公共属性、方法 法人名称原url searching/company_search_page.html
 */
var commonMixin = {
    el: '#app',
    data: function () {
        return {
            searchType: 0,
            topSearchQuery: [
                {
                    type: 0,
                    query: '',
                    placeholder: '请输入企业名称',
                    searchUrl: CTX_ROOT + 'searching/company_search_page.html',
                    param: 'compName'
                },
                {
                    type: 1,
                    query: '',
                    placeholder: '请输入统一社会信用代码',
                    searchUrl: CTX_ROOT +'publicity/gsxx_xxgs/info_precast_pub_code.html',
                    param: 'unifiedCode'
                },
                {
                    type: 2,
                    query: '',
                    placeholder: '请输入搜索关键字',
                    searchUrl: CTX_ROOT + 'searching/article_search_page.html',
                    param: 'keywords'
                }
            ],
            robotOpened: false,
            msg: '',
            messageList: [],
            site_name:'',
            questions: [],
            knowledge: []
        }
    },
    created: function () {
        this.checkCookie();
        this._init()
        this.getSite();
        //导航数量自适应触发器（无法兼容edge以下版本）
        this.navAdaption()
        this.getQuestions()
        this.isIEBrower()
    },
    mounted: function () {
        window.addEventListener('scroll', function () {
            var scrollTop = window.scrollY || window.pageYOffset
            if (this.$refs.backTop) {
                this.$refs.backTop.style['height'] = scrollTop > 50 ? '50px' : '0'
            }
        }.bind(this))
    },
    methods: {
        setSearchType:function(searchType){
            document.cookie = "searchType="+searchType
            this.searchType = searchType
        },
        checkCookie:function(){
            if (document.cookie.includes("searchType=0")){
                this.searchType = 0
            }
            if (document.cookie.includes("searchType=1")){
                this.searchType = 1
            }
            if (document.cookie.includes("searchType=2")){
                this.searchType = 2
            }
        },
         isIEBrower:function(){
            if (window.ActiveXObject) {
                this.$notify({
                    title: '提示',
                    message: '请更换IE11或非IE浏览器,享受极致浏览体验',
                    type: 'warning',
                    duration: 4000
                })
            }
            },
        getSite: function(){
            var _self = this
            axios.get(CTX_ROOT + 'cache/getSite.do', {
                params: {siteCode: 'home_site'}
            }).then(function (resp) {
                _self.site_name  = resp.data;
            }).catch(function (err) {
                _self._gotoErrPage()
            })
        },
        //导航数量自适应（无法兼容edge以下版本浏览器）
        navAdaption: function () {
            var nav = document.getElementsByClassName('nav')
            if(null !=nav &&  nav.length>=1){
                var navList = nav[0].children
                var length = navList.length
                var line2LastEle = navList[length - 1]
                var line1LastEle
                  if (length <= 10) {
                      line1LastEle = navList[length - 1]
                      for (var i = 0; i < length;i++) {
                          navList[i].style.width = "120px"
                          navList[i].className += ' reset'
                      }
                  } else if (length === 12) {
                      line1LastEle = navList[5]
                      for (var i = 0; i < 12;i++) {
                          navList[i].style.width = "200px"
                          i>=6?navList[i].className += ' reset':''
                      }

                  } else if (length === 14) {
                      line1LastEle = navList[6]
                      for (var i = 0; i < 14;i++) {
                          navList[i].style.width = "171px"
                          i>=7?navList[i].className += ' reset':''
                      }
                  } else if (length === 16) {
                      line1LastEle = navList[7]
                      for (var i = 0; i < 16;i++) {
                          navList[i].style.width = "150px"
                          i>=8?navList[i].className += ' reset':''
                      }
                  }
                var a2 = line2LastEle.children[0]
                var a1 = line1LastEle.children[0]
                a1.className += ' reset'
                a2.className += ' reset'
            }
        },

        /**
         * 初始化方法获取token，初始化axios实例
         * @private 默认初始化，外部不用调用
         */
        _init: function () {
            this.axios_instance = axios.create({
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            this.axios_instance.interceptors.response.use(function (response) {
                return response
            }, function (error) {
                // 对响应错误做点什么
                if (error.response) {
                    // 响应时触发错误
                    if (error.response.status >= 500) { // 如果是服务器端错误则跳转至服务错误页面
                        location.href = CTX_ROOT + 'error.html'
                    }
                    if (error.response.status === 403) {
                        location.href = CTX_ROOT + 'error.html'
                    }
                    if (error.response.status === 401) {
                        location.href = CTX_ROOT + 'error.html'
                    }
                } else {
                    console.log('Error', error.message)
                }
                return Promise.reject(error)
            })
        },
        /**
         * 获取meta标签值的content
         * @param str 标签名称
         * @returns meta的值
         * @private
         */
        _getMeta: function (str) {
            var meta = document.getElementsByName(str)
            if (meta.length > 0) {
                return meta[0].content
            }
            return null
        },
        /**
         * 封装请求头部
         * @param isNormal 普通post请求
         * @returns {{'Content-Type': string}|{'Content-Type': string}}
         * @private
         */
        _requestHeaderByType: function (isNormal) {
            var headers
            if (isNormal) {
                headers = {'Content-Type': 'application/x-www-form-urlencoded'}
            } else {
                headers = {'Content-Type': 'multipart/form-data'}
            }
            var csrfHeader = this._getMeta('_csrf_header')
            var csrfToken = this._getMeta('_csrf')
            if (csrfHeader && csrfToken) {
                headers[csrfHeader] = csrfToken
            }
            return headers
        },
        /**
         * 根据key获取url的参数值
         * @param name 参数名称
         */
        getQueryString: function (name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
            var r = window.location.search.substr(1).match(reg)
            if (r != null) {
                return decodeURIComponent(r[2])
            }
            return null
        },
        /**
         * 滚动到某个区域
         * @param target 目标位置id
         */
        scrollTo: function (target) {
            var scrollPart = document.getElementById(target) // 目标节点id
            var top = scrollPart.getBoundingClientRect().top
            var pageY = window.pageYOffset
            var endPosition = top + pageY
            Velocity(document.documentElement, 'scroll', {duration: 1000, offset: endPosition})
        },
        /**
         * 跳转url
         * @param url
         */
        goTo: function (url) {
            location.href = url
        },
        /**
         * 封装get请求
         */
        getRequest: function (url, data) {
            return this.axios_instance.get(url, data)
        },
        /**
         * 封装post请求，携带token验证
         * @param url   请求地址
         * @param data  参数对象
         * @returns {promise}
         */
        postRequest: function (url, data) {
            var headers = this._requestHeaderByType(true)
            return this.axios_instance.post(url, data, {
                transformRequest: [function (data) {
                    var ret = ''
                    for (var it in data) {
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                    }
                    ret = ret.substring(0, ret.length - 1)
                    return ret
                }],
                headers: headers
            })
        },
        /**
         * formData格式post请求
         * @param url 请求路径
         * @param formData formData格式类型的参数
         * let formData = new FormData()
         * formData.append('tempName', temp.tempName)
         * formData.append('tempFile', temp.fileList[0].raw)
         * @returns {promise}
         */
        postRequestFormData: function (url, formData) {
            var headers = this._requestHeaderByType(false)
            return this.axios_instance.post(url, formData, {headers: headers})
        },
        /**
         * 返回顶部按钮
         */
        backTop: function () {
            Velocity(document.documentElement, 'scroll', {duration: 1000})
        },
        /**
         * 返回随机验证码字符串
         * @param url
         * @returns {string}
         */
        randomCaptcha: function (url) {
            return url + '?_r=' + Math.random()
        },
        /**
         * 全文搜索基本方法
         * @param item topSearchQuery对象
         */
        handleSearchBase: function (item) {
            if (item.query.length === 0) {
                window.open(item.searchUrl)
            } else {
                window.open(item.searchUrl + '?' + item.param + '=' + encodeURIComponent(item.query.trim()))
            }
        },
        parseTime: function (time, cFormat) {
            if (arguments.length === 0) {
                return null
            }
            var format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
            var date
            if (typeof time === 'object') {
                date = time
            } else {
                if (('' + time).length === 10) time = parseInt(time) * 1000
                date = new Date(time)
            }
            var formatObj = {
                y: date.getFullYear(),
                m: date.getMonth() + 1,
                d: date.getDate(),
                h: date.getHours(),
                i: date.getMinutes(),
                s: date.getSeconds(),
                a: date.getDay()
            }
            // eslint-disable-next-line
            var time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, function (result, key) {
                var value = formatObj[key]
                if (key === 'a')
                    return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
                if (result.length > 0 && value < 10) {
                    value = '0' + value
                }
                return value || 0
            })
            // eslint-disable-next-line
            return time_str
        },
        /** 机器人*/
        openRobot: function () {
            this.robotOpened = true
            if (this.messageList.length === 0) {
                this.messageList.push({
                    time: this.parseTime(new Date()),
                    value: '您好，很高兴为您服务，请问有什么可以帮助您？',
                    html: null,
                    robot: true
                })
            }
        },
        minusRobot: function () {
            this.robotOpened = false
        },
        closeRobot: function () {
            this.robotOpened = false
            this.messageList = []
        },
        sendMessage: function (q) {
            var _self = this
            var text = this.msg.trim()
            if(text.length === 0){
                text = q
            }
            if (text.length === 0) {
                this.msg = ''
                return
            }

            this.messageList.push({
                time: null,
                value: text.toString(),
                html: null,
                robot: false
            })
            this.scrollToBottom()
            // 模拟发起请求并返回不同回答
            this.getRequest("/wcm/reobot/queryAnswer.do", {
                params: {
                    keywords: text
                }
            }).then(function (data) {
                if(data.data === "nodata"){
                    _self.messageList.push({
                        time: null,
                        value: '非常抱歉，您问的问题我还不会。要不，您换个问法试一试?',
                        html: null,
                        robot: true
                    })
                }else{
                    _self.messageList.push({
                        time: null,
                        value: null,
                        html: data.data,
                        robot: true
                    })
                }
                _self.scrollToBottom()
            }).catch(function (err) {
                _self.messageList.push({
                    time: null,
                    value: '非常抱歉，您问的问题我还不会。要不，您换个问法试一试?',
                    html: null,
                    robot: true
                })
            })
            this.msg = ''
        },

        getQuestions: function() {
            var _self = this
            _self.questions = []
            _self.knowledge = []
            this.getRequest(CTX_ROOT +"wcm/reobot/queryQuestions.do", {
                params: {
                    category: "ques",
                    page: 0,
                    size: 5
                }
            }).then(function (resp) {
                if (resp.status === 200) {
                    _self.questions = resp.data
                }
            }).catch(function (err) {
            })
            this.getRequest(CTX_ROOT +"wcm/reobot/queryQuestions.do", {
                params: {
                    category: "cre",
                    page: 0,
                    size: 5
                }
            }).then(function (resp) {
                if (resp.status === 200) {
                    _self.knowledge = resp.data
                }
            }).catch(function (err) {
            })

        },
        scrollToBottom: function () {
            var scrollDom = document.getElementById('content')
            Velocity(scrollDom, 'scroll', {
                container: scrollDom,
                duration: 300,
                offset: scrollDom.scrollHeight
            })
        }
    }
}
