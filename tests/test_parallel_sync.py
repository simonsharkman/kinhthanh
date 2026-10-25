import os
import json
import subprocess

def test_state_set_current_verse_exists():
    with open("js/state.js", "r", encoding="utf-8") as f:
        content = f.read()
    assert "setCurrentVerse(verseNum)" in content, "AppState must have setCurrentVerse method"
    assert "selectVerse(verseNum, true)" in content

def test_drawer_sync_with_current_passage_data():
    with open("js/app.js", "r", encoding="utf-8") as f:
        content = f.read()
    assert "currentBookId = this.currentPassageData.book_id || state.currentBook" in content
    assert "currentChapterNum = this.currentPassageData.chapter_num || state.currentChapter" in content
    assert "bibleEngine.getParallelVerses(currentBookId, currentChapterNum" in content

def test_navigate_to_passage_calls_select_verse():
    with open("js/app.js", "r", encoding="utf-8") as f:
        content = f.read()
    assert "state.selectVerse(verseNum, true)" in content
    assert "this.renderDrawerContent()" in content

def test_passage_changed_synchronizes_drawer():
    with open("js/app.js", "r", encoding="utf-8") as f:
        content = f.read()
    assert "if (state.isDrawerOpen) {" in content
    assert "this.renderDrawerContent();" in content

def test_bible_data_rom9_and_rev22_integrity():
    with open("data/bibles/ROM.json", "r", encoding="utf-8") as f:
        rom = json.load(f)
    assert "9" in rom["chapters"], "Romans chapter 9 must exist"
    v10 = next((v for v in rom["chapters"]["9"] if v["verse_num"] == 10), None)
    assert v10 is not None, "Romans 9:10 must exist"
    assert "Rê-be-ca" in v10["text_primary"]
    assert "CGKPV" in v10["translations"]

    with open("data/bibles/REV.json", "r", encoding="utf-8") as f:
        rev = json.load(f)
    assert "22" in rev["chapters"], "Revelation chapter 22 must exist"
    rev_v10 = next((v for v in rev["chapters"]["22"] if v["verse_num"] == 10), None)
    assert rev_v10 is not None, "Revelation 22:10 must exist"
    assert "Chớ niêm phong" in rev_v10["text_primary"]

def test_node_parallel_comparison_execution():
    result = subprocess.run([
        "node", "-e", """
        import fs from 'fs';
        import path from 'path';

        global.fetch = async (url) => {
          const filePath = path.resolve('.', url);
          if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf-8');
            return {
              ok: true,
              json: async () => JSON.parse(data),
              text: async () => data
            };
          }
          return { ok: false, status: 404 };
        };

        Promise.all([import('./js/state.js'), import('./js/bible-engine.js')]).then(async ([stateMod, engineMod]) => {
          const { state } = stateMod;
          const { bibleEngine } = engineMod;

          state.setCurrentVerse(10);
          if (state.currentVerse !== 10 || !state.isDrawerOpen) process.exit(1);

          await bibleEngine.init();
          await bibleEngine.loadPassage('ROM', 9);
          const romParallel = bibleEngine.getParallelVerses('ROM', 9, 10, ['BDY', 'CGKPV', 'BD2011']);
          if (romParallel.length !== 3) process.exit(2);

          await bibleEngine.loadPassage('REV', 22);
          const revParallel = bibleEngine.getParallelVerses('REV', 22, 10, ['BDY', 'CGKPV', 'BD2011']);
          if (revParallel.length !== 3) process.exit(3);

          process.exit(0);
        }).catch(() => process.exit(4));
        """
    ], capture_output=True, text=True)
    assert result.returncode == 0, f"Node verification failed: {result.stderr}"
