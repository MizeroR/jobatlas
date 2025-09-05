import { useEffect } from "react";
import Papa from "papaparse";

const loadCsvData = (path) => {
  console.log(`Attempting to load: ${path}`);
  return new Promise((resolve, reject) => {
    Papa.parse(path, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        console.log(`✅ Loaded ${path}:`, result.data.slice(0, 3));
        resolve(result.data);
      },
      error: (error) => {
        console.error(`❌ Error loading ${path}:`, error);
        reject(error);
      }
    });
  });
};

export default function DebugCsv() {
  useEffect(() => {
    console.log('🚀 Starting CSV load...');
    async function load() {
      try {
        await loadCsvData("/data/occupation_groups.csv");
        await loadCsvData("/data/occupation_hierarchy.csv");
        await loadCsvData("/data/occupation_to_skill_relations.csv");
        await loadCsvData("/data/occupations.csv");
        await loadCsvData("/data/skill_groups.csv");
        await loadCsvData("/data/skill_hierarchy.csv");
        await loadCsvData("/data/skill_to_skill_relations.csv");
        await loadCsvData("/data/skills.csv");
      } catch (error) {
        console.error('Failed to load CSV:', error);
      }
    }
    load();
  }, []);

  return <div>Check your console for CSV data 👀</div>;
}
