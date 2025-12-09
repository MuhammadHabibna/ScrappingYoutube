import { unparse } from "papaparse";

export function downloadCSV(data: any[], filename: string) {
    const csv = unparse(data);
    // Add Byte Order Mark (BOM) for Excel UTF-8 compatibility
    const bom = "\uFEFF";
    const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
