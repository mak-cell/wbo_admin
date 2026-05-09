---
name: Weddingbellodisha Studio
colors:
  surface: '#fbf9f8'
  surface-dim: '#dbdad9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f0'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#775a19'
  on-secondary: '#ffffff'
  secondary-container: '#fed488'
  on-secondary-container: '#785a1a'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a1c1b'
  on-tertiary-container: '#838482'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#ffdea5'
  secondary-fixed-dim: '#e9c176'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4201'
  tertiary-fixed: '#e3e2e0'
  tertiary-fixed-dim: '#c7c6c5'
  on-tertiary-fixed: '#1a1c1b'
  on-tertiary-fixed-variant: '#464746'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-h1:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-h2:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-page: 48px
  section-gap: 64px
---

## Brand & Style
The design system is anchored in the concept of "The Curated Gallery." It reflects the prestige of the high-end wedding industry by treating every dashboard element as a piece of art. The brand personality is timeless, sophisticated, and authoritative, designed to instill confidence in both the studio managers and their premium clientele.

The visual direction follows **High-Contrast Minimalism**. It prioritizes extreme legibility and breathability. By utilizing generous whitespace and a restricted, expensive color palette, the UI disappears to let the photography and client data take center stage. This approach moves away from traditional "app-like" densities toward an editorial, magazine-inspired experience.

## Colors
The palette is built on a foundation of **Deep Charcoal** (#121212) and **Crisp White** (#FFFFFF) to establish a high-contrast, professional environment. 

- **Primary (Deep Charcoal):** Used for typography, primary actions, and structural navigation to provide a grounded, authoritative feel.
- **Accent (Champagne Gold):** Used sparingly for high-value interactions, success states, and premium callouts. It serves as a visual "signature" of the wedding industry.
- **Surface (Soft Bone/Bone White):** A subtle off-white (#F9F8F6) is used for secondary containers to prevent visual fatigue and add a layer of warmth.
- **Utility:** Grays are kept neutral to avoid clashing with the photography metadata.

## Typography
This design system employs a sophisticated typographic pairing to balance heritage with modern utility.

- **Headings:** **Playfair Display** provides a literary, high-fashion aesthetic. It is used for page titles, section headers, and significant numerical data (e.g., total revenue) to evoke the elegance of a wedding invitation.
- **UI & Body:** **Manrope** is used for all functional elements. Its geometric but refined structure ensures that dense studio data remains legible and contemporary.
- **Hierarchy:** High contrast in scale is encouraged. Labels should often be small, uppercase, and tracked out to provide a sense of architectural precision.

## Layout & Spacing
The layout philosophy is based on a **Fixed-Width Grid** within a fluid viewport. This ensures that on large studio monitors, the content remains centered and composed like a photograph.

- **Grid:** A 12-column grid with wide 24px gutters.
- **Rhythm:** An 8px linear scale governs all padding and margins. 
- **Whitespace:** Elements are given "room to breathe." Margins between major sections should be aggressive (64px+) to maintain the premium feel. 
- **Sidebar:** A slim, high-contrast vertical navigation bar (Charcoal) stays fixed to the left, providing a persistent anchor for the user.

## Elevation & Depth
Depth is conveyed through **Ambient Shadows** and tonal layering rather than heavy borders.

- **Surfaces:** The main canvas is Crisp White. Secondary cards use a Soft Bone background with a 1px stroke in a very light gray (#EAEAEA).
- **Shadows:** Use large-radius, low-opacity shadows (e.g., `box-shadow: 0 10px 30px rgba(0,0,0,0.03)`). This creates a "lifted paper" effect that feels tactile and light.
- **Interactivity:** Elements "lift" slightly on hover using a slightly more pronounced shadow, rather than changing color, to maintain the minimalist aesthetic.

## Shapes
The shape language is **Softly Architectural**. 

A low roundedness (4px to 8px) is applied to maintain a sharp, professional edge while avoiding the harshness of perfect right angles. This subtle softening makes the UI feel modern and approachable without losing its "luxury" status. Buttons and input fields should strictly adhere to the `rounded-sm` (4px) or `rounded-md` (8px) tokens. Circles are reserved exclusively for user avatars and status indicators.

## Components
- **Buttons:** Primary buttons are Solid Charcoal with White text. Secondary buttons are Gold-outlined with Gold text. Transitions should be smooth (200ms) and use a subtle scale-down on click to feel premium.
- **Cards:** Used to house client bookings and gallery previews. They feature a 1px light border and the ambient shadow defined in the Elevation section. Photography within cards should always have a slight zoom-on-hover effect.
- **Inputs:** High-end form fields use a "floating label" style with a 1px bottom border that turns Gold on focus. Avoid heavy boxed inputs.
- **Chips/Status:** Use the Champagne Gold for positive states (e.g., "Booked") and a muted gray for neutral states (e.g., "Draft").
- **Data Tables:** Clean, no vertical lines. Horizontal dividers should be 1px and very faint (#F0F0F0). Row headers use the Serif font for a bespoke feel.
- **Featured Component (Booking Timeline):** A vertical, elegant line in Gold connecting different wedding events (Engagement, Sangeet, Wedding, Reception), using Serif typography for dates.