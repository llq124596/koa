class EncryptToken {
    constructor() {
        this.skey = 'abc..123'
        this.createToken = this.createToken.bind(this)
        this.decodeToken = this.decodeToken.bind(this)
        this.encrypt = this.encrypt.bind(this)
        this.decrypt = this.decrypt.bind(this)
    }

    // 使用静态方法可以直接使用类名，进行访问，不需要new对象
    createToken (userId, skey = this.skey) {
        let curTime = Date.now()
        let curTime36 = curTime.toString(36)
        return this.encrypt(`${userId},${curTime36}`, skey)
    }
    
    // 解析token，搭配redis
    decodeToken (token, skey = this.skey) { 
        try {
            let [userid, curTime36] = this.decrypt(token, skey).split(',')
            const loginTime = parseInt(curTime36, 36)
            if ((loginTime + '').length !== 13) {
                console.error(new Date().toLocaleString(), 'token不合法')
                return { userid: null, loginTime: null}
            }

            return {
                userid,loginTime
            }
        } catch (err) {
            console.error(new Date().toLocaleString(), 'token不合法')
            return {
                userid: null,
                loginTime: null
            }
        }
    }

    // 加密
    encrypt (str, skey = this.skey) {
        let strArr = Buffer.from(str + skey).toString('base64').split('')
        strArr.reverse()
        let enStr = strArr.join('').replace(/=/g, '$')
        return enStr
    }

    // 解密
    decrypt (pass, skey = this.skey) {
        let strArr = pass.replace(/\$/g, '=').split('')
        strArr.reverse()
        let str = Buffer.from(strArr.join(''), 'base64').toString().split(skey)[0]
        return str
    }

}

module.exports = new EncryptToken()