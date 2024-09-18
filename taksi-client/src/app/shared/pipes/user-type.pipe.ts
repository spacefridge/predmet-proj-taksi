import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "userType"
})
export class UserType implements PipeTransform {
	transform(id: number): any {
		switch (id) {
			case 0:
				return "Admin";

			case 1:
				return "Driver";

			case 2:
				return "User";

			default:
				//
				return id;
		}
	}
}
