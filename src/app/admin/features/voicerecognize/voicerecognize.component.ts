import { AfterViewInit, Component, NgZone, OnInit } from '@angular/core';
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

@Component({
  selector: 'app-voicerecognize',
  templateUrl: './voicerecognize.component.html',
  styleUrls: ['./voicerecognize.component.scss']
})

export class VoicerecognizeComponent implements OnInit, AfterViewInit {
  recognizedText: string = '';
  isListening: boolean = false;
  recognition: any;

  constructor(private ngZone: NgZone) { }
  ngOnInit(): void {
    // const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    // const recognition = new SpeechRecognition();

    // const output = document.querySelector("#output");
    // const startBtn = document.querySelector("#start-btn");
    // console.log('1111111111', startBtn);

    // const stopBtn = document.querySelector("#stop-btn");
    // console.log('222222222222', stopBtn);

    // recognition.continuous = true;

    // startBtn?.addEventListener("click", () => {
    //   recognition.start();
    // });

    // stopBtn?.addEventListener("click", () => {
    //   recognition.stop();
    // });

    // recognition.addEventListener("result", (event: any) => {
    //   const transcript = Array.from(event.results)
    //     .map((result: any) => result[0].transcript)
    //     .join("");

    //   if (output) {
    //     output.textContent = transcript;
    //   }
    // });
  }
  // ngAfterViewInit(): void {
  //   const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  //   const recognition = new SpeechRecognition();

  //   const output = document.querySelector("#output");
  //   const startBtn = document.querySelector("#start-btn");
  //   const stopBtn = document.querySelector("#stop-btn");

  //   console.log('Start Button:', startBtn);
  //   console.log('Stop Button:', stopBtn);

  //   recognition.continuous = true;

  //   startBtn?.addEventListener("click", () => {
  //     console.log("Start button clicked");
  //     recognition.start();
  //   });

  //   stopBtn?.addEventListener("click", () => {
  //     console.log("Stop button clicked");
  //     recognition.stop();
  //   });

  //   recognition.addEventListener("result", (event: any) => {
  //     const transcript = Array.from(event.results)
  //       .map((result: any) => result[0].transcript)
  //       .join("");

  //     if (output) {
  //       output.textContent = transcript;
  //       console.log(transcript);

  //     }
  //     console.log(transcript);

  //   });
  // }


  ngAfterViewInit(): void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in your browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    const output = document.querySelector("#output");
    const startBtn = document.querySelector("#start-btn");
    const stopBtn = document.querySelector("#stop-btn");

    console.log('Start Button:', startBtn);
    console.log('Stop Button:', stopBtn);

    startBtn?.addEventListener("click", () => {
      console.log("🎤 Start button clicked. Listening...");
      recognition.start();
    });

    stopBtn?.addEventListener("click", () => {
      console.log("🛑 Stop button clicked.");
      recognition.stop();
    });

    recognition.addEventListener("result", (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join("");

      console.log("🗣️ Transcript:", transcript);
      if (output) {
        output.textContent = transcript;
      }
    });

    recognition.addEventListener("error", (event: any) => {
      console.error("Speech recognition error:", event.error);
    });

    recognition.addEventListener("end", () => {
      console.log("Recognition ended.");
    });
  }


}
