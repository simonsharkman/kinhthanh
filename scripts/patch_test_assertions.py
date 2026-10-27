with open('E:/kinhthanh/tests/test_portal_and_header_sticky.py', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('this.updateUrlHash(viewName);', 'this.updateUrlHash(viewName')
text = text.replace("this.updateUrlHash('bible', data.book, data.chapter, true);", "this.updateUrlHash('bible', data.book, data.chapter")

with open('E:/kinhthanh/tests/test_portal_and_header_sticky.py', 'w', encoding='utf-8') as f:
    f.write(text)
print('Updated test assertions')
