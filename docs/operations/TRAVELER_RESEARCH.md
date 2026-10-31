# Traveler task pack

Use this pack for actual voluntary traveler sessions after a verified release. A simulation, automated journey or editorial review is not a participant session. No participants have been recruited or interviewed through this pack yet. Recruitment/messages require the owner's explicit authorization.

## Participants and setup

Start with 3–5 independent travelers across first visits, late arrivals, family/room needs, dietary requirements and mobility needs. Record which needs are actually represented; do not invent coverage or generalize small samples to all travelers. Participants can decline any task. Do not collect passport details, medical records, payment details or booking codes.

Use a no-ads preview for facilitated tasks. Record exact source commit, domain, device, CSS viewport, language, date and network conditions. Explain that prices, transport and opening information need operator confirmation. Ask permission before recording screen/audio. Store consent and notes privately under `.private/research/participants/`; use participant codes in summaries. Agree a retention/deletion date before recording.

Opening script: “We are testing this site, not you. Please tell us what you expect to happen and what you would do next. You can stop at any time. Please do not enter sensitive information or make a purchase. May I take notes? May I record the screen?”

## Tasks

Read one task at a time. Do not point to the correct button or explain the interface unless the participant is stuck; record assistance separately. Use the same scenario across comparable sessions.

| Task to read                                                                                                                                  | Observe                                                                                                          | Success evidence                                                                                                                                            |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| You reach Incheon T2 late in the evening, with a suitcase, and need to reach a Seoul hotel. Find a workable first option and a fallback.      | Distinguishes landing from terminal-exit time; finds actual operator check; notices last-connection uncertainty. | Participant states conditions, opens the relevant official route and identifies an overnight alternative without treating an estimate as live availability. |
| Two travelers stay six nights and want to compare one room with two rooms. Set a seven-day budget and share the assumptions with a companion. | Per-room/night versus per-person/day understanding; stale-result notice; comparison; share action.               | Room cost changes appropriately, food does not double, and the shared result retains the entered inputs. No payment is made.                                |
| Plan two nearby stops, add time for travel, close the board and reopen it. Remove a stop and change your mind.                                | Addition, order/day/time, persistence and undo discoverability.                                                  | Stops and edits return correctly; undo restores the removed stop.                                                                                           |
| Rain is forecast for your Seoul afternoon. Find an indoor anchor and check how to reach it.                                                   | Neighborhood choice, reservation/closed-day limits, outdoor approach and navigation.                             | Participant finds the operator check and a usable route, rather than assuming all attractions are open.                                                     |
| You need to communicate a food restriction. Find what to ask a restaurant and a fallback if the kitchen cannot confirm ingredients.           | Finds Korean aid; distinguishes label/translation from suitability; avoids a false safety guarantee.             | Participant can explain what remains unknown and choose an alternative without sharing private health details publicly.                                     |
| Send the budget card to yourself using the isolated download, then scan its QR on another device.                                             | Text legibility, limitations, QR, exact input reopening, link confidence.                                        | Correct public tool inputs reopen; no private notes or account/share tokens are encoded. The download is not counted as an actual social post.              |
| Find one useful next article from a guide. Explain why it belongs in the trip.                                                                | Relation label, route/interest fit and next-action clarity.                                                      | Participant follows a relevant link and can describe its purpose.                                                                                           |
| Draft a practical question about a guide, leave, and return before submitting.                                                                | Draft retention, sign-in return, review notice and error recovery.                                               | Draft survives. Do not publish fake questions; stop before sending unless the participant has an actual question and explicitly chooses to contribute.      |

Do not place real bookings, call emergency numbers, repeatedly send login mail or click live advertisements. Account-flow research is optional and must use the participant's own deliberate consent; the technical account regression remains separate.

## Notes and decisions

For each task record unassisted / assisted / abandoned, time-to-first-useful-answer, wrong turns, misunderstood conditions, errors and recovery. Timing is descriptive for this session, not a population benchmark. Capture exact screen evidence where consent allows. Label participant quotations, facilitator interpretations and source-verified facts separately.

Ask after each task: “How confident are you that you could act on this? What would you verify elsewhere? What was missing?” Finish with: “Which page would you save or share? What would bring you back?” An intention to return is not actual retention.

Triage critical false-confidence/privacy/task failures first, then repeated confusion across independent people. Do not turn three repeated concerns into a statistical prevalence estimate. Link each accepted issue to the affected route, owner, proposed fix, regression and re-test session. Report unchanged/contradictory observations as well as improvements.

Private session template:

```text
Participant code / consent and retention date:
Actual travel context represented / missing contexts:
Release commit / device / viewport / language / network:
Task / unassisted, assisted or abandoned / elapsed time:
Observed action and exact words:
What remained unknown / facilitator help:
Evidence file:
Issue, severity and affected route:
Decision, owner, fix commit and re-test evidence:
```
