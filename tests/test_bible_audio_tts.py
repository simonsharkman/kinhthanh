import os
import subprocess
import json
import pytest

APP_JS = os.path.join(os.path.dirname(__file__), '..', 'js', 'app.js')


def test_audio_normalization_implemented_in_app_js():
    """Verify normalizeBibleAudioText method is implemented and wired in app.js."""
    assert os.path.exists(APP_JS), f"Missing {APP_JS}"
    with open(APP_JS, 'r', encoding='utf-8') as f:
        content = f.read()

    assert "normalizeBibleAudioText(text)" in content, "normalizeBibleAudioText missing in app.js"
    assert "this.normalizeBibleAudioText(rawText)" in content, "normalizeBibleAudioText not wired in speakCurrentVerse"
    assert "this.normalizeBibleAudioText(currentItem.text)" in content, "normalizeBibleAudioText not wired in speakSurveyParagraph"


def test_audio_normalization_behavior_node():
    """Run Node.js script to test edge cases of normalizeBibleAudioText."""
    node_test_script = """
    const fs = require('fs');
    const code = fs.readFileSync('js/app.js', 'utf8');

    const startMarker = 'normalizeBibleAudioText(text) {';
    const endMarker = '  speakCurrentVerse() {';

    const idx1 = code.indexOf(startMarker);
    const idx2 = code.indexOf(endMarker);
    if (idx1 === -1 || idx2 === -1) {
        console.error('Markers not found in app.js');
        process.exit(1);
    }

    const fullMethodStr = code.slice(idx1, idx2).trim();
    const fnBody = fullMethodStr.slice(fullMethodStr.indexOf('{') + 1, fullMethodStr.lastIndexOf('}'));
    const normalizeBibleAudioText = new Function('text', fnBody);

    const testCases = [
        ['Mác 3:13', 'Mác đoạn 3 câu 13'],
        ['Mác 3:13 cái này phải đọc là Mác đoạn 3 câu 13', 'Mác đoạn 3 câu 13 cái này phải đọc là Mác đoạn 3 câu 13'],
        ['Mác 3:13-15', 'Mác đoạn 3 câu 13 đến 15'],
        ['(Mác 3:13)', '(Mác đoạn 3 câu 13)'],
        ['đoạn 3:13', 'đoạn 3 câu 13'],
        ['chương 3:13', 'chương 3 câu 13'],
        ['đoạn 3:13-15', 'đoạn 3 câu 13 đến 15'],
        ['chương 3:13-15', 'chương 3 câu 13 đến 15'],
        ['I Sa-mu-ên 13:19-22', 'Nhất Sa-mu-ên đoạn 13 câu 19 đến 22'],
        ['II Các Vua 6:1', 'Nhì Các Vua đoạn 6 câu 1'],
        ['1Cô-rinh-tô 13:4', 'Nhất Cô-rinh-tô đoạn 13 câu 4'],
        ['2Cô-rinh-tô 5:17', 'Nhì Cô-rinh-tô đoạn 5 câu 17'],
        ['1Giăng 1:9', 'Nhất Giăng đoạn 1 câu 9'],
        ['3Giăng 1:2', 'Ba Giăng đoạn 1 câu 2'],
        ['Khải Huyền 3:4', 'Khải Huyền đoạn 3 câu 4'],
        ['câu 1-5', 'câu 1 đến 5'],
        ['câu 13–15', 'câu 13 đến 15'],
        ['đoạn 1-3', 'đoạn 1 đến 3'],
        ['chương 10-12', 'chương 10 đến 12'],
        ['Mác 3:13, 14', 'Mác đoạn 3 câu 13, 14']
    ];

    let failed = 0;
    for (const [input, expected] of testCases) {
        const actual = normalizeBibleAudioText(input);
        if (actual !== expected) {
            console.error(`Mismatch for: "${input}" -> Expected: "${expected}" but got: "${actual}"`);
            failed++;
        }
    }

    if (failed > 0) {
        process.exit(1);
    }
    console.log("All Node normalization cases passed!");
    """

    res = subprocess.run(
        ['node', '-e', node_test_script],
        cwd=os.path.join(os.path.dirname(__file__), '..'),
        capture_output=True,
        encoding='utf-8'
    )
    assert res.returncode == 0, f"Node tests failed: {res.stderr}\n{res.stdout}"
