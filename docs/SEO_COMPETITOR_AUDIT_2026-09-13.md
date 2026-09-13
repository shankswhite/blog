# Levon Blog：公开竞品诊断与证据

审计日期：2026-09-13。用户站点：https://www.levon.blog/；竞品：https://levon.homes/；目标查询：`levon blog`。

本笔记记录本轮修改前的生产环境基线。只读获取了公开页面、HTTP 响应、robots、sitemap 和 Google 官方文档；未访问账号后台、环境变量或私有数据。它不是已上线变更报告。

## 核心结论

当前最直接、可修复的差距是 **博客品牌与搜索意图表达不足**。用户首页是完整可抓取的职业作品集，却把标题写成通用职位 `AI / ML Engineer`；博客列表则叫 `Writing | Levon Zhao`。对方首页直接叫 `Levon's Blog`，整站的标题、站点名、导航与文章结构都持续表达“Levon 的博客”。这是针对该查询的有力解释，但不是已证明的排名算法因果。

不能据此声称对方网站技术全面领先、域名权重更高、反向链接更多，或已查明 Google 的全部排名原因。Google Search Console 数据、链接数据与长期同条件排名样本仍缺失。

## Google 观察与边界

主任务代理通过真实 Google 浏览器页面复现了用户反馈：

- 页面：[Google，levon blog，英语／美国参数](https://www.google.com/search?q=levon+blog&hl=en&gl=us&pws=0)。未登录。
- 当次前两个普通网页结果分别为竞品首页 `Levon's Blog`，以及用户的 `https://www.levon.blog/blog`，显示 `Writing | Levon Zhao`；其后还出现竞品 Categories、Archives。
- 这是 **一次、特定环境的结果样本**，不能外推所有国家、设备、时间或用户的固定名次。`pws=0` 也不消除地区和时间差异。
- 通用 web 搜索工具另能发现用户首页、About、Resume 等页面，但它不等于 Google SERP，不能用它的结果次序作为 Google 排名证据，也不能把其缓存内容当作生产页面现状。

Google 明确说明结果会受时间、地点、设备、近期历史影响；Search Console 可按查询、页面、国家、设备、日期检查点击、曝光、CTR 与平均位置。[Search Console Performance 文档](https://support.google.com/webmasters/answer/7576553)

Google 的 `site:` 结果不是完整索引清单，也不适合据其数量判断完整收录或排名能力。具体 URL 的索引状态应以 URL Inspection 为准。[Google site: operator 文档](https://developers.google.com/search/docs/monitor-debug/search-operators/all-search-site)

## 公开页面对照

| 维度 | www.levon.blog 当前基线 | levon.homes 当前基线 | 判断 |
| --- | --- | --- | --- |
| 首页 HTTP | 200；完整文本出现在初始 HTML | 200；完整文本出现在初始 HTML | 两者均非空壳页面 |
| 首页 title | `AI / ML Engineer` | `Levon's Blog` | 用户标题缺 Levon 与 Blog；高优先级 |
| 首页 H1 | `I Focus on Game & AI.` | `Levon` | 用户正文职业定位明确，但首页博客身份弱 |
| 首页 description | 明确说明 Levon Zhao 与 AI / ML 经历 | 中文首页 description 为空；英文首页为欢迎博客 | 对方不是所有 metadata 都更好 |
| 首页 og:site_name | `Levon Zhao` | `Levon's Blog` | 用户当前有职业品牌，博客品牌未统一 |
| 首页 canonical | `https://www.levon.blog` | `https://levon.homes/` | 两者都有自指 canonical |
| robots | `Allow: /`，声明站图 | 空 Disallow，声明站图 | 未发现基本抓取阻断 |
| 首页 JSON-LD | 未发现 | Organization（博客名）；未发现 WebSite | 用户应按自身身份准确补充，而非照抄对方 |
| 博客索引 | `/blog` 标题 `Writing \| Levon Zhao`；H1 `Writing from the workbench.` | `/posts/` 标题 `Posts \| Levon's Blog`；H1 `Posts` | 用户核心着陆页名称不直接对应目标查询 |
| 文章规模 | 当前博客列表 2 篇 | 中文列表 9 篇；英文站图 9 篇对应翻译 | 数量差是事实，不等于质量/排名因果 |
| 首页文章发现 | 有 Writing 导航；无直接单篇文章链接 | 首页链接文章入口，文章索引有丰富摘要与栏目 | 用户适合增加精选文章模块，减少发现步骤 |
| 文章结构化数据 | 抽查两篇均无 JSON-LD | 抽查 SPI 有 BlogPosting、BreadcrumbList | 用户可补文章身份、作者、真实日期和路径 |
| 文章作者表达 | 两篇正文区域无显式作者署名；全站有 Levon Zhao 品牌 | SPI 的 BlogPosting 没有 author | 两站都有改善空间；用户更适合清晰署名并链接 About |

直接来源：[用户首页](https://www.levon.blog/)、[用户博客列表](https://www.levon.blog/blog)、[用户 robots](https://www.levon.blog/robots.txt)、[用户 sitemap](https://www.levon.blog/sitemap.xml)、[竞品首页](https://levon.homes/)、[竞品英文首页](https://levon.homes/en/)、[竞品文章列表](https://levon.homes/posts/)、[竞品 robots](https://levon.homes/robots.txt)、[竞品 sitemap 索引](https://levon.homes/sitemap.xml)。

## 内容、日期与站图细节

- 用户站图当前 27 个 URL，其中博客文章 2 篇：[图像变形调试文章](https://www.levon.blog/blog/beier-neely-image-morphing)，发布/站图日期 2025-02-01；[YOLO-KAN 研究文章](https://www.levon.blog/blog/yolo-kan-research)，发布/站图日期 2024-12-08。它们各自有描述、唯一标题、自指 canonical 和完整初始正文，均为 index/follow。
- 用户两篇文章有亲身项目细节，分别包含实验结果、调试问题与项目来源链接。这些内容适合补充作者、实验边界、方法和相关项目关系；不需要为追求篇数泛写九篇通用教程。
- 用户首页优先展示履历、证书、项目和教育；关于博客的信号主要来自全站 Writing 与 Legacy Blog 链接。建议在保留职业价值的同时，明确讲“Levon Zhao 的技术博客与作品集”，并呈现真实精选文章。
- [竞品中文站图](https://levon.homes/zh/sitemap.xml) 有 42 个 URL，[英文站图](https://levon.homes/en/sitemap.xml) 有 43 个 URL；总计 85 个 URL **不是 85 篇文章**。大量 URL 是标签、分类、归档、搜索和索引。
- 竞品中文列表显示 9 篇，主题包括 Git、Vim、表驱动、SPI、Maven、CI/CD、LLM；页面自报最早文章日期 2021-06-13、最新发布日 2025-08-03。其站图含 2025-10-10 修改日期。**自报发布日期不证明域名建立时间或 Google 首次收录时间。**
- [竞品 SPI 样本](https://levon.homes/posts/spi-extension-pattern/) 存在自指 canonical、BlogPosting、BreadcrumbList、发布日期/修改日期、目录、标签、上一篇/下一篇；结构化数据中的 Organization sameAs 还混有主题作者的 Ko-fi 链接。对方模板并非应逐项照搬的最佳实践。
- 用户 [Legacy 首页](https://www.levon.blog/legacy) 独立 index/follow、自指 canonical，标题 `Levon's AllBlue — Legacy Blog | Levon Zhao`，仍含较旧职业资料。应检查新旧重复页面的具体关系后再做规范化；不能因为叫 legacy 就一律 noindex 或重定向所有旧路径至首页。

## 开发优先级与验收

### P0：品牌、核心着陆页与信号一致性

1. 首页 title 同时包含真实名字、博客品牌和主题，例如 `Levon Blog — Levon Zhao | AI, Games & Software`。这只是建议文案，最终须和页面可见身份一致。博客列表可改为 `Levon Blog — AI, Graphics & Engineering Notes`，避免 `Writing` 作为唯一内容类别信号。
2. 首页/博客列表增加自然可见的“Levon Blog”身份与简洁主题说明；全站导航用清晰 Blog 或 Blog / Writing 文案。保持内容真正服务读者，避免关键词堆叠。
3. 首页加入现有 2 篇原创文章的直接链接、标题和摘要；文章添加 Levon Zhao 署名、About 链接以及相关项目/文章入口。这样用户和爬虫都能更容易理解文章关系。
4. 首页补 `WebSite`（真实 name、alternateName、url）与真实 `Person` 身份信息；文章补 `BlogPosting`、author、headline、url、真实 datePublished，只有实质修改才提供准确 dateModified。Schema 应与可见内容相符。

验收：生产构建的原始 HTML 可直接读到正确 title、唯一 canonical、正文品牌、文章链接、可解析 JSON-LD；每篇实际内容与结构化属性匹配；移动端可读可用。

Google 用 title、可见标题、H1、og:title、锚文本等生成搜索标题，建议标题描述准确、简洁且有区别；重抓取和重处理可能需要数天到数周。[Title links 文档](https://developers.google.com/search/docs/appearance/title-link)

Google 推荐在根首页用 `WebSite` 声明站点名偏好，并保持首页其他位置一致；该系统用于站点名称展示，**不是承诺排名加分的开关**。[Site names 文档](https://developers.google.com/search/docs/appearance/site-names)

`Article` / `BlogPosting` 可帮助 Google 理解标题、图片、日期和作者；不保证富媒体样式，更不保证超越特定竞争者。[Article structured data 文档](https://developers.google.com/search/docs/appearance/structured-data/article)

### P1：规范化、旧地址和技术验收

1. 保持 https/www canonical、站图与站内链接一致；非 www 首页当前已跳转 www，继续验证各路径保留和状态码。
2. 对历史旧 URL 做逐页语义匹配：有真实替代内容才永久重定向；仍有独立价值则保留；避免把不相关旧页面统一跳首页。
3. sitemap 只放希望索引的 canonical、200 页面，lastmod 使用真实内容变化时间。Google 忽略 `priority`、`changefreq`，调整这些值不值得占用主要工时。
4. 检查不存在 URL 返回真实 404、资源可访问、canonical 不泄漏预览域名、robots 未阻断、HTML 与渲染后内容一致。

Google 将重定向和 rel=canonical 视为较强规范化信号、站图为弱信号；同一内容的信号应一致。[Canonical 文档](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)

站图应列出期望规范 URL；lastmod 需准确并与实质内容变化对应，priority/changefreq 不用于 Google 处理。[Sitemap 文档](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

### P1：高价值内容与页面体验

1. 优先完善用户已有、可核实的研究/工程经历：实验设置、对照结果、失败案例、源码/海报/论文入口；任何未经验证的经历、数字与引用不可补造。
2. 一篇真正基于已发布项目的深入文章，比为凑数量批量生成泛主题短文更符合当前品牌和读者需求。
3. 测量移动端 LCP/CLS 和交互负担后处理实际瓶颈；尤其检查常驻 AI companion 对初始加载的影响。原始 HTML 87 KB 对比竞品 7.6 KB **不能单独证明 Core Web Vitals 差距**，本轮未取得两站真实用户性能数据。

Google 强调原创信息、亲身经验、清晰来源与作者背景；没有偏好的固定字数，单纯大量发文或改日期不会让网站因“新鲜”自动获得更好排名。[Helpful content 文档](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

Google 建议良好真实用户体验；CWV 目标 LCP ≤2.5 秒、INP <200 毫秒、CLS <0.1。实验室测试用于找瓶颈，不能冒充真实用户 28 天指标。[Core Web Vitals 文档](https://developers.google.com/search/docs/appearance/core-web-vitals)

### P2：搜索测量与站外身份

1. 在已有授权和可访问前提下，Search Console 留下变更前后 `levon blog` 的查询过滤报告，按国家/设备区分，记录点击、曝光、CTR、平均位置；同时跟踪 `levon zhao`、`levon zhao blog` 等真实身份词。
2. 用 URL Inspection 检查首页、博客列表、两篇文章的索引状态、Google 选择 canonical 和最后抓取；上线后只提交关键页面重抓取并确认站图处理。
3. 核查用户本人已拥有的 GitHub、LinkedIn 等公开主页是否链接到规范博客网址，并使用准确一致的名称。站外资料变更/发帖须在主任务授权边界内执行；不能以本报告为向他人发消息的授权。
4. 以 14 天与 28 天同长度窗口评估趋势；低流量品牌词可能样本不足，应报告分母而非只说百分比增长。

## 尚未知、不能编造的结论

- Search Console 的当前曝光、点击、CTR、平均位置、索引覆盖、Google selected canonical、抓取历史。
- 竞品外链数量/质量、用户站点外链数量/质量、两站真实用户 CWV。
- 对方注册时间、收录历史、所谓域名权威分数与它们对本次结果的因果贡献。
- 全球/所有设备的固定名次；本次品牌优化后何时超过竞品。
- 当前两篇日期是否对应旧站初发而非迁移日期；保持现值，不能为了 SEO 改新。

Google 明确没有能自动保证第一名的秘诀；变更影响可能从数小时到数月，通常应等待数周再判断。因此 8 小时应预算给可验证的开发与上线质量，排名结果需等待抓取与真实搜索数据验证。[Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)

## 追加核验：生产 3D 负载与 GitHub 身份入口

以下仍为 2026-09-13 修改前生产环境样本。初始静态资源通过公开 GET/HEAD 检查，运行状态通过 CUA 操作的新 Chrome 页面读取 DOM，未点击 KIRA、未打开麦克风、未发送消息。

### 3D 确实在首次打开首页时运行

- 初始 HTML 已包含 `data-persistent-avatar-host="true"` 和 `data-avatar-load-state="loading"`，并将一个公开 `.glb` 模型地址传给 `FloatingAvatarChat`。
- 首次进入首页后，DOM 已变为 `data-avatar-load-state="ready"`，子元素 `data-avatar-runtime="three"`，canvas 的 `data-engine="three.js r185"`；本次 backing canvas 为 202 × 345。这说明不是仅存在 unused 依赖，而是未打开聊天就已建立 3D 渲染器。
- [生产布局脚本](https://www.levon.blog/_next/static/chunks/app/layout-32070a4c49ec4700.js) 直接挂载动态 `AvatarStage`，原先只以加载失败状态控制渲染，并未以访客首次打开聊天为条件。
- [生产 AvatarStage 脚本](https://www.levon.blog/_next/static/chunks/4317.4000cab3fe49768a.js) 使用 GLTF loader 的 `loadAsync(modelUrl)`，并建立渲染循环。

### 公开资源体积

| 资源 | 未压缩/解压后的字节数 | 本次公开响应体字节数 | 说明 |
| --- | ---: | ---: | --- |
| 首页 HTML | 87,114 | 未以浏览器传输量报告 | 含完整页面正文与 Next 序列化数据 |
| 11 个初始现代浏览器 JS | 559,205 | 177,895 | 请求 Accept-Encoding:gzip；9 个 gzip，2 个极小文件未压缩；排除 nomodule polyfills |
| 追加 5 个 3D JS chunk | 785,468 | 199,498 | 均以 gzip 返回；约 194.8 KiB 压缩响应体 |
| 外部 GLB 模型 | 5,118,216 | 未下载模型本体 | HEAD 的 Content-Length，约 4.88 MiB；无 Content-Encoding |
| 两个 CSS | 89,899 | 16,345 | gzip |
| 预加载 WOFF2 字体 | 48,432 | 48,432 | 已压缩字体格式 |
| 本次头像 currentSrc 96w | 2,476 | 2,476 | WebP，实际 DOM currentSrc 指向此尺寸 |
| 本次头像 currentSrc 256w | 10,326 | 10,326 | WebP，实际 DOM currentSrc 指向此尺寸 |

模型来源为页面自己引用的 [公开 GLB 地址](https://d1u2dz52bxeut8.cloudfront.net/models/sapphy-sd-web-v1-404e5849.glb)。本次只检查其 HTTP 头，没有下载或重新发布模型。

以上是单个公开构建版本、特定编码协商下的资源响应体积，**不是完整浏览器网络瀑布或 CWV**：不包含所有请求/协议头，不反映缓存命中与设备计算成本；现代浏览器不会因为 HTML 同时列出 nomodule 就必然下载该 polyfill。图片 `src` 虽保留 3840w fallback，但本次浏览器实际选用 96w/256w，不能据 fallback URL 断言加载了 3840w 图片。

### 性能报告获取情况

- 官方 PageSpeed API 的 mobile + performance 无密钥 GET 返回 `429 RESOURCE_EXHAUSTED`，原因是该公共调用通道当日配额为 0；没有返回 Lighthouse 分数或 CWV。
- 随后通过 CUA 打开 [此次 PageSpeed 报告页面](https://pagespeed.web.dev/analysis/https-www-levon-blog/hwyzifrw24?form_factor=mobile)，页面显示报告时间 2026-09-13 03:20:57（本地时间）、Mobile、真实用户区 `No Data`。实验室区在本轮观察中持续 loading，后续 DOM 读取超时；因此仍未取得可报告的 Lighthouse 分数。
- `No Data` 表示没有可用的公开真实用户样本，不能写成“CWV 不通过”或“性能很差”。官方说明 CrUX 需要足够样本，PSI 真实用户数据代表过去 28 天；实验室 Lighthouse 模拟与真实用户指标也不能互换。[PSI 数据说明](https://developers.google.com/speed/docs/insights/v5/about)

### GitHub 公开网站字段为空

- [GitHub 用户公开 API](https://api.github.com/users/shankswhite) 返回 `name: "Xiaofeng Zhao"`、`blog: ""`。
- [博客仓库公开 API](https://api.github.com/repos/shankswhite/blog) 返回 `homepage: null`。
- 可行补充是将用户本人 GitHub 网站字段与博客仓库 Website 指向 `https://www.levon.blog`，并在准确的公开个人介绍中连接 Levon Zhao / Xiaofeng Zhao 身份。当前这些两个字段为空，不代表整个 GitHub 完全没有链接，也不能据此推算外链数量或权重。
- 本轮未修改任何 GitHub 资料、仓库设置或其他外部资料。

### 本地性能修复交接

主任务随后授权在隔离工作区仅修改 `src/components/FloatingAvatarChat.tsx`：以已有轻量静态头像保留关闭时的入口，在访客第一次打开对话时才挂载 AvatarStage，此后关闭对话仍保留已挂载模型；不改变既有头像尺寸、文本聊天、语音、拖拽与失败降级逻辑。首访 host 状态为 `deferred`，供浏览器验收检查。

该组件修改已完成，`git diff --check` 通过；未运行构建、未提交、未部署，交给主任务统一测试。因此本笔记中的生产资源测量仍是修复前基线，不能当作已经消除负载或排名已改善的证明。
