# Plan: Performance Bottleneck Optimizations

This plan outlines optimizations for sequential network request pipelines to run asynchronously in parallel, improving response times.

## Identified Bottlenecks

1. **dashboardController.js**:
   - Queries individual stock price quotes sequentially in a `for...of` loop.
   - Fetches index quotes (SPY, QQQ) sequentially.

2. **portfolioInsightService.js**:
   - Queries individual stock price quotes sequentially when computing analytics metrics.

---

## Proposed Refactoring

- Wrap the individual stock mapping arrays in `Promise.all` blocks to fetch all quotes concurrently.
- Re-run transaction balance and dynamic AI response checks to verify no regression.
