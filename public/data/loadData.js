import Papa from "papaparse";

export const loadCSV = (file) => {
  return new Promise((resolve) => {
    Papa.parse(file, {
      download: true,
      header: true,
      complete: (result) => {
        resolve(result.data);
      },
    });
  });
};