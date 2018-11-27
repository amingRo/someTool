<template>
  <div class="menu">
    <el-container>
      <el-header>
        <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
          <el-tab-pane label="描点" name="point">图片描点</el-tab-pane>
          <el-tab-pane label="画框" name="frame">画框</el-tab-pane>
          <el-tab-pane label="画线" name="line">画线</el-tab-pane>
        </el-tabs>
      </el-header>
      <el-container>
        <el-aside width="300px">
          <span class="inputData">
            <span>描点坐标：</span>
            <el-radio v-model="dataType" label="str">字符串</el-radio>
            <el-radio v-model="dataType" label="num">数字</el-radio>
          </span>
          <span class="inputData">
            <span>图片数据：</span>
            <el-radio v-model="imgType" label="img">上传图片</el-radio>
            <el-radio v-model="imgType" label="base64">base64</el-radio>
          </span>
        </el-aside>
        <el-main>
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
              <el-button @click="addPoint" class="addPoint">新增</el-button>
              <p v-for="val in pointData" :key="val.x" class="pointLine">
                <span>X:</span><el-input v-model="val.x" class="inputNum"></el-input>
                <span>Y:</span><el-input v-model="val.y" class="inputNum"></el-input>
              </p>
            </div>
          </div>
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
              <input type="file" @change="saveImg(this.files)" accept="image/*">
            </div>
          </div>
          <div class="childCo">
            <el-button type="primary" @click="drawBegin">开始绘制</el-button>
            <div ref="imgContainer">

            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      placeHoledr: '"x1,y1,x2,y2,x3,y3,x4,y4..."',
      activeName: 'point',
      dataType: 'str',
      imgType: 'base64',
      pointData: [{ x: '', y: '' }],
      pointStr: '',
      imgBase64: '',
      img: null,
    };
  },
  methods: {
    saveImg(data) {
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
  height: 30px;
  margin-bottom: 10px;
}
.usefulData{
  display: inline-block;
}
.inputData{
  margin-left: 20px;
  height: 150px;
  display: inline-block;
  width: 280px;
  text-align: left;
}
.inputNum{
  width: 100px;
}
.childCo{
  min-height: 150px;
}
.pointLine{
  display: inline-block;
  margin-right: 30px;
}
.addPonit{
  /* position: relative; */
  float: left;
}
</style>
<style>
.el-main{
  padding:0;
}
.el-header{
  margin-bottom:50px;
}
</style>
