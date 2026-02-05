import { History, Trash2, RotateCcw, Eye } from "lucide-react";
import { formatTs } from "@/lib/helpers";

interface HistoryEntry {
    id: string;
    ts: number;
    label: string;
    report: string;
    inputs: { patientName: string; species: string; notes: string };
    baseReportId?: string;
    baseVersion?: number;
    editVersion?: number;
    kind: "base" | "edit";
}

interface HistoryPanelProps {
    history: HistoryEntry[];
    selectedId: string | null;
    setSelectedId: (id: string | null) => void;
    onRestore: (version: HistoryEntry) => void;
    onDelete: (id: string) => void;
}

export function HistoryPanel({
    history,
    selectedId,
    setSelectedId,
    onRestore,
    onDelete,
}: HistoryPanelProps) {
    const shouldScroll = history.length > 3;

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg  bg-linear-to-br from-primary/20 to-violet-500/15 border border-primary/10">
                    <History className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-foreground">Historial</h2>
                    <p className="text-xs text-muted-foreground">
                        {history.length} {history.length === 1 ? "versión" : "versiones"} guardadas
                    </p>
                </div>
            </div>

            {/* LIST */}
            <div className="flex-1 min-h-0">
                <div
                    className={[
                        "space-y-2 pr-1",
                        shouldScroll ? "max-h-112 overflow-y-auto" : "",
                    ].join(" ")}
                >
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-8">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                                <History className="h-6 w-6 text-muted-foreground/50" />
                            </div>
                            <p className="text-sm text-muted-foreground">Sin versiones aún</p>
                            <p className="text-xs text-muted-foreground/70 mt-1">
                                Genera tu primer reporte
                            </p>
                        </div>
                    ) : (
                        history.map((entry) => {
                            const isActive = selectedId === entry.id;

                            return (
                                <div
                                    key={entry.id}
                                    className={`rounded-lg border p-3 transition-all cursor-pointer ${isActive
                                        ? "border-primary bg-primary/5"
                                        : "border-border bg-card hover:border-primary/30 hover:bg-muted/50"
                                        }`}
                                    onClick={() => setSelectedId(entry.id)}
                                >
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-sm font-medium text-foreground truncate">
                                                    {entry.label}
                                                </span>

                                                {/* IA vs Edición chip */}
                                                {entry.kind === "edit" ? (
                                                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                                                        Edición
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                                                        IA
                                                    </span>
                                                )}

                                                {isActive && (
                                                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                                                        Viendo
                                                    </span>
                                                )}
                                            </div>

                                            <span className="text-xs text-muted-foreground">
                                                {formatTs(entry.ts)}
                                            </span>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(entry.id);
                                            }}
                                            className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                            title="Eliminar versión"
                                            type="button"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                                        <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                                            {entry.inputs.patientName || "—"}
                                        </span>
                                        <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                                            {entry.inputs.species || "—"}
                                        </span>
                                    </div>

                                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                                        {entry.report.slice(0, 100)}
                                        {entry.report.length > 100 ? "..." : ""}
                                    </p>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedId(entry.id);
                                            }}
                                            className="flex-1 flex items-center justify-center gap-1.5 rounded-md border border-border bg-card px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                                            type="button"
                                        >
                                            <Eye className="h-3 w-3" />
                                            Ver
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedId(entry.id);
                                                onRestore(entry);
                                            }}
                                            className="flex-1 flex items-center justify-center gap-1.5 rounded-md bg-primary px-2 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 transition-all"
                                            type="button"
                                        >
                                            <RotateCcw className="h-3 w-3" />
                                            Restaurar
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
