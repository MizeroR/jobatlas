import { loadOccupations, loadSkills, loadOccupationGroups, loadSkillGroups } from './nodes.js'
import { loadOccupationHierarchy, loadSkillHierarchy, loadOccupationToSkillRelations, loadSkillToSkillRelations } from './edges.js'

export async function buildGraph() {
  // Load all nodes
  const [occupations, skills, occGroups, skillGroups] = await Promise.all([
    loadOccupations(),
    loadSkills(),
    loadOccupationGroups(),
    loadSkillGroups()
  ])

  // Load all edges
  const [occHierarchy, skillHierarchy, occToSkill, skillToSkill] = await Promise.all([
    loadOccupationHierarchy(),
    loadSkillHierarchy(),
    loadOccupationToSkillRelations(),
    loadSkillToSkillRelations()
  ])

  return {
    nodes: [...occupations, ...skills, ...occGroups, ...skillGroups],
    edges: [...occHierarchy, ...skillHierarchy, ...occToSkill, ...skillToSkill]
  }
}