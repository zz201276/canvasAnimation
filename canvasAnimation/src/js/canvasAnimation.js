/**  
 * @param CA canvas序列帧动画插件
 * @play 开始播放
 * @pause 暂停播放
 * @frameI 返回当前帧
 * @urllt 图片前半段 ./src/images/x
 * @suffix 图片后缀 .jpg|.png
 * @MaxL 最大帧数
 * @el canvas Id(只接受ID)
 * @dpr 像素比(决定清晰度)
 * @positer 是否提前用封面占位(默认第一帧) | Boolean
 * @positerUrl 封面地址(接受一个URL字符串)
 * @loop 是否循环 | Boolean
 * @frame 每秒多少帧
 * @replayLoopFrom 第二次从第多少帧开始循环
 * @replayLoopTo 循环第多少帧从新循环
*/
//虽然还有一些地方可以优化，但是我懒得写┗( ▔, ▔ )┛
class CA {
    constructor(option) {
        this.option = option;
        this.imgArr = [];
        let canvas = document.getElementById(this.option.el);
        this.xtc = canvas.getContext('2d');
        this.CW;
        this.CH;
        this.creatImgList()
        this.fmer;
        this.frameIndex = 0;
        this.framePlaying=false
    }
    creatImgList() {
        let THAT = this;
        (function () {
            for (let i = 1; i < THAT.option.MaxL+1; i++) {
                let img = new Image();
                img.onload = function () {
                    THAT.imgArr[i - 1] = img; // 有可能图片加载有快有满慢，所以用角标存
                    img.setAttribute("crossOrigin", 'anonymous');
                    if (i === 1) {
                        THAT.CW = img.width * THAT.option.dpr;
                        THAT.CH = img.height * THAT.option.dpr;
                        canvas.width = THAT.CW;
                        canvas.height = THAT.CH;
                        THAT.onRady()
                    }
                };
                img.src = THAT.option.urllt + i + THAT.option.suffix;
            }
        })()
    }
    onRady() {
        let THAT = this;
        this.xtc.fillRect(0, 0, this.CW, this.CH);
        this.xtc.save();
        let ia = new Image();
        ia.onload = function () {
            THAT.xtc.drawImage(ia, 0, 0, THAT.CW, THAT.CH);
        };
        if (this.option.positer) ia.src = this.option.positerUrl;
        else this.xtc.drawImage(this.imgArr[0], 0, 0, THAT.CW, THAT.CH);
    }
    play() {
        
        if (this.framePlaying) return;
        this.framePlaying=true;
        this.fmer = setInterval(() => {
            this.frameIndex++;
            this.xtc.clearRect(0, 0, this.CW, this.CH);
            this.xtc.drawImage(this.imgArr[this.frameIndex], 0, 0, this.CW, this.CH);
            let RLT=0;
            if (this.option.replayLoopTo){
                RLT = this.option.replayLoopTo
            }else{
                RLT = this.imgArr.length - 1
            }
            if (this.option.loop && this.frameIndex == RLT) {
                clearInterval(this.fmer)
                if (this.option.replayLoopFrom){
                    this.frameIndex = this.option.replayLoopFrom;
                }else{
                    this.frameIndex=0
                }
                console.log(this.frameIndex);
                this.framePlaying=false;
                this.play()
            } else if (this.frameIndex == RLT) {
                clearInterval(this.fmer)
                this.framePlaying=false;
                this.frameIndex = 0
            }
        }, 1000 / this.option.frame)
    }
    pause() {
        this.framePlaying = false;
        clearInterval(this.fmer)
    }
    frameI(){
        return this.frameIndex
    }
}

let CALOOP = new CA({
    urllt: './src/images/x',
    suffix: '.jpg',
    MaxL: 121,
    el: 'canvas',
    dpr: .5,
    positer: true,
    positerUrl: './src/images/x20.jpg',
    loop: true,
    frame: 23,
    replayLoopFrom: 50,
    replayLoopTo:70
})
document.querySelector('.play').onclick = function () {
    CALOOP.play(CALOOP.frameI());
}
document.querySelector('.pause').onclick = function () {
    CALOOP.pause();
}