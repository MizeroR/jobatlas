import { useEffect, useState } from "react";
import Papa from "papaparse";

export default function useCsv(path) {
  const [data, setData] = useState([]);

  useEffect(() => {
    Papa.parse(path, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setData(result.data);
      },
    });
  }, [path]);

  return data;
}
