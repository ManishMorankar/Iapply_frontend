import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PasswordStrengthBarComponent } from './password-strength-bar/password-strength-bar.component'
import { AnalyticsComponent } from './analytics/analytics.component';
@NgModule({
    declarations: [IApplyCommonModule.passwordBarComponent, IApplyCommonModule.analyticsComponent],
    imports: [CommonModule],
    exports: [IApplyCommonModule.passwordBarComponent, IApplyCommonModule.analyticsComponent],
    entryComponents: [IApplyCommonModule.passwordBarComponent, IApplyCommonModule.analyticsComponent],
})
export class IApplyCommonModule {
    static passwordBarComponent = PasswordStrengthBarComponent;
    static analyticsComponent = AnalyticsComponent;
}