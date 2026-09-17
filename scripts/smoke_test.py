from pathlib import Path

root = Path(__file__).resolve().parents[1]
required = [
    "index.html",
    "styles.css",
    "enhancements.css",
    "ci-theme.css",
    "app.js",
    "enhancements.js",
    "README.md",
]
missing = [name for name in required if not (root / name).exists()]
if missing:
    raise SystemExit(f"missing files: {', '.join(missing)}")

html = (root / "index.html").read_text(encoding="utf-8")
base_js = (root / "app.js").read_text(encoding="utf-8")
enhanced_js = (root / "enhancements.js").read_text(encoding="utf-8")
css = "\n".join((root / name).read_text(encoding="utf-8") for name in ["styles.css", "enhancements.css", "ci-theme.css"])
js = base_js + enhanced_js

checks = {
    "app mount": 'id="app"' in html,
    "base script": 'src="app.js"' in html,
    "enhancement script": 'src="enhancements.js"' in html,
    "base stylesheet": 'href="styles.css"' in html,
    "enhancement stylesheet": 'href="enhancements.css"' in html,
    "ci stylesheet": 'href="ci-theme.css"' in html,
    "kanit font": "family=Kanit" in html and "'Kanit'" in css,
    "ci navy": "#171C8F" in css,
    "ci green": "#00FFCA" in css,
    "ci white": "#F0F6F7" in css,
    "ci blue": "#097EFB" in css,
    "executive overview": "Executive Overview" in js,
    "risk center": "Risk Center" in js,
    "decision center": "Decision Center" in js,
    "action center": "Action Center" in js,
    "mrv readiness": "MRV Readiness" in js,
    "executive brief": "Executive Brief" in js,
    "assumption warning": "ASSUMED DATA" in js,
    "csv export": "downloadCSV" in enhanced_js,
    "local persistence": "localStorage" in enhanced_js,
    "drawer styles": ".risk-drawer" in css,
    "print styles": "@media print" in css,
}
failed = [name for name, ok in checks.items() if not ok]
if failed:
    raise SystemExit("smoke test failed: " + ", ".join(failed))

print(f"smoke test passed ({len(checks)} checks)")
