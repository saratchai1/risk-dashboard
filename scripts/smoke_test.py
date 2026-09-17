from pathlib import Path

root = Path(__file__).resolve().parents[1]
required = ["index.html", "styles.css", "app.js", "README.md"]
missing = [name for name in required if not (root / name).exists()]
if missing:
    raise SystemExit(f"missing files: {', '.join(missing)}")

html = (root / "index.html").read_text(encoding="utf-8")
js = (root / "app.js").read_text(encoding="utf-8")
css = (root / "styles.css").read_text(encoding="utf-8")

checks = {
    "app mount": 'id="app"' in html,
    "script": 'src="app.js"' in html,
    "stylesheet": 'href="styles.css"' in html,
    "executive overview": "Executive Overview" in js,
    "risk center": "Risk Center" in js,
    "decision center": "Decision Center" in js,
    "action center": "Action Center" in js,
    "mrv readiness": "MRV Readiness" in js,
    "executive brief": "Executive Brief" in js,
    "assumption warning": "ASSUMED DATA" in js,
    "drawer styles": ".risk-drawer" in css,
    "print styles": "@media print" in css,
}
failed = [name for name, ok in checks.items() if not ok]
if failed:
    raise SystemExit("smoke test failed: " + ", ".join(failed))

print(f"smoke test passed ({len(checks)} checks)")
