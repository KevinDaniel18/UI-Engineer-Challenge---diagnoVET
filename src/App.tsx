import { useEffect, useMemo, useRef, useState } from "react";
import { Stethoscope} from "lucide-react";

import { extractInputsFromReportText, makeReport, safeUUID } from "./lib/helpers";
import { PatientForm } from "./components/PatientForms";
import { ReportPreview } from "./components/ReportPreview";
import { HistoryPanel } from "./components/HistoryPanel";

export interface HistoryEntry {
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

function App() {
  const [patientName, setPatientName] = useState("Luna");
  const [species, setSpecies] = useState("Canino");
  const [notes, setNotes] = useState(
    "Vómitos intermitentes, letargo, disminución del apetito."
  );

  const [currentReport, setCurrentReport] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "generating">("idle");

  const [draftReport, setDraftReport] = useState("");
  const [, setBaseCounter] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  const latestInputsRef = useRef({ patientName, species, notes });

  const selectedVersion = useMemo(
    () => history.find((h) => h.id === selectedId) || null,
    [history, selectedId]
  );

  const activeReport = selectedVersion?.report ?? currentReport;

  useEffect(() => {
    latestInputsRef.current = { patientName, species, notes };
  }, [patientName, species, notes]);

  function addBaseReport(reportText: string) {
    const text = reportText.trim();
    if (!text) return;

    setBaseCounter((n) => {
      const baseVersion = n + 1;

      const entry: HistoryEntry = {
        id: safeUUID(),
        ts: Date.now(),
        label: `Reporte v${baseVersion}`,
        report: text,
        inputs: { ...latestInputsRef.current },
        kind: "base",
        baseVersion,
      };

      setHistory((prev) => [entry, ...prev]);
      setSelectedId(entry.id);
      return baseVersion;
    });
  }

  function getActiveBaseReport(): HistoryEntry | null {
    if (!selectedVersion) {
      return history.find((h) => h.kind === "base") || null;
    }

    if (selectedVersion.kind === "base") return selectedVersion;

    if (selectedVersion.kind === "edit" && selectedVersion.baseReportId) {
      return history.find((h) => h.id === selectedVersion.baseReportId) || null;
    }

    return history.find((h) => h.kind === "base") || null;
  }

  function saveDraftAsVersion() {
    const text = draftReport.trim();
    if (!isDirty || !text) return;

    const base = getActiveBaseReport();
    if (!base || base.kind !== "base" || base.baseVersion == null) return;

    const parsed = extractInputsFromReportText(text);

    const inputsSnapshot: HistoryEntry["inputs"] = {
      patientName: parsed.patientName ?? base.inputs.patientName ?? "",
      species: parsed.species ?? base.inputs.species ?? "",
      notes: base.inputs.notes ?? "",
    };

    const editsForBase = history.filter(
      (h) => h.kind === "edit" && h.baseReportId === base.id
    ).length;

    const editVersion = editsForBase + 1;

    const entry: HistoryEntry = {
      id: safeUUID(),
      ts: Date.now(),
      label: `Reporte v${base.baseVersion} – edición v${editVersion}`,
      report: text,
      inputs: inputsSnapshot,
      kind: "edit",
      baseReportId: base.id,
      baseVersion: base.baseVersion,
      editVersion,
    };

    setHistory((prev) => [entry, ...prev]);
    setSelectedId(entry.id);
    setCurrentReport(text);
    setIsDirty(false);
  }


  const DEFAULT_SPECIES = "Canino";

  async function handleGenerate() {
    saveDraftAsVersion();

    setStatus("generating");
    await new Promise((r) => setTimeout(r, 800));
    const report = makeReport({ patientName, species, notes });

    setCurrentReport(report);
    setDraftReport(report);
    addBaseReport(report);

    setPatientName("");
    setSpecies(DEFAULT_SPECIES);
    setIsDirty(false);

    setStatus("idle");
  }

  function handleRestore(version: HistoryEntry) {
    setPatientName(version.inputs.patientName);
    setSpecies(version.inputs.species);
    setNotes(version.inputs.notes);

    setCurrentReport(version.report);
    setDraftReport(version.report);
    setSelectedId(version.id);
    setIsDirty(false);
  }

  function handleDeleteVersion(id: string) {
    setHistory((prev) => prev.filter((x) => x.id !== id));
    setSelectedId((cur) => (cur === id ? null : cur));
  }
  return (
    <div className="min-h-screen bg-linear-to-b from-primary/5 via-background to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-card/70 backdrop-blur supports-backdrop-filter:bg-card/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-primary/40 via-violet-400/30 to-cyan-400/30 blur-md" />
                <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-primary text-primary-foreground shadow-sm">
                  <Stethoscope className="h-5 w-5" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  diagnoVET
                </h1>
                <p className="text-xs text-muted-foreground">
                  Reportes con IA (simulado)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-linear-to-r from-emerald-500/15 to-cyan-500/15 border border-emerald-500/20 px-3 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                  Sistema activo
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Patient Form */}
          <section className="lg:col-span-4">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-linear-to-br from-primary/20 to-violet-500/15 border border-primary/10">
                  <Stethoscope className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Datos del paciente
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Completa la información clínica
                  </p>
                </div>
              </div>

              <PatientForm
                patientName={patientName}
                setPatientName={setPatientName}
                species={species}
                setSpecies={setSpecies}
                notes={notes}
                setNotes={setNotes}
                onGenerate={handleGenerate}
                isGenerating={status === "generating"}
              />
            </div>
          </section>

          {/* Center Panel - Report Preview */}
          <section className="lg:col-span-5">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm h-full min-h-[500px]">
              <ReportPreview
                activeReport={activeReport}
                selectedVersion={selectedVersion}
                draftReport={draftReport}
                setDraftReport={setDraftReport}
                onSaveVersion={saveDraftAsVersion}
                onDirtyChange={setIsDirty}
                isDirty={isDirty}
              />

            </div>
          </section>

          {/* Right Panel - History */}
          <aside className="lg:col-span-3">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm h-full min-h-[500px]">
              <HistoryPanel
                history={history}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                onRestore={handleRestore}
                onDelete={handleDeleteVersion}
              />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default App
