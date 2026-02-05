# Analyze & Evolve – Improving the veterinarian workflow

This project analyzes friction points in the current diagnoVET user experience and proposes a focused UI improvement aimed at reducing cognitive load and increasing confidence when working with AI-generated medical reports.

---

## 1. Findings from the videos

### Video 1 – Authentication & onboarding flow

After login, the user is briefly redirected to the dashboard before being sent to the pre-confirmation screen (clinic information), and again to the dashboard before reaching the post-confirmation screen (personal data).

While the flow technically works, these intermediate redirects introduce navigation inconsistency. Showing the dashboard before onboarding is complete can confuse first-time users and weaken their sense of progress and control during setup.

**Opportunity:**  
A more linear onboarding flow would reduce cognitive friction and clearly communicate completion status.

---

### Video 2 – Configuration navigation

When navigating to **Configuration → Personal**, the configuration panel remains visible while scrolling the page.

This persistent panel can become a visual distraction when the user is focused on editing personal information. Collapsing or hiding the menu after navigation would improve readability and focus.

<img width="1098" height="807" alt="Configuration menu remains visible" src="https://github.com/user-attachments/assets/c9fefba6-83fa-4f8f-ab36-b161b91d7e27" />

---

### Video 3 – AI report generation & editing

When the AI generates a medical report, veterinarians often need to iterate:
- Adjust patient data
- Regenerate the report
- Compare different versions

Currently, previous reports are overwritten, forcing the user to rely on memory or avoid experimentation altogether.

**This creates cognitive risk**, especially in a clinical context where accuracy and traceability are critical.

---

## 2. Chosen improvement: Temporary report versioning

Among the identified issues, I chose to focus on **AI report iteration and version safety**, as it has the highest impact on daily clinical efficiency and trust in the system.

### Why this improvement?

- Prevents accidental data loss  
- Reduces anxiety when editing AI-generated content  
- Encourages safe experimentation and refinement  
- Keeps the veterinarian in control of clinical decisions  

This improvement addresses both **usability** and **clinical confidence**, without adding unnecessary complexity.

---

## 3. Proposed workflow

1. The veterinarian enters patient data  
2. The AI generates **Report v1** (saved automatically)  
3. The veterinarian edits the report or adjusts inputs  
4. Each iteration is saved as a new version (e.g. *Reporte v1 – edición v2*)  
5. A side panel displays the report history  
6. Any previous version can be previewed or restored  

This approach supports clinical decision-making by making changes explicit, reversible, and easy to understand.

---

## 4. The prototype

I implemented a functional UI prototype using **React + Vite + Tailwind**, focusing on:

- AI report preview and editing
- Temporary version history
- Visual indicators for unsaved changes
- Safe restoration of previous reports
- Clear separation between “current report” and saved versions

The prototype demonstrates how a relatively small UI change can significantly improve confidence and efficiency when working with AI-generated medical content.

[See the demo here](https://ui-engineer-challenge-diagno-vet.vercel.app/)
