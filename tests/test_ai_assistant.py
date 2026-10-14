import os

def test_ai_assistant_file_exists():
    assert os.path.exists("js/ai-assistant.js"), "js/ai-assistant.js is missing"

def test_ai_assistant_contract():
    with open("js/ai-assistant.js", "r", encoding="utf-8") as f:
        content = f.read()

    assert "class AIAssistant" in content or "export const AIAssistant" in content
    assert "setApiKey" in content
    assert "getApiKey" in content
    assert "getSuggestedPrompts" in content
    assert "queryOfflineTheology" in content
    assert "ask" in content
    assert "chatgpt" in content.lower() or "openai" in content.lower()

def test_ai_chat_css_styles():
    with open("css/components.css", "r", encoding="utf-8") as f:
        content = f.read()

    assert ".ai-chat-container" in content
    assert ".ai-message" in content
    assert ".suggested-prompt-chip" in content
