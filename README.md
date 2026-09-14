# SmartKutubxona — Zamonaviy Onlayn Kutubxona Veb Sayti

SmartKutubxona — kitobxonlar, talabalar, o'quvchilar va o'qituvchilar uchun mo'ljallangan zamonaviy, tezkor va 100% responsiv elektron kutubxona platformasi.

## 📌 Asosiy Xususiyatlar va Imkoniyatlar

1. **8 ta to'liq sahifa**:
   - `index.html` — Bosh sahifa (Hero, qidiruv, mashhur kitoblar, statistika, afzalliklar)
   - `books.html` — Kitoblar katalogi (Real-time qidiruv, kategoriyalar, tillar va A–Z / Reyting saralash)
   - `categories.html` — 6 ta asosiy yo'nalishlar (Badiiy adabiyot, IT, Tarix, Ingliz tili, Biznes, Ilm-fan)
   - `book-detail.html` — Kitob haqida to'liq ma'lumot, o'xshash kitoblar tavsiyasi va sharh qoldirish
   - `authors.html` — Mualliflar kartalari, qisqacha tarjimai hol va ularning asarlari
   - `favorites.html` — Sevimli kitoblar ro'yxati (LocalStorage bilan saqlanadi, o'chirish va tozalash)
   - `about.html` — Kutubxona tarixi, missiyasi, jamoa a'zolari va rejalari
   - `contact.html` — Bog'lanish formasi, validatsiya, xabarlarni saqlash va tez-tez so'raladigan savollar (FAQ)

2. **Dizayn va Foydalanuvchi Tajribasi (UI/UX)**:
   - Yashil (`#10b981`, `#059669`) va oq ranglar gammasiga asoslangan zamonaviy, toza va minimalist dizayn.
   - **Dark / Light Mode**: Tungi va kunduzgi rejim to'liq ishlaydi va foydalanuvchi tanlovi `localStorage` da eslab qolinadi.
   - Barcha mobil telefonlar, planshetlar va kompyuterlar uchun to'liq moslashuvchan (Responsive).
   - Toast bildirishnomalari (xabar yuborilganda, sevimlilarga qo'shilganda/o'chirilganda).
   - Scroll-to-top tugmasi.

3. **Texnologiyalar**:
   - **Frontend**: HTML5, CSS3, JavaScript (ES6+).
   - **Ikonkalar & Shriftlar**: Font Awesome 6, Google Fonts (Poppins, Inter).
   - **Ma'lumotlar**: `data/books.json` va brauzerning `LocalStorage` xotirasi.

---

## 📂 Loyiha Fayl Tuzilishi

```
SmartKutubxona/
├── index.html            # Bosh sahifa
├── books.html            # Kitoblar katalogi
├── categories.html       # Kategoriyalar sahifasi
├── book-detail.html      # Kitob tafsiloti sahifasi
├── authors.html          # Mualliflar sahifasi
├── favorites.html        # Sevimlilar sahifasi
├── about.html            # Biz haqimizda sahifasi
├── contact.html          # Bog'lanish sahifasi
├── README.md             # Loyiha hujjati
├── css/
│   └── style.css         # Asosiy dizayn va stillar
├── js/
│   ├── data.js           # Ma'lumotlar manbai va fallback
│   ├── app.js            # Umumiy skript (Dark mode, Sevimlilar hisoblagichi, Toast)
│   ├── books.js          # Qidiruv, saralash va filtrlar
│   ├── book-detail.js    # Kitob tafsilotlari va sharhlar
│   ├── favorites.js      # Sevimlilar boshqaruvi
│   ├── authors.js        # Mualliflar ro'yxati
│   └── contact.js        # Aloqa formasi va validatsiya
└── data/
    └── books.json        # 16+ kitoblar, mualliflar va toifalar bazasi
```

---

## 🚀 Loyihani Ishga Tushirish

Loyihani ishga tushirish uchun hech qanday qo'shimcha paketlar o'rnatish shart emas:
1. `SmartKutubxona/` papkasidagi `index.html` faylini istalgan brauzerda (Chrome, Firefox, Edge, Safari) ikki marta bosib oching.
2. Yoki VS Code dasturida **Live Server** kengaytmasi orqali ishga tushiring.

---

## 🐙 GitHub'ga Yuklash Bo'yicha Ko'rsatma

Loyihani o'zingizning GitHub profilingizga yuklash uchun quyidagi buyruqlarni bajaring:

```bash
cd SmartKutubxona
git init
git add .
git commit -m "feat: SmartKutubxona 8 sahifali zamonaviy onlayn kutubxona loyihasi"
git branch -M main
git remote add origin https://github.com/abdulazizshukurov872/one.git
git push -u origin main
```

