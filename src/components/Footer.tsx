export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} SEO Platform. Alla rättigheter reserverade.</p>
        <div className="flex items-center gap-4">
          <a className="hover:text-white" href="mailto:support@example.com">
            support@example.com
          </a>
          <a className="hover:text-white" href="https://status.example.com">
            Driftstatus
          </a>
        </div>
      </div>
    </footer>
  );
}


