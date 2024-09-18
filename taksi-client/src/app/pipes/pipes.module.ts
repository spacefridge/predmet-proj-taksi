import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { VerificationStatus } from "../shared/pipes/verification-status.pipe";
import { UserType } from "../shared/pipes/user-type.pipe";

@NgModule({
	declarations: [VerificationStatus, UserType],
	imports: [CommonModule],
	exports: [VerificationStatus, UserType]
})
export class PipesModule {}
