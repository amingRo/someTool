<template>
  <div class="menu">
    <el-container>
      <el-header>
        <el-menu
          :default-active="activeIndex1"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          text-color="#666666"
          active-text-color="#409EFF">
          <el-menu-item
            index="1"
            class="fen">
            <img :src="activeIndex1==='1'?icon.pointSelected:icon.point">
            描点</el-menu-item>
          <el-menu-item
            index="2"
            class="fen">
            <img :src="activeIndex1==='2'?icon.lineSelected:icon.line">
            画线</el-menu-item>
          <el-menu-item
            index="3"
            class="fen">
            <img :src="activeIndex1==='3'?icon.frameSelected:icon.frame">
            画框</el-menu-item>
        </el-menu>
      </el-header>
      <el-container>
        <el-main>
          <p class="inputData">
            <span>
              <span>描点坐标：</span>
              <el-radio
                v-model="dataType"
                label="str">字符串</el-radio>
              <el-radio
                v-model="dataType"
                label="num">数字</el-radio>
              <el-button
                v-show="dataType === 'num'"
                @click="addPoint"
                size="mini"
                type="primary"
                class="addPoint">新增坐标</el-button>
            </span>
          </p>
          <div class="childCo">
            <el-input
              v-if="dataType==='str'"
              class="usefulData"
              :placeholder='placeHoledr'
              type="textarea"
              :rows="4"
              v-model="pointStr"
            ></el-input>
            <div
              v-else
              class="usefulData">
              <p
                class="pointCon"
                v-for="(point,index) in pointData"
                :key="index">
              <el-input :value="point.x">
                <template slot="prepend">X</template>
              </el-input>
              <el-input :value="point.y">
                <template slot="prepend">Y</template>
              </el-input>
              </p>
            </div>
          </div>
          <p class="inputData">
            <span>
              <span>图片数据：</span>
              <el-radio
                v-model="imgType"
                label="base64">Base64</el-radio>
              <el-radio
                v-model="imgType"
                label="file">上传图片</el-radio>
            </span>
          </p>
          <div class="childCo">
            <el-input
              v-if="imgType==='base64'"
              class="usefulData"
              placeholder='base64数据'
              type="textarea"
              :rows="4"
              v-model="imgBase64"
            ></el-input>
            <div
              v-else
              class="usefulData">
              <input
                type="file"
                @change="saveImg($event.target.files)"
                accept="image/*">
            </div>
          </div>
          <p class="inputData">
            <span>
              <span>生成图片</span>
            </span>
          </p>
          <div class="imgContainer">
            <img :src="imgData">
          </div>
          <div class="buttonContainer">
            <p class="inputData2">
              <span>画笔颜色:</span>
              <el-color-picker v-model="penColor"></el-color-picker>
            </p>
            <p class="inputData2">
              <span>画笔粗细:（单位：像素）
                <el-input-number
                  v-model="penWidth"
                  size="small"
                  :min="1"
                  :max="5">
                </el-input-number>
              </span>
            </p>
            <p>
              <el-button>下载图片</el-button>
            <el-button
              type="primary"
              @click="drawBegin">开始绘制</el-button>
            </p>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import frame from '@/assets/frame.png';
import frameSelected from '@/assets/frameSelected.png';
import line from '@/assets/line.png';
import lineSelected from '@/assets/lineSelected.png';
import point from '@/assets/point.png';
import pointSelected from '@/assets/pointSelected.png';

export default {
  name: 'HelloWorld',
  data() {
    return {
      activeIndex1: '1', // 当前的绘制模式
      icon: { // 头部选项卡icon
        frame,
        frameSelected,
        line,
        lineSelected,
        point,
        pointSelected
      },
      imgData: '', // 生成的图片
      placeHoledr: '"x1,y1,x2,y2,x3,y3,x4,y4..."',
      dataType: 'str', // 数据输入类型
      imgType: 'base64', // 图片类型
      pointData: [{ x: '', y: '' }], // 点坐标数据
      pointStr: '', // 点坐标数据
      imgBase64: '', // 图片的base64
      img: null, // 上传的图片数据
      penColor: 'red', // 画笔颜色
      penWidth: 1// 画笔粗细
    };
  },
  methods: {
    /**
     * 点击头部绘制模式选项卡.
     * @param {*} index - 不同模式的索引值.
     * @returns.
     */
    handleSelect(index) {
      this.activeIndex1 = index;
      if (index === '2') {
        if (this.pointData.length > 2) {
          this.pointData.splice(2, this.pointData.length - 2);
        }
      }
    },
    /**
     * 图片上传成功后保存图片数据.
     * @param {*} data - 图片数据.
     * @returns.
     */
    saveImg(data) {
      this.img = data;
    },
    /**
     * 增加数据录入框.
     * @param.
     * @returns.
     */
    addPoint() {
      if (this.activeIndex1 === '2') {
        if (this.pointData.length < 2) {
          this.pointData.push({ x: '', y: '' });
        } else {
          this.$message.warning('画线最多输入2个点！');
        }
      } else if (this.pointData.length < 4) {
        this.pointData.push({ x: '', y: '' });
      } else {
        this.$message.warning('最多输入4个点！');
      }
    },
    /**
     * 开始绘制.
     * @param {*} index - 不同模式的索引值.
     * @returns.
     */
    drawBegin() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      let pointData = [];
      if (this.dataType === 'str') {
        pointData = this.pointStr.split(',');
      } else {
        this.pointData.forEach((value) => {
          pointData.push(value.x);
          pointData.push(value.y);
        });
      }
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        pointData.forEach((value, index) => {
          if (this.activeIndex1 === '1') {
            if (index % 2 === 0) {
              ctx.beginPath();
              ctx.arc(Number(pointData[index]), Number(pointData[index + 1]), 5, 0, 2 * Math.PI, true);
              ctx.fillStyle = 'red';
              ctx.fill();
            }
          } else if (this.activeIndex1 === '2') {
            if (index % 4 === 0) {
              ctx.beginPath();
              ctx.strokeStyle = 'red';
              ctx.lineWidth = 5;
              ctx.moveTo(pointData[index], pointData[index + 1]);
              ctx.lineTo(pointData[index + 2], pointData[index + 3]);
              ctx.closePath();
              ctx.stroke();
            }
          } else if (this.activeIndex1 === '3') {
            if (index % 4 === 0) {
              ctx.beginPath();
              ctx.strokeStyle = 'red';
              ctx.lineWidth = 5;
              ctx.moveTo(pointData[index], pointData[index + 1]);
              ctx.lineTo(pointData[index + 2], pointData[index + 3]);
              ctx.closePath();
              ctx.stroke();
            }
          }
        });
        this.imgData = canvas.toDataURL('image/png', 1);
        // this.$refs.imgContainer.innerHTML = `<img src=${canvas.toDataURL('image/png', 1)}>`;
      };

      if (this.imgType === 'base64') {
        img.src = this.imgBase64;
      } else {
        img.src = URL.createObjectURL(this.img[0]);
      }
    },
  },
};
</script>

<style scoped>
.menu{
  width: 1000px;
  padding: 20px 0;
  margin: 20px auto;
  background: #fff;
  height: 100%;
}
.fen{
  font-size: 24px;
}
.fen img{
  width: 30px;
  height: 30px;
}
.inputData{
  text-align: left;
  line-height: 30px;
  margin: 10px 0px;
}
.inputData2{
  display: flex;
  justify-content: flex-start;
  width: 90%;
  line-height: 50px;
}
.childCo{
  height: 100px;
  background: #F9F9FA;
}
.imgContainer{
  height: 260px;
  width: 470px;
  float: left;
  background: #F9F9FA;
  overflow: scroll;
}
.buttonContainer{
  height: 260px;
  width: 470px;
  float: left;
  display: inline-flex;
  justify-content: flex-end;
  align-items: flex-end;
  flex-direction: column;
}
.usefulData{
  text-align: left;
}
.addPoint{
  margin-left: 20px;
}
.pointCon{
  width: 200px;
  float: left;
  margin: 7px 15px;
}
</style>
<style>
.el-textarea__inner{
  background: #F9F9FA;
}
.el-main{
  padding:30px;
}
.el-menu .el-menu--horizontal{
  border-bottom:2px;
}
.el-menu--horizontal>.el-menu-item.is-active{
  border-bottom:4px solid #409EFF;
}
</style>
