interface ControlProps {
  currentSlide: number;
  totalSlides: number;
  onNext: () => void;
  onPrev: () => void;
}

export function Control({
  currentSlide,
  totalSlides,
  onNext,
  onPrev,
}: ControlProps) {
  return (
    <div className="flex items-center justify-center gap-6 bg-black/80 p-5">
      <button
        onClick={onPrev}
        disabled={currentSlide <= 1}
        className="rounded bg-gray-700 px-6 py-2 text-white transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:bg-gray-800"
      >
        Previous
      </button>
      <span className="text-lg text-white">
        {currentSlide} / {totalSlides}
      </span>
      <button
        onClick={onNext}
        disabled={currentSlide >= totalSlides}
        className="rounded bg-gray-700 px-6 py-2 text-white transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:bg-gray-800"
      >
        Next
      </button>
    </div>
  );
}
