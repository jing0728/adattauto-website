import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const inputPath = String.raw`C:\Users\<user>\.codex\attachments\1c1ca685-46a6-40d8-b526-3f70022304a1\已粘贴的文本.txt`;
const outputDir = path.resolve("output");
const outputPath = path.join(outputDir, "GS1_XXX_AUTO_Import_Template.xlsx");

const raw = await fs.readFile(inputPath, "utf8");
const lines = raw.trim().split(/\r?\n/).filter(Boolean);
const dataRows = lines.slice(1).map((line) => {
  const [sku, description] = line.split("\t");
  return { sku: sku?.trim() ?? "", description: description?.trim() ?? "" };
});

const headers = [
  "SKU",
  "Description",
  "BrandName",
  "Desc1Language",
  "Brand1Language",
  "Status",
  "Industry",
  "IsVariable",
  "IsPurchasable",
  "ChildGTINs",
  "Quantity",
  "Action",
  "GS1CompanyPrefix",
  "GTIN",
  "PackagingLevel",
];

const rows = dataRows.map((row) => [
  row.sku,
  row.description,
  "XXX AUTO",
  "en",
  "en",
  "In Use",
  "General",
  "N",
  "Y",
  "",
  "",
  "Create",
  "",
  "",
  "Each",
]);

const workbook = Workbook.create();
const sheet = workbook.worksheets.add("GS1 Import Template");
const notes = workbook.worksheets.add("Instructions");

sheet.showGridLines = false;
notes.showGridLines = false;

sheet.getRange("A1:O1").values = [headers];
sheet.getRangeByIndexes(1, 0, rows.length, headers.length).values = rows;

const usedRange = sheet.getRangeByIndexes(0, 0, rows.length + 1, headers.length);
usedRange.format.font = { name: "Arial", size: 10, color: "#111111" };
sheet.getRange("A1:O1").format = {
  fill: "#1F4E78",
  font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" },
};
sheet.getRange("A1:O1").format.wrapText = true;
usedRange.format.borders = { preset: "all", style: "thin", color: "#D9E2F3" };
sheet.freezePanes.freezeRows(1);
sheet.getRange("A:O").format.verticalAlignment = "center";
sheet.getRange("A:O").format.autofitColumns();
sheet.getRange("B:B").format.columnWidth = 48;
sheet.getRange("A:A").format.columnWidth = 31;
sheet.getRange("M:N").format.columnWidth = 20;
sheet.getRange("A:O").format.numberFormat = "@";

// Dropdowns for fields with limited valid values.
sheet.getRange(`F2:F${rows.length + 1}`).dataValidation = {
  rule: { type: "list", values: ["In Use", "PreMarket"] },
};
sheet.getRange(`G2:G${rows.length + 1}`).dataValidation = {
  rule: { type: "list", values: ["General", "CPG", "Regulated Healthcare", "Foodservice", "Apparel"] },
};
sheet.getRange(`H2:H${rows.length + 1}`).dataValidation = {
  rule: { type: "list", values: ["N", "Y"] },
};
sheet.getRange(`I2:I${rows.length + 1}`).dataValidation = {
  rule: { type: "list", values: ["Y", "N"] },
};
sheet.getRange(`L2:L${rows.length + 1}`).dataValidation = {
  rule: { type: "list", values: ["Create"] },
};
sheet.getRange(`O2:O${rows.length + 1}`).dataValidation = {
  rule: { type: "list", values: ["Each"] },
};

notes.getRange("A1").values = [["GS1 batch import notes"]];
notes.getRange("A1").format.font = { name: "Arial", size: 14, bold: true, color: "#111111" };
notes.getRange("A3:B15").values = [
  ["Field", "How to fill"],
  ["SKU", "Use the O'Reilly SKU or your internal SKU. Each row should be unique."],
  ["Description", "Buyer-facing product description. This workbook uses XXX AUTO Complete Strut Assembly plus the XXX part number."],
  ["BrandName", "XXX AUTO"],
  ["Desc1Language / Brand1Language", "en"],
  ["Status", "Use In Use if the item is already being sold. Use PreMarket if not yet in commerce."],
  ["Industry", "General"],
  ["IsVariable", "N for these auto parts; they are not variable by weight, count, or volume."],
  ["IsPurchasable", "Y for individual sale items."],
  ["ChildGTINs / Quantity", "Leave blank for Each-level products. Use only for cases, inner packs, pallets, or other higher-level packaging."],
  ["Action", "Create"],
  ["GS1CompanyPrefix / GTIN", "In the official GS1 Assigned GTINs template these are usually prefilled. If you paste this data into GS1's template, do not overwrite the prefilled prefix or GTIN columns."],
  ["PackagingLevel", "Each"],
];
notes.getRange("A3:B15").format.font = { name: "Arial", size: 10, color: "#111111" };
notes.getRange("A3:B3").format = {
  fill: "#1F4E78",
  font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" },
};
notes.getRange("A3:B15").format.borders = { preset: "all", style: "thin", color: "#D9E2F3" };
notes.getRange("A:B").format.autofitColumns();
notes.getRange("B:B").format.columnWidth = 90;
notes.getRange("B:B").format.wrapText = true;
notes.freezePanes.freezeRows(3);

await fs.mkdir(outputDir, { recursive: true });
const preview = await workbook.render({ sheetName: "GS1 Import Template", range: "A1:O12", scale: 1, format: "png" });
await fs.writeFile(path.join(outputDir, "GS1_XXX_AUTO_Import_Template_preview.png"), new Uint8Array(await preview.arrayBuffer()));

const exported = await SpreadsheetFile.exportXlsx(workbook);
await exported.save(outputPath);

const inspect = await workbook.inspect({
  kind: "table",
  sheetId: "GS1 Import Template",
  range: "A1:O6",
  include: "values",
  tableMaxRows: 6,
  tableMaxCols: 15,
});
console.log(inspect.ndjson);
console.log(JSON.stringify({ outputPath, rowCount: rows.length }));
