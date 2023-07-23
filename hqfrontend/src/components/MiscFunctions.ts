
interface ObjectWithId {
	id: string;
	[key: string]: any; // Allow for any additional properties
}

export function sortObjectsByIds(objects: ObjectWithId[], ids: string[]): ObjectWithId[] {
	const objectsMap: { [key: string]: ObjectWithId } = {};
	objects.forEach(object => {
		objectsMap[object.id] = object;
	});

	// Sort ids that exist in objects
	const sortedExistingIds = ids.filter(id => objectsMap.hasOwnProperty(id)).map(id => objectsMap[id]);

	// Get objects that don't exist in ids
	const notExistingObjects = objects.filter(object => !ids.includes(object.id));

	// Return new array: notExistingObjects at the front + sortedExistingIds
	return [...notExistingObjects, ...sortedExistingIds];
}
