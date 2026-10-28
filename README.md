# ADATT Auto Website

A static automotive parts brand website with supporting UPC barcode and GS1 workbook generation utilities. This repository contains a sanitized source snapshot.

## Features

- Home, company, product catalog, shock and strut, and contact pages.
- Plain HTML, CSS, and JavaScript with SVG illustrations and responsive navigation.
- Vercel deployment configuration without a frontend build step.
- Python utilities for validating UPC check digits and embedding barcode images in Excel.
- A Node.js utility for generating a GS1 import workbook from SKU descriptions.

## Preview

```bash
python -m http.server 8000
```

Open http://localhost:8000 from the project root. For hosting, import the static directory into Vercel and review `vercel.json`.

## Structure

| Path | Purpose |
| --- | --- |
| `index.html`, `about.html`, `contact.html` | Main brand pages |
| `catalog.html`, `products.html`, `shock-and-struts.html` | Product pages |
| `assets/` | Styles, navigation, and SVG assets |
| `build_masterpro_barcodes.py` | UPC validation and barcode workbook generation |
| `build_gs1_template.mjs` | GS1 workbook generation |

## Barcode Utilities

Install Python dependencies with `python -m pip install openpyxl Pillow`. Update `INPUT` and `OUTPUT_DIR` in the Python script, supply your own workbook, then run `python build_masterpro_barcodes.py`.

The GS1 utility requires Node.js and access to `@oai/artifact-tool`, which is not bundled. Update `inputPath` and supply tab-separated SKU and description input before running it.

## Sanitized Release

Original product photography, trademark application materials, input workbooks, and generated output are excluded. Some image references may therefore be unresolved. Local file paths are placeholders. The original public support email is retained. See [SANITIZATION.md](SANITIZATION.md).

No license file is included in this snapshot; public visibility does not itself grant redistribution rights.
