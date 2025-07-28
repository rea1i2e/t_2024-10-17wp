// gulpのメソッド呼び出し
// src：参照元指定、dest：出力先指定、watch：ファイル監視、series：直列処理、parallel：並列処理
const { src, dest, watch, series, parallel } = require("gulp");

// 追加モジュール
const changed = require("gulp-changed"); // 変更されたファイルのみを対象にする
const webp = require("gulp-webp"); // WebP生成
const webpackStream = require("webpack-stream"); // Webpack処理
const named = require("vinyl-named"); // ファイル名指定

// 入出力先指定
const srcBase = './src';
const distBase = `./dist/wp-content/themes/yamaguchi-economy`;
const srcPath = {
  css: srcBase + '/sass/**/*.scss',
  img: srcBase + '/images/**/*',
  js: srcBase + '/js/index.js', // エントリーポイント
}
const distPath = {
  css: distBase + '/assets/css/',
  img: distBase + '/assets/images/',
  js: distBase + '/assets/js/', // JS出力先
  jsWatch: distBase + '/assets/js/**/*.js', // JS監視用
  php: distBase + '/**/*.php'
}

// ローカルサーバー立ち上げ
const browserSync = require("browser-sync");
const browserSyncOption = {
  proxy: 'http://localhost:10011/', // LocalのSite hostを入れる
}
const browserSyncFunc = () => {
  browserSync.init(browserSyncOption);
}
const browserSyncReload = (done) => {
  browserSync.reload();
  done();
}

// Sassコンパイル
const sass = require('gulp-sass')(require('sass')); // sassコンパイル（DartSass対応）
const sassGlob = require('gulp-sass-glob-use-forward'); // globパターンを使用可にする
const plumber = require("gulp-plumber"); // エラーが発生しても強制終了させない
const notify = require("gulp-notify"); // エラー発生時のアラート出力
const postcss = require("gulp-postcss"); // PostCSS利用
const autoprefixer = require("autoprefixer"); // ベンダープレフィックス自動付与
const sourcemaps = require("gulp-sourcemaps"); // ソースマップ生成
const browsers = [ // 対応ブラウザの指定
  'last 2 versions',
  '> 1%',
  'not dead',
  'not ie 11'
]
const cssSass = () => {
  return src(srcPath.css)
    .pipe(sourcemaps.init()) // ソースマップの初期化
    .pipe(
      plumber({ // エラーが出ても処理を止めない
          errorHandler: notify.onError('Error:<%= error.message %>')
      }))
    .pipe(sassGlob()) // globパターンを使用可にする
    .pipe(sass.sync({ // sassコンパイル
      includePaths: ['src/sass'], // 相対パス省略
      outputStyle: 'expanded' // 出力形式をCSSの一般的な記法にする
    }))
    .pipe(postcss([autoprefixer({ overrideBrowserslist: browsers })])) // ベンダープレフィックス自動付与
    .pipe(sourcemaps.write('./')) // ソースマップの出力先をcssファイルから見たパスに指定
    .pipe(dest(distPath.css)) // 
    .pipe(notify({ // エラー発生時のアラート出力
      message: 'Sassをコンパイルしました！',
      onLast: true
    }))
}

// 画像圧縮
const imagemin = require("gulp-imagemin"); // 画像圧縮
const imageminMozjpeg = require("imagemin-mozjpeg"); // jpgの高圧縮に必要
const imageminPngquant = require("imagemin-pngquant"); // pngの高圧縮に必要
const imageminSvgo = require("imagemin-svgo");  // svgの高圧縮に必要
const imgImagemin = () => {
  return src(srcPath.img)
  // .pipe(changed(distPath.img)) // 変更があった画像のみ処理対象に（一時的に無効）
  .pipe(imagemin([
    imageminMozjpeg({
      quality: 80
    }),
    imageminPngquant(),
    imageminSvgo({
      plugins: [{
        removeViewbox: false // viewBox属性を削除しない
      }]
    })],
    {
      verbose: true
    }
  ))
  .pipe(dest(distPath.img))
  .pipe(webp()) // WebP形式に変換
  .pipe(dest(distPath.img)) // WebPファイルも同じディレクトリに出力
}

// JavaScript処理
const jsWebpack = () => {
  return src(srcPath.js)
    .pipe(
      plumber({
        errorHandler: notify.onError("Error: <%= error.message %>"),
      })
    )
    .pipe(named())
    .pipe(webpackStream({
      mode: "development",
      devtool: "source-map",
      entry: {
        bundle: "./src/js/index.js" // エントリーポイント
      },
      output: {
        filename: "bundle.js"
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env"]
              }
            }
          }
        ]
      },
      resolve: {
        extensions: [".js"]
      }
    }))
    .pipe(dest(distPath.js))
    .pipe(notify({
      message: 'JavaScriptをバンドルしました！',
      onLast: true
    }));
};

// ファイルの変更を検知
const watchFiles = () => {
  watch(srcPath.css, series(cssSass, browserSyncReload))
  watch(srcPath.img, series(imgImagemin, browserSyncReload))
  watch(srcBase + '/js/**/*.js', series(jsWebpack, browserSyncReload)) // JS監視
  watch(distPath.jsWatch, series(browserSyncReload))
  watch(distPath.php, series(browserSyncReload))
}

// clean
const del = require('del');
const delPath = {
	css: distBase + '/css/style.css',
	cssMap: distBase + '/css/style.css.map',
  img: distBase + '/images/',
}
const clean = (done) => {
  del(delPath.css, { force: true });
  del(delPath.cssMap, { force: true });
  del(delPath.img, { force: true });
  done();
};

// 実行
exports.default = series(series(clean, imgImagemin, cssSass, jsWebpack), parallel(watchFiles, browserSyncFunc));