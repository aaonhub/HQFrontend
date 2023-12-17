
interface ObjectWithId {
	id: string;
	[key: string]: any; // Allow for any additional properties
}

export function sortObjectsByIds(objects: ObjectWithId[], ids: string[]): ObjectWithId[] {
	// First, ensure that both objects and ids are valid arrays.
	if (!Array.isArray(objects) || !Array.isArray(ids)) {
		return objects
	}

	const objectsMap: { [key: string]: ObjectWithId } = {};
	objects.forEach(object => {
		objectsMap[object.id] = object;
	});

	// Create an array of objects based on the order of ids.
	const sortedObjects = ids
		.map(id => objectsMap[id]) // Transform ids to objects.
		.filter(object => object !== undefined); // Remove undefined entries (for ids not found in objects).

	// Optionally, you can include objects not in ids at the end.
	const notIncludedObjects = objects.filter(object => !ids.includes(object.id));

	return [...sortedObjects, ...notIncludedObjects];
}
