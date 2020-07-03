import { ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';
import { TimeService } from './service/time.service';

export const timeValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const start = TimeService.toSecondsOfDay(control.get('startTime').value);
    const end = TimeService.toSecondsOfDay(control.get('endTime').value);

    return end <= start ? {'temporalInvalid': true} : null;
}