"""Generate hero image for homepage."""
from google import genai
from google.genai import types
from dotenv import load_dotenv
from PIL import Image as PILImage
from pathlib import Path
import tempfile, os

load_dotenv(".env.local")
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

prompt = """Create a stunning cinematic hero banner image for a Korea travel website.

SCENE: A breathtaking panoramic view of Seoul at twilight/blue hour. Namsan Tower (N Seoul Tower) glows in the center-right, the Han River reflects the city lights in the foreground, and modern skyscrapers blend with traditional Korean architecture silhouettes. Cherry blossom branches frame the top edges softly.

COMPOSITION:
- Ultra-wide 16:9 cinematic aspect ratio
- The scene should have a natural blue-hour color palette (deep blues, soft cyans, warm amber city lights)
- The LEFT SIDE and CENTER should be slightly darker/less busy to allow text overlay
- The RIGHT SIDE can be more detailed with the city skyline
- Soft depth of field on foreground elements

VISUAL STYLE:
- Professional editorial photography quality
- Cinematic color grading with rich blues and warm accent lights
- Dreamy, aspirational mood that says premium travel & lifestyle
- NO text, NO watermarks, NO logos, NO overlays - just the pure photograph
- The image should feel premium, modern, and inviting

COLOR PALETTE: Deep navy blue, soft cyan, warm amber/gold city lights, hints of pink from sunset remnants

This should look like a hero banner from a premium travel magazine or luxury travel website."""

print("Generating hero image...")
response = client.models.generate_content(
    model="gemini-3-pro-image-preview",
    contents=[prompt],
    config=types.GenerateContentConfig(
        response_modalities=["IMAGE", "TEXT"],
        temperature=0.8,
    ),
)

out_dir = Path("public/images")
out_dir.mkdir(parents=True, exist_ok=True)
output_path = out_dir / "hero-seoul.webp"

for part in response.parts:
    if part.inline_data is not None:
        image = part.as_image()
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
            tmp_path = tmp.name
        image.save(tmp_path)
        pil_img = PILImage.open(tmp_path)
        pil_img.save(str(output_path), format="WEBP", quality=85)
        Path(tmp_path).unlink(missing_ok=True)
        sz = output_path.stat().st_size // 1024
        print(f"OK: {output_path} ({pil_img.size[0]}x{pil_img.size[1]}, {sz}KB)")
        break
else:
    print("ERROR: No image generated")
