import { Dog, Cat, Bird, Rabbit, Sparkles } from "lucide-react";

interface PatientFormProps {
    patientName: string;
    setPatientName: (value: string) => void;
    species: string;
    setSpecies: (value: string) => void;
    notes: string;
    setNotes: (value: string) => void;
    onGenerate: () => void;
    isGenerating: boolean;
}

const speciesOptions = [
    { value: "Canino", icon: Dog, label: "Canino" },
    { value: "Felino", icon: Cat, label: "Felino" },
    { value: "Ave", icon: Bird, label: "Ave" },
    { value: "Otro", icon: Rabbit, label: "Otro" },
];

export function PatientForm({
    patientName,
    setPatientName,
    species,
    setSpecies,
    notes,
    setNotes,
    onGenerate,
    isGenerating,
}: PatientFormProps) {
    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Nombre del paciente
                </label>
                <input
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full rounded-lg border border-border/70 bg-card/80 px-4 py-3 text-sm outline-none transition-all 
                     focus:border-primary focus:ring-2 focus:ring-primary/30 
                     placeholder:text-muted-foreground/70"
                    placeholder="Ej: Luna, Max, Toby..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                    Especie
                </label>
                <div className="grid grid-cols-4 gap-2">
                    {speciesOptions.map((option) => {
                        const Icon = option.icon;
                        const isSelected = species === option.value;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setSpecies(option.value)}
                                className={[
                                    "flex flex-col items-center gap-2 rounded-lg border p-3 transition-all",
                                    "focus:outline-none focus:ring-2 focus:ring-primary/30",
                                    isSelected
                                        ? "border-primary bg-gradient-to-br from-primary/15 to-violet-500/10 text-primary shadow-sm"
                                        : "border-border/70 bg-card/80 text-muted-foreground hover:border-primary/50 hover:bg-primary/5",
                                ].join(" ")}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="text-xs font-medium">{option.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Notas clínicas
                </label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full min-h-[140px] rounded-lg border border-border/70 bg-card/80 px-4 py-3 text-sm outline-none transition-all 
                     focus:border-primary focus:ring-2 focus:ring-primary/30 
                     placeholder:text-muted-foreground/70 resize-none"
                    placeholder="Describe los síntomas, motivo de consulta, antecedentes relevantes..."
                />
            </div>

            {/* CTA */}
            <button
                onClick={onGenerate}
                disabled={isGenerating || !patientName || !notes}
                className={[
                    "w-full flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold transition-all",
                    "bg-gradient-to-r from-primary to-violet-500 text-primary-foreground shadow-md",
                    "hover:opacity-95 hover:shadow-lg",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
                ].join(" ")}
            >
                <Sparkles className="h-4 w-4" />
                {isGenerating ? "Generando reporte..." : "Generar reporte con IA"}
            </button>
        </div>
    );
}