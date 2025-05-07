export interface FileRecord {
  fileId: string;
  fileName: string;
  fileLocation: string;
  fileCreatedTime: string;
  totalSlides: number;
  fileSlides: {
    slideId: string;
    slideNumber: number;
    slideLocation: string;
  }[];
}