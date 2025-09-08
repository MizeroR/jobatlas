import { supabase } from "../supabase.js"

// Clean and format labels as proper titles
function formatLabel(label) {
  if (!label) return "Untitled"
  
  return label
    .replace(/[{}"']/g, '') // Remove quotes and braces
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim() // Remove leading/trailing spaces
    .split(' ') // Split into words
    .map(word => {
      // Capitalize first letter of each word, except common articles/prepositions
      const lowerWord = word.toLowerCase()
      if (['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'].includes(lowerWord) && word !== label.split(' ')[0]) {
        return lowerWord
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
}

// Load occupations
export async function loadOccupations() {
  const { data, error } = await supabase.from("occupations").select("*")
  if (error) throw error

  return data.map((row) => ({
    id: `occupation-${row.id}`,
    label: formatLabel(row.preferredlabel) || "Unnamed Occupation",
    type: "occupation",
    ...row
  }))
}

// Load skills
export async function loadSkills() {
  const { data, error } = await supabase.from("skills").select("*")
  if (error) throw error

  return data.map((row) => ({
    id: `skill-${row.id}`,
    label: formatLabel(row.preferredlabel) || "Unnamed Skill",
    type: "skill",
    ...row
  }))
}

// Load occupation groups
export async function loadOccupationGroups() {
  const { data, error } = await supabase.from("occupation_groups").select("*")
  if (error) throw error

  return data.map((row) => ({
    id: `occ-group-${row.id}`,
    label: formatLabel(row.preferredlabel) || "Unnamed Occupation Group",
    type: "occupation_group",
    ...row
  }))
}

// Load skill groups
export async function loadSkillGroups() {
  const { data, error } = await supabase.from("skill_groups").select("*")
  if (error) throw error

  return data.map((row) => ({
    id: `skill-group-${row.id}`,
    label: formatLabel(row.preferredlabel) || "Unnamed Skill Group",
    type: "skill_group",
    ...row
  }))
}
