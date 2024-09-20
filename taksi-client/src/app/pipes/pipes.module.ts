import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { VerificationStatus } from "../shared/pipes/verification-status.pipe";
import { UserType } from "../shared/pipes/user-type.pipe";
import { MinutesSecondsPipe } from "../shared/pipes/time.pipe";

@NgModule({
	declarations: [VerificationStatus, UserType, MinutesSecondsPipe],
	imports: [CommonModule],
	exports: [VerificationStatus, UserType, MinutesSecondsPipe]
})
export class PipesModule {}
