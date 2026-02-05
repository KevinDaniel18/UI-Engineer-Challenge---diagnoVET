#Analyze & Evolve – Findings

##Video 1 – Authentication & onboarding flow

After login, the user is briefly redirected to the dashboard before being sent to the pre-confirmation screen (clinic information), and later again to the dashboard before reaching the post-confirmation screen (personal data).
While the flow technically works, these intermediate redirects introduce a navigation inconsistency that may confuse users, as the dashboard appears before the onboarding process is actually completed. This can reduce the user’s sense of progress and control during first-time setup.

##Video 2 – Configuration navigation

When navigating to Configuration → Personal, the configuration menu remains visible while scrolling the page. This persistent panel can become a visual distraction, especially when the user is focused on editing personal information. Hiding or collapsing the menu after navigation would improve focus and readability.

some comments:

<img width="1098" height="807" alt="Screenshot 2026-02-05 at 10 59 13 AM" src="https://github.com/user-attachments/assets/c9fefba6-83fa-4f8f-ab36-b161b91d7e27" />

##Video 3 – AI report generation & editing

When the AI generates a medical report, veterinarians may want to iterate on the results by adjusting patient data and regenerating the report. Currently, previous versions are lost.
Introducing a temporary version history would reduce cognitive risk and increase confidence, allowing veterinarians to safely experiment while preserving earlier reports.

##Proposed flow:

- The veterinarian enters patient data

- AI generates Report v1 (saved in temporary history)

- The veterinarian adjusts inputs and generates Report v2 (also saved)

- A side panel displays the report history, allowing quick preview and restoration of previous versions

- This approach supports clinical decision-making by preventing accidental data loss and encouraging iterative refinement.
