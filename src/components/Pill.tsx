import type { ReactNode } from 'react';

export default function Pill({ children }: { children: ReactNode }) {
    return (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
            {children}
        </span>
    );
}
