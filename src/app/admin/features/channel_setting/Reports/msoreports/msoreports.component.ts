import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-msoreports',
  templateUrl: './msoreports.component.html',
  styleUrls: ['./msoreports.component.scss']
})
export class MsoreportsComponent {
step = signal(0);
  setStep(index: number) {
    this.step.set(index);
  }

  nextStep() {
    this.step.update(i => i + 1);
  }

  prevStep() {
    this.step.update(i => i - 1);
  }
}
