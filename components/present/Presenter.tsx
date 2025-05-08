interface PresenterProps {
  slideUrl: string;
}

export function Presenter({ slideUrl }: PresenterProps) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-black">
      <embed
        src={slideUrl ?? ""}
        type="image/png"
        className="h-full w-full object-contain"
      />
    </div>
  );
}
