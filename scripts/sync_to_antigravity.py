import os
import shutil
import sys

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def sync_folders():
    src = r"E:\kinhthanh"
    dst = r"C:\Users\Admin\.gemini\antigravity-ide\scratch\logos-bible-multiverse"
    
    print("==================================================")
    print("Syncing E:\\kinhthanh -> Antigravity Scratch")
    print(f"Source: {src}")
    print(f"Destination: {dst}")
    print("==================================================")
    
    os.makedirs(dst, exist_ok=True)
    
    # Core directories to sync
    dirs_to_sync = ['css', 'js', 'data', 'scripts', 'tests', 'docs']
    
    # Root files to sync
    root_files = ['index.html', 'README.md', 'GEMINI.md', 'memory.md']
    
    # 1. Sync root files
    for rf in root_files:
        s_file = os.path.join(src, rf)
        d_file = os.path.join(dst, rf)
        if os.path.exists(s_file):
            shutil.copy2(s_file, d_file)
            print(f"  [ROOT] Copied: {rf}")
            
    # 2. Sync directories
    copied_count = 0
    for d in dirs_to_sync:
        s_dir = os.path.join(src, d)
        d_dir = os.path.join(dst, d)
        if not os.path.exists(s_dir):
            continue
        os.makedirs(d_dir, exist_ok=True)
        for root, dirs, files in os.walk(s_dir):
            rel_dir = os.path.relpath(root, s_dir)
            target_sub_dir = os.path.join(d_dir, rel_dir) if rel_dir != '.' else d_dir
            os.makedirs(target_sub_dir, exist_ok=True)
            for f in files:
                if f.endswith('.pyc') or '__pycache__' in root:
                    continue
                s_path = os.path.join(root, f)
                d_path = os.path.join(target_sub_dir, f)
                shutil.copy2(s_path, d_path)
                copied_count += 1
        print(f"  [DIR] Synced: {d}/")
        
    # 3. Sync .agents folder if exists
    s_agents = os.path.join(src, '.agents')
    d_agents = os.path.join(dst, '.agents')
    if os.path.exists(s_agents):
        os.makedirs(d_agents, exist_ok=True)
        for root, dirs, files in os.walk(s_agents):
            rel_dir = os.path.relpath(root, s_agents)
            target_sub_dir = os.path.join(d_agents, rel_dir) if rel_dir != '.' else d_agents
            os.makedirs(target_sub_dir, exist_ok=True)
            for f in files:
                s_path = os.path.join(root, f)
                d_path = os.path.join(target_sub_dir, f)
                shutil.copy2(s_path, d_path)
        print("  [AGENTS] Synced: .agents/")

    print("==================================================")
    print(f"SUCCESS: Sync completed successfully! Total files synced: {copied_count}")
    print("==================================================")

if __name__ == '__main__':
    sync_folders()
