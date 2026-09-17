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
2. **📖 Onlayn Mutolaa Zali (E-Reader)**:
   - Har bir kitob uchun maxsus qulay elektron kitobxonlik oynasi.
   - Shrift o'lchamini o'zgartirish (`A-` / `A+`).
   - 3 xil fon rejimi: ☀️ Kunduzgi (Oq), 📜 Sepiya (Qog'oz), 🌙 Tungi (Dark).
   - Real kitob boblari matnlari.

3. **🎧 Ovozli Audio Kitob Pleyeri (Audio Player)**:
   - Brauzerning Web Speech API orqali kitoblarni ovoz chiqarib o'qish imkoniyati.
   - Play, Pause, 10s orqaga/oldinga o'tkazish, interaktiv vaqt chizig'i.
   - Tezlikni boshqarish (`0.75x`, `1.0x`, `1.25x`, `1.5x`).
   - Jonli audio to'lqinlari (Equalizer wave animation).

4. **Dizayn va Foydalanuvchi Tajribasi (UI/UX)**:
   - Yashil (`#10b981`, `#059669`) va oq ranglar gammasiga asoslangan zamonaviy, toza va minimalist dizayn.
   - **Dark / Light Mode**: Tungi va kunduzgi rejim to'liq ishlaydi va foydalanuvchi tanlovi `localStorage` da eslab qolinadi.
   - Barcha mobil telefonlar, planshetlar va kompyuterlar uchun to'liq moslashuvchan (Responsive).
   - Toast bildirishnomalari (xabar yuborilganda, sevimlilarga qo'shilganda/o'chirilganda).
   - Scroll-to-top tugmasi.
   - Scroll-to-top tugmasi va rasm yuklanmaganda SVG vektorli muqovalar generatori.

3. **Texnologiyalar**:
5. **Texnologiyalar**:
   - **Frontend**: HTML5, CSS3, JavaScript (ES6+).
   - **Ikonkalar & Shriftlar**: Font Awesome 6, Google Fonts (Poppins, Inter).
   - **Ma'lumotlar**: `data/books.json` va brauzerning `LocalStorage` xotirasi.
   - **Windows Serveri**: Python talab qilmaydigan Windows o'rnatilgan `server.ps1` HTTP serveri.

---

## 📂 Loyiha Fayl Tuzilishi

```
SmartKutubxona/
├── Ishga_Tushirish.bat   # ⚡ Bitta bosishda ishga tushirish (Pythonsiz ham ishlaydi)
├── server.ps1            # 🚀 Windows o'rnatilgan HTTP serveri (Python kerak emas)
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
│   └── style.css         # Asosiy dizayn, E-reader va Audio pleyer stillari
├── js/
│   ├── data.js           # Ma'lumotlar manbai va fallback
│   ├── app.js            # Umumiy skript (Dark mode, Sevimlilar hisoblagichi, Toast)
│   ├── data.js           # Ma'lumotlar manbai va ishonchli offline fallback
│   ├── app.js            # E-Reader, Audio pleyer, Dark mode, Toast, SVG generator
│   ├── books.js          # Qidiruv, saralash va filtrlar
│   ├── book-detail.js    # Kitob tafsilotlari va sharhlar
│   ├── favorites.js      # Sevimlilar boshqaruvi
│   ├── authors.js        # Mualliflar ro'yxati
│   └── contact.js        # Aloqa formasi va validatsiya
└── data/
    └── books.json        # 16+ kitoblar, mualliflar va toifalar bazasi
    └── books.json        # 26 ta kitob, mualliflar va toifalar bazasi
```

---

## 🚀 Loyihani Ishga Tushirish

Loyihani ishga tushirish uchun hech qanday qo'shimcha paketlar o'rnatish shart emas:
1. `SmartKutubxona/` papkasidagi `index.html` faylini istalgan brauzerda (Chrome, Firefox, Edge, Safari) ikki marta bosib oching.
2. Yoki VS Code dasturida **Live Server** kengaytmasi orqali ishga tushiring.
Loyihani ishga tushirish uchun hech qanday qo'shimcha dasturlar o'rnatish shart emas:
1. **Eng oson usul**: `Ishga_Tushirish.bat` faylini ikki marta bosing. U avtomatik tarzda eng maqbul usulda brauzeringizni ochadi!
2. **To'g'ridan-to'g'ri ochish**: `index.html` faylini istalgan brauzerda (Chrome, Edge, Firefox, Safari) ikki marta bosib oching.
3. **PowerShell orqali**: `powershell -File server.ps1` buyrug'i orqali mahalliy serverni ishga tushiring.

---

## 🐙 GitHub'ga Yuklash Bo'yicha Ko'rsatma
## 🐙 GitHub Repository

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

Loyiha rasmiy GitHub ombori:
👉 [https://github.com/abdulazizshukurov872/one.git](https://github.com/abdulazizshukurov872/one.git)
