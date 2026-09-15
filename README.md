# quinn-ma.github.io

马沁桢 / Qinzhen Ma 的个人网站，托管于 GitHub Pages：https://quinn-ma.github.io/

纯静态站点（HTML / CSS / JS，无构建步骤），中英双语，深色 / 浅色主题。首屏是一个可交互的 3D 办公桌（Three.js）：悬停高亮、点击桌上的物件镜头推近并打开对应内容面板，拖动可环视。

```
index.html              页面骨架（各区块容器，文字由 JS 渲染）
assets/js/content.js    全部文案：zh / en 两份，改文字改这里（含 3D 热点标签、视频标题）
assets/js/main.js       页面交互：语言 / 主题切换、打字机、交付闭环图、时间线、技能高亮、复制联系方式
assets/js/desk.js       3D 办公桌场景（ES module）：建模、灯光、热点、镜头、侧边面板、显示器视频纹理
assets/css/style.css    全站样式与主题变量
assets/css/desk.css     3D 首屏相关样式（覆盖层、面板、图例、演示视频网格）
assets/vendor/          本地打包的 three.js 0.160 与 RoundedBoxGeometry（不依赖外网 CDN）
assets/img/avatar.jpg   头像
assets/media/           演示视频（mp4 / webm）与封面图
assets/Qinzhen_Ma_Resume.pdf  简历下载
```

3D 桌面上的热点：显示器（演示视频）、机械臂（交付闭环）、笔记本电脑（研究项目）、简历本（经历）、书堆 + 学位帽（教育）、手机（联系方式）。

## 本地预览

```bash
python -m http.server 8765
```

然后打开 http://127.0.0.1:8765/ 。可用的调试参数：`?lang=en`、`?theme=light`、`?focus=monitor`（直接聚焦某个热点：monitor / arm / laptop / notebook / books / phone）。

## 换视频

1. 用 ffmpeg 转成 720p H.264（`-crf 28 -movflags +faststart`），放进 `assets/media/`，同时导出一张封面 jpg。
2. 在 `content.js` 顶部的 `videos` 数组里加一项（id / file / poster / type），再在 zh 与 en 的 `desk.videos` 里加对应标题与描述。
3. `defaultVideo` 决定显示器默认播放哪一段。

## 部署

推送到 `main` 分支即自动发布（GitHub Pages，根目录）。
