'use client';
import { ReactNode, useState } from "react";

export function DialogForm({
  trigger,
  title,
  description,
  onSubmit,
  children
}: {
  trigger: ReactNode;
  title: string;
  description?: string;
  onSubmit: () => Promise<void> | void;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSubmit();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2">{trigger}</button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-card/90 p-6 shadow-glow">
            <div className="mb-4 space-y-1">
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              {description && <p className="text-sm text-white/60">{description}</p>}
            </div>
            <div className="space-y-3">{children}</div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/5"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-black hover:shadow-glow"
                disabled={loading}
              >
                {loading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
