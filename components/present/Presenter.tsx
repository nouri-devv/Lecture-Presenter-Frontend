interface PresenterProps {
  slideUrl: string;
}

export function Presenter({ slideUrl }: PresenterProps) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-black">
      {slideUrl ? (
        <embed
          src={slideUrl}
          type="application/pdf"
          className="h-full w-full"
        />
      ) : (
        <p className="text-white">Loading slide...</p>
      )}
    </div>
  );
}
