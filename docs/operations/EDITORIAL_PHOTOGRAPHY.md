# Photography for travel guides

Read this check before choosing or replacing a guide photograph, a destination cover, or the homepage feature. The approved composition and visual palette are in [Travel editorial design](../intent/TRAVEL_EDITORIAL_DESIGN.md).

## Choose a photograph that answers part of the traveler’s question

- Start with the real setting. Use a recognizable street, landscape, building, entrance, dish, boarding point or route detail for the right story. A transfer guide can benefit from a readable station sign. An outdoor itinerary can start with a wide view that shows where the visitor will go.
- For a destination hub, lead with a real scene that helps the traveler choose the place, such as a market, museum, landscape or neighborhood. Put platform signs and station interiors in the arrival guides where they help with wayfinding. Check the hub, directory tile and social preview together, and choose a different original from an existing article hero where possible.
- Prioritize a clear subject, natural color, useful visual detail and an uncrowded composition. Let individual places, seasons and times of day retain their own character. Capture dates describe what the photo shows and need no stylistic reinterpretation. Use warm page surfaces around images and keep edits to faithful crops, resizing and compression.
- Preview the actual mobile crop at 320 and 390px and the desktop crop at 768 and 1440px. Keep route-critical signs, crossings, landforms and entrances in frame. Preserve useful portrait originals in a frame that shows them clearly. Inspect the cropped sharing card separately.
- Each article hero has its own original. See the all-guide media guard for path, source and hash reuse. A contextual body photograph should add a different detail or viewpoint. Archive footage, stock scenes and illustrations need honest labels. Use only authenticated place photographs for visual directions and other real-world evidence.
- Record the original work, author, source, license and commercial reuse rights before publication. Record edits and any share-alike obligations alongside the reuse link. Alt text describes the visible scene. Captions identify the place and date when known, explain its relationship to the route, and distinguish historical scenes from present-day access, staff or schedules.
- When a replacement improves usefulness, update the article, media references, credit, alt text and captions together. Regenerate only the affected share cards. Keep responsive copies where they improve delivery and keep original downloads out of the public export. If a candidate’s rights or subject remain uncertain, use a verified existing photograph and record the reason.

## Image-led destination plans

- Score every proposed lead photograph for how much the scene answers the visitor’s question (0–3), how clearly people can identify its subject (0–2), and whether the focal area survives the card crop (0–2). Require a total of at least 5 and a subject score of at least 2. Verify the actual scene, license and author separately from the score.
- Record eligible card photos in `data/destination-guide-photos.json` after reviewing the source, card and article. Bind the approval to the current hero media ID. Keep illustrations and unverified images in their appropriate article context. A guide with a pending photograph is available from the hub’s guide list and can still be the right arrival link.
- Review onward cards with the destination cover and verify that the travel reason is specific. Give a new hub a distinct lead photograph, at least three verified guides and at least three photograph-led plans, with one plausible onward decision. Add one regional link back from the guide and check the directory, sitemap and related cards after publication.
- Run `npm.cmd exec -- tsx scripts/audit-guide-heroes.ts` for the full archive inventory, visual contact sheets and `similarity-candidates.json`. Inspect the listed pairs side by side to distinguish actual reuse from different photos or illustrations with similar composition. Exact source and hash matches are checked during the build. Record visual judgments separately and reconsider any approval when the front image changes.

## Initial editorial review

The 60-guide November 23 expansion was the initial review cohort for the design rollout. Tongin Market’s prepared-food counter and Andong’s wide twilight view of Wolyeonggyo replace the former hero images on their respective guides. Their original images remain as relevant contextual figures with accurate captions. The Daejeon market portrait keeps its original sign and street context in the article frame. INSPIRE’s Airport Cargo Terminal Station image remains a labelled transport landmark.
