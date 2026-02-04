# MDX Components Guide for KoreaExperience

> **GEO-Optimized Visual Components for AI-Friendly, Professional Blog Content**

This guide covers all available MDX components designed for:
- 🎯 **GEO (Generative Engine Optimization)** - AI citation optimization
- 🎨 **Visual Quality** - Professional, magazine-like appearance
- 📊 **Fact Density** - Structured data for SEO/AI crawlers
- 🏆 **E-E-A-T** - Experience, Expertise, Authoritativeness, Trustworthiness

---

## Table of Contents

1. [KeyTakeaways](#1-keytakeaways) - AI citation optimization
2. [InfoBox](#2-infobox) - Tips, warnings, alerts
3. [QuickFacts](#3-quickfacts) - Fact density enhancement
4. [StepGuide](#4-stepguide) - HowTo schema integration
5. [PriceTable](#5-pricetable) - Price comparisons (Dualism)
6. [LocationCard](#6-locationcard) - Local business info
7. [ProsCons](#7-proscons) - Balanced analysis
8. [DualismRoute](#8-dualismroute) - Luxury vs Budget routes
9. [StatCard](#9-statcard) - Statistics highlight
10. [ExpertTip](#10-experttip) - E-E-A-T enhancement
11. [FAQAccordion](#11-faqaccordion) - FAQ schema integration
12. [Original Components](#12-original-components) - Gallery, Timeline, etc.

---

## 1. KeyTakeaways

**Purpose**: AI-optimized summary box for the article's key points. Place immediately after the intro.

**GEO Strategy**: "답변 우선 구조 (Answer-First Structure)" - AI engines prioritize this for citations.

```jsx
<KeyTakeaways 
  points={[
    "Medical tourism in Korea saves 40-60% compared to US prices",
    "Top clinics include Gangnam Severance and ID Hospital",
    "Visa-free entry available for 112 countries in 2026",
    "Book 2-3 months in advance for popular procedures"
  ]}
  readTime={12}
  lastUpdated="2026-02-04"
/>
```

**Props**:
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `points` | string[] | ✅ | 1-4 key takeaways (max 25 words each) |
| `title` | string | | Custom title (default: "Key Takeaways") |
| `readTime` | number | | Estimated read time in minutes |
| `lastUpdated` | string | | Last update date (YYYY-MM-DD) |

---

## 2. InfoBox

**Purpose**: Visually distinct boxes for tips, warnings, and important information.

**Types Available**:
- `tip` 💡 - Pro tips and recommendations
- `warning` ⚠️ - Important warnings
- `success` ✅ - Success messages
- `info` ℹ️ - General information
- `danger` 🚨 - Critical alerts
- `note` 📝 - Notes
- `arc-free` 🌏 - Solutions for tourists without ARC

```jsx
<InfoBox type="tip" title="Pro Tip">
  Book your skin consultation at least one week before your procedure 
  to allow time for patch testing.
</InfoBox>

<InfoBox type="arc-free" title="No Korean Phone Number?">
  Use the Klook or Trazy apps for restaurant reservations - they work 
  with international phone numbers and credit cards.
</InfoBox>

<InfoBox type="warning">
  Some clinics require a 50% deposit at booking. Always confirm 
  cancellation policies before paying.
</InfoBox>
```

---

## 3. QuickFacts

**Purpose**: Structured data display for statistics and quick reference.

**GEO Strategy**: "팩트 밀도 강화" - High fact density improves AI credibility assessment.

```jsx
<QuickFacts
  title="Seoul Medical Tourism at a Glance"
  facts={[
    { label: "Annual Visitors", value: "2.5M+", icon: "👥", note: "2025 estimate" },
    { label: "Average Savings", value: "50-70%", icon: "💰" },
    { label: "Top Procedures", value: "Rhinoplasty", icon: "👃" },
    { label: "Recovery Time", value: "7-14 days", icon: "🏥" }
  ]}
  columns={2}
  variant="highlight"
/>
```

**Variants**:
- `default` - Card grid with borders
- `compact` - Minimal inline display
- `highlight` - Gradient background cards

---

## 4. StepGuide

**Purpose**: Step-by-step instructions with HowTo schema integration.

**GEO Strategy**: Generates HowTo structured data for Featured Snippets.

```jsx
<StepGuide
  title="How to Book a Clinic Consultation"
  totalTime="15-30 minutes"
  estimatedCost="Free - $50"
  difficulty="easy"
  steps={[
    {
      title: "Research Clinics",
      description: "Compare reviews on RealSelf and Korean medical tourism forums.",
      duration: "10 min",
      tip: "Look for clinics with English-speaking coordinators"
    },
    {
      title: "Submit Inquiry Form",
      description: "Most clinics have online forms. Include photos for accurate quotes.",
      duration: "5 min",
      icon: "📧"
    },
    {
      title: "Schedule Video Consultation",
      description: "Many top clinics offer free video consultations via KakaoTalk.",
      duration: "30 min",
      tip: "Prepare a list of questions about recovery and aftercare"
    }
  ]}
/>
```

---

## 5. PriceTable

**Purpose**: Price comparisons with Dualism (luxury vs budget) support.

**GEO Strategy**: "이원적 가치 소비" - Highlights both luxury and budget options.

```jsx
// Dualism variant - Luxury vs Budget comparison
<PriceTable
  title="Dining Options in Gangnam"
  variant="dualism"
  items={[
    { name: "Michelin 3-Star Omakase", price: "₩350,000", tag: "luxury", description: "8-course seasonal menu" },
    { name: "Premium Hanwoo Set", price: "₩120,000", tag: "luxury", description: "Grade 1++ Korean beef" },
    { name: "Local BBQ Joint", price: "₩15,000", tag: "budget", description: "Unlimited pork belly" },
    { name: "Convenience Store", price: "₩5,000", tag: "budget", description: "Triangle kimbap + ramyeon" }
  ]}
/>

// Cards variant - Service packages
<PriceTable
  title="Skin Treatment Packages"
  variant="cards"
  items={[
    { 
      name: "Basic Facial", 
      price: "$80", 
      description: "Deep cleansing + hydration",
      features: ["60 minutes", "Suitable for all skin types"],
      tag: "Popular"
    },
    { 
      name: "Premium Package", 
      price: "$250", 
      description: "Full rejuvenation treatment",
      features: ["120 minutes", "LED therapy included", "Free consultation"],
      recommended: true,
      tag: "Best Value"
    }
  ]}
/>
```

---

## 6. LocationCard

**Purpose**: Detailed venue/business information with LocalBusiness schema.

**GEO Strategy**: Integrates with Google's LocalBusiness structured data.

```jsx
<LocationCard
  name="Myeongdong Gyoja"
  nameKo="명동교자"
  type="Restaurant"
  address="29 Myeongdong 10-gil, Jung-gu, Seoul"
  hours="10:30 - 21:30 (Break: 15:30-16:30)"
  phone="+82-2-776-5348"
  priceRange="$$"
  rating={4.6}
  reviewCount={3250}
  transit="Exit 8 from Myeongdong Station, 3 min walk"
  highlights={["Handmade Kalguksu", "Cash Only", "No Reservations"]}
  tags={["Local Favorite", "Michelin Guide"]}
  tip="Arrive before 11am to avoid the lunch rush. The bibim-kalguksu is a hidden gem!"
  mapUrl="https://maps.google.com/?q=..."
/>
```

---

## 7. ProsCons

**Purpose**: Balanced pros and cons analysis.

```jsx
<ProsCons
  title="Should You Visit Gangnam for Shopping?"
  variant="cards"
  pros={[
    "Premium brands and flagship stores",
    "Modern, well-organized malls",
    "Excellent public transportation",
    "Many stores have English-speaking staff"
  ]}
  cons={[
    "Higher prices than other districts",
    "Very crowded on weekends",
    "Less authentic local atmosphere",
    "Can feel overwhelming for first-time visitors"
  ]}
/>
```

**Variants**: `default`, `compact`, `cards`

---

## 8. DualismRoute

**Purpose**: Curated routes combining luxury and budget experiences.

**GEO Strategy**: Core "이원성" concept - showing both worlds in one itinerary.

```jsx
<DualismRoute
  title="24 Hours in Seongsu-dong: Luxury Meets Budget"
  subtitle="Experience Seoul's Brooklyn with high-end and local gems"
  area="Seongsu-dong, Seoul"
  totalBudget={{ luxury: "$180", budget: "$35" }}
  totalTime="8 hours"
  stops={[
    {
      name: "Dior Seongsu Pop-up",
      type: "luxury",
      description: "Instagram-worthy photo ops at the exclusive temporary gallery.",
      cost: "Free entry",
      duration: "45 min",
      icon: "👗",
      tip: "Visit on weekday mornings to avoid crowds"
    },
    {
      name: "Seongsu Traditional Market",
      type: "budget",
      description: "Authentic Korean street food: tteokbokki, sundae, and hotteok.",
      cost: "$5-8",
      duration: "30 min",
      icon: "🍜"
    },
    {
      name: "Onion Cafe Anguk",
      type: "luxury",
      description: "Artisanal pastries in a beautifully renovated hanok.",
      cost: "$15-25",
      duration: "1 hour",
      icon: "☕"
    },
    {
      name: "Han River Picnic",
      type: "budget",
      description: "Grab chicken and beer from a convenience store and enjoy the sunset.",
      cost: "$10",
      duration: "2 hours",
      icon: "🌅",
      tip: "Rent a mat from the convenience store for ₩3,000"
    }
  ]}
  recommendation="This route perfectly balances Instagram-worthy luxury moments with authentic local experiences. Ideal for travelers who want to see both sides of modern Seoul."
/>
```

---

## 9. StatCard

**Purpose**: Highlight statistics and numbers for AI citation.

**GEO Strategy**: High fact density with clear data attribution.

```jsx
// Hero variant - Single impactful stat
<StatCard
  variant="hero"
  stats={[{
    value: "2.5M+",
    label: "Medical Tourists Visit Korea Annually",
    description: "Korea is the #3 destination for medical tourism worldwide",
    icon: "🏥"
  }]}
  source="Korea Health Industry Development Institute"
  asOf="2025"
/>

// Gradient variant - Multiple stats
<StatCard
  title="Korea Medical Tourism Stats 2026"
  variant="gradient"
  columns={4}
  stats={[
    { value: "40-60%", label: "Average Savings", icon: "💰" },
    { value: "4.8/5", label: "Patient Satisfaction", icon: "⭐" },
    { value: "200+", label: "JCI-Accredited Hospitals", icon: "🏥" },
    { value: "15", label: "Official Medical Visa Days", icon: "📅" }
  ]}
  source="KHIDI"
/>
```

---

## 10. ExpertTip

**Purpose**: Personal insights and local knowledge for E-E-A-T.

**GEO Strategy**: Demonstrates human experience that AI cannot replicate.

```jsx
<ExpertTip
  author="Kim Min-ji"
  role="Seoul Resident, 12 years"
  type="local"
  verified={true}
  location="Gangnam"
>
  Don't just go to the famous clinics in Gangnam - some of the best dermatologists 
  are actually in Sinsa-dong. The rents are lower, so they can offer better prices 
  without compromising on equipment. I've been going to my dermatologist there for 
  8 years and have referred over 20 friends.
</ExpertTip>

<ExpertTip
  author="Dr. Park Soo-hyun"
  role="Board-Certified Dermatologist"
  type="expert"
  experience="15+ years in cosmetic dermatology"
>
  Always ask to see the actual laser machine certificate - not just photos. 
  Some clinics use older equipment that can cause burns on darker skin tones. 
  FDA-cleared devices like Picosure or Pico+ are safest for Asian skin.
</ExpertTip>
```

**Types**: `local`, `expert`, `warning`, `personal`

---

## 11. FAQAccordion

**Purpose**: FAQ section with FAQPage schema integration.

**GEO Strategy**: Directly generates Featured Snippets for FAQ searches.

```jsx
<FAQAccordion
  title="Frequently Asked Questions"
  defaultOpen={0}
  items={[
    {
      question: "Do I need a visa for medical tourism in Korea?",
      answer: "Most nationalities can enter Korea visa-free for up to 90 days. For longer treatments, you can apply for a G-1 Medical Tourism Visa which allows stays up to 1 year."
    },
    {
      question: "How much can I save compared to US prices?",
      answer: "On average, procedures in Korea cost 40-60% less than in the US. For example, rhinoplasty averages $3,000-5,000 in Korea vs $8,000-15,000 in the US."
    },
    {
      question: "Do Korean clinics accept international insurance?",
      answer: "Most clinics do not directly bill insurance but provide detailed receipts for reimbursement claims. Some premium clinics partner with international insurers."
    },
    {
      question: "What is the best time of year to visit?",
      answer: "Spring (April-May) and Fall (September-October) offer the best weather. Avoid August (hot and humid) and Lunar New Year/Chuseok holidays when clinics may be closed."
    },
    {
      question: "How do I communicate with doctors?",
      answer: "Most major clinics have English-speaking coordinators. You can also hire medical interpreters (around $200-300/day) or use apps like Papago for basic communication."
    }
  ]}
/>
```

---

## 12. Original Components

### ImageGallery
```jsx
<ImageGallery
  images={[
    { src: "/images/clinic1.jpg", alt: "Clinic exterior", caption: "Modern facilities" },
    { src: "/images/clinic2.jpg", alt: "Treatment room", caption: "State-of-the-art equipment" }
  ]}
  columns={2}
/>
```

### Timeline
```jsx
<Timeline
  title="Your Treatment Journey"
  items={[
    { time: "Day 1", title: "Arrival", description: "Airport pickup and hotel check-in", icon: "✈️" },
    { time: "Day 2", title: "Consultation", description: "Meet with your surgeon", icon: "👨‍⚕️" },
    { time: "Day 3", title: "Procedure", description: "Surgery day", icon: "🏥" }
  ]}
/>
```

### ComparisonTable
```jsx
<ComparisonTable
  title="Clinic Comparison"
  headers={["Feature", "Clinic A", "Clinic B", "Clinic C"]}
  rows={[
    { feature: "English Support", option1: true, option2: true, option3: false },
    { feature: "Price Range", option1: "$$$", option2: "$$", option3: "$" }
  ]}
/>
```

### BeforeAfter
```jsx
<BeforeAfter
  before="/images/before.jpg"
  after="/images/after.jpg"
  beforeLabel="Before Treatment"
  afterLabel="After 3 Months"
  caption="Results may vary. Photos used with patient consent."
/>
```

### PriceComparisonChart
```jsx
<PriceComparisonChart
  title="Rhinoplasty Cost Comparison"
  items={[
    { label: "Basic Rhinoplasty", korea: 3000, usa: 8000, japan: 6000 },
    { label: "Revision Rhinoplasty", korea: 5000, usa: 12000, japan: 9000 }
  ]}
  currency="USD"
/>
```

---

## Best Practices

### 1. Article Structure
```markdown
---
title: "Your Article Title"
date: 2026-02-04
excerpt: "Compelling description"
category: Medical Tourism
author: Korea Experience Team
---

# Main Title

Opening paragraph with hook...

<KeyTakeaways points={[...]} readTime={10} />  <!-- MANDATORY -->

## First Section

Content...

<InfoBox type="tip">...</InfoBox>

<QuickFacts facts={[...]} />

## Second Section

<LocationCard ... />

<ExpertTip>...</ExpertTip>

## Conclusion

Summary...

<FAQAccordion items={[...]} />  <!-- MANDATORY -->
```

### 2. Component Usage Guidelines

| Component | When to Use | Frequency |
|-----------|-------------|-----------|
| KeyTakeaways | After intro | 1 per article |
| InfoBox | Tips, warnings, important info | 3-5 per article |
| QuickFacts | Data-heavy sections | 1-2 per article |
| StepGuide | How-to content | 0-1 per article |
| PriceTable | Cost comparisons | 1-2 per article |
| LocationCard | Venue/business info | 2-5 per article |
| ProsCons | Balanced analysis | 0-1 per article |
| DualismRoute | Travel itineraries | 0-1 per article |
| StatCard | Key statistics | 1-2 per article |
| ExpertTip | Personal insights | 2-3 per article |
| FAQAccordion | End of article | 1 per article |

### 3. SEO/GEO Optimization

- Place **KeyTakeaways** immediately after intro (AI citation priority)
- Include **specific numbers** in QuickFacts and StatCard
- Use **FAQAccordion** with common search queries
- Add **ExpertTip** for E-E-A-T signals
- Use **StepGuide** for HowTo rich snippets
- Include **LocationCard** for local business schema

---

## Changelog

- **2026-02-04**: Added 11 new GEO-optimized components
- **2026-01-15**: Initial 7 visual components

---

*For questions or component requests, contact the development team.*
