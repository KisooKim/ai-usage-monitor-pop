# SDD Progress — Claude Code Usage Monitor product site

Plan: docs/superpowers/plans/2026-06-26-claude-monitor-product-site.md

- Spec + plan: complete (commits 17949a9 / 8d7cc7d)
- Task 1 (scaffold) + Tasks 3-10 (page structure): complete (commits 93dc245..558a3b8, review clean; minor: tasks 7/8 folded into commit 98fa4cb — content correct, not worth a fix)
- Task 2 (screenshots): captured 4 themes via PrintWindow (2-account clean: Claude+Codex), emails redacted to placeholders, placed as panel-hero/theme-*/multi-account.webp (commit eb9ebe5). Known minor: ~4px bottom clip on 7d row (build geometry). tray-badge: pending decision (reuse panel vs real tray capture).
- Layout verified correct (hero centered, mL=mR=712px; earlier "right-shift" was a capture misread, not a bug).
- Clip FIXED: app source patched (multi_account_panel_height bottom sc(6)->sc(14)), rebuilt, re-captured all 4 themes at 136px (no clip). App fix committed in Claude-Code-Usage-Monitor (0c45456); user's app relaunched on the fixed build. tray-badge = reused light panel image.
- Task 11 (favicon/OG/a11y/perf): complete — SEO/OG meta added, favicon + og-cover generated, all assets serve 200 (commit on claude-monitor-site).
- Task 12 (deploy): pending — needs user confirm (push to KisooKim, Pages, Release with fixed exe).
