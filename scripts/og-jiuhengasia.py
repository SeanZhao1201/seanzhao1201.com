"""Render public/jiuhengasia/og.png (1200×630) for the /jiuhengasia page.

Composes the hero with the site's own fonts instead of screenshotting, so the
output is deterministic. Fraunces/Inter come from node_modules (woff2 →
TTF via fontTools); Chinese text uses Noto Sans SC if installed, else
Microsoft YaHei / PingFang.

    pip install pillow fonttools brotli
    python scripts/og-jiuhengasia.py
"""

import os
import sys
import tempfile

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NM = os.path.join(ROOT, "node_modules")
OUT = os.path.join(ROOT, "public", "jiuhengasia", "og.png")
MARK = os.path.join(ROOT, "public", "jiuhengasia", "mark.png")
W, H = 1200, 630
TMP = tempfile.mkdtemp(prefix="og-fonts-")

CJK_CANDIDATES = [
    r"C:\Windows\Fonts\NotoSansSC-VF.ttf",
    r"C:\Windows\Fonts\msyh.ttc",
    "/System/Library/Fonts/PingFang.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
]


def woff2_to_ttf(rel):
    src = os.path.join(NM, rel)
    dst = os.path.join(TMP, os.path.basename(rel).replace(".woff2", ".ttf"))
    f = TTFont(src)
    f.flavor = None
    f.save(dst)
    return dst


def variable(path, size, axes):
    f = ImageFont.truetype(path, size)
    f.set_variation_by_axes(axes)
    return f


FRAUNCES = woff2_to_ttf("@fontsource-variable/fraunces/files/fraunces-latin-opsz-normal.woff2")
FRAUNCES_I = woff2_to_ttf("@fontsource-variable/fraunces/files/fraunces-latin-opsz-italic.woff2")
INTER = woff2_to_ttf("@fontsource/inter/files/inter-latin-500-normal.woff2")
CJK = next((p for p in CJK_CANDIDATES if os.path.exists(p)), None)
if not CJK:
    sys.exit("No CJK font found; add one to CJK_CANDIDATES")


def fraunces(size, italic=False):
    return variable(FRAUNCES_I if italic else FRAUNCES, size, [144, 400])


def inter(size):
    return ImageFont.truetype(INTER, size)


def cjk(size):
    f = ImageFont.truetype(CJK, size)
    try:
        f.set_variation_by_axes([400])
    except Exception:  # static font
        pass
    return f


img = Image.new("RGB", (W, H), (0, 0, 0))


def glow(cx, cy, rx, ry, color, alpha, blur):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(layer).ellipse(
        [cx - rx, cy - ry, cx + rx, cy + ry], fill=color + (int(255 * alpha),)
    )
    return layer.filter(ImageFilter.GaussianBlur(blur))


base = img.convert("RGBA")
base = Image.alpha_composite(base, glow(0.22 * W, 0.32 * H, 0.30 * W, 0.36 * H, (41, 151, 255), 0.16, 90))
base = Image.alpha_composite(base, glow(0.78 * W, 0.72 * H, 0.26 * W, 0.32 * H, (177, 91, 255), 0.12, 90))
img = base.convert("RGB")
d = ImageDraw.Draw(img)


def dashed_rect(x0, y0, x1, y1, color=(41, 41, 41), dash=4, gap=4):
    x = x0
    while x < x1:
        d.line([(x, y0), (min(x + dash, x1), y0)], fill=color)
        d.line([(x, y1), (min(x + dash, x1), y1)], fill=color)
        x += dash + gap
    y = y0
    while y < y1:
        d.line([(x0, y), (x0, min(y + dash, y1))], fill=color)
        d.line([(x1, y), (x1, min(y + dash, y1))], fill=color)
        y += dash + gap


dashed_rect(14, 14, W - 15, H - 15)


def tracked(x, y, text, font, fill, tracking):
    for ch in text:
        d.text((x, y), ch, font=font, fill=fill)
        x += font.getlength(ch) + tracking
    return x


DIM = (134, 134, 139)
FG = (245, 245, 247)
MUTED = (161, 161, 166)

x = tracked(76, 70, "久桁广告会展（上海）有限公司", cjk(17), DIM, 5)
tracked(x + 10, 71, "— SHANGHAI · LIVE COMMUNICATION", inter(13), DIM, 4.5)


def gradient_text(text, font, x, y, top=(255, 255, 255), bottom=(138, 138, 143)):
    bbox = d.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0] + 4, bbox[3] - bbox[1] + 4
    mask = Image.new("L", (tw, th), 0)
    ImageDraw.Draw(mask).text((-bbox[0] + 2, -bbox[1] + 2), text, font=font, fill=255)
    grad = Image.new("RGB", (tw, th))
    px = grad.load()
    for yy in range(th):
        t = yy / max(th - 1, 1)
        c = tuple(round(top[i] + (bottom[i] - top[i]) * t) for i in range(3))
        for xx in range(tw):
            px[xx, yy] = c
    img.paste(grad, (x + bbox[0] - 2, y + bbox[1] - 2), mask)


gradient_text("Jiuheng", fraunces(196), 68, 118)
gradient_text("Asia", fraunces(196, italic=True), 68 + int(196 * 0.4), 118 + 176)

mark = Image.open(MARK).convert("RGBA")
mh = 76
mark = mark.resize((int(mark.width * mh / mark.height), mh), Image.LANCZOS)
img.paste(mark, (W - 76 - mark.width, 58), mark)
d = ImageDraw.Draw(img)

y = 468
for text, font, fill in [
    ("久桁广告会展 · Live Communication · a new dimension", cjk(21), FG),
    ("营销活动 · 企业展厅与室内 · 广告营销 · 主题特展", cjk(17), MUTED),
    ("专注车企，不止于车企。", cjk(17), MUTED),
]:
    d.text((W - 76 - font.getlength(text), y), text, font=font, fill=fill)
    y += 32

tracked(76, H - 60, "31.23° N   121.47° E   8 CITIES · APAC", inter(11), DIM, 2.6)

img.save(OUT, optimize=True)
print("wrote", OUT, os.path.getsize(OUT) // 1024, "KB")
