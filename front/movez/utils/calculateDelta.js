export const calculateDelta = (fromCoor, toCoor) => {
	const R = 6371; // Radius of the earth in km
	const lat1 = fromCoor.latitude * Math.PI / 180; // Convert degrees to radians
	const lat2 = toCoor.latitude * Math.PI / 180;
	const lng1 = fromCoor.longitude * Math.PI / 180;
	const lng2 = toCoor.longitude * Math.PI / 180;

	const dLat = lat2 - lat1;
	const dLng = lng2 - lng1;

	const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(lat1) * Math.cos(lat2) *
		Math.sin(dLng / 2) * Math.sin(dLng / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	const distance = R * c; // Distance in km

	return {
		latDelta: dLat * (180 / Math.PI), // Convert radians to degrees
		lngDelta: dLng * (180 / Math.PI)
	};
}