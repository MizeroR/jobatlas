#!/bin/bash
# Script to download hackathon CSV datasets for Tabiya Graph Navigator

# Make sure public/data exists
mkdir -p public/data

echo "Downloading datasets..."

# Example URLs — replace these with your hosted CSV URLs
curl -L -o public/data/occupations.csv "https://example.com/occupations.csv"
curl -L -o public/data/occupation_groups.csv "https://example.com/occupation_groups.csv"
curl -L -o public/data/occupation_hierachy.csv "https://example.com/occupation_hierachy.csv"
curl -L -o public/data/occupation_to_skill_relations.csv "https://example.com/occupation_to_skill_relations.csv"
curl -L -o public/data/skill_groups.csv "https://example.com/skill_groups.csv"
curl -L -o public/data/skill_hierachy.csv "https://example.com/skill_hierachy.csv"
curl -L -o public/data/skill_to_skill_relations.csv "https://example.com/skill_to_skill_relations.csv"
curl -L -o public/data/skills.csv "https://example.com/skills.csv"

echo "All datasets downloaded successfully!"