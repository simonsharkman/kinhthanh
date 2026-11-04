#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
prune_memory.py - Check and enforce the memory.md character budget (<= 24,000 chars).
"""
import sys
from pathlib import Path

MEMORY_PATH = Path(__file__).resolve().parent.parent / "memory.md"
MAX_CHARS = 24000

def check_memory():
    if not MEMORY_PATH.exists():
        print(f"[ERROR] {MEMORY_PATH} does not exist.")
        return 1

    content = MEMORY_PATH.read_text(encoding="utf-8")
    length = len(content)
    print(f"[*] Memory file: {MEMORY_PATH}")
    print(f"[*] Current character count: {length} / {MAX_CHARS}")

    if length <= MAX_CHARS:
        print("[SUCCESS] memory.md is within budget!")
        return 0
    else:
        print(f"[WARNING] memory.md exceeds budget by {length - MAX_CHARS} characters. Compression needed!")
        return 1

if __name__ == "__main__":
    sys.exit(check_memory())
