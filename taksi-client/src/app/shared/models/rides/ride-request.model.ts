export interface RideRequest {
	startAddress: string;
	endAddress: string;
	userId: number;
	price?: number | null;
	waitTime: number | null;
	connectionId: string | null;
}
