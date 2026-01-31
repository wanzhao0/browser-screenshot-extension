Edge Add-ons 发布步骤（快速指南）

1. 准备材料
- 扩展 ZIP 包（压缩目录下的所有扩展文件，不包含开发时的无关文件）。
- 图标（128x128 PNG），至少一张主图。
- 隐私政策 URL 或隐私说明文件（可填写提交页面字段或链接到你的站点）。
- 屏幕截图和演示 GIF（用于商店展示）。

2. 打包（在扩展根目录运行）
```bash
# 在 macOS / Linux
cd /path/to/browser-screenshot-extension
zip -r ../browser-screenshot-extension.zip . -x "*.DS_Store" "*/.git/*"
```

3. 注册 Microsoft Partner Center
- 访问 https://partner.microsoft.com 并完成开发者注册。

4. 提交扩展
- 登录 Microsoft Partner Center -> 行政中心 -> 提交新的 Edge 扩展。
- 填写名称（个人开发者可用真实姓名或开发者昵称）、描述、类别、隐私政策 URL（可填 `PRIVACY.md` 托管到 GitHub Pages 或个人网站）、支持邮箱（建议填写个人邮箱，例如 `wanzhao0@163.com`）等。
- 上传 ZIP 包、图标、截图。
- 完成审核并提交（等待审核通过）。

5. 发布后注意
- 监控崩溃与用户反馈，及时更新版本并提交新包。
- 在扩展页面提供联系方式与版本说明。

更多细节请参考 Microsoft 官方文档：https://learn.microsoft.com/microsoft-edge/extensions-chromium/publish/overview
