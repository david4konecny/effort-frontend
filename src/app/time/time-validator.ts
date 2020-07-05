import { ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';
import { TimeUtil } from './time-util';

export const timeValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const start = TimeUtil.toSecondsOfDay(control.get('startTime').value);
    const end = TimeUtil.toSecondsOfDay(control.get('endTime').value);

    return end <= start ? {'temporalInvalid': true} : null;
}