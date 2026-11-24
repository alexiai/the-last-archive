"""Publish the current game beside production built from the unchanged main snapshot.

Historical production is read from Git, never from obsolete working-tree copies.
The development source and both preview aliases contain only the current edition.
"""
import argparse
import hashlib
import io
import json
from pathlib import Path
import shutil
import subprocess
import tarfile
import tempfile


ROOT = Path(__file__).resolve().parents[2]


def git(*args):
    return subprocess.check_output(["git", *args], cwd=ROOT, text=True).strip()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True)
    parser.add_argument("--main-ref", default="origin/main")
    args = parser.parse_args()
    output = Path(args.output).resolve()
    if output == ROOT or ROOT in output.parents:
        raise SystemExit("Preview output must be outside the source repository.")
    if output.exists():
        raise SystemExit("Preview output must be a new directory.")

    subprocess.run(
        ["node", str(ROOT / "tools/sceneplay/test_repository.mjs")],
        cwd=ROOT,
        check=True,
    )
    stable_commit = git("rev-parse", "--verify", args.main_ref + "^{commit}")
    with tempfile.TemporaryDirectory(prefix="archive-preview-") as temp:
        temp = Path(temp)
        stable = temp / "stable"
        stable.mkdir()
        archive_bytes = subprocess.check_output(
            ["git", "archive", stable_commit], cwd=ROOT
        )
        with tarfile.open(fileobj=io.BytesIO(archive_bytes)) as archive:
            archive.extractall(stable, filter="data")

        # Production remains the approved main edition until a separate merge.
        # Its own builder and assets exist only inside this temporary snapshot.
        stable_builder = stable / "tools/build_site.py"
        if not stable_builder.is_file():
            raise SystemExit("Stable main changed; review its build before publishing.")
        subprocess.run(["python3", str(stable_builder)], cwd=stable, check=True)
        stable_output = stable / "dist"
        shutil.copytree(stable_output, output)

        current = temp / "current"
        subprocess.run(
            ["python3", str(ROOT / "tools/sceneplay/build.py"), "--output", str(current)],
            cwd=ROOT,
            check=True,
        )
        preview_paths = ["preview/", "editions/sceneplay-preview/"]
        for name in preview_paths:
            shutil.copytree(current, output / name)

        # Old installed root workers must not substitute their index for preview.
        worker = output / "sw.js"
        original_worker = worker.read_text()
        exclusion = "request.url.startsWith(new URL('editions/',self.registration.scope).href)"
        if exclusion not in original_worker:
            raise SystemExit("Stable worker changed; review preview isolation before deployment.")
        worker.write_text(
            original_worker.replace(
                exclusion,
                exclusion + "||request.url.startsWith(new URL('preview/',self.registration.scope).href)",
            )
        )
        manifest_path = output / "asset-manifest.json"
        manifest = json.loads(manifest_path.read_text())
        for row in manifest["files"]:
            asset = output / row["url"]
            if row["url"] == "sw.js":
                row["bytes"] = asset.stat().st_size
                row["sha256"] = hashlib.sha256(asset.read_bytes()).hexdigest()
            elif asset.read_bytes() != (stable_output / row["url"]).read_bytes():
                raise SystemExit("Stable production asset changed: " + row["url"])
        manifest["version"] = hashlib.sha256(
            json.dumps(manifest["files"], sort_keys=True).encode()
        ).hexdigest()[:20]
        manifest["totalBytes"] = sum(row["bytes"] for row in manifest["files"])
        manifest_path.write_text(json.dumps(manifest, indent=2))

        provenance = {
            "stableCommit": stable_commit,
            "previewCommit": git("rev-parse", "HEAD"),
            "stableIndexSha256": hashlib.sha256(
                (stable_output / "index.html").read_bytes()
            ).hexdigest(),
            "rootChanges": [
                "sw.js: exclude preview/",
                "asset-manifest.json: worker integrity metadata",
            ],
            "previewEdition": "sceneplay-1",
            "previewPaths": preview_paths,
            "currentOnlySource": True,
            "saveKeys": ["lastarchive.sceneplay.v1"],
        }
        (output / "preview-provenance.json").write_text(json.dumps(provenance, indent=2))

    print("Stable production preserved from Git, except preview worker exclusion and integrity metadata.")
    print("Current-edition preview aliases built:", output)


if __name__ == "__main__":
    main()
