export interface Ride {
	startAddress: string;
	endAddress: string;
	userId: number;
	driverId: number;
	price?: number | null;
	rideDuration: number | null;
	waitTime: number | null;
	rideState: number;
}
