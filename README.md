# One-Click Long Screenshot

一键截取当前网页长图（自动滚动拼接），点击扩展图标或弹窗按钮即可。

## 安装方法
1. 打开 Chrome，进入 扩展程序 > 管理扩展程序 > 加载已解压的扩展程序。
2. 选择本项目文件夹。

## 使用方法
- 进入任意网页，点击扩展图标或弹窗按钮，自动截取长图并下载。

## 发布到 Microsoft Edge Add-ons

准备并上传到 Microsoft Partner Center 的快速步骤：

1. 确认 `manifest.json` 中 `name`、`description`、`homepage_url`、`icons` 已填写。
2. 包含隐私说明文件 `PRIVACY.md`（可把其内容放到你的网站并填写隐私政策 URL）。
3. 执行打包脚本生成 ZIP：
```bash
chmod +x package.sh
./package.sh
```
注意：作为个人开发者，我已将 `manifest.json` 的 `author` 和 `homepage_url` 更新为示例个人信息，并将 `PRIVACY.md` 的联系邮箱设置为 `wanzhao0@163.com`。如果需要更改显示名称或主页链接，请编辑 `manifest.json`。你也可以把 `PRIVACY.md` 内容发布到 GitHub Pages 或个人网站，并把该 URL 填到 Partner Center 的隐私政策字段中。
4. 登录 Microsoft Partner Center（https://partner.microsoft.com），创建扩展，上传 ZIP、图标和屏幕截图，填写隐私政策 URL 与支持邮箱，然后提交审核。

详细发布说明见 `EDGE_PUBLISH.md`。

## 权限说明
- 仅用于当前活动标签页截图与下载，不收集任何用户数据。

## 注意事项
- 某些复杂页面可能因懒加载/动画导致截图不完整，可适当调整等待时间。
- 如需区域截取/格式自定义等高级功能，可在 content.js 中扩展。
