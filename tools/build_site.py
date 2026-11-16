"""Create a static deployment folder using an explicit public-file allowlist."""
from pathlib import Path
import shutil
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'dist'
if OUT.exists():
    shutil.rmtree(OUT)
OUT.mkdir()
for name in ['index.html', 'style.css', 'story.js', 'content_extra.js', 'engine.js', 'game.js', 'experience.js']:
    shutil.copy2(ROOT / name, OUT / name)
shutil.copytree(ROOT / 'assets', OUT / 'assets')
(OUT / '.nojekyll').touch()
print('Static site prepared in dist/ (story documentation and tests excluded).')
