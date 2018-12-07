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
        <!-- <el-aside width="300px">
          <span class="inputData">
            <span>描点坐标：</span>
            <el-radio
              v-model="dataType"
              label="str">字符串</el-radio>
            <el-radio
              v-model="dataType"
              label="num">数字</el-radio>
          </span>
          <span class="inputData">
            <span>图片数据：</span>
            <el-radio
              v-model="imgType"
              label="img">上传图片</el-radio>
            <el-radio
              v-model="imgType"
              label="base64">base64</el-radio>
          </span>
        </el-aside> -->
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
                class="addPoint">新增</el-button>
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
            <el-button>下载图片</el-button>
            <el-button
              type="primary"
              @click="drawBegin">开始绘制</el-button>
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
      activeIndex1: '1',
      icon: {
        frame,
        frameSelected,
        line,
        lineSelected,
        point,
        pointSelected
      },
      imgData: '',
      placeHoledr: '"x1,y1,x2,y2,x3,y3,x4,y4..."',
      activeName: 'point',
      dataType: 'str',
      imgType: 'base64',
      fileList: [],
      pointData: [{ x: '', y: '' }],
      pointStr: '',
      imgBase64: '',
      img: null,
    };
  },
  methods: {
    handleSelect(index) {
      this.activeIndex1 = index;
    },
    saveImg(data) {
      console.log(data);
      this.img = data;
    },
    addPoint() {
      if (this.pointData.length < 4) {
        this.pointData.push({ x: '', y: '' });
      }
    },
    handleClick() {},
    drawBegin() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      let pointData = [];
      if (this.dataType === 'str') {
        pointData = this.pointStr.split(',');
      } else {
        console.log(this.pointData);
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
          if (index % 2 === 0) {
            ctx.beginPath();
            ctx.arc(Number(pointData[index]), Number(pointData[index + 1]), 5, 0, 2 * Math.PI, true);
            ctx.fillStyle = 'red';
            ctx.fill();
          }
        });
        this.$refs.imgContainer.innerHTML = `<img src=${canvas.toDataURL('image/png', 1)}>`;
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
}
.usefulData{
  text-align: left;
}
.addPoint{
  margin-left: 20px;
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
