This is my first hackathon solution code, we have met with all the criterions mentioned in the problem statement.
The initial code was the one our team made during the hackathon, and it has been altered later to make the output more project worthy.
The problem statement was: 

CODEX ’26 PROBLEM STATEMENT 1
Real-time Residential Infrastructure Intelligence for Safety & Quality Assurance

PROBLEM
Home buyers and tenants often have little visibility into hidden defects in new or under-construction buildings such as damp walls, exposed wiring, cracked beams, and poor finishing. Although these issues appear in inspection photos, videos, and notes, they are not analyzed systematically, leading to unsafe housing decisions and delayed identification of risks.

OBJECTIVES
Use a sample inspection dataset containing properties, rooms, findings, and labeled images (e.g., crack, leak, ok)
Apply AI assisted classification and tagging of potential defects from text or image metadata
Aggregate inspection findings into a simple risk score per property or room
Generate clear, plain-language inspection summaries describing observed risks (e.g., “High risk: visible damp in 3/5 rooms, exposed wiring in kitchen”).

EXPECTED OUTPUT
An AI-assisted inspection workspace
Automated defect tagging and classification
Risk scores at room and property levels
Human-readable inspection summaries for early risk identification


<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1cCRdohQwgL0rNO-qDaJVdByf-lN2dkSX

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
