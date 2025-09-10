import { supabase } from '../supabase.js'

// Occupation hierarchy edges
export async function loadOccupationHierarchy() {
  const { data, error } = await supabase.from("occupation_hierarchy").select("*")
  if (error) throw error

  return data.map((row) => ({
    source: row.parentid,
    target: row.childid,
    type: "occupation_hierarchy",
    ...row
  }))
}

// Skill hierarchy edges
export async function loadSkillHierarchy() {
  const { data, error } = await supabase.from("skill_hierarchy").select("*")
  if (error) throw error

  return data.map((row) => ({
    source: row.parentid,
    target: row.childid,
    type: "skill_hierarchy",
    ...row
  }))
}

// Occupation-to-skill relations
export async function loadOccupationToSkillRelations() {
  const { data, error } = await supabase.from("occupation_to_skill_relations").select("*")
  if (error) throw error

  return data.map((row) => ({
    source: row.occupationid,
    target: row.skillid,
    type: row.relationtype || "occupation_to_skill",
    ...row
  }))
}

// Skill-to-skill relations
export async function loadSkillToSkillRelations() {
  const { data, error } = await supabase.from("skill_to_skill_relations").select("*")
  if (error) throw error

  return data.map((row) => ({
    source: row.requiringid,
    target: row.requiredid,
    type: row.relationtype || "skill_to_skill",
    ...row
  }))
}
