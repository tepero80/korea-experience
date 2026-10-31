"""Offline WOFF2 delivery encoding; retain existing font names, glyphs and licenses.

Preparation dependencies: fonttools==4.62.0, brotli==1.2.1.
This command is not run by deploy builds. Original TTF files remain for card
rendering and compatibility with the preceding deployed community stylesheet.
"""
import json
from pathlib import Path
from fontTools.ttLib import TTFont

records = []
for name in ("manrope-latin", "source-sans-3-latin"):
    source = Path("public/fonts") / f"{name}.ttf"
    target = source.with_suffix(".woff2")
    font = TTFont(source, recalcTimestamp=False)
    cmap = font.getBestCmap()
    metrics = dict(font["hmtx"].metrics)
    order = font.getGlyphOrder()
    axes = [(a.axisTag, a.minValue, a.defaultValue, a.maxValue) for a in font["fvar"].axes]
    font.flavor = "woff2"
    font.save(target)
    decoded = TTFont(target, recalcTimestamp=False)
    assert decoded.getBestCmap() == cmap, "Unicode mapping changed"
    assert decoded["hmtx"].metrics == metrics, "Advance widths changed"
    assert decoded.getGlyphOrder() == order, "Glyph order changed"
    assert [(a.axisTag, a.minValue, a.defaultValue, a.maxValue) for a in decoded["fvar"].axes] == axes
    records.append({"name": name, "sourceBytes": source.stat().st_size, "deliveryBytes": target.stat().st_size, "unicodeMappings": len(cmap), "glyphs": len(order), "metricsAndVariableAxes": "round-trip matched"})
Path(".private/reports/font-delivery-preparation.json").write_text(json.dumps({"method": "Format compression only; no glyph/name/subset alteration", "records": records}, indent=2), encoding="utf-8")
print(json.dumps(records))
