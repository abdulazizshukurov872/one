import json
import random

books_json_path = 'data/books.json'
data_js_path = 'js/data.js'

with open(books_json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

new_titles = [
    "JavaScript Asoslari", "C++ Dasturlash", "Jahon Tarixi", "Ingliz Tili So'zlashuv",
    "Mukammal Xotira", "Marketing Sirlari", "Koinot Mo'jizalari", "Ibn Sino Va Tibbiyot",
    "Buxoro Va Samarqand Tarixi", "Raqamli Iqtisodiyot", "Web Dizayn Sirlari",
    "Frontend Dasturlash", "Backend Arxitekturasi", "Navoiy Lirikasi", "Fizika Qonunlari",
    "Kimyo Sirlari", "Rus Tili Grammatikasi", "Tadbirkorlik Asoslari", "Liderlik Qobiliyati",
    "Psixologiya Va Inson"
]

current_id = max([b['id'] for b in data['books']])
books = data['books']
new_books = []

for title in new_titles:
    current_id += 1
    # Pick a random template book
    template = random.choice(books[:10])
    new_book = template.copy()
    new_book['id'] = current_id
    new_book['title'] = title
    new_book['isNew'] = True
    new_book['rating'] = round(random.uniform(4.0, 5.0), 1)
    new_book['reviews_count'] = random.randint(100, 5000)
    new_books.append(new_book)

data['books'].extend(new_books)

with open(books_json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# Now update data.js
with open(data_js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

# We need to replace the json string in data.js
# js_content has `window.SMART_DATA = { ... };`
# We'll just overwrite it.

new_js = f"/**\n * SmartKutubxona - Asosiy ma'lumotlar to'plami\n */\nwindow.SMART_DATA = {json.dumps(data, ensure_ascii=False, indent=2)};\n\nasync function getSmartData() {{\n  try {{\n    const res = await fetch('data/books.json');\n    if (res.ok) {{\n      const data = await res.json();\n      return data;\n    }}\n  }} catch (e) {{\n    console.info('Mahalliy SMART_DATA ma\\'lumotlaridan foydalanilmoqda');\n  }}\n  return window.SMART_DATA;\n}}\n"

with open(data_js_path, 'w', encoding='utf-8') as f:
    f.write(new_js)

print(f"Added {len(new_titles)} books. Total books: {len(data['books'])}")

