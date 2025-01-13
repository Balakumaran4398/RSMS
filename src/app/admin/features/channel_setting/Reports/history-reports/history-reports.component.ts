import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-history-reports',
  templateUrl: './history-reports.component.html',
  styleUrls: ['./history-reports.component.scss']
})
export class HistoryReportsComponent {
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
