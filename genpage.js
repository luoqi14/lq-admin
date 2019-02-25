const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const colors = require('colors');
const readline = require('readline');

// function sleep(milliSeconds) {
//   const startTime = new Date().getTime();
//   while (new Date().getTime() < startTime + milliSeconds);
// }
// sleep(5000);

const usage = () => {
  console.log('===========================Usage=============================');
  console.log('=                                                           =');
  console.log('=         node gen pagename [template suffix:html|tpl]      =');
  console.log('=                                                           =');
  console.log('=============================================================');
};

const paths = {
  page: './src/routes/Manage/',
  templates: './templates/',
};

const setConfig = (cb) => {
  let moduleName = '';
  let pageType = 'list';
  let parameters = false;
  const PageTypeDict = {
    1: 'list',
    2: 'detail',
  };
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let question = {};
  const setPromptTitle = (() => {
    let questionIndex = -1;
    const questions = [
      {
        type: 'moduleName',
        question: '请输入模块名称 > ',
      }, {
        type: 'pageType',
        question: '请选择哪种页面? 1:列表页 2:详情页 > ',
      }, {
        type: 'parameters',
        question: '是否需要参数id? 1:需要 2:不需要 > ',
      },
    ];
    return () => {
      questionIndex += 1;
      if (questions[questionIndex]) {
        console.log(questions[questionIndex].question.green);
      } else {
        rl.close();
      }
      question = questions[questionIndex];
    };
  })();
  setPromptTitle();

  const rlEnd = () => {
    rl.close();
    cb({
      moduleName,
      pageType,
      parameters,
    });
  };

  rl.on('line', (line) => {
    const value = line.trim();
    switch (question.type) {
      case 'moduleName':
        if (/^[A-Z]\w+$/.test(value)) {
          moduleName = value;
          setPromptTitle();
        } else {
          console.log('输入不合法，请重新输入'.red);
        }
        break;
      case 'pageType':
        pageType = PageTypeDict[value];
        setPromptTitle();
        break;
      case 'parameters':
        if (/1|(true)/.test(line.trim())) {
          setPromptTitle();
          parameters = true;
        } else {
          parameters = false;
        }
        rlEnd();
        break;
      default:
        rlEnd();
        break;
    }
  });
};

const parseTplByStretagy = () => {
  const commands = {
    moduleName(opt) {
      return opt.moduleName;
    },
    MODULENAME(opt) {
      return opt.moduleName.toUpperCase();
    },
    id(opt) {
      return opt.needId ? 'needId' : '';
    },
  };
  const parseTpl = (content, option, subFile = '') => {
    const pageContent = new String(content).replace(
      /@@(.*?)@@/gm,
      (group, matched) => commands[matched](option)
    );
    return {
      name: 'index',
      filepath: `${paths.page}${option.moduleName}/${subFile}`,
      content: pageContent,
      subfix: 'jsx',
    };
  };
  const parseTplStretagy = {
    tpl(content, option) {
      return parseTpl(content, option, '');
    },
    modules(content, option) {
      return parseTpl(content, option, 'modules/');
    },
    containers(content, option) {
      return parseTpl(content, option, 'containers/');
    },
    components(content, option) {
      return parseTpl(content, option, 'components/');
    },
  };

  return (tplKey, content, option) => parseTplStretagy[tplKey](content, option);
};

const parseTpls = (tplContents, parseOption) => {
  const parsedContentInfomation = {};
  const parseSingleTpl = parseTplByStretagy();

  Object.keys(tplContents).forEach((tplKey) => {
    parsedContentInfomation[tplKey] = parseSingleTpl(tplKey, tplContents[tplKey], parseOption);
  });
  return parsedContentInfomation;
};

/**
 * 替换路由配置内容
 * @returns {*}
 */
const writePageRouteFiles = () => {
  const files = fs.readdirSync(path.join((__dirname, paths.page)));
  const dirs = [];
  const moduleNamesWithID = [];
  files.forEach((item) => {
    const stat = fs.statSync(path.join((__dirname, paths.page + item)));
    if (stat.isDirectory()) {
      dirs.push(item);
    }
  });
  dirs.forEach((dir) => {
    const entryPath = path.join(__dirname, `${paths.page + dir}/index.jsx`);
    const content = fs.readFileSync(entryPath, 'utf8');
    const postfix = /needId/.test(content) ? '/:id' : '';
    moduleNamesWithID.push(dir + postfix);
  });
  console.log(moduleNamesWithID);
  const pageRoutePath = path.join(__dirname, `${paths.page}/index.jsx`);
  const content = fs.readFileSync(pageRoutePath, 'utf8');
  const parsed = content.replace(
    /const moduleNames = .*;/, `const moduleNames = ${JSON.stringify(moduleNamesWithID).replace(/"/g, '\'')};`);
  fs.writeFileSync(pageRoutePath, parsed);
  console.log('路由配置文件修改成功');
};


const writeGenFiles = (targetFilesInfo) => {
  const keys = Object.keys(targetFilesInfo);
  let index = 0;
  keys.forEach((key) => {
    const info = targetFilesInfo[key];
    const dirname = path.join(__dirname, info.filepath);
    const filepath = `${dirname}${info.name}.${info.subfix}`;

    const writeFileFn = () => {
      fs.writeFile(filepath, info.content, (err) => {
        if (err) throw err;
        console.log(`${filepath}创建成功`);
        index += 1;
        if (index === keys.length) {
          writePageRouteFiles();
        }

        // console.log(`file ${info.name} exists ${fs.existsSync(filepath)}`);
      });
    };

    fs.exists(dirname, (exists) => {
      if (exists) {
        // writeFileFn();
        console.log('该模块已存在'.red);
      } else {
        fs.mkdirSync(dirname, 0o777);
        writeFileFn();
      }
    });
  });
};

const readTplFiles = (pageType) => {
  const contentMap = {};
  const tplNames = {
    tpl: 'index.tpl',
    modules: 'modules/jsx.tpl',
    containers: 'containers/jsx.tpl',
    components: 'components/jsx.tpl',
  };

  Object.keys(tplNames).forEach((tplNameKey) => {
    const tplName = [paths.templates, `${pageType}/`, tplNames[tplNameKey]].join('');
    contentMap[tplNameKey] = fs.readFileSync(path.join(__dirname, tplName));
  });

  return contentMap;
};


const execCmd = ({ moduleName, pageType, parameters: needId }) => {
  console.log('=============================================================');
  console.log(`模块访问路径为/Manage/${moduleName}${needId ? '/:id' : ''}`);
  console.log('=============================================================');

  const tplJson = readTplFiles(pageType);
  const targetFilesInfo = parseTpls(tplJson, {
    moduleName,
    needId,
  });

  writeGenFiles(targetFilesInfo);
};

usage();
setConfig((config) => execCmd(config));
