const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, 'vzor-odmen.xlsx');
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

console.log("Struktura listu:", sheetName);
console.log("Hledám data (prvních 100 řádků):");
data.slice(0, 100).forEach((row, i) => {
    if (row && row.length > 0 && row.some(cell => cell !== null && cell !== "")) {
        console.log(`Řádek ${i}:`, JSON.stringify(row));
    }
});
