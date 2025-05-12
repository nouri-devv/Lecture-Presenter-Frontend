export interface Session {
  sessionId: string;
  totalSlides: number;
  slides: {
    sessionId: string;
    slideNumber: number;
    slideLocation: string;
  }[];
  llmResponses: {
    sessionId: string;
    llmResponseNumber: number;
    llmResponseHeading: string;
    llmResponseExplanation: string;
  }[];
}