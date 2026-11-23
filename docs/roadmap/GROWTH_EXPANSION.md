# Korea Experience growth expansion

Owner scope confirmed on 2026-11-23. This expands the existing visitor recovery goal and uses the publication, photo-rights and production checks in [Traveler Experience Upgrade](TRAVELER_EXPERIENCE_UPGRADE.md).

## Delivery and business targets

- Publish 60 new English guides with distinct travel questions, useful decisions and stable indexable URLs. Track new guides separately from updates and integrations. Count a guide after its exact production response has been checked.
- Expand the destination directory from three published hubs to approximately 15, with useful routes through guides, places and tools. Keep the current Seoul, Busan and Suwon URLs.
- Use a licensed photograph of the actual subject as each new guide's representative image. Verify provenance, attribution, commercial reuse, alteration terms and a distinct original. Use additional contextual photographs for route choices, confusing entrances, relevant terrain and other steps a reader benefits from seeing. Give each photo useful alt text and a caption where its context or date matters.
- Build relevant entry routes from search, destination and guide pages. Check share cards, excerpts and navigation so a visitor who starts on a single guide can solve a larger travel task.
- Prepare an ad placement test under the existing consent and measurement rules. Preserve mobile reading and task completion when evaluating potential gains.

The business targets are **10,000 visitors per day** and **US$100 in daily AdSense revenue**. Delivery acceptance requires the guides, hubs and growth operations to be deployed and verified. Report progress toward the business targets using actual observations. Record the scope and consent limitations of GA4 audience estimates, separately from Search Console search clicks and AdSense page views. Use the AdSense site report and its reporting timezone for the revenue target. [Google's page RPM definition](https://support.google.com/adsense/answer/112030?hl=en)

## Destination candidates

Organize the directory for trip planning and publish a hub after its routes, photography and coverage are verified. The initial shortlist contains 15 destinations. Choose launch order by travel demand, source availability and existing useful coverage. Confirm overlaps with the catalog before assigning new slugs.

| Area | Destinations | Candidate guide clusters |
|---|---|---|
| Capital area | Seoul, Incheon, Suwon | Airport arrival to the city, central and coastal Incheon, station-to-sights choices, access and weather alternatives |
| Gangwon | Chuncheon, Gangneung, Sokcho & Seoraksan | Rail or bus to a useful first stop, car-free routes, coast or mountain alternatives |
| Southeast | Busan, Gyeongju, Daegu, Andong | Intercity arrivals, market and heritage routes, a realistic one- or two-day plan |
| Central & southwest | Daejeon, Jeonju, Gwangju, Mokpo | Station transfers, family indoor visits, regional food and heritage, port transfers |
| Island | Jeju | Airport transfers, car-free bases and trips, ferry and weather decisions |

Use specific orientation and at least three verified indexable guides before listing a new hub in the directory and sitemap. Use the same published membership rule for directory links, hub metadata and sitemap inclusion. Explain when visitors should connect to a different hub or choose a fallback. Support links back to the relevant destinations from guide pages.

## Production batches

1. Inventory existing signatures by title, coverage, question and canonical URL. Protect established landing pages. Choose each proposed new article only after checking for equivalent content, season, sources, a suitable photo and a practical next step. Repairs to old articles can support a batch and are tracked separately.
2. Work in up to six regional batches of about ten new articles. Adjust the mix to evidence while keeping the total at 60 and building enough depth for each hub. Each batch may link arrival, a base, a route, accessibility or weather decisions, and an adjacent destination or relevant tool.
3. Write the essential answer above the fold. Include verified planning constraints, localized names and maps or useful visual aids when they help. Include an operator link for a changeable decision. Use relevant related links with readable reasons. Export responsive photos and check share cards against the actual destination and conditions.
4. Run the repository's content, media, rendered-link, share card, sitemap and export checks. Check actual 320/390/768/1440 rendering and travel tasks, accessible open and error states, map alternatives and sharing. Push reviewed batches to `main`, match Cloudflare Production to the exact commit and verify the changed routes on the public domain.
5. Record each production URL, publication date, batch, destination, evidence, recovery commit and 7/14/28-day checks. Keep raw provider reports in the private operations directory. Track Search Console acquisition and new/return activity with the existing GA4 and AdSense reporting setup. Report absent or provisional data according to the [measurement contract](../operations/MEASUREMENT.md).

## Revenue and visitor experience

Start from a measured comparison of the current labeled article ad and the same single slot at an earlier, natural section break on eligible long articles. Compare equivalent article, device and audience cohorts, document when the comparison begins, and keep consent and analytics receipt requirements. Prespecify a review date and the needed sample. Check outbound actions, further reading, CLS, requests per page, impressions per page and page RPM. Revert on a material reading or layout regression, or a policy issue. Leave weak evidence as inconclusive. Keep ads outside key answers, maps, safety and costs, interactive tools, and community controls. [Google's placement policies](https://support.google.com/adsense/answer/1346295?hl=en)

## Release tracking

Initial verified scope is the existing three destinations. No articles count toward the new 60 until a production batch is verified. Add completed batch IDs, URLs and deployed hub counts here as they are released. Measure the effect of earlier recovery and new batches against their own release dates.
