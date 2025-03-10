const languageSelector = document.getElementById("languageSelector");
const title1 = document.getElementById("title1");
const title2 = document.getElementById("title2");
const tabs = document.querySelectorAll(".tab-link");
const btns = document.querySelectorAll(".button-generate-qr");
const contents = document.querySelectorAll(".tab-content");
const description1 = document.getElementById("description1");
const description2 = document.getElementById("description2");
const selectElements = document.querySelectorAll(".qr-size-select");
const spinner = document.getElementById("spinner");
const qr = document.getElementById("qrcode");

let selectedValue = "500x500";
let selectedIndex = 0;

const browserLang = getBrowserLanguage();
const langToSet = browserLang; // Default to "en" if no preference

// Language Data
const TRANSLATIONS = {
  en: {
    title: "QR Code Generator",
    btn: "Generate QR Code",
    btn2: "Save Image",
    alert: "Please enter a {type}",
    generalDescription:
      "QR Codes allow smartphone users to access your {type} simply and quickly.",
    description2:
      "Enter your {type} below to generate a QR Code and download the image.",
    0: "Enter Website URL (e.g., https://example.com)",
    1: "Enter Phone Number (e.g., +123456789)",
    2: "Enter Viber Number (e.g., +123456789)",
    3: "Enter WhatsApp Number (e.g., +123456789)",
    4: "Enter Telegram Username (e.g., @username)",
  },
  uk: {
    title: "Генератор QR-кодів",
    btn: "Створити QR-код",
    btn2: "Зберегти зображення",
    alert: "Будь ласка, введіть {type}",
    generalDescription:
      "QR-коди дозволяють користувачам смартфонів отримати доступ до вашого {type} просто і швидко.",
    description2:
      "Введіть {type} нижче, щоб створити QR-код і завантажити зображення.",
    0: "Введіть URL вебсайту (https://example.com)",
    1: "Номер телефону (123456789)",
    2: "Номер Viber (123456789)",
    3: "Номер WhatsApp (123456789)",
    4: "Ім'я користувача Telegram (@username)",
  },
};

function getDescription(tabIndex, lang) {
  const typeMap = {
    0: { en: "website", uk: "веб-сайт" },
    1: { en: "phone number", uk: "номер телефону" },
    2: { en: "viber number", uk: "номер viber" },
    3: { en: "whats number", uk: "номер whats" },
    4: { en: "telegram username", uk: "ім'я користувача telegram" },
  };

  const type = typeMap[tabIndex]?.[lang];
  return {
    description1: TRANSLATIONS[lang].generalDescription.replace("{type}", type),
    description2: TRANSLATIONS[lang].description2.replace("{type}", type),
    alert: TRANSLATIONS[lang].alert.replace("{type}", type),
  };
}

function updatePlaceholder(tabIndex, lang) {
  const inputIds = {
    0: "website",
    1: "phone",
    2: "viber",
    3: "whats",
    4: "telegram",
  };

  const inputId = inputIds[tabIndex];
  const inputField = document.getElementById(inputId);
  inputField.placeholder = TRANSLATIONS[lang][tabIndex];
}

const changeLanguage = (lang) => {
  const descriptions = getDescription(selectedIndex, lang);
  title1.textContent = TRANSLATIONS[lang].title;
  title2.textContent = TRANSLATIONS[lang].title;
  description1.textContent = descriptions.description1;
  description2.textContent = descriptions.description2;
  btns.forEach((btn) => (btn.textContent = TRANSLATIONS[lang].btn));
  updatePlaceholder(selectedIndex, lang);
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

selectElements.forEach((select) => {
  for (let i = 100; i <= 2000; i += 100) {
    const option = document.createElement("option");
    option.value = `${i}x${i}`;
    option.textContent = `${i}x${i}`;
    if (i === 500) option.selected = true; // Set default to 500x500
    select.appendChild(option);
  }
});

selectElements.forEach((select) => {
  select.addEventListener("change", () => {
    selectedValue = select.value;
  });
});

tabs.forEach((tab, index) => {
  tab.addEventListener("click", function () {
    tabs.forEach((t) => {
      t.style.backgroundColor = "transparent";
      t.style.color = "#666";
    });

    tab.style.backgroundColor = "#ff725e";
    tab.style.color = "white";

    selectedIndex = index;

    contents.forEach((content) => content.classList.add("hidden"));
    contents[index].classList.remove("hidden");
    changeLanguage(languageSelector.value);
  });
});

function aditTextToLink(tabIndex) {
  if (tabIndex === 1) {
    return "tel:";
  }
  if (tabIndex === 2) {
    return "viber://chat?number=";
  }
  if (tabIndex === 3) {
    return "https://wa.me/";
  }
  if (tabIndex === 4) {
    return "https://t.me/";
  } else {
    return "";
  }
}

function isValidInput(inputValue, tabIndex) {
  if (inputValue === "") {
    alert(getDescription(selectedIndex, languageSelector.value).alert);
    return false;
  }
  if ([1, 2, 3].includes(tabIndex)) {
    if (isNaN(inputValue)) {
      alert(getDescription(selectedIndex, languageSelector.value).alert);
      return false;
    }
  }
  if ([0, 4].includes(tabIndex)) {
    if (typeof inputValue !== "string" || inputValue.trim() === "") {
      alert(getDescription(selectedIndex, languageSelector.value).alert);
      return false;
    }
  }
  return true;
}

function generateQR(event, inputId, index) {
  event.preventDefault();
  const inputValue = document.getElementById(inputId).value;

  if (!isValidInput(inputValue, selectedIndex)) {
    return;
  }
  clearUI();
  showSpinner();
  setTimeout(() => {
    hideSpinner();
    generateQRCode(`${aditTextToLink(index)}${inputValue}`, selectedValue);
    setTimeout(() => {
      const saveUrl = qr.querySelector("canvas").toDataURL();
      createSaveBtn(saveUrl);
    }, 50);
  }, 1000);
}

// Generate QR code
const generateQRCode = (url, size) => {
  const qrcode = new QRCode("qrcode", {
    text: url,
    width: parseInt(size),
    height: parseInt(size),
    correctLevel: QRCode.CorrectLevel.H,
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

document
  .getElementById("website-form")
  .addEventListener("submit", function (e) {
    generateQR(e, "website", 0);
  });

document.getElementById("phone-form").addEventListener("submit", function (e) {
  generateQR(e, "phone", 1);
});

document.getElementById("viber-form").addEventListener("submit", function (e) {
  generateQR(e, "viber", 2);
});

document.getElementById("whats-form").addEventListener("submit", function (e) {
  generateQR(e, "whats", 3);
});

document
  .getElementById("telegram-form")
  .addEventListener("submit", function (e) {
    generateQR(e, "telegram", 4);
  });
