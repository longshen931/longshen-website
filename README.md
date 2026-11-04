# 沈隆学术网站：本地编辑与发布

这个项目是现有公开网站的静态文件副本。网站内容在 `site/` 中；无需安装 Node.js 或构建工具。

## 第一次配置

1. 在电脑上安装 [Git for Windows](https://git-scm.com/downloads/win)。安装后重新打开本文件夹。
2. 你的公开仓库是 [longshen931/longshen-website](https://github.com/longshen931/longshen-website)。解压本项目后双击 `setup.cmd`，它会在旁边创建一个 `longshen-website-local` 文件夹，作为你长期编辑和发布的工作副本。也可以在 Git Bash 中自行运行 `git clone https://github.com/longshen931/longshen-website.git`。
3. 如果 GitHub 要求授权推送，在 Git 提供的浏览器登录窗口中完成。不要将密码或访问令牌写入脚本。
4. 在仓库 **Actions** 中查看 `Publish website` 的发布记录。GitHub Pages 的发布源应设置为 **GitHub Actions**。

## 以后怎么修改

- 首页、栏目及公共文字：修改 `site/index.html`。
- 配色、字体与布局：修改 `site/style.css`。
- 研究札记和页面交互：修改 `site/app.js`。
- 所有人可见的资源清单：修改 `site/resources.js` 开头的 `publicResources`，每条包括名称、HTTPS 地址、分类和中英文用途。
- 在文件夹内执行 `python -m http.server 8000 --directory site`，用浏览器打开 `http://localhost:8000` 本地预览。需要先安装 Python；也可以使用 VS Code 的本地静态预览扩展。
- 确认后在**克隆得到的 `longshen-website-local` 文件夹**内双击 `publish.cmd`。它会提交 `site/` 的变化并推送到 GitHub；GitHub Actions 自动更新网页。请在仓库 **Actions** 页确认绿色成功状态。压缩包中的原始副本用于备份，不要在那个副本里直接运行 `publish.cmd`。

本地文件改动只会在执行发布后让访客看到。网站“我的备忘”仍保存在各自的浏览器；要让所有访客看到一个网址，应修改 `publicResources` 并发布。备忘导出文件中可能有私人内容，不要放入公开仓库。

## 把 `longshen931.new.tg` 指向新网站

等 `github.io` 预览成功后，在 GitHub 仓库 **Settings → Pages → Custom domain** 填入 `longshen931.new.tg` 并保存。然后在 dnshe.com 中找到该域名对应的 DNS 记录，把它指向 GitHub Pages 默认域名（通常是 `你的用户名.github.io`）。若 DNShe 管理的是 `new.tg` 的子域，通常修改主机名 `longshen931` 的 **CNAME**；若它把 `longshen931.new.tg` 作为独立区域管理，记录名可能显示为 `@`，须按平台支持的记录类型和 GitHub 提示配置。确认 HTTPS 生效后再把新地址作为正式站点。

域名切换期间不要同时保留同名的冲突记录；DNS 生效可能需要一段时间。当前 Sites 网站会保持原样直到 DNS 改指向新站。**不要在 GitHub 预览验证前修改 DNS。**

网站采用相对路径引用 CSS 和 JavaScript，因此默认 `github.io/仓库名/` 预览和自定义域名都能载入资源。
