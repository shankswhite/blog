# Levon Blog：8 小时开发预算与 28 天增长计划

编制于 2026-09-13。目标是让搜索者更容易识别、发现并阅读 Levon Zhao 的博客，提升 `levon blog` 的搜索表现。下表是 **最多 8 小时的开发工时预算**，不是已消耗工时，也不是排名生效期限。修改前证据见 [竞品审计](SEO_COMPETITOR_AUDIT_2026-09-13.md)。

## 8 小时怎么分配

| 优先级 | 预算 | 工作及验收结果 |
| --- | ---: | --- |
| P0 | 0.75 小时 | 留存真实 Google 单次样本，检查两站 HTML、robots、canonical、站图与内容；区分事实和排名推断。 |
| P0 | 1.75 小时 | 统一 Levon Blog 与 Levon Zhao 身份、首页及博客标题、导航、描述；首页直接推荐现有原创文章。 |
| P0 | 1.00 小时 | 补充准确的 WebSite、Person、BlogPosting 和面包屑数据、可见作者及 About 链接；检验内容一致性。 |
| P1 | 0.75 小时 | 检查旧路径、404、规范网址、文章日期和站图；修复实际问题，保留真实发布日期。 |
| P1 | 1.00 小时 | 将全站 3D 头像改为首次打开对话才加载；验收首访静态入口、激活、关闭保留、键盘和移动端行为。 |
| P1 | 1.00 小时 | 完善现有研究文章的来源、实验边界与项目链接；不为凑数量发布未经验证的新文章。 |
| P0 | 1.25 小时 | 构建、自动检查和浏览器验收，通过后发布；检查生产 HTML、GSC 所有权验证与站图处理，记录版本和发布时间。 |
| P2 | 0.50 小时 | 建立查询测量口径、14/28 天复盘安排和后续内容提纲；记录下一步依赖。 |
| **合计上限** | **8.00 小时** | 先保证可发现、身份清楚、页面正确且可用，再评估搜索结果。 |

某项提前完成，可把余额投入失败检查和真实瓶颈；不得为用满预算制造内容、重复重抓取或刷搜索点击。未来三篇文章是后续选题，不预设能在本轮预算内全部研究并发布。

## 已做与仍待验收

**已完成的证据或本地实现：**

- 复现一次真实 Google 查询：竞品首页在用户博客列表前；已记录条件，未推广为全球固定名次。
- 确认生产站能提供完整初始 HTML，主要短板是首页通用职位标题及博客页 `Writing` 的品牌表达。
- 本地已统一博客品牌、改进首页/博客入口及文章作者信息，并加入结构化数据和相关检查。
- 已量化原生产首页的 3D 负担：公开模型 Content-Length 约 4.88 MiB，追加脚本 gzip 响应体约 195 KiB；新开浏览器未打开聊天就有 Three.js canvas。
- 本地已实现首次打开 KIRA 才挂载 3D、关闭后保持模型；尚不能将代码变更当作生产性能改善证明。
- GSC 接入由主任务 **正在执行**：已通过浏览器取得公开验证标签并加入生产 layout；将随 SEO 发布后完成所有权验证和检查，不作为必须由用户手动配置的阻塞项。

**发布前验收已通过：** Node 22 生产构建、31 项自动测试、类型检查、ESLint、27 个站图页面 SEO 验证（0 failures / 0 warnings）、不存在文章/项目/Legacy 项目的真实 404，以及 390px 手机博客与导航。生产依赖审计为 0 个已知漏洞。KIRA 首访无 canvas，点击后面板正常；模型 CDN 只允许生产 Origin，本地按既有逻辑回退静态入口，需在真实域名验证 3D 加载。两篇文章均已依据原始材料实质修订并保留原始发布日期。

**发布后仍待取得的证据：** 生产版本确认、GSC 验证结果、关键 URL 的索引/canonical/抓取状态、站图处理结果及后续搜索表现。以本轮最终发布报告为准。

PSI API 本轮返回配额限制；网页真实用户区显示 `No Data`，未取得可用 Lighthouse 评分。不能把无数据写成 CWV 不通过，也不能从体积直接推算性能提升百分比。

## 28 天怎么判断有效

以 **生产发布日为 D0**，保留发布前可用历史；若新验证属性没有历史或查询被隐私阈值隐藏，明确记为“无可用基线”，不填 0。

1. GSC 搜索类型固定为 Web，主要查询按完全匹配 `levon blog`；另分别查看 `levon zhao`、`levon zhao blog`、`levon's blog`。每个词独立记录，不混成一个“平均排名”。
2. 留存点击、曝光、CTR、平均位置及对应着陆页。按相同国家/设备比较；避免将美国桌面与全球移动结果合并解释。平均位置是观察期统计值，不是人人看到的固定名次。
3. D0 确认首页、`/blog`、现有两篇文章可索引、Google 选择的 canonical 与预期一致；待上线后适量请求关键页重抓取并检查站图处理。**提交 sitemap 不保证抓取、收录或排名。**
4. D14 比较发布后完整 14 天与此前完整 14 天；D28 比较完整 28 天与此前 28 天。只使用已完成处理的数据；首次复盘同时检查 Google 是否已抓取新版本，避免把尚未处理的变更判为无效。
5. 低样本时写原始分子/分母，例如“1 次点击 / 9 次曝光”，不把“从 1 到 2 次”包装成显著增长。可以列出 CTR 数值，但不把小样本差异当作改版因果；必要时延长观察窗口。

| 复盘结果 | 下一步 |
| --- | --- |
| 关键页未收录、选错 canonical 或抓取失败 | 优先排查索引与部署状态，暂不讨论文案胜负。 |
| 新标题已处理、身份相关查询更清楚，但曝光很少 | 保持口径，完善公开身份入口和原创文章，积累更多样本。 |
| 曝光增加而点击表现停滞 | 检查实际查询与着陆页是否匹配，再改进搜索标题和摘要表达。 |
| 28 天仍无明显变化 | 复核数据量、内容价值与外部发现渠道；不反复改名或批量生成文章。 |

口径依据：[GSC Performance](https://support.google.com/webmasters/answer/7576553)、[Google sitemap 指南](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)。

## 下一批三篇原创选题

| 选题 | 已有公开依据 | 发布前必须补齐的原创材料 |
| --- | --- | --- |
| **YOLO-KAN 消融实验：精度、网络深度与特征展平的取舍** | [研究项目](https://www.levon.blog/projects/yolo-kan)、[现有文章](https://www.levon.blog/blog/yolo-kan-research)、[研究海报](https://www.levon.blog/media/research/levon-yolo-kan-poster.pdf) | 从原始实验记录核对设置与指标；明确数据划分、训练条件、参数/层数、precision 与 mAP 的区别，解释失败配置。重跑才报告新结果；没有重跑时标为对既有公开实验的复盘，不虚构多次试验或置信区间。 |
| **Beier–Neely 图像变形：定位坐标、取整和旋转错误** | [图形项目](https://www.levon.blog/projects/beier-neely-morphing)、[调试文章](https://www.levon.blog/blog/beier-neely-image-morphing) | 用自制几何图形建立最小可复现样例，展示统一坐标/取整前后、边界采样与尚未修好的旋转结果；提供代码、参数和失败解释。算法来源核实后引用；不重新发布缺少授权记录的旧角色图。 |
| **让 3D AI 作品集按需加载：KIRA 的加载与交互实验** | [公开项目案例](https://www.levon.blog/projects/portfolio-companion)、[AI Companion](https://www.levon.blog/ai-companion)、[公开源码](https://github.com/shankswhite/blog) | 在相同移动/桌面条件下重复冷启动，保存前后版本、资源请求和实验室报告；验证首访不加载模型、首次开启、关闭保留、无 WebGL 降级。记录样本和波动，区分资源减少、实验室指标与真实用户体验；不宣称尚未测到的排名或 CWV 改善。 |

三篇都围绕已有公开工作发展。新增履历、业务收益、实验数字、论文结论和引用必须有来源；不披露雇主机密，也不把通用模型生成内容当作本人做过的实验。Google 更看重原创信息、作者背景与对读者有帮助的亲身经验，没有偏好的固定字数。[Google 有用内容指南](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

## 站外发现入口

2026-09-13 的公开 GitHub API 显示：用户 [shankswhite](https://api.github.com/users/shankswhite) 的 `blog` 为空，博客[仓库](https://api.github.com/repos/shankswhite/blog)的 `homepage` 为 null。建议后续将这两个 Website 字段指向 `https://www.levon.blog`，在准确的个人介绍中保持 Levon Zhao / Xiaofeng Zhao 的身份对应，并在相关公开项目 README 中自然链接具体文章。

本轮已将博客仓库 Website 设置为 https://www.levon.blog，并通过 GitHub API 验证。个人 GitHub Website 仍是后续建议；没有发送推广消息或购买链接。站外入口用于让真实读者发现作品，不承诺链接必定提高排名。LinkedIn 的网站字段仍待核实。

本计划能交付可验证的站点改进，不能保证超过 `levon.homes` 或承诺具体生效日。Google 处理与排名变化需要时间，通常应观察数周；8 小时用于开发与验收，28 天用于有边界地评估趋势。[Google SEO 入门指南](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
