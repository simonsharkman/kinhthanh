with open('E:/kinhthanh/js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    "const testBook = this.resolveBookId(prefix);",
    "const testBook = (this && typeof this.resolveBookId === 'function') ? this.resolveBookId(prefix) : null;"
)

text = text.replace(
    "const resolvedBook = bookPart ? this.resolveBookId(bookPart) : null;",
    "const resolvedBook = bookPart ? ((this && typeof this.resolveBookId === 'function') ? this.resolveBookId(bookPart) : String(bookPart).toUpperCase()) : null;"
)

with open('E:/kinhthanh/js/app.js', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated parseHash with safe this fallback')
