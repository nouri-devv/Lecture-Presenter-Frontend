export interface FileRecord {
  fileId: string;
  fileName: string;
  fileLocation: string;
  fileCreatedTime: string;
  fileSlides: SlideRecord[];
}

export interface SlideRecord {
    slideId: string;
    slideNumber: number;
    slideLocation: string;
}
