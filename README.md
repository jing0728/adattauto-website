# ADATT Auto · 汽车配件展示网站

面向汽车零部件品牌的静态展示站，配套 UPC 条码图片及 GS1 导入表生成脚本。本仓库是脱敏后的代码展示版本。

## 功能与技术

- 首页、品牌介绍、产品分类、产品目录、减振器专题及联系页面。
- HTML、CSS、原生 JavaScript；无需前端构建即可预览。
- SVG 配件插图和响应式导航；包含 Vercel 部署配置。
- Python 脚本校验 UPC 校验位、生成条码图片并写回 Excel。
- Node.js 脚本将 SKU / 描述文本整理为 GS1 导入工作簿。

## 本地预览

在项目根目录运行：

```bash
python -m http.server 8000
```

浏览器打开 http://localhost:8000 。也可将静态目录导入 Vercel，并结合 `vercel.json` 配置部署。

## 目录

| 路径 | 用途 |
| --- | --- |
| `index.html`、`about.html`、`contact.html` | 首页、品牌及联系页面 |
| `catalog.html`、`products.html`、`shock-and-struts.html` | 产品展示 |
| `assets/` | 样式、导航脚本和 SVG 图标 |
| `build_masterpro_barcodes.py` | Excel 与 UPC 条码处理 |
| `build_gs1_template.mjs` | GS1 工作簿生成 |

## 条码工具

Python 工具依赖 `openpyxl`、`Pillow`，可通过 `python -m pip install openpyxl Pillow` 安装。使用前修改脚本内 `INPUT`、`OUTPUT_DIR`，提供自己的工作簿后执行 `python build_masterpro_barcodes.py`。

GS1 工具依赖 Node.js 和 `@oai/artifact-tool`，该依赖未随仓库提供；需具备可用的依赖环境，并修改脚本中的 `inputPath`。输入按脚本要求提供制表符分隔的 SKU 与描述。

## 脱敏版边界

产品原图、商标申请资料、输入工作簿和生成结果未提供，因此部分图片引用可能缺失。脚本中的本机路径是占位值，需自行配置。网站原有公开联系邮箱保留。详细范围见 [脱敏说明](脱敏说明.md)。

仓库未附开源许可证；公开可见不代表自动授予商标、图片或代码的再分发许可。
