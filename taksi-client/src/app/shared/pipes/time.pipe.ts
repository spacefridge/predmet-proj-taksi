import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "minutesSeconds"
})
export class MinutesSecondsPipe implements PipeTransform {
	transform(value: number): string {
		if (!value) {
			return "0s";
		}

		const totalSeconds = Math.floor(value * 60);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;

		return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
	}
}
