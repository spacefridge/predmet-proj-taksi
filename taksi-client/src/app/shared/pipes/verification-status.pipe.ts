import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "verificationStatus"
})
export class VerificationStatus implements PipeTransform {
	transform(id: number): any {
		switch (id) {
			case 0:
				return "Pending";

			case 1:
				return "Rejected";

			case 2:
				return "Accepted";

			default:
				//
				return id;
		}
	}
}
