---
name: frontend-design
description: Create polished, production-grade frontend interfaces with stronger visual hierarchy and UX clarity. Invoke when users ask to beautify UI, improve layout, spacing, typography, responsiveness, or interaction quality.
---

# Frontend Design

Use this skill when the user asks to improve the look, feel, and usability of a frontend surface.

Typical triggers:

- beautify a page, form, modal, dashboard, landing page, or component
- make the UI cleaner, more modern, more premium, or more polished
- improve spacing, typography, color usage, hierarchy, or consistency
- refine interaction states, affordance, accessibility, or responsiveness
- evolve an existing interface without changing product scope

Do not use this skill for:

- backend-only work
- pure testing requests
- logic-only refactors with no user-facing UX impact
- cloning a copyrighted product's exact visual identity

## Goal

Create a cohesive, production-ready interface that feels intentional. Prefer system-level improvements over one-off decoration.

Target outcomes:

- clearer visual hierarchy
- cleaner spacing rhythm
- more consistent typography
- better component alignment and grouping
- stronger affordance and interaction feedback
- better responsive behavior
- solid baseline accessibility

## Process

1. Understand the user goal and the primary task on the screen
2. Inspect the relevant files and preview the current UI if possible
3. Identify the smallest set of changes with the biggest UX payoff
4. Apply improvements that preserve existing behavior unless functional changes are requested
5. Verify the result with diagnostics and visual review when available

## Audit Checklist

Before editing, quickly assess:

- what the user should notice first
- whether primary and secondary actions are clearly separated
- whether spacing follows a repeatable rhythm
- whether headings, body text, and labels form a clear type scale
- whether colors are restrained, readable, and consistent
- whether controls visibly look interactive
- whether focus, hover, disabled, loading, empty, and error states are covered
- whether the layout still works on smaller screens
- whether any visual noise can be removed

## Preferred Improvements

### Hierarchy

- make the main title, section titles, and primary CTA obvious
- reduce competing emphasis and unnecessary strong colors
- group related information with spacing before adding decoration

### Layout And Spacing

- normalize padding, gaps, and margins
- align card edges, grid columns, and form fields
- improve whitespace to reduce clutter

### Typography

- simplify font sizes and weights into a tighter scale
- improve line height and text contrast for readability
- use muted text strategically instead of everywhere

### Components And Surfaces

- unify border radius, border color, shadow, and background treatment
- prefer subtle depth and contrast over heavy effects
- keep buttons, inputs, cards, and panels visually related

### Interaction Quality

- improve hover, focus, active, selected, loading, and disabled states
- make actions feel obvious and reliable
- reduce friction in forms with clearer labels, hints, and errors

### Accessibility

- maintain sufficient contrast
- preserve visible keyboard focus
- avoid color-only status communication
- keep touch targets practical where relevant

## Constraints

- prefer minimal, high-leverage edits
- do not break working behavior
- do not add large dependencies unless strongly justified
- follow the existing stack and styling conventions
- if a design system exists, extend it instead of fighting it

## Output Expectations

When using this skill, the response should usually:

1. summarize the main UX/UI issues found
2. explain the intended design direction briefly
3. implement focused improvements
4. call out important visual and interaction changes
5. mention any useful next steps if the request was broad

## If Scope Is Vague

If the request is broad, first narrow the work to one of these scopes:

- one page
- one component group
- one flow such as onboarding, form, table, or dashboard
- a shared style cleanup such as design tokens, buttons, cards, or spacing

## Example Triggers

- 帮我把这个页面做得更高级一点
- 优化一下这个后台界面的 UIUX
- 请做一轮 frontend design polish
- 把按钮、卡片、留白和层级统一一下
- 让这个表单更清晰、更顺手
