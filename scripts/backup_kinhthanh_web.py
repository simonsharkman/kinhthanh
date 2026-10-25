#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Backup and package the Logos Bible Multiverse project to:
1. Folder: E:\KINHTHANH WEB\
2. Archive: E:\KINHTHANH WEB.zip
"""

import os
import sys
import shutil
import zipfile
import time

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

SRC_DIR = r"E:\kinhthanh"
DEST_DIR = r"E:\KINHTHANH WEB"
DEST_ZIP = r"E:\KINHTHANH WEB.zip"

EXCLUDE_DIRS = {'__pycache__', '.pytest_cache', '.git'}
EXCLUDE_EXTS = {'.pyc'}


def copy_project():
    print(f"1. Dang sao chep toan bo du an sang: {DEST_DIR}...")
    if os.path.exists(DEST_DIR):
        print("  Thu muc da ton tai, dang lam sach truoc khi sao chep...")
        shutil.rmtree(DEST_DIR)

    os.makedirs(DEST_DIR, exist_ok=True)
    copied_count = 0
    total_bytes = 0

    for root, dirs, files in os.walk(SRC_DIR):
        # Filter directories in-place
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]

        rel_path = os.path.relpath(root, SRC_DIR)
        target_root = os.path.join(DEST_DIR, rel_path) if rel_path != '.' else DEST_DIR
        os.makedirs(target_root, exist_ok=True)

        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in EXCLUDE_EXTS:
                continue

            src_file = os.path.join(root, f)
            dest_file = os.path.join(target_root, f)

            shutil.copy2(src_file, dest_file)
            copied_count += 1
            total_bytes += os.path.getsize(dest_file)

    # Them tap tin khoi chay 1-click CHAY_WEB.bat
    bat_path = os.path.join(DEST_DIR, "CHAY_WEB.bat")
    with open(bat_path, "w", encoding="utf-8") as f:
        f.write("@echo off\r\n")
        f.write("title KINHTHANH WEB - Logos MultiVerse\r\n")
        f.write("echo ========================================================\r\n")
        f.write("echo   LOGOS MULTIVERSE - HE THONG DOI CHIEU KINH THANH\r\n")
        f.write("echo   Dang mo trinh duyet tai: http://localhost:8089\r\n")
        f.write("echo ========================================================\r\n")
        f.write("start http://localhost:8089\r\n")
        f.write("python -m http.server 8089\r\n")
        f.write("pause\r\n")

    print(f"  Hoan thanh sao chep: {copied_count} tep ({total_bytes / (1024*1024):.2f} MB)")
    return copied_count, total_bytes


def create_zip_archive():
    print(f"2. Dang dong goi thanh tap tin zip rieng: {DEST_ZIP}...")
    if os.path.exists(DEST_ZIP):
        os.remove(DEST_ZIP)

    file_count = 0
    t0 = time.time()

    with zipfile.ZipFile(DEST_ZIP, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as zipf:
        for root, dirs, files in os.walk(DEST_DIR):
            for f in files:
                full_path = os.path.join(root, f)
                rel_path = os.path.relpath(full_path, DEST_DIR)
                # Archive with root folder name "KINHTHANH WEB/"
                archive_name = os.path.join("KINHTHANH WEB", rel_path)
                zipf.write(full_path, archive_name)
                file_count += 1

    zip_size = os.path.getsize(DEST_ZIP)
    dt = time.time() - t0
    print(f"  Hoan thanh dong goi: {file_count} tep -> {zip_size / (1024*1024):.2f} MB ({dt:.1f}s)")
    return zip_size


def verify_backup():
    print("3. Kiem tra tinh toan ven sau khi sao chep...")
    assert os.path.exists(DEST_DIR), f"{DEST_DIR} phai ton tai"
    assert os.path.exists(os.path.join(DEST_DIR, "index.html")), "index.html phai ton tai"
    assert os.path.exists(os.path.join(DEST_DIR, "data", "cgkpv", "JHN.json")), "CGKPV JHN.json phai ton tai"
    assert os.path.exists(DEST_ZIP), f"{DEST_ZIP} phai ton tai"

    # Verify zip can be read
    with zipfile.ZipFile(DEST_ZIP, 'r') as z:
        names = z.namelist()
        assert any("index.html" in n for n in names), "Zip phai chua index.html"
        assert any("cgkpv/JHN.json" in n for n in names), "Zip phai chua CGKPV"

    print("  Xac thuc 100% thanh cong! San sang su dung.")


if __name__ == '__main__':
    print("=== BAT DAU SAO LUU & DONG GOI KINHTHANH WEB ===")
    copy_project()
    create_zip_archive()
    verify_backup()
    print("=== HOAN TAT! ===")
