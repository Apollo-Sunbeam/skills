"""Regenerate asset_logo.html and asset_matchplan.html from the source images.

Usage: pip install pillow && python3 scripts/build_assets.py

Each output file contains a single base64 data URI; Code.gs reads the file
content verbatim and injects it as the img src.
"""
import base64
import io
import pathlib

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "src"


def write_data_uri(image: Image.Image, out_name: str) -> None:
    buf = io.BytesIO()
    image.save(buf, "PNG", optimize=True)
    uri = "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()
    (ROOT / out_name).write_text(uri)
    print(f"{out_name}: {len(uri) // 1024} KB")


def main() -> None:
    logo = Image.open(SRC / "LidlLogo.jpeg").convert("RGB")
    logo = logo.resize((128, 128), Image.LANCZOS)
    write_data_uri(logo, "asset_logo.html")

    plan = Image.open(SRC / "matchplan.png")
    plan = plan.resize((1200, round(plan.height * 1200 / plan.width)), Image.LANCZOS)
    flat = Image.new("RGB", plan.size, (255, 255, 255))
    flat.paste(plan, mask=plan.split()[3])
    write_data_uri(flat.quantize(colors=128, method=Image.MEDIANCUT), "asset_matchplan.html")


if __name__ == "__main__":
    main()
