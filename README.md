# blue-retreat

Vue keep-alive popstate manage

## 简介

Vue 提供的 KeepAlive 组件存在一些使用场景上的问题，例如：A 访问 B 页面，从 B 页面后退回到 A 也页面，再重新通过 A 页面访问 B 时，Vue 的策略会直接使用之前的 B 缓存

由此衍生出我们需要做对应的处理来达到后退时清楚对应历史页面的缓存处理。

## 依赖：

```cmd
npm i blue-retreat -S
```

## 使用说明

## BlueRetreat 类

### Options

---

#### router: VueRouter

VueRouter 实例

---

#### store: Vuex

Vuex 实例

---

### prototype


类只存在两个配置，使用起来非常方便。

```javascript
// 在注册路由前使用模块
import BlueRetreat from 'blue-retreat;
import Router from 'vue-router';
import Vuex from 'vuex;

const router = new Router({
  routes:[{
    path:`page`,
    meta:{
      name:`page1`
    }
  }]
});
const store = new Vuex();
const retreat = new BlueRetreat({
  router,
  store
});
```

### 通过 BlueRetreat 的 getExcludeState 方法获取 exclude 状态

由于 KeepAlive 组件在做缓存时，会使用到页面.vue 文件中的 name 作为唯一表示，我们需要在.vue 文件中定义好 name 值，由于在 router 中获取不到页面的name，需要定义.vue 文件的 name 同时也要定义路由中的 meta.name，如上面例子所示

```html
<KeepAlive :exclude="exclude">
  <RouterView />
</KeepAlive>

<script>
  export default {
    //这里的name是唯一的，和router中的meta.name作为匹配使用
    name: `page1`,
    computed: {
      exclude() {
        //如果有自身需要排除的，可以通过这个方式concat getExcludeState
        return [
          /* 你自己的exclude */
        ].concat(retreat.getExcludeState());
      },
    },
  };
</script>
```

## 一些特殊场景的处理

场景1：A->B->C->A->C->B 存在回环处理的，第一个A缓存会被删除，后退回到第一个A后，A将会重新初始化render

场景2：A->A的这种情况不做任何处理，需要自身处理$route的变化，以及的对应业务处理
