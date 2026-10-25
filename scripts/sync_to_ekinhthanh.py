import shutil
import os
import sys

src = r"C:\Users\Admin\.gemini\antigravity-ide\scratch\logos-bible-multiverse"
dst = r"E:\kinhthanh"

files = [
    "index.html",
    "css/design-tokens.css",
    "css/layout.css",
    "css/components.css",
    "js/ai-assistant.js",
    "js/app.js",
]

for f in files:
    s_path = os.path.join(src, f)
    d_path = os.path.join(dst, f)
    os.makedirs(os.path.dirname(d_path), exist_ok=True)
    shutil.copy2(s_path, d_path)
    print(f"Copied {f}")

# Sync data/bibles enriched json
bibles_src = os.path.join(src, "data", "bibles")
bibles_dst = os.path.join(dst, "data", "bibles")
os.makedirs(bibles_dst, exist_ok=True)
for fname in ["JOS.json", "ISA.json", "GEN.json", "JHN.json", "PSA.json", "JON.json"]:
    s_path = os.path.join(bibles_src, fname)
    d_path = os.path.join(bibles_dst, fname)
    if os.path.exists(s_path):
        shutil.copy2(s_path, d_path)
        print(f"Copied data/bibles/{fname}")

# Sync data/httlvn
httlvn_src = os.path.join(src, "data", "httlvn")
httlvn_dst = os.path.join(dst, "data", "httlvn")
if os.path.exists(httlvn_src):
    os.makedirs(httlvn_dst, exist_ok=True)
    for fname in os.listdir(httlvn_src):
        shutil.copy2(os.path.join(httlvn_src, fname), os.path.join(httlvn_dst, fname))
    print("Copied data/httlvn")

# Sync tests
tests_src = os.path.join(src, "tests")
tests_dst = os.path.join(dst, "tests")
os.makedirs(tests_dst, exist_ok=True)
for fname in os.listdir(tests_src):
    if fname.endswith(".py"):
        shutil.copy2(os.path.join(tests_src, fname), os.path.join(tests_dst, fname))
print("Copied tests")

print("All files synchronized 100% to E:\\kinhthanh successfully!")
