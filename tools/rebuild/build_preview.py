"""Compatibility entrypoint used by the already-approved main-ref Pages workflow."""
from pathlib import Path
import runpy

runpy.run_path(
    str(Path(__file__).resolve().parents[1] / "sceneplay/publish_preview.py"),
    run_name="__main__",
)
