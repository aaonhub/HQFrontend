import { useEffect } from 'react';
import { Accordion, AccordionSummary, Card, CardContent, CardHeader, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Sortable from 'sortablejs';

const SortableList = () => {
	const list = [
		{ id: "item1", name: "Item 1", list: [{ id: "subitem1", name: "Subitem 1" }, { id: "subitem2", name: "Subitem 2" }] },
		{ id: "item2", name: "Item 2", list: [] },
		{ id: "item3", name: "Item 3" },
		{ id: "item4", name: "Item 4" }
	];

	useEffect(() => {
		const listElement = document.getElementById('sortable-list');
		if (!listElement) {
			return;
		}
		const sortable = Sortable.create(listElement, {
			group: 'shared',
			animation: 150,
			onEnd: function (evt) {
				const oldIndex = evt.oldIndex;
				const newIndex = evt.newIndex;
				if (oldIndex === undefined || newIndex === undefined) {
					return;
				}
				const item = list[oldIndex];
				list.splice(oldIndex, 1);
				list.splice(newIndex, 0, item);
			}
		});

		list.forEach((item, index) => {
			if (item.list) {
				const subListElement = document.getElementById('sub-sortable-list-' + index);
				if (!subListElement) {
					return;
				}
				Sortable.create(subListElement, {
					group: 'shared',
					animation: 150,
					onEnd: function (evt) {
						const oldIndex = evt.oldIndex;
						const newIndex = evt.newIndex;
						if (oldIndex === undefined || newIndex === undefined) {
							return;
						}
						const subitem = item.list[oldIndex];
						item.list.splice(oldIndex, 1);
						item.list.splice(newIndex, 0, subitem);
					}
				});
			}
		});

		return () => {
			sortable.destroy();
		};
	}, [list]);


	return (
		<div id="sortable-list">
			{list.map((item, index) => (
				item.list ?
					<Card key={item.id} id={item.id} variant="outlined" sx={{ marginBottom: 1 }}>
						<Accordion>
							<AccordionSummary expandIcon={<ExpandMoreIcon />}>
								<CardHeader title={item.name} />
							</AccordionSummary>
							<div
								id={'sub-sortable-list-' + index}
								style={{ minHeight: '50px', border: '1px solid #ddd', padding: '10px' }}
							>
								{item.list.map(subitem => (
									<CardContent key={subitem.id} id={subitem.id}>
										<Typography>{subitem.name}</Typography>
									</CardContent>
								))}
							</div>
						</Accordion>
					</Card>
					:
					<Card key={item.id} id={item.id} variant="outlined" sx={{ marginBottom: 1 }}>
						<CardContent>
							<Typography>{item.name}</Typography>
						</CardContent>
					</Card>
			))}
		</div>
	);

}


export default SortableList;