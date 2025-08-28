import React from "react";
import useCsv from "../hooks/useCsv";

const DatasetLoader = () => {
  const occupations = useCsv("/data/occupations.csv");
  const occupationGroups = useCsv("/data/occupation_groups.csv");
  const occupationHierarchy = useCsv("/data/occupation_hierachy.csv");
  const occupationToSkills = useCsv("/data/occupation_to_skill_relations.csv");
  const skillGroups = useCsv("/data/skill_group.csv");
  const skillHierarchy = useCsv("/data/skill_hierachy.csv");
  const skillToSkillRelations = useCsv("/data/skill_to_skill_relations.csv");
  const skills = useCsv("/data/skills.csv");

  return (
    <div className="p-4 border rounded-lg shadow">
      <h2 className="text-lg font-bold mb-2">Dataset Loader Test</h2>
      <ul className="space-y-1 text-sm">
        <li>Occupations: {occupations.length}</li>
        <li>Occupation Groups: {occupationGroups.length}</li>
        <li>Occupation Hierarchy: {occupationHierarchy.length}</li>
        <li>Occupation → Skills: {occupationToSkills.length}</li>
        <li>Skill Groups: {skillGroups.length}</li>
        <li>Skill Hierarchy: {skillHierarchy.length}</li>
        <li>Skill → Skill Relations: {skillToSkillRelations.length}</li>
        <li>Skills: {skills.length}</li>
      </ul>
    </div>
  );
};

export default DatasetLoader;
