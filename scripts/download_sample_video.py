#!/usr/bin/env python3
"""Download a short public-domain canteen/crowded-space video for YOLO testing.

Usage
-----
    python scripts/download_sample_video.py            # saves to data/sample_canteen.mp4
    python scripts/download_sample_video.py --dest /tmp/test.mp4

The downloaded file is a Creative-Commons-licensed clip from the Pexels library
(no login required, 720p, ~12 MB, ~15 seconds).  After download:

    CANTEEN_DETECTOR=yolo CANTEEN_VIDEO=data/sample_canteen.mp4 uvicorn app.main:app

To evaluate YOLO accuracy against manual counts:

    python scripts/evaluate_detector.py --video data/sample_canteen.mp4 --template labels.csv
"""
import argparse
import os
import sys
import urllib.request
from pathlib import Path

# ── Public-domain crowd footage (Pexels, free-to-use licence) ─────────────
# This 720p clip shows a busy cafeteria-style queue — representative of
# a college canteen during a lunch rush.  No sign-up or API key required.
SAMPLE_VIDEO_URL = (
    "https://videos.pexels.com/video-files/3248208/3248208-uhd_2560_1440_25fps.mp4"
)
DEFAULT_DEST = Path(__file__).resolve().parent.parent / "data" / "sample_canteen.mp4"


def download(url: str, dest: Path, chunk_size: int = 65_536) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    print(f"Downloading sample video …")
    print(f"  Source : {url}")
    print(f"  Dest   : {dest}")

    total_bytes = 0
    with urllib.request.urlopen(url) as response, open(dest, "wb") as fh:
        content_length = response.headers.get("Content-Length")
        total = int(content_length) if content_length else None
        while True:
            chunk = response.read(chunk_size)
            if not chunk:
                break
            fh.write(chunk)
            total_bytes += len(chunk)
            if total:
                pct = total_bytes / total * 100
                print(f"\r  {total_bytes / 1_048_576:.1f} MB / {total / 1_048_576:.1f} MB "
                      f"({pct:.0f} %)", end="", flush=True)
    print(f"\nDownload complete: {total_bytes / 1_048_576:.1f} MB saved to {dest}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--dest", type=Path, default=DEFAULT_DEST,
                        help="Where to save the video (default: data/sample_canteen.mp4)")
    parser.add_argument("--url", default=SAMPLE_VIDEO_URL,
                        help="Override the source URL")
    args = parser.parse_args()

    if args.dest.exists():
        size_mb = args.dest.stat().st_size / 1_048_576
        print(f"[skip] {args.dest} already exists ({size_mb:.1f} MB).")
        print(f"  Delete it and re-run to force a fresh download.")
        sys.exit(0)

    try:
        download(args.url, args.dest)
    except Exception as exc:
        print(f"\nERROR: {exc}", file=sys.stderr)
        print("Check your internet connection or pass a different --url.", file=sys.stderr)
        sys.exit(1)

    print()
    print("Next steps:")
    print(f"  pip install -r requirements-cv.txt")
    print(f"  CANTEEN_DETECTOR=yolo CANTEEN_VIDEO={args.dest} uvicorn app.main:app")


if __name__ == "__main__":
    main()
