export function boxSelection({
	state,
	initialPosition,
	finalPosition,
	keepInitialSelection,
}) {
	if (keepInitialSelection) {
		state.selection.clear();
		const indexes = Object.keys(state.freezedValues.notes);
		state.selection.setSelected(indexes);
	} else {
		state.selection.clear();
	}
	for (let index in state.notes) {
		const start = state.notes[index].start;
		const end = state.notes[index].start + state.notes[index].duration;
		const height = state.notes[index].height;
		if (
			start > initialPosition[0] &&
			start < finalPosition[0] &&
			end > initialPosition[0] &&
			end < finalPosition[0] &&
			height > initialPosition[1] &&
			height < finalPosition[1]
		) {
			state.selection.addInSelection(index);
		}
	}
}
