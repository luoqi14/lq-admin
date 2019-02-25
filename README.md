# lq-admin
> 自适应后台管理系统页面级模板

- react16 + redux + react-router4 + antd3
- 屏幕自适应
- 页面级业务组件
- webpack dllPlugin性能优化
- mock server环境配置
- eslint airbnb规范
- 集成sonarQube、countly、fundebug等
- 第三方模块按需加载
- tree shaking
- 代码分隔


[项目地址](https://github.com/luoqi14/lq-admin)

## Start
  ```bash
  git clone https://github.com/luoqi14/lq-admin
  cd lq-admin && npm i --sass_binary_site=https://npm.taobao.org/mirrors/node-sass
  ```

## Dev
  本地启动node服务器 ```npm start```

  启用开发环境 ```npm run dev```


  如果默认端口号3000在本地已经被占用，可以使用 ```npm start --PORT xxxx``` 的形式指定特定的端口号。

## Compile
开发环境编译打包
  ```npm run compile:dev```

测试环境编译打包
  ```npm run compile:qafc```

预发环境编译打包
  ```npm run compile:pre```

生产环境编译打包
  ```npm run compile:online```

## Clean
项目清理
  ```npm run clean```

## Lint
代码规范检查
  ```npm run lint```

代码规范修正
  ```npm run lint:fix```

dll加速
  ```npm run dll```


