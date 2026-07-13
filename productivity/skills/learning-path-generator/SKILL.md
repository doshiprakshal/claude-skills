---
name: learning-path-generator
description: Generate a learning path for acquiring a general skill or technology — sequenced from foundational to advanced, with practical exercises, tailored to the learner's current background, distinct from onboarding to a specific existing codebase. Triggers on "generate a learning path for this technology", "help me plan how to learn this skill", "sequence a curriculum for learning this topic", "what should i learn first to get good at this".
user-invocable: true
---

# Learning Path Generator

Generate a sequenced learning path for acquiring a general skill or technology, tailored to the learner's current background.

## When to use

- Planning how to learn a general skill/technology/topic, sequenced from foundational to advanced.

**Out of scope**:
- Onboarding to a specific existing codebase → `codebase-onboarding`
- A specific certification exam's study plan structure (if the platform has a dedicated skill for that) — otherwise this skill covers general learning paths including certification prep

## Inputs

- The skill/technology/topic to learn.
- The learner's current background and relevant prior experience.
- The learner's goal (general proficiency, a specific project need, a certification).

## Workflow

### 1. Assess starting point

Determine what the learner already knows that's relevant/transferable, so the path starts at the right level — recommending foundational material to someone with strong transferable background wastes time; skipping foundations for someone without them creates gaps that compound later.

### 2. Sequence foundational-to-advanced

Order topics so each builds on genuinely established prior knowledge, not just a topic list in isolation — identify the load-bearing foundational concepts that unlock understanding of later material, similar to the core-concepts-first approach in `codebase-onboarding`.

### 3. Include practical exercises, not just reading

For each stage, include a concrete practical exercise or small project that applies the concept, not just reading/reference material — active application solidifies learning far more effectively than passive consumption alone.

### 4. Calibrate to the actual goal

If the goal is a specific project need rather than general mastery, prune the path to what's actually necessary for that goal rather than a comprehensive curriculum — a narrowly-scoped, goal-directed path gets the learner productive faster than an exhaustive one.

### 5. Report

A sequenced learning path: stages from foundational to advanced, a practical exercise per stage, and calibration notes explaining why certain material was included or excluded given the stated goal and starting background.

## Notes

- Always calibrate to actual starting background — a generic "beginner" path wastes an experienced learner's time by re-covering transferable knowledge, while assuming too much foundational knowledge leaves gaps; ask about relevant prior experience explicitly if not stated.
- Practical exercises per stage are what make a learning path effective rather than just a reading list — always include a concrete, applied task at each stage, not only reference material to consume.
