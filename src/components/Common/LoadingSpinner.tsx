export default function LoadingSpinner({ text }: { text?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-300">
      <span className="size-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
      {text ?? "Laddar..."}
    </div>
  );
}


