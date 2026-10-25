import os
import re

def test_kimchi_multi_model_constants_and_contracts():
    with open("js/ai-assistant.js", "r", encoding="utf-8") as f:
        content = f.read()

    # Providers
    assert "export const AI_PROVIDERS" in content
    assert "berea-offline" in content
    assert "gemini" in content
    assert "openai" in content
    assert "deepseek" in content
    assert "ollama" in content

    # Roles
    assert "export const AI_ROLES" in content
    assert "copilot" in content
    assert "exegete" in content
    assert "linguist" in content
    assert "historian" in content

    # Methods
    assert "getProvider" in content
    assert "setProvider" in content
    assert "getRole" in content
    assert "setRole" in content
    assert "getModel" in content
    assert "setModel" in content
    assert "queryGemini" in content
    assert "queryOpenAI" in content
    assert "queryDeepSeek" in content
    assert "queryOllama" in content
    assert "convertMarkdownToHTML" in content
    assert "getActiveProviderInfo" in content

def test_theological_faith_invariants_preserved():
    with open("js/ai-assistant.js", "r", encoding="utf-8") as f:
        content = f.read()

    assert "Trước giả" in content
    assert "Tác Giả Tối Thượng" in content
    assert "Kinh Thánh tự giải nghĩa Kinh Thánh" in content

def test_joshua_24_and_66_books_masterclass_engine():
    with open("js/ai-assistant.js", "r", encoding="utf-8") as f:
        content = f.read()

    # Joshua 24 exegesis
    assert "Si-chem" in content
    assert "Hazak ve-amats" in content
    assert "Yehoshua" in content
    assert "Hê-bơ-rơ 4:8" in content

    # 66 books directory
    assert "initBooksDirectory" in content
    assert "findPassageMention" in content
    assert "getSpecificChapterStructure" in content

def test_copilot_compound_action_command_support():
    with open("js/ai-assistant.js", "r", encoding="utf-8") as f:
        content = f.read()

    assert "parseAndExecuteCopilotCommand" in content
    assert "copilot-action-btn" in content
    assert "copilot-executed-badge" in content

def test_html_kimchi_ui_components():
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()

    # Verify distracting floating widget & modal triggers are removed
    assert "id=\"floating-ai-settings-btn\"" not in html
    assert "id=\"floating-ai-model-badge\"" not in html
    assert "id=\"floating-ai-role-bar\"" not in html
    assert "id=\"ai-settings-modal\"" not in html
    assert "id=\"header-ai-trigger-btn\"" not in html
    assert "id=\"top-nav-ai-btn\"" not in html

def test_css_kimchi_ui_styling():
    with open("css/components.css", "r", encoding="utf-8") as f:
        css = f.read()

    assert ".floating-ai-model-badge" in css
    assert ".floating-ai-role-bar" in css
    assert ".fab-role-btn" in css
    assert ".fab-role-btn.active" in css
    assert ".header-ai-pill" in css
    assert ".nav-btn.ai-nav-btn" in css

def test_app_js_kimchi_wiring():
    with open("js/app.js", "r", encoding="utf-8") as f:
        app_js = f.read()

    assert "initAISettingsModal" in app_js
    assert "openAISettingsModal" in app_js
    assert "openFloatingAI" in app_js
    assert "toggleFloatingAI" in app_js
    assert "header-ai-trigger-btn" in app_js
    assert "top-nav-ai-btn" in app_js
    assert "updateFloatingAIModelBadge" in app_js
    assert "updateFloatingAIRolePills" in app_js
    assert "passageData: this.currentPassageData" in app_js
    assert "activeVersions: state.activeVersions" in app_js
    assert "crossReferences: crossRefs" in app_js
    assert "genreGuide: genreGuide" in app_js
    assert "floating-deep-research-btn" in app_js
    assert "floating-clear-history-btn" in app_js

def test_kimchi_deep_context_package_and_telemetry():
    with open("js/ai-assistant.js", "r", encoding="utf-8") as f:
        ai_js = f.read()

    assert "buildKimchiContextPackage" in ai_js
    assert "formatKimchiTelemetryBar" in ai_js
    assert "wrapWithTelemetry" in ai_js
    assert "kimchi-telemetry-bar" in ai_js
    assert "kimchi-chip" in ai_js
    assert "model-chip" in ai_js
    assert "token-chip" in ai_js
    assert "speed-chip" in ai_js
    assert "deep-mode" in ai_js

def test_kimchi_deep_research_and_memory_stream():
    with open("js/ai-assistant.js", "r", encoding="utf-8") as f:
        ai_js = f.read()

    assert "setDeepResearchEnabled" in ai_js
    assert "getDeepResearchEnabled" in ai_js
    assert "recordConversationTurn" in ai_js
    assert "clearConversationHistory" in ai_js
    assert "getConversationHistory" in ai_js
    assert "ai-deep-research-toggle-btn" in ai_js
    assert "ai-clear-history-btn" in ai_js

    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()

    assert "id=\"floating-deep-research-btn\"" not in html
    assert "id=\"floating-clear-history-btn\"" not in html

def test_kimchi_css_telemetry_styling():
    with open("css/components.css", "r", encoding="utf-8") as f:
        css = f.read()

    assert ".kimchi-telemetry-bar" in css
    assert ".kimchi-chip" in css
    assert ".kimchi-chip.model-chip" in css
    assert ".kimchi-chip.token-chip" in css
    assert ".kimchi-chip.deep-mode" in css
    assert ".fab-ctrl-btn.deep-research-btn.active" in css

