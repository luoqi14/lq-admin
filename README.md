# react-cli-pc
> 自适应后台管理系统页面级模板

[项目地址](http://git.ops.com/fe-group/react-cli-pc)

## Start
  编辑本地 .npmrc 文件

  ```bash
  registry=http://172.16.2.71:4873/
  sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
  ```

  然后执行

  ```bash
  git clone http://git.ops.com/fe-group/react-cli-pc
  cd react-cli-pc && npm i
  ```

## Dev
  启用开发环境 ```npm run dev```

  本地启动node服务器 ```npm start```

  如果默认端口号3000在本地已经被占用，可以使用 ```npm start --PORT xxxx``` 的形式指定特定的端口号。

## Compile
编译打包
  ```npm run compile```

## Clean
项目清理
  ```npm run clean```

## Lint
代码规范检查
  ```npm run lint```

代码规范修正
  ```npm run lint:fix```

git提交限制
  ```npm run githook```

## Coverage
代码覆盖率
  ```npm run codecov```

## Deploy
项目部署
  ```npm run deploy[:env]```

部署实际上等同于
  ```npm run lint && npm run test && npm run clean && npm run compile```


# Code Submition
代码提交前，先执行
```npm run lint:fix```
对存在语法规范错误的代码进行修复后，再push到对应的分支


