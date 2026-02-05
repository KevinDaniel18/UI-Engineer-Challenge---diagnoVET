import type { HistoryEntry } from "@/App";

export function formatTs(ts: string | number | Date) {
    const d = new Date(ts);
    return d.toLocaleString("es-ES", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export type ReportType = {
    patientName: string;
    species: string;
    notes: string;
};

export function makeReport({ patientName, species, notes }: ReportType) {
    const impressions = [
        "Hallazgos compatibles con proceso inflamatorio leve.",
        "Se recomienda correlacionar con examen físico y antecedentes.",
        "Considerar control en 7–10 días o antes si empeora.",
        "Sugerir pruebas complementarias según evolución clínica.",
    ];
    const pick =
        impressions[
        (patientName.length + species.length + notes.length) % impressions.length
        ];

    return `DIAGNÓSTICO VETERINARIO (Generado por IA)

Paciente: ${patientName || "—"}
Especie: ${species || "—"}

Resumen clínico:
${notes || "—"}

Impresión:
• ${pick}

Plan sugerido:
• Monitoreo de signos clínicos
• Ajustes terapéuticos según respuesta
• Reevaluación programada

Nota: Este reporte es un borrador. Requiere validación profesional.`;
}

export function extractInputsFromReportText(report: string): Partial<HistoryEntry["inputs"]> {
    const getLineValue = (label: string) => {
        const re = new RegExp(`^\\s*${label}\\s*:\\s*(.+)\\s*$`, "mi");
        const m = report.match(re);
        return m?.[1]?.trim();
    };

    return {
        patientName: getLineValue("Paciente"),
        species: getLineValue("Especie"),
    };
}

export function safeUUID() {
  // Modern browsers
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    // @ts-ignore
    return crypto.randomUUID();
  }

  // Fallback: UUID v4 usando getRandomValues si existe
  if (typeof crypto !== "undefined" && (crypto as any).getRandomValues) {
    const buf = new Uint8Array(16);
    (crypto as any).getRandomValues(buf);

    // v4
    buf[6] = (buf[6] & 0x0f) | 0x40;
    buf[8] = (buf[8] & 0x3f) | 0x80;

    const hex = [...buf].map((b) => b.toString(16).padStart(2, "0")).join("");
    return (
      hex.slice(0, 8) +
      "-" +
      hex.slice(8, 12) +
      "-" +
      hex.slice(12, 16) +
      "-" +
      hex.slice(16, 20) +
      "-" +
      hex.slice(20)
    );
  }

  // Último recurso
  return `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

