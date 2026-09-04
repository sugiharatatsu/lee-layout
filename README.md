# LeeLayout 2.0 beta.1

[中文](#中文) \| [日本語](#日本語) \| [English](#english)

---------------------------------------------

# 中文

LeeLayout 是一个轻量级的工具类 CSS（Utility
CSS）库，提供基础样式工具，并根据项目源码中实际使用的类名按需生成数值型工具类。

LeeLayout 2.0
直接集成到宿主项目现有的构建流程中，不会额外启动独立的文件监听进程。

## 安装

``` bash
npm install lee-layout --save-dev
```

## Vue 2 + Vue CLI / Webpack

在 `vue.config.js` 中添加 LeeLayout 的 Webpack 插件：

``` js
const LeeLayoutWebpackPlugin = require("lee-layout/webpack");

module.exports = {
  configureWebpack: {
    plugins: [
      new LeeLayoutWebpackPlugin()
    ]
  }
};
```

在应用入口文件中引入一次生成的 CSS：

``` js
import "./assets/LeeLayout.css";
```

之后按照原来的方式启动项目：

``` bash
npm run serve
```

LeeLayout 会在 Webpack
构建或重新构建时自动运行，不需要额外执行监听命令。

## Vite

CommonJS（Node.js 常用模块规范）：

``` js
const leeLayout = require("lee-layout/vite");
```

ES Module（JavaScript 标准模块规范）：

``` js
import leeLayout from "lee-layout/vite";
```

将 `leeLayout()` 添加到现有的 Vite `plugins`
数组中，并在应用入口文件中引入一次：

``` js
import "./assets/LeeLayout.css";
```

开发过程中，LeeLayout 复用 Vite
自身的文件监听机制，不会额外启动独立的轮询进程。

## lee.config.js

配置文件可选。以下内容也是默认配置：

``` js
module.exports = {
  content: ["./src"],
  extensions: [".html", ".htm", ".vue", ".js", ".jsx", ".ts", ".tsx"],
  unit: "px",
  output: "./src/assets/LeeLayout.css"
};
```

## 使用说明

基础工具类可以直接组合使用：

``` html
<div class="flex items-center justify-between w-full">
  ...
</div>
```

数值型工具类会根据源码中实际出现的类名按需生成，默认单位为 `px`：

``` html
<div class="w347 h48 pd-l16 mg-t20 f14 br4">
  ...
</div>
```

支持百分比、负数以及无单位数值：

``` html
<div class="w50p mg-l-10 z100 order2">
  ...
</div>
```

其中 `z` 和 `order` 使用无单位数值。

支持任意值，方括号中的 `_` 表示空格：

``` html
<div class="w-[20rem]"></div>
<div class="w-[calc(100%-240px)]"></div>
```

支持按需生成 Grid（网格布局）相关类：

``` html
<div class="grid grid-cols-3 gap20">
  <div class="col-span-2">...</div>
</div>
```

常用数值前缀：

-   `w` / `h`：宽度 / 高度
-   `min-w` / `max-w` / `min-h` / `max-h`：最小、最大宽高
-   `mg-*` / `pd-*`：外边距 / 内边距
-   `t` / `r` / `b` / `l`：定位偏移
-   `gap` / `gap-x` / `gap-y`：间距
-   `f`：字号
-   `lh`：行高
-   `br`：圆角
-   `z`：层叠顺序
-   `order`：Flex/Grid 项目顺序
-   `flex-basis-w`：Flex 基准尺寸

## 说明

LeeLayout 不会修改宿主项目的 `package.json`，也不会使用 `postinstall`
安装后脚本。

------------------------------------------------------------------------

# 日本語

LeeLayout は、基本的なスタイルユーティリティと、プロジェクト内で実際に使用されているクラス名から数値ユーティリティをオンデマンド生成する軽量なUtility CSS ライブラリです。

LeeLayout 2.0は既存プロジェクトのビルドプロセスに統合され、別のファイル監視プロセスを起動しません。

## インストール

``` bash
npm install lee-layout --save-dev
```

## Vue 2 + Vue CLI / Webpack

`vue.config.js` に LeeLayout の Webpack プラグインを追加します。

``` js
const LeeLayoutWebpackPlugin = require("lee-layout/webpack");

module.exports = {
  configureWebpack: {
    plugins: [
      new LeeLayoutWebpackPlugin()
    ]
  }
};
```

アプリケーションのエントリーファイルで、生成された CSS を一度読み込みます。

``` js
import "./assets/LeeLayout.css";
```

その後は通常どおりプロジェクトを起動します。

``` bash
npm run serve
```

LeeLayoutはWebpackのビルドまたは再ビルド時に自動実行されるため、別の監視コマンドは必要ありません。

## Vite

CommonJS（Node.js で広く使われるモジュール形式）：

``` js
const leeLayout = require("lee-layout/vite");
```

ES Module（JavaScript 標準モジュール形式）：

``` js
import leeLayout from "lee-layout/vite";
```

既存の Vite `plugins` 配列に `leeLayout()`を追加し、アプリケーションのエントリーファイルで生成された CSS を一度読み込みます。

``` js
import "./assets/LeeLayout.css";
```

開発時は Vite の既存のファイル監視機能を利用するため、別のポーリングプロセスは起動しません。

## lee.config.js

設定ファイルは任意です。以下がデフォルト設定です。

``` js
module.exports = {
  content: ["./src"],
  extensions: [".html", ".htm", ".vue", ".js", ".jsx", ".ts", ".tsx"],
  unit: "px",
  output: "./src/assets/LeeLayout.css"
};
```

## 使い方

基本ユーティリティはそのまま組み合わせて使用できます。

``` html
<div class="flex items-center justify-between w-full">
  ...
</div>
```

数値ユーティリティは、ソースコード内で実際に使用されたクラス名からオンデマンド生成されます。デフォルト単位は
`px` です。

``` html
<div class="w347 h48 pd-l16 mg-t20 f14 br4">
  ...
</div>
```

パーセント、負数、単位なしの数値にも対応しています。

``` html
<div class="w50p mg-l-10 z100 order2">
  ...
</div>
```

`z` と `order` は単位なしの数値です。

任意値にも対応しています。角括弧内の `_` はスペースとして扱われます。

``` html
<div class="w-[20rem]"></div>
<div class="w-[calc(100%-240px)]"></div>
```

Grid（グリッドレイアウト）関連クラスもオンデマンド生成できます。

``` html
<div class="grid grid-cols-3 gap20">
  <div class="col-span-2">...</div>
</div>
```

主な数値プレフィックス：

-   `w` / `h`：幅 / 高さ
-   `min-w` / `max-w` / `min-h` / `max-h`：最小・最大の幅と高さ
-   `mg-*` / `pd-*`：マージン / パディング
-   `t` / `r` / `b` / `l`：位置オフセット
-   `gap` / `gap-x` / `gap-y`：間隔
-   `f`：フォントサイズ
-   `lh`：行の高さ
-   `br`：角丸
-   `z`：重なり順
-   `order`：Flex/Grid アイテムの順序
-   `flex-basis-w`：Flex の基準サイズ

## 注意事項

LeeLayout は導入先プロジェクトの `package.json`
を変更せず、`postinstall` スクリプトも使用しません。

------------------------------------------------------------------------

# English

LeeLayout is a lightweight utility CSS library that provides base
utilities and generates numeric utility classes on demand from class
names actually used in project source files.

LeeLayout 2.0 integrates with the host project's existing build process
and does not start a separate file-watching process.

## Installation

``` bash
npm install lee-layout --save-dev
```

## Vue 2 + Vue CLI / Webpack

Add the LeeLayout Webpack plugin to `vue.config.js`:

``` js
const LeeLayoutWebpackPlugin = require("lee-layout/webpack");

module.exports = {
  configureWebpack: {
    plugins: [
      new LeeLayoutWebpackPlugin()
    ]
  }
};
```

Import the generated CSS once from the application entry:

``` js
import "./assets/LeeLayout.css";
```

Then start the project normally:

``` bash
npm run serve
```

LeeLayout runs automatically when Webpack builds or rebuilds. No
separate watch command is required.

## Vite

CommonJS configuration:

``` js
const leeLayout = require("lee-layout/vite");
```

ES Module configuration:

``` js
import leeLayout from "lee-layout/vite";
```

Add `leeLayout()` to the existing Vite `plugins` array and import the
generated CSS once from the application entry:

``` js
import "./assets/LeeLayout.css";
```

During development, LeeLayout reuses Vite's existing file watcher and
does not start a second polling process.

## lee.config.js

The configuration file is optional. The following values are the
defaults:

``` js
module.exports = {
  content: ["./src"],
  extensions: [".html", ".htm", ".vue", ".js", ".jsx", ".ts", ".tsx"],
  unit: "px",
  output: "./src/assets/LeeLayout.css"
};
```

## Usage

Base utilities can be combined directly:

``` html
<div class="flex items-center justify-between w-full">
  ...
</div>
```

Numeric utilities are generated on demand from class names found in
source files. The default unit is `px`:

``` html
<div class="w347 h48 pd-l16 mg-t20 f14 br4">
  ...
</div>
```

Percentage, negative, and unitless numeric values are supported:

``` html
<div class="w50p mg-l-10 z100 order2">
  ...
</div>
```

`z` and `order` use unitless numeric values.

Arbitrary values are supported. An underscore (`_`) inside brackets
represents a space:

``` html
<div class="w-[20rem]"></div>
<div class="w-[calc(100%-240px)]"></div>
```

Grid utilities can also be generated on demand:

``` html
<div class="grid grid-cols-3 gap20">
  <div class="col-span-2">...</div>
</div>
```

Common numeric prefixes:

-   `w` / `h`: width / height
-   `min-w` / `max-w` / `min-h` / `max-h`: minimum and maximum
    width/height
-   `mg-*` / `pd-*`: margin / padding
-   `t` / `r` / `b` / `l`: positional offsets
-   `gap` / `gap-x` / `gap-y`: gaps
-   `f`: font size
-   `lh`: line height
-   `br`: border radius
-   `z`: stacking order
-   `order`: Flex/Grid item order
-   `flex-basis-w`: Flex basis size

## Notes

LeeLayout does not modify the host project's `package.json` and does not
use a `postinstall` script.
