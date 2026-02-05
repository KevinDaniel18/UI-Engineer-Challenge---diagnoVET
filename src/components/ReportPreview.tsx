import { useEffect } from "react"

import { Check, Clock, Copy, FileText, Save } from "lucide-react";
import { useState } from "react";
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

interface ReportPreviewProps {
    activeReport: string;                 // lo que se está mostrando (selectedVersion?.report ?? currentReport)
    selectedVersion: HistoryEntry | null; // versión seleccionada (solo lectura)
    draftReport: string;                  // texto editable
    setDraftReport: (value: string) => void;
    onSaveVersion: () => void;            // guarda draft como nueva versión
    onDirtyChange: (dirty: boolean) => void;
    isDirty: boolean;
}

export function ReportPreview({
    activeReport,
    selectedVersion,
    draftReport,
    setDraftReport,
    onSaveVersion,
    onDirtyChange,
    isDirty,
}: ReportPreviewProps) {
    const [copied, setCopied] = useState(false);

    // Cuando cambias de versión seleccionada (o pasas a "reporte actual"),
    // cargamos ese texto en el borrador y limpiamos el dirty.
    useEffect(() => {
        setDraftReport(activeReport || "");
        onDirtyChange(false);
        // Importante: depende de selectedVersion?.id para no resetear por cada keystroke
        // (activeReport cambia mientras escribes si lo derivabas del draft).
        // Aquí asumimos que activeReport viene de history/current, no del draft.
    }, [selectedVersion?.id]); // también podrías agregar selectedVersion === null como caso si lo cambias con un botón

    const handleCopy = async () => {
        await navigator.clipboard.writeText(draftReport || "");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleChange = (value: string) => {
        setDraftReport(value);
        onDirtyChange(true);
    };

    const hasText = (draftReport ?? "").trim().length > 0;

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="relative shrink-0">
                        <div className="relative flex items-center justify-center h-10 w-10 rounded-lg bg-linear-to-br from-primary/20 to-violet-500/15 border border-primary/10">
                            <FileText className="h-5 w-5 text-primary" />
                        </div>
                    </div>

                    <div className="min-w-0">
                        <h2 className="text-lg font-semibold text-foreground leading-tight">
                            Vista previa
                        </h2>

                        {selectedVersion ? (
                            <>
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3 text-primary/70" />
                                    <span className="truncate font-medium text-foreground/80">
                                        {selectedVersion.label}
                                    </span>
                                    <span className="text-border/60">•</span>
                                    <span className="whitespace-nowrap">
                                        {formatTs(selectedVersion.ts)}
                                    </span>
                                </div>

                                {isDirty && (
                                    <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                                        Cambios sin guardar
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <p className="text-xs text-muted-foreground">
                                    {hasText ? "Reporte actual" : "Sin reporte generado"}
                                </p>

                                {isDirty && hasText && (
                                    <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                                        Cambios sin guardar
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {hasText && (
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-1.5 rounded-lg border border-border/70 bg-card/80 px-3 py-2 text-xs font-medium text-muted-foreground transition-all 
                   hover:bg-primary/5 hover:text-primary"
                        >
                            {copied ? (
                                <>
                                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                                    Copiado
                                </>
                            ) : (
                                <>
                                    <Copy className="h-3.5 w-3.5" />
                                    Copiar
                                </>
                            )}
                        </button>
                    )}

                    {/* Guardar como nueva versión */}
                    <button
                        onClick={onSaveVersion}
                        disabled={!isDirty || !hasText}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all
                 bg-linear-to-r from-primary to-violet-500 text-primary-foreground shadow-sm
                 hover:opacity-95 hover:shadow-md
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                        title="Guardar esta edición como nueva versión (no modifica el historial existente)"
                    >
                        <Save className="h-3.5 w-3.5" />
                        Guardar versión
                    </button>
                </div>
            </div>
            <div className="flex-1 relative">
                {hasText ? (
                    <textarea
                        value={draftReport}
                        onChange={(e) => handleChange(e.target.value)}
                        className="absolute inset-0 w-full h-full rounded-lg border border-border bg-card p-4 text-sm leading-relaxed outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none font-mono"
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
                        <FileText className="h-12 w-12 text-muted-foreground/40 mb-3" />
                        <p className="text-sm text-muted-foreground text-center">
                            Completa los datos del paciente
                            <br />y genera un reporte con IA
                        </p>
                    </div>
                )}
            </div>

            {hasText && (
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Puedes editar el texto directamente</span>
                    <span>{draftReport.length} caracteres</span>
                </div>
            )}
        </div>
    );
}
