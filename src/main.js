import {createApp} from 'vue'
import App from './App.vue'
import './App.scss'
import '@svgstore'
import {createPinia} from "pinia";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import {router} from "./router/index.js";
import {findMapLayer} from "./utils/layer.js";

window.Cesium = Cesium

const app = createApp(App)

app.use(router)

app.use(createPinia())
app.use(ElementPlus)

app.mount('#app')

window.findMapLayer = findMapLayer
