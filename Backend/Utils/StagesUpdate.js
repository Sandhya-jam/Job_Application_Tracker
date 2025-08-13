export function insertCustomStages(existingStages, newCustomStages) {
  const fixedOrder = ["Applied", "Interview", "Offer", "Accepted", "Rejected"];

  let updatedStages = [...existingStages];

  for (let fixedStage of fixedOrder) {
    if (newCustomStages[fixedStage] && Array.isArray(newCustomStages[fixedStage])) {
      for (let newStage of newCustomStages[fixedStage]) {
        const fixedIndex = updatedStages.findIndex(s => s.name === fixedStage);

        if (fixedIndex === -1) {
          throw new Error(`Fixed stage "${fixedStage}" not found in existing stages`);
        }

        // Find the next fixed stage after this one
        const nextFixedIndex = updatedStages.findIndex((s, idx) =>
          idx > fixedIndex && fixedOrder.includes(s.name)
        );

        // Insert right after last custom stage before next fixed stage
        const insertIndex = nextFixedIndex === -1 ? updatedStages.length : nextFixedIndex;
        updatedStages.splice(insertIndex, 0, newStage);
      }
    }
  }

  return updatedStages;
}
