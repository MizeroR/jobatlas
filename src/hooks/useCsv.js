import Papa from "papaparse";

export async function loadCsvData(path) {
  return new Promise((resolve, reject) => {
    Papa.parse(path, {
      download: true,
      header: true,   // ensures you get objects, not arrays
      complete: (results) => {
        console.log(`📂 Loaded: ${path}`);
        console.log(results.data.slice(0, 5)); // 👈 log first 5 rows
        resolve(results.data);
      },
      error: (err) => reject(err),
    });
  });
}
