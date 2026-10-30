# -*- coding: utf-8 -*-
"""
Test Suite: Bible Quiz & VTKTH Theological Examination Engine (Milestone 62)
Verifies:
1. Integrity of data/quiz-database.json (all 7 datasets, question counts > 600, schema keys).
2. UI integration in index.html (subnav button, quiz view container, mobile drawer, portal links).
3. Engine architecture in js/quiz-engine.js (QuizEngine class, 5 interactive modes, scripture parser).
4. Application routing in js/app.js (import, URL hash detection, switchView integration, renderQuizView).
5. Comprehensive CSS styles in css/components.css (hero, subtabs, flashcards, exam sets, theology cards, events).
"""

import json
import os
import pytest

ROOT_DIR = r"E:\kinhthanh"
QUIZ_JSON_PATH = os.path.join(ROOT_DIR, "data", "quiz-database.json")
INDEX_HTML_PATH = os.path.join(ROOT_DIR, "index.html")
APP_JS_PATH = os.path.join(ROOT_DIR, "js", "app.js")
QUIZ_ENGINE_PATH = os.path.join(ROOT_DIR, "js", "quiz-engine.js")
COMPONENTS_CSS_PATH = os.path.join(ROOT_DIR, "css", "components.css")


def test_quiz_database_integrity():
    """Validates existence and data completeness of quiz-database.json"""
    assert os.path.exists(QUIZ_JSON_PATH), f"Missing {QUIZ_JSON_PATH}"
    with open(QUIZ_JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Required datasets
    assert "newSetsData" in data, "Missing newSetsData"
    assert "theologyData" in data, "Missing theologyData"
    assert "flashcardsData" in data, "Missing flashcardsData"
    assert "quizData" in data, "Missing quizData"
    assert "eventsData" in data, "Missing eventsData"
    assert "grandBankData" in data, "Missing grandBankData"
    assert "diamondVersesData" in data, "Missing diamondVersesData"

    # Dataset quantity assertions
    assert len(data["newSetsData"]) == 200, f"Expected 200 exam set questions, got {len(data['newSetsData'])}"
    assert len(data["theologyData"]) == 200, f"Expected 200 theology questions, got {len(data['theologyData'])}"
    assert len(data["flashcardsData"]) >= 30, f"Expected >= 30 flashcards, got {len(data['flashcardsData'])}"
    assert len(data["quizData"]) >= 15, f"Expected >= 15 quiz items, got {len(data['quizData'])}"
    assert len(data["eventsData"]) >= 25, f"Expected >= 25 events, got {len(data['eventsData'])}"
    assert len(data["grandBankData"]) >= 100, f"Expected >= 100 grand bank items, got {len(data['grandBankData'])}"
    assert len(data["diamondVersesData"]) >= 50, f"Expected >= 50 diamond verses, got {len(data['diamondVersesData'])}"

    total_items = (
        len(data["newSetsData"])
        + len(data["theologyData"])
        + len(data["flashcardsData"])
        + len(data["quizData"])
        + len(data["eventsData"])
        + len(data["grandBankData"])
        + len(data["diamondVersesData"])
    )
    assert total_items >= 630, f"Expected total items >= 630, got {total_items}"

    # Sample schema inspection for newSetsData
    sample_exam = data["newSetsData"][0]
    assert "set_id" in sample_exam
    assert "set_title" in sample_exam
    assert "q_num" in sample_exam
    assert "q" in sample_exam
    assert "a" in sample_exam
    assert "exp" in sample_exam

    # Sample schema inspection for theologyData
    sample_theo = data["theologyData"][0]
    assert "id" in sample_theo
    assert "section" in sample_theo
    assert "q" in sample_theo
    assert "a" in sample_theo

    # Sample schema inspection for flashcardsData
    sample_fc = data["flashcardsData"][0]
    assert "cat" in sample_fc
    assert "verse" in sample_fc
    assert "ref" in sample_fc

    # Sample schema inspection for quizData
    sample_quiz = data["quizData"][0]
    assert "q" in sample_quiz
    assert "options" in sample_quiz
    assert "correct" in sample_quiz


def test_index_html_quiz_integration():
    """Validates markup in index.html for navigation, view panel, and mobile drawer"""
    assert os.path.exists(INDEX_HTML_PATH)
    with open(INDEX_HTML_PATH, "r", encoding="utf-8") as f:
        html = f.read()

    # Subnav button with data-view="quiz"
    assert 'data-view="quiz"' in html, "Missing data-view='quiz' in subnav"
    assert 'nav-btn-quiz' in html
    assert 'Đố Kinh Thánh' in html

    # Main view container
    assert 'id="quiz-view"' in html, "Missing #quiz-view panel in index.html"
    assert 'id="quiz-container"' in html, "Missing #quiz-container in index.html"

    # Mobile drawer button & portal link
    assert 'data-nav="quiz"' in html, "Missing data-nav='quiz' in mobile drawer"
    assert 'id="portal-item-quiz"' in html, "Missing #portal-item-quiz link in portal"


def test_quiz_engine_module_structure():
    """Validates QuizEngine class architecture and methods in js/quiz-engine.js"""
    assert os.path.exists(QUIZ_ENGINE_PATH)
    with open(QUIZ_ENGINE_PATH, "r", encoding="utf-8") as f:
        js = f.read()

    # Class and singleton export
    assert "class QuizEngine" in js
    assert "export const quizEngine = new QuizEngine();" in js

    # Subtab renderers
    assert "renderQuizTab" in js
    assert "renderFlashcardsTab" in js
    assert "renderSetsTab" in js
    assert "renderTheologyTab" in js
    assert "renderEventsTab" in js
    assert "renderActiveTabHTML" in js

    # Interactive handlers & navigation helper
    assert "bindEvents" in js
    assert "bindTabEvents" in js
    assert "parseScriptureRef" in js


def test_app_js_quiz_routing():
    """Validates js/app.js import, URL hash detection, and view switching"""
    assert os.path.exists(APP_JS_PATH)
    with open(APP_JS_PATH, "r", encoding="utf-8") as f:
        js = f.read()

    # Import
    assert "quizEngine" in js, "quizEngine not imported in app.js"

    # URL hash parsing
    assert "'quiz'" in js or '"quiz"' in js
    assert "view = 'quiz';" in js or "viewName === 'quiz'" in js

    # switchView implementation
    assert "renderQuizView" in js, "renderQuizView method missing in app.js"
    assert "quizEngine.render(container)" in js


def test_components_css_quiz_styles():
    """Validates CSS rules for quiz hero, flashcards, exam sets, and theology cards"""
    assert os.path.exists(COMPONENTS_CSS_PATH)
    with open(COMPONENTS_CSS_PATH, "r", encoding="utf-8") as f:
        css = f.read()

    # Hero & Subtabs
    assert ".quiz-container" in css
    assert ".quiz-hero-header" in css
    assert ".quiz-hero-badge" in css
    assert ".quiz-nav-subtabs" in css
    assert ".quiz-subtab-btn" in css

    # Mode 1: Multiple choice quiz
    assert ".quiz-play-box" in css
    assert ".quiz-option-btn" in css
    assert ".quiz-counter-tag" in css

    # Mode 2: Flashcards
    assert ".flashcard-card" in css
    assert ".flashcard-front" in css
    assert ".flashcard-back" in css
    assert "perspective" in css or "transform-style" in css

    # Mode 3: 10 Exam Sets
    assert ".exam-sets-picker-scroll" in css
    assert ".exam-set-pill" in css
    assert ".exam-question-card" in css

    # Mode 4: Theology Question Bank
    assert ".theology-search-box" in css
    assert ".theology-cards-grid" in css
    assert ".theology-item-card" in css

    # Mode 5: Biblical Events locator
    assert ".events-table-card" in css
    assert ".events-table" in css
    assert ".event-goto-btn" in css
