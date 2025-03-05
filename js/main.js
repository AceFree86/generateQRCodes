const languageSelector = document.getElementById("languageSelector");
const title1 = document.getElementById("title1");
const title2 = document.getElementById("title2");
const url = document.getElementById("url");
const description1 = document.getElementById("description1");
const description2 = document.getElementById("description2");
const btn = document.getElementById("btn");
const form = document.getElementById("generate-form");
const select = document.getElementById("size");
const spinner = document.getElementById("spinner");
const qr = document.getElementById("qrcode");
const btn2Name = "";

const browserLang = getBrowserLanguage();
const langToSet = browserLang; // Default to "en" if no preference

// Language Data
const TRANSLATIONS = {
  en: {
    title: "QR Codes Generate",
    description1:
      "QR Codes allow smartphone users to access your website simply and quickly.",
    description2:
      "Enter your URL below to generate a QR Code and download the image.",
    btn: "Generate QR Code",
    btn2: "Save Image",
    alert: "Please enter a URL",
    placeholder: "Enter a URL",
  },
  uk: {
    title: "Створення QR-кодів",
    description1:
      "QR-коди дозволяють користувачам смартфонів швидко і просто отримати доступ до вашого вебсайту.",
    description2:
      "Введіть URL нижче, щоб згенерувати QR-код і завантажити зображення.",
    btn: "Створити QR-код",
    btn2: "Зберегти зображення",
    alert: "Будь ласка, введіть URL",
    placeholder: "Введіть URL",
  },
};

const changeLanguage = (lang) => {
  title1.textContent = TRANSLATIONS[lang].title;
  title2.textContent = TRANSLATIONS[lang].title;
  url.placeholder = TRANSLATIONS[lang].placeholder;
  description1.textContent = TRANSLATIONS[lang].description1;
  description2.textContent = TRANSLATIONS[lang].description2;
  btn.textContent = TRANSLATIONS[lang].btn;
  languageSelector.value = lang;
};

// Event Listener for Language Change
languageSelector.addEventListener("change", (e) => {
  changeLanguage(e.target.value); // Change content based on selected language
});

function getBrowserLanguage() {
  const userLang = navigator.language || navigator.userLanguage; // Detect language
  const lang = userLang.split("-")[0]; // Get the primary language (e.g., "en" from "en-US")
  // If the browser language is Ukrainian or Russian, set it to 'uk'
  if (lang === "uk" || lang === "ru") {
    return "uk"; // Ukrainian for 'uk' and 'ru'
  }
  return lang; // Default to the browser's language
}

for (let i = 100; i <= 2000; i += 100) {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = `${i}x${i}`;
  if (i === 500) option.selected = true; // Set default to 500x500
  select.appendChild(option);
}

const onGenerateSubmit = (e) => {
  e.preventDefault();
  clearUI();

  const size = select.value;

  if (url === "") {
    alert(TRANSLATIONS[languageSelector.value].alert);
  } else {
    showSpinner();
    setTimeout(() => {
      hideSpinner();
      generateQRCode(url.value, size);
      setTimeout(() => {
        const saveUrl = qr.querySelector("canvas").toDataURL();
        createSaveBtn(saveUrl);
      }, 50);
    }, 1000);
  }
};

// Generate QR code
const generateQRCode = (url, size) => {
  const qrcode = new QRCode("qrcode", {
    text: url,
    width: parseInt(size),
    height: parseInt(size),
    correctLevel: QRCode.CorrectLevel.H, // High error correction
  });
};

const showSpinner = () => {
  spinner.style.display = "block";
};

const hideSpinner = () => {
  spinner.style.display = "none";
};

const clearUI = () => {
  qr.innerHTML = "";
  const saveLink = document.getElementById("save-link");
  if (saveLink) saveLink.remove();
};

const createSaveBtn = (saveUrl) => {
  const link = document.createElement("a");
  link.id = "save-link";
  link.classList =
    "bg-red-500 hover:bg-red-700 text-white font-bold py-2 rounded w-1/3 m-auto my-5";
  link.href = saveUrl;
  link.download = "qrcode";
  link.innerHTML = TRANSLATIONS[languageSelector.value].btn2;
  document.getElementById("generate").appendChild(link);
};

changeLanguage(langToSet);
hideSpinner();

form.addEventListener("submit", onGenerateSubmit);
