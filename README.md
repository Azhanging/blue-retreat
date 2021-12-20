# blue-retreat

### Vue KeepAlive 后退处理

## 简介

Vue 提供的 KeepAlive 组件存在一些使用场景上的问题，例如：A 访问 B 页面，从 B 页面后退回到 A 也页面，再重新通过 A 页面访问 B 时，Vue 的策略会直接使用之前的 B 缓存

由此衍生出我们需要做对应的处理来达到后退时清楚对应历史页面的缓存处理。

## 依赖：

```cmd
npm i blue-retreat -S
```

## 使用说明

## initBlueRetreat 方法

### Options

---

#### router: VueRouter

VueRouter 实例

---

#### store: Vuex

Vuex 实例

---

类只存在两个配置，使用起来非常方便。

```javascript
// 在注册路由前使用模块
import {initBlueRetreat} from 'blue-retreat;
import Router from 'vue-router';
import Vuex from 'vuex;

const router = new Router({
  routes:[{
    path:`page`,
    meta:{
      name:`page-name`
    }
  }]
});
const store = new Vuex();

//初始化retreat
initBlueRetreat({
  router,
  store
});

```

### 通过 getExcludeState 方法获取 exclude 状态

由于 KeepAlive 组件在做缓存时，会使用到页面.vue 文件中的 name 作为唯一表示，我们需要在.vue 文件中定义好 name 值，由于在 router 中获取不到页面的 name，需要定义.vue 文件的 name 同时也要定义路由中的 meta.name，如上面例子所示

```html
<KeepAlive :exclude="exclude">
  <RouterView />
</KeepAlive>

<script>
  import { getExcludeState } from "blue-retreat";
  export default {
    //这里的name是唯一的，和router中的meta.name作为匹配使用
    name: `page-name`,
    computed: {
      exclude() {
        //如果有自身需要排除的，可以通过这个方式concat getExcludeState
        return [
          /* 你自己的exclude */
        ].concat(getExcludeState());
      },
    },
  };
</script>
```

## 一些特殊场景的处理

场景 1：A->B->C->A->C->B 存在回环处理的，第一个 A 缓存会被删除，后退回到第一个 A 后，A 将会重新初始化 render

场景 2：A->A 的这种情况不做任何处理，需要自身处理$route 的变化，以及的对应业务处理

---

## 后退传值

### page2

```javascript
  //page2
  import {setRetreatData} from 'blue-retreat;
  setRetreatData({
    someData:`data`
  });
```

### 通过后退到 page1

```javascript
  //page1
  import {getRetreatData} from 'blue-retreat;
  const retreatData = getRetreatData();
  //retreatData === {someData:`data`}
```

### 关于getRetreatData方法

getRetreatData({
  once?: boolean = true
});

如果被使用一次就会被销毁回默认值{};当然也可以跨页面获取值，可以给到具体需要使用到的页面来使用到值。