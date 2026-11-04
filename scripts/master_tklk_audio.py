#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Master raw synthesized audio using OmniVoice ALDEN Studio DSP Chain.
Applies:
- Highpass 70Hz (rumble removal)
- 150Hz +4.2dB (chest warmth)
- 450Hz -3.0dB (boxiness cut)
- 3.2kHz +2.4dB (presence & intimacy)
- 8kHz +1.0dB (air sparkle)
- Compand broadcasting compression
- Subtle studio room acoustic (aecho)
- Loudnorm -16 LUFS (broadcasting standard)
"""

import sys
import subprocess
from pathlib import Path

DSP_FILTER = (
    "highpass=f=70,"
    "equalizer=f=150:width_type=o:w=1.2:g=4.2,"
    "equalizer=f=450:width_type=o:w=1.0:g=-3.0,"
    "equalizer=f=3200:width_type=o:w=1.5:g=2.4,"
    "equalizer=f=8000:width_type=o:w=1.0:g=1.0,"
    "compand=attacks=0.02:decays=0.22:points=-80/-80|-35/-22|-18/-12|0/-7:gain=2.2,"
    "aecho=0.8:0.35:20:0.08,"
    "loudnorm=I=-16:TP=-1.5:LRA=10"
)

def master_file(input_path: Path, output_path: Path):
    if not input_path.exists():
        print(f"[ERROR] Input not found: {input_path}")
        return False

    output_path.parent.mkdir(parents=True, exist_ok=True)
    temp_out = output_path.with_suffix(".tmp.mp3")

    cmd = [
        "ffmpeg", "-y",
        "-i", str(input_path),
        "-af", DSP_FILTER,
        "-b:a", "128k",
        str(temp_out)
    ]

    print(f"[*] Mastering {input_path.name} with ALDEN Studio DSP Chain...")
    res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if res.returncode == 0 and temp_out.exists() and temp_out.stat().st_size > 1000:
        temp_out.replace(output_path)
        size_kb = output_path.stat().st_size / 1024
        print(f"[SUCCESS] Mastered: {output_path.name} ({size_kb:.1f} KB)")
        return True
    else:
        print(f"[FAIL] FFmpeg failed with code {res.returncode}")
        if temp_out.exists():
            temp_out.unlink()
        return False

if __name__ == "__main__":
    if len(sys.argv) > 2:
        master_file(Path(sys.argv[1]), Path(sys.argv[2]))
    else:
        # Default chapter 39
        src = Path(r"E:\kinhthanh\scratch\ch39_full.mp3")
        dst = Path(r"E:\kinhthanh\data\tklk\audio\39.mp3")
        master_file(src, dst)
