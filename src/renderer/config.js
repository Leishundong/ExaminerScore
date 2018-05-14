var crypto = require('crypto')
export default {
    names: '2017年温州市各级机关单位考生录用公务员面试',
    times:'2017年6月3日-4日',
    judgement:0,
    judgeSystem:0,
    algorithm : 'aes-256-ctr',
    password : 'd6F3Efeq',

    s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    },
    ab2s(ab){
        var buf = new Buffer(ab.byteLength);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buf.length; ++i) buf[i] = view[i];
        return buf;
        },
    decrypt(arraybuffer){
        var decipher = crypto.createDecipher(this.algorithm,this.password);
        var dec = Buffer.concat([decipher.update(arraybuffer) , decipher.final()]);
        return dec;
        },
    encrypt(arraybuffer){
        var cipher = crypto.createCipher(this.algorithm,this.password);
        var crypted = Buffer.concat([cipher.update(arraybuffer),cipher.final()]);
        return crypted;
        },
    setname (newName) {
        this.names = newName
    },
    settime(newTime){
        this.times = newTime
    },
    setjudgement(newjudge){
        this.judgement = newjudge
    },
    setjudgeSystem(NewSystem){
        this.judgeSystem = NewSystem
    }
}