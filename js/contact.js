/**
 * SmartKutubxona - Bog'lanish sahifasi (js/contact.js)
 * Forma validatsiyasi, xabarlarni LocalStorage ga saqlash va Toast xabarlari
 */

const MESSAGES_KEY = 'smart_kutubxona_messages';

function initContactPage() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullname = document.getElementById('contact-name')?.value.trim();
    const email = document.getElementById('contact-email')?.value.trim();
    const phone = document.getElementById('contact-phone')?.value.trim();
    const message = document.getElementById('contact-message')?.value.trim();

    if (!fullname || !email || !message) {
      showToast('Iltimos, barcha majburiy maydonlarni to\'ldiring', 'error');
      return;
    }

    // Email formati tekshiruvi
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Noto\'g\'ri email manzili kiritildi', 'error');
      return;
    }

    const newMessage = {
      id: Date.now(),
      fullname,
      email,
      phone: phone || 'Ko\'rsatilmagan',
      message,
      createdAt: new Date().toLocaleString('uz-UZ')
    };

    try {
      const existing = JSON.parse(localStorage.getItem(MESSAGES_KEY)) || [];
      existing.push(newMessage);
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(existing));
    } catch (err) {
      console.error('Xabarni saqlashda xatolik:', err);
    }

    form.reset();
    showToast('Xabaringiz muvaffaqiyatli yuborildi! Tez orada javob beramiz.');
  });
}

document.addEventListener('DOMContentLoaded', initContactPage);

