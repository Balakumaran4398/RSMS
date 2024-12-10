import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-trai-report',
  templateUrl: './trai-report.component.html',
  styleUrls: ['./trai-report.component.scss']
})
export class TraiReportComponent implements OnInit {

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
  ngOnInit(): void {
    // function toggle_active_info(event) {
    //   console.log(event);
    // }
  }

}
