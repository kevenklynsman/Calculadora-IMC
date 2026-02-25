// Regras de classificação do IMC
const IMC_RANGES = [
  {
    min: 0,
    max: 18.4,
    classification: "Menor que 18,5",
    info: "Magreza",
    obesity: "0",
  },
  {
    min: 18.5,
    max: 24.9,
    classification: "Entre 18,5 e 24,9",
    info: "Normal",
    obesity: "0",
  },
  {
    min: 25,
    max: 29.9,
    classification: "Entre 25,0 e 29,9",
    info: "Sobrepeso",
    obesity: "I",
  },
  {
    min: 30,
    max: 39.9,
    classification: "Entre 30,0 e 39,9",
    info: "Obesidade",
    obesity: "II",
  },
  {
    min: 40,
    max: 99,
    classification: "Maior que 40,0",
    info: "Obesidade grave",
    obesity: "III",
  },
];

// Mapeamentos de estilo (evita switch/case repetitivo)
const OBESITY_CLASS_BY_LEVEL = {
  "0": "good",
  I: "low",
  II: "medium",
  III: "high",
};

const RESULT_CLASS_BY_INFO = {
  Magreza: "low",
  Normal: "good",
  Sobrepeso: "low",
  Obesidade: "medium",
  "Obesidade grave": "high",
};

// Seletores centralizados (Single Source of Truth)
const elements = {
  imcTable: document.querySelector("#imcTable"),
  heightInput: document.querySelector("#height"),
  weightInput: document.querySelector("#weight"),
  calcButton: document.querySelector("#calcButton"),
  cleanButton: document.querySelector("#cleanButton"),
  calcContainer: document.querySelector("#calcContainer"),
  resultContainer: document.querySelector("#resultContainer"),
  imcNumber: document.querySelector("#imcNumber span"),
  imcInfo: document.querySelector("#imcInfo span"),
  backButton: document.querySelector("#backButton"),
};

// Sanitiza texto para padrão local (apenas números e vírgula)
function sanitizeLocaleInput(text) {
  return text.replace(/\./g, ",").replace(/[^0-9,]/g, "");
}

// Máscara de input: máscara de altura (autoformata para 2 casas decimais)
function formatHeightInput(text) {
  const value = sanitizeLocaleInput(text);

  if (!value) return "";

  if (value.includes(",")) {
    const [integerPartRaw, ...rest] = value.split(",");
    const integerPart = integerPartRaw || "0";
    const decimalPart = rest.join("").slice(0, 2);

    return decimalPart ? `${integerPart},${decimalPart}` : `${integerPart},`;
  }

  const digitsOnly = value.replace(/\D/g, "");

  if (digitsOnly.length > 2) {
    return `${digitsOnly.slice(0, -2)},${digitsOnly.slice(-2)}`;
  }

  return digitsOnly;
}

// Máscara de input: máscara de peso (até 999,9)
function formatWeightInput(text) {
  const value = sanitizeLocaleInput(text);

  if (!value) return "";

  const maxIntegerDigits = 3;
  const maxDecimalDigits = 1;

  if (!value.includes(",")) {
    return value.replace(/\D/g, "").slice(0, maxIntegerDigits);
  }

  const [integerPartRaw, ...rest] = value.split(",");
  const integerPart = integerPartRaw
    .replace(/\D/g, "")
    .slice(0, maxIntegerDigits);
  const decimalPart = rest
    .join("")
    .replace(/\D/g, "")
    .slice(0, maxDecimalDigits);

  return decimalPart ? `${integerPart},${decimalPart}` : `${integerPart},`;
}

// Strategy Pattern simples para máscaras por campo
const inputMaskStrategies = {
  height: formatHeightInput,
  weight: formatWeightInput,
};

function parseLocaleNumber(value) {
  return Number(value.replace(",", "."));
}

function calculateImc(height, weight) {
  return Number((weight / (height * height)).toFixed(1));
}

function getImcInfo(imc) {
  const range = IMC_RANGES.find((item) => imc >= item.min && imc <= item.max);
  return range ? range.info : null;
}

function resetInputsAndStyles() {
  elements.heightInput.value = "";
  elements.weightInput.value = "";
  elements.imcNumber.className = "";
  elements.imcInfo.className = "";
}

function toggleResults() {
  elements.calcContainer.classList.toggle("hide");
  elements.resultContainer.classList.toggle("hide");
}

function applyResultStyles(info) {
  const cssClass = RESULT_CLASS_BY_INFO[info];

  if (!cssClass) return;

  elements.imcNumber.classList.add(cssClass);
  elements.imcInfo.classList.add(cssClass);
}

function createTable(ranges) {
  const fragment = document.createDocumentFragment();

  ranges.forEach((item) => {
    const row = document.createElement("div");
    row.classList.add("tableData");

    const classificationElement = document.createElement("p");
    classificationElement.innerText = item.classification;

    const infoElement = document.createElement("p");
    infoElement.innerText = item.info;

    const obesityElement = document.createElement("p");
    obesityElement.innerText = item.obesity;
    obesityElement.classList.add(OBESITY_CLASS_BY_LEVEL[item.obesity] || "high");

    row.append(classificationElement, infoElement, obesityElement);
    fragment.appendChild(row);
  });

  elements.imcTable.appendChild(fragment);
}

function handleInputMask(event) {
  const maskStrategy = inputMaskStrategies[event.target.id];

  if (!maskStrategy) return;

  event.target.value = maskStrategy(event.target.value);
}

function handleCalculate(event) {
  event.preventDefault();

  const height = parseLocaleNumber(elements.heightInput.value);
  const weight = parseLocaleNumber(elements.weightInput.value);

  if (!height || !weight) return;

  const imc = calculateImc(height, weight);
  const info = getImcInfo(imc);

  if (!info) return;

  elements.imcNumber.innerText = String(imc).replace(".", ",");
  elements.imcInfo.innerText = info;

  applyResultStyles(info);
  toggleResults();
}

function handleClean(event) {
  event.preventDefault();
  resetInputsAndStyles();
}

function handleBack() {
  resetInputsAndStyles();
  toggleResults();
}

function initialize() {
  createTable(IMC_RANGES);

  [elements.heightInput, elements.weightInput].forEach((input) => {
    input.addEventListener("input", handleInputMask);
  });

  elements.calcButton.addEventListener("click", handleCalculate);
  elements.cleanButton.addEventListener("click", handleClean);
  elements.backButton.addEventListener("click", handleBack);
}

// Ponto único de entrada da aplicação
initialize();
