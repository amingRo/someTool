// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import { Button, MenuItem, Container, Header, Menu, Main, Radio, Input, ColorPicker, InputNumber, Loading, Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';

Vue.use(Button);
Vue.use(MenuItem);
Vue.use(Container);
Vue.use(Header);
Vue.use(Menu);
Vue.use(Main);
Vue.use(Radio);
Vue.use(Input);
Vue.use(ColorPicker);
Vue.use(InputNumber);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$message = Message;

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
});
