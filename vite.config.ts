import { createVitePlugins } from './config/vite/plugins';
import { resolve } from 'path';
import { ConfigEnv, UserConfigExport } from 'vite';
import autoprefixer from "autoprefixer";
import postCssPxToRem from "postcss-pxtorem";
// import { viteMockServe } from 'vite-plugin-mock';

const pathResolve = (dir: string) => {
  return resolve(process.cwd(), '.', dir);
};

// https://vitejs.dev/config/
export default function ({ command }: ConfigEnv): UserConfigExport {
  const isProduction = command === 'build';
  const root = process.cwd();

  return {
    root,
    resolve: {
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
        },
        {
          find: /\/@\//,
          replacement: pathResolve('src') + '/',
        },
      ],
    },
    server: {
      host: true,
      hmr: true,
    },
    plugins: createVitePlugins(isProduction),
    css: {
      postcss: {
        plugins: [
          autoprefixer({
            overrideBrowserslist: [
              "Android 4.1",
              "iOS 7.1",
              "Chrome > 31",
              "ff > 31",
              "ie >= 8",
            ],
          }),
          postCssPxToRem({
            // 自适应，px>rem转换
            rootValue: 100, // 根元素字体大小，用于将像素转换为rem的基准值
            unitPrecision: 10, // rem的小数位数
            propList: ["*"], // 需要转换的属性列表，['*']表示所有属性都会被转换
            minPixelValue: 2, // 小于或等于该值的像素单位不被转换
            mediaQuery: false, // 是否在媒体查询的css代码中也进行转换，默认false
            replace: true, // 是否转换后直接更换属性值
            exclude: /node_modules/i,
            selectorBlackList: [/^\.PC/] // 过滤掉.norem-开头的class，不进行rem转换
          }),
        ],
      },
    },
  };
}
