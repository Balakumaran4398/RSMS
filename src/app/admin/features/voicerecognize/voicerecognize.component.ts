import { Component, NgZone } from '@angular/core';

@Component({
  selector: 'app-voicerecognize',
  templateUrl: './voicerecognize.component.html',
  styleUrls: ['./voicerecognize.component.scss']
})
export class VoicerecognizeComponent {
 recognizedText: string = '';
  isListening: boolean = false;
  recognition: any;

  constructor(private ngZone: NgZone) {}

  startListening(): void {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in your browser.');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'en-US';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this.ngZone.run(() => {
        this.isListening = true;
      });
    };

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.ngZone.run(() => {
        this.recognizedText = transcript;
        this.isListening = false;
      });
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.ngZone.run(() => {
        this.isListening = false;
      });
    };

    this.recognition.onend = () => {
      this.ngZone.run(() => {
        this.isListening = false;
      });
    };

    this.recognition.start();
  }

  stopListening(): void {
    if (this.recognition) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}
