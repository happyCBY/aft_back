import Cookies from 'js-cookie'
const  TokenKey = 'dreamTouch'
export default{
    /**
     *ajax的封装（post）
     * @param funcUrl  请求的方法地址
     * @param argsData 入参
     * @param successFunc 成功的回调函数
     * @param errorFunc 失败的回调函数
     */
    post:function (funcUrl,argsData,successFunc) {
        let UA=navigator.userAgent;
        let TOKEN="dreamtouch";
        window.axios.post(funcUrl, {
            "args":argsData,
            "token":TOKEN,
            "deviceinfo":UA
        })
            .then(function (res) {
              Cookies.set(TokenKey, JSON.parse(localStorage.getItem("managerInfo")).token, {expires: (1/24)*2})
                successFunc(res);
            })
            .catch(function (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                    if(error.request.status==429){
                        alert('请求太多了啊');
                    }
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
                console.log(error.config);
            });
    },
  /**
   * 判断是否为空
   * 先判断是否为undefined，在判断是否为null，最后判断如果是字符串的话，是否是“”
   * 满足以上任何一种则返回true，其余情况返回false
   * @param obj
   * @returns {boolean}
   */
  isEmpty: function (obj) {
    if (obj === undefined) {
      return true;
    } else if (obj === null) {
      return true;
    } else if (typeof obj === "string") {
      if (this.trim(obj) === "") {
        return true;
      }
    }
    return false;
  }
}

