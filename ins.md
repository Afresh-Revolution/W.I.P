You are a senior frontend engineer, UI engineer, accessibility specialist, and Figma-to-code expert.

Use this Figma project as the SINGLE SOURCE OF TRUTH:

https://www.figma.com/make/1QaiNKFhwZJhOAY7uQsu2r/Women-in-Politics-Initiative-Website?fullscreen=1&t=HIJnyMnT3IAdzYtH-1&code-node-id=0-6

Your task is to inspect the ENTIRE Figma project and convert EVERY relevant website design, page, section, component, asset, interaction, and responsive state into a complete production-quality Next.js website.

The website is for:

WOMEN IN POLITICS INITIATIVE — WIPI

Do not redesign the website.

Do not create a generic NGO website.

Do not use the current selected frame only.

Inspect ALL pages, ALL frames, ALL sections, ALL components, ALL reusable styles, and ALL assets contained in the Figma project.

The Figma project must remain the visual authority throughout the implementation.

⸻

PROJECT GOAL

Recreate the entire Women in Politics Initiative website in Next.js so that the live website visually matches the supplied Figma design as closely as technically possible.

The implementation must preserve:

* Existing visual hierarchy
* Existing branding
* Existing color palette
* Existing typography
* Existing spacing
* Existing imagery
* Existing logo
* Existing content
* Existing cards
* Existing buttons
* Existing border radius
* Existing shadows
* Existing navigation
* Existing hero sections
* Existing maps
* Existing statistics
* Existing membership sections
* Existing programs
* Existing footer
* Existing page structures
* Existing mobile layouts
* Existing interactions
* Existing animations

Do not replace the visual system with your own.

⸻

STEP 1 — INSPECT THE ENTIRE FIGMA PROJECT FIRST

Before writing code, inspect the complete Figma project.

Do not start coding after looking at only the homepage.

Identify:

1. Every website page
2. Every desktop frame
3. Every mobile frame
4. Every tablet variation if available
5. Every reusable component
6. Every component variant
7. Every section
8. Every modal
9. Every form
10. Every navigation state
11. Every carousel
12. Every dropdown
13. Every map
14. Every statistic block
15. Every membership section
16. Every CTA
17. Every footer variation
18. Every visual asset

Build an internal page inventory before implementation.

If a page exists in the Figma project, create it.

Do not omit a page because it looks similar to another page.

⸻

DESIGN SOURCE OF TRUTH

Treat Figma as a specification, NOT inspiration.

You MUST extract actual design values from Figma.

Do not guess values unless absolutely necessary.

Extract:

* Exact color values
* Exact typography
* Exact font weights
* Exact font sizes
* Exact line heights
* Exact letter spacing
* Exact section spacing
* Exact card dimensions
* Exact button dimensions
* Exact border radius
* Exact shadows
* Exact borders
* Exact image crops
* Exact alignment
* Exact container width
* Exact maximum widths

The final website must feel like the Figma design was directly transformed into code.

⸻

WOMEN IN POLITICS INITIATIVE BRAND

Preserve the identity and visual tone already established in the design.

The website should continue to feel:

* Professional
* Civic
* Empowering
* Women-focused
* Leadership-oriented
* Trustworthy
* Inclusive
* Modern
* Premium
* Clean
* Not overly corporate
* Not generic
* Not AI-generated

Do not introduce unrelated visual themes.

⸻

OFFICIAL MISSION

Where the mission appears in the Figma design, preserve this exact meaning and wording unless the Figma itself uses a refined version:

To mobilize, empower and equip Plateau women through leadership training, mentorship, voter education and empowerment programs so they can participate meaningfully in governance, peace building and community development.

Do not rewrite this unnecessarily.

⸻

OFFICIAL VISION

Where the vision appears, preserve this meaning:

A Plateau State where women vote and are voted for, are skilled in leadership, respected, protected from abuse, economically empowered, and enjoy happy, dignified and meaningful participation as active partners in peace and democracy.

Use the exact copy contained in Figma if it differs slightly.

Figma copy takes priority.

⸻

ALL FIGMA ASSETS MUST BE USED

Extract and correctly use all original assets.

This includes:

* WIPI logo
* Hero images
* Leadership photographs
* Program photographs
* Gallery photographs
* Decorative graphics
* Icons
* SVG graphics
* LGA map graphics
* Membership graphics
* Background artwork
* Section background images
* Social media icons
* Arrow icons
* Navigation icons
* Footer icons

Do NOT replace these with:

* Unsplash
* Random stock imagery
* AI-generated photos
* Placeholder images
* Random illustrations
* Generic icons

If Figma contains the original asset, use that asset.

⸻

ASSET STRUCTURE

Organize exported assets professionally.

Use a structure similar to:

/public
  /images
    /hero
    /about
    /programs
    /leadership
    /gallery
    /membership
    /locations
  /logos
  /icons
  /maps
  /backgrounds
  /illustrations

Use descriptive file names.

Do not use filenames like:

image1.png
image2.png
frame33.png

Prefer:

wipi-logo.svg
women-leadership-training.webp
plateau-state-lga-map.svg
membership-community.webp

⸻

LOGO IMPLEMENTATION

Export the actual WIPI logo from Figma.

Prefer SVG where available.

Do not:

* Recreate the logo manually
* Change its color
* Stretch it
* Distort it
* Add glow
* Add shadow
* Add 3D
* Change proportions

Respect the exact logo sizing shown in the design.

⸻

COLOR SYSTEM

Inspect Figma and extract EVERY actual color.

Create centralized design tokens.

For example:

:root {
  --wipi-primary: ...;
  --wipi-primary-dark: ...;
  --wipi-secondary: ...;
  --wipi-accent: ...;
  --background-primary: ...;
  --background-secondary: ...;
  --text-primary: ...;
  --text-secondary: ...;
  --text-muted: ...;
  --border-default: ...;
  --success: ...;
  --warning: ...;
  --error: ...;
}

These are examples only.

DO NOT invent the values.

Extract the actual values from Figma.

Use the same colors consistently across the website.

⸻

TYPOGRAPHY

Inspect Figma and identify the exact font family used.

Use that same font.

If it is available from Google Fonts, use:

next/font/google

If Figma uses custom font files, use:

next/font/local

Create a proper typography system based on the design:

* Display
* H1
* H2
* H3
* H4
* H5
* H6
* Body large
* Body
* Body small
* Caption
* Navigation
* Buttons
* Labels

Match:

* Font family
* Font weight
* Font size
* Line height
* Letter spacing
* Text transformation

Do not silently replace the font with Inter unless Figma actually uses Inter.

⸻

PAGE IMPLEMENTATION

Implement every page visible in the Figma project.

This may include pages such as:

* Home
* About
* Programs
* Membership
* Leadership
* Initiatives
* Events
* Gallery
* Resources
* Contact
* Join WIPI
* Any other page contained in the Figma file

Do not assume this list is complete.

The Figma file determines the actual final route list.

⸻

ROUTING

Use Next.js App Router.

Create proper routes.

Example:

/
/about
/programs
/membership
/leadership
/events
/gallery
/contact
/join

Use the actual Figma navigation structure.

Do not create dead buttons.

Every navigation item that points to a designed page must work.

⸻

HOMEPAGE

Reproduce the complete homepage from top to bottom.

Do not implement only the hero section.

Include every homepage section appearing in Figma.

Possible examples include:

* Navigation
* Hero carousel
* Introductory section
* About WIPI
* Mission and vision
* Programs
* Membership
* Impact/statistics
* Plateau State/LGA section
* Upcoming activities
* Leadership
* Testimonials
* CTA
* Footer

Use the actual Figma composition.

⸻

HERO CAROUSEL

The Figma design contains a hero carousel.

Implement it properly.

The hero carousel should:

* Display the correct imagery
* Display the correct text
* Display the correct CTA buttons
* Match Figma positioning
* Match Figma overlay treatment
* Match text alignment
* Match section height
* Match border radius where applicable

Implement:

* Automatic transition if intended
* Previous control if shown
* Next control if shown
* Indicators if shown
* Touch swipe support
* Keyboard accessibility

Use subtle transitions.

Do not create an exaggerated slider animation.

⸻

HERO IMAGE QUALITY

Use high-quality exported Figma imagery.

The image must not become pixelated or stretched.

Use:

<Image />

where appropriate.

Preserve:

object-fit: cover;
object-position: ...;

according to the Figma crop.

⸻

PAGE HERO / INNER PAGE BANNERS

The design includes page introductory frames where background imagery should appear faintly behind the content.

Implement them correctly.

If the Figma design uses a faint image inside a page banner:

* Use the actual corresponding image
* Add the same dark/color overlay
* Match opacity
* Match positioning
* Match text placement

Do NOT replace these banners with plain solid backgrounds if the current design shows imagery.

⸻

PLATEAU STATE MAP

Use the Plateau State map design already included in the Figma file.

The map should preserve the Plateau State LGA representation.

Where the Figma design displays LGA names, ensure the correct names are preserved:

* Barkin Ladi
* Bassa
* Bokkos
* Jos East
* Jos North
* Jos South
* Kanam
* Kanke
* Langtang North
* Langtang South
* Mangu
* Mikang
* Pankshin
* Qua’an Pan
* Riyom
* Shendam
* Wase

Use the map exactly as designed.

Do not substitute it with Google Maps or a generic Nigeria map unless Figma explicitly contains one.

If the map is an image/SVG, export and use it properly.

⸻

MEMBERSHIP SECTION

Implement the membership section exactly as designed.

Preserve:

* Membership category
* Membership benefits
* Membership amount
* Registration information
* CTA
* Uniform requirement
* Membership visuals
* Cards
* Icons
* Typography

If the design includes the ₦10,000 membership category, use the category name already shown in Figma.

Do not invent a different membership name.

Uniform is mandatory where the design communicates this.

⸻

PROGRAMS

Implement all programs shown in the Figma project.

Each program card/section must preserve:

* Original image
* Title
* Description
* Icon
* Button
* Spacing
* Card proportions

Use reusable React components where appropriate.

⸻

LEADERSHIP / TEAM

If Figma includes WIPI leadership/team:

Use the exact:

* Images
* Names
* Positions
* Card styles
* Typography
* Layout

Do not replace portraits.

⸻

GALLERY

If a gallery is contained in the design:

Implement it accurately.

Support the exact layout:

* Grid
* Masonry
* Carousel

depending on what Figma specifies.

If image preview/lightbox behaviour is shown, implement it.

⸻

FORMS

Implement every form visually.

Examples:

* Membership form
* Volunteer form
* Contact form
* Newsletter form

Forms must have:

* Correct labels
* Correct placeholders
* Correct fields
* Correct input sizes
* Correct border radius
* Correct button style
* Correct validation states

Unless a backend has explicitly been requested:

DO NOT create APIs.

Use frontend validation only.

⸻

BUTTONS

Every visible button must be interactive.

Buttons must have:

* Default
* Hover
* Focus
* Active
* Disabled where relevant

Match Figma.

Do not invent extra gradients or shadows.

All buttons should use the same radius system shown in Figma.

⸻

CORNER RADIUS

The design intentionally uses rounded elements.

Preserve rounded corners on:

* Buttons
* Cards
* Images
* Containers
* Forms
* Hero panels
* Modals
* Content sections

Do not exaggerate the radius.

Use the actual Figma radius values.

⸻

CARDS

Match card designs exactly.

Check:

* Width
* Height
* Padding
* Border radius
* Border
* Shadow
* Background
* Text alignment
* Image size
* Image placement

Do not create generic Tailwind cards.

⸻

ANIMATION

The website should feel modern and polished rather than static.

Use subtle animations based on the design.

Good examples:

* Fade and slide on section entry
* Soft card reveal
* Subtle CTA hover
* Menu transition
* Carousel transition
* Number/statistic reveal
* Image hover
* Accordion transition

Do not use:

* Excessive parallax
* 3D transformations
* Neon effects
* Glowing lines
* Constant movement
* Distracting animations

Animation should support the content.

⸻

SCROLL ANIMATION

Sections may animate subtly as they enter the viewport.

Keep animation approximately:

* 300ms–700ms
* Smooth easing
* Small distances

Example behaviour:

opacity: 0 → 1
translateY: 20px → 0

Do not delay content excessively.

⸻

REDUCED MOTION

Respect:

@media (prefers-reduced-motion: reduce)

Disable unnecessary movement for users who request reduced motion.

⸻

NAVIGATION

Recreate the exact header design.

Desktop:

* Correct logo placement
* Correct menu
* Correct CTA
* Correct height
* Correct colors
* Correct spacing

Mobile:

Create a responsive mobile menu.

The mobile navigation must:

* Open
* Close
* Include all navigation
* Be keyboard accessible
* Fit the phone screen
* Prevent background overflow where appropriate

⸻

STICKY HEADER

If Figma indicates a sticky/fixed navbar, implement it.

If not shown, do not add one unnecessarily.

⸻

FOOTER

Recreate the complete footer.

Include everything shown:

* WIPI logo
* Navigation
* Contact details
* Social icons
* Address
* Copyright
* Newsletter
* Additional links

Use the exact content from Figma.

⸻

RESPONSIVENESS

The entire website MUST be fully responsive.

Do not create only desktop and scale it down.

Test at minimum:

320px
360px
375px
390px
414px
430px
768px
820px
1024px
1280px
1366px
1440px
1536px
1728px
1920px

The website must look intentional at every width.

⸻

MOBILE

For mobile:

* Stack sections intelligently
* Maintain proper spacing
* Ensure headings fit
* Keep body copy readable
* Ensure buttons remain usable
* Use appropriate image crops
* Keep section margins consistent
* Prevent horizontal scrolling
* Reorganize multi-column grids
* Use one or two columns according to the design
* Preserve card quality

If Figma includes dedicated mobile frames:

FOLLOW THOSE FRAMES EXACTLY.

They take priority over automatic responsiveness.

⸻

TABLET

Create deliberate layouts for tablets.

Between approximately:

768px – 1024px

Do not simply use the desktop design squeezed into a smaller width.

Review:

* Grid count
* Heading size
* Card width
* Navigation
* Image dimensions
* Section padding

⸻

LARGE DESKTOP

Do not let content become excessively stretched on:

1440px
1728px
1920px+

Use the Figma container width/max width.

Keep content centered.

Preserve the composition.

⸻

RESPONSIVE TYPOGRAPHY

Use clamp() where appropriate.

For example:

font-size: clamp(2.5rem, 5vw, 5rem);

But if Figma provides explicit responsive typography values, use them.

⸻

RESPONSIVE SPACING

Use responsive section spacing.

Avoid:

* Giant gaps on mobile
* Cramped desktop sections
* Cards touching screen edges

Create consistent horizontal padding.

⸻

IMAGE BEHAVIOUR

Every image must behave correctly responsively.

Preserve:

* Aspect ratio
* Crop
* Border radius
* Image focus
* Alignment

Do not allow stretched images.

⸻

NEXT.JS STACK

Use:

Next.js
React
TypeScript
App Router

Use Tailwind CSS if it helps faithfully recreate the design, but do not let default Tailwind values replace Figma values.

⸻

PROJECT STRUCTURE

Use a professional architecture.

Example:

app/
  layout.tsx
  page.tsx
  about/
    page.tsx
  programs/
    page.tsx
  membership/
    page.tsx
  contact/
    page.tsx
components/
  layout/
    Header.tsx
    Footer.tsx
    MobileMenu.tsx
  sections/
    Hero.tsx
    MissionVision.tsx
    Programs.tsx
    Membership.tsx
    Impact.tsx
    Locations.tsx
    Leadership.tsx
  ui/
    Button.tsx
    Card.tsx
    Input.tsx
    SectionHeader.tsx
public/
  images/
  logos/
  icons/
  maps/

Adapt this according to the actual Figma pages.

⸻

SERVER VS CLIENT COMPONENTS

Use Server Components by default.

Only use:

"use client";

for components that actually require interactivity.

Examples:

* Carousel
* Mobile menu
* Tabs
* Modal
* Accordion
* Interactive form

Avoid unnecessarily converting the entire application to client components.

⸻

IMAGE OPTIMIZATION

Use Next.js Image.

Correctly configure:

sizes
priority
width
height
fill

as appropriate.

Above-the-fold hero images should load efficiently.

⸻

ACCESSIBILITY

Implement proper accessibility without changing the visual design.

Use semantic tags:

<header>
<nav>
<main>
<section>
<article>
<footer>

Use actual:

<button>

for actions.

Use actual:

<a>

for links.

Add:

* Alt text
* Form labels
* Keyboard navigation
* Focus styles
* Appropriate ARIA attributes

⸻

SEO

Create appropriate metadata for WIPI.

Include:

* Title
* Description
* Open Graph data
* Favicon
* Social preview setup

Use information contained in the Figma project.

Do not invent excessive copy.

⸻

CONTENT ACCURACY

Use the exact content shown in Figma.

Do not use:

Lorem ipsum
Dummy text
Sample text
Placeholder organization

Do not rewrite WIPI copy unless needed to correct obvious grammar.

Figma text is authoritative.

⸻

LINKS

Ensure:

* Navigation links work
* CTA buttons work
* Footer links work
* Email links use mailto:
* Phone numbers use tel:
* Social links work where URLs exist

Internal navigation should use Next.js <Link>.

⸻

ACTIVE NAVIGATION STATE

Show an appropriate active state for the current page if the Figma design includes one.

⸻

PERFORMANCE

Keep the application efficient.

Avoid huge unnecessary dependencies.

Use:

* Optimized images
* SVGs
* Font optimization
* Lazy loading
* Code splitting
* Reusable components

⸻

NO GENERIC DESIGN

This requirement is critical.

DO NOT turn WIPI into a generic NGO template.

Avoid:

* Generic stock photography
* Generic purple gradient SaaS layouts
* Random blobs
* Glassmorphism
* Neon
* 3D graphics
* Overdesigned UI
* Generic Bootstrap-looking cards

The provided Figma design is already the finished design.

IMPLEMENT IT.

⸻

PIXEL ACCURACY

At the same viewport size as the original Figma desktop frames, the live implementation should appear nearly identical when placed side-by-side.

Pay particular attention to:

* Heading wrapping
* Paragraph widths
* Image crops
* Spacing
* Section height
* Alignment
* Button size
* Navigation positioning
* Image-to-text proportions
* Card dimensions

⸻

FIGMA AUTO-LAYOUT → WEB

Translate Figma Auto Layout intelligently into:

* Flexbox
* CSS Grid
* Gap
* Padding
* max-width
* min-width

Do not blindly reproduce Figma x/y coordinates.

The website must behave responsively.

Use absolute positioning only where visual overlays genuinely require it.

⸻

RESPONSIVE CSS

Use modern responsive tools including:

clamp()
min()
max()
minmax()
repeat()
auto-fit
auto-fill
aspect-ratio
object-fit

Use Grid/Flexbox instead of brittle coordinate-based CSS.

⸻

DESIGN TOKENS

Extract repeated values and centralize them.

Create tokens for:

* Colors
* Font sizes
* Radius
* Shadows
* Spacing
* Breakpoints
* Containers

This ensures the website remains visually consistent with the original design.

⸻

QUALITY CONTROL

Before completing the project, go back to the original Figma link and audit EVERY frame again.

Verify that every website frame has a corresponding implementation.

Check:

Content

* Correct text
* Correct headings
* Correct labels
* Correct names

Visual

* Correct colors
* Correct fonts
* Correct images
* Correct icons
* Correct radius
* Correct shadows

Layout

* Correct spacing
* Correct grids
* Correct alignment
* Correct container sizes

Functionality

* Navigation works
* Mobile menu works
* Carousel works
* Buttons work
* Forms respond
* Modals close
* Links work

Responsive

Test:

375px
390px
430px
768px
1024px
1280px
1440px
1920px

⸻

ERROR CHECK

Before final completion make sure:

* npm run build succeeds
* No TypeScript errors exist
* No missing imports exist
* No broken images exist
* No invalid routes exist
* No unnecessary console errors exist
* No visible horizontal overflow exists

⸻

FINAL INSTRUCTION

Build the complete Women in Politics Initiative website from the supplied Figma project.

Inspect the ENTIRE project, not just:

* The currently selected frame
* The homepage
* The first design section

Use every relevant existing design.

Extract and use the REAL:

* WIPI logo
* Colors
* Font families
* Images
* SVGs
* Icons
* Map
* Text
* Border radius
* Shadows
* Spacing

DO NOT create your own substitute design.

DO NOT replace the design system.

DO NOT replace the images.

DO NOT skip secondary pages.

DO NOT make it look like a generic AI-generated NGO website.

The result must be:

PIXEL-ACCURATE.

FULLY RESPONSIVE.

PRODUCTION-QUALITY.

ACCESSIBLE.

FAST.

FUNCTIONAL.

AND VISUALLY FAITHFUL TO THE ORIGINAL FIGMA DESIGN.

The finished Next.js website should look and feel like the original Women in Politics Initiative Figma project has been transformed directly into a fully working website.