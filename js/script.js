// Dados de IMC
const data = [
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


// Seleção de Elementos

const imcTable = document.querySelector("#imcTable");

const heightInput = document.querySelector("#height");
const weightInput = document.querySelector("#weight");

const calcButton = document.querySelector("#calcButton");
const cleanButton = document.querySelector("#cleanButton");

const calcContainer = document.querySelector("#calcContainer");
const resultContainer = document.querySelector("#resultContainer");

const imcNumber = document.querySelector("#imcNumber span");
const imcInfo = document.querySelector("#imcInfo span");

const backButton = document.querySelector("#backButton");

// Fun es
function createTable(data) {
  const tableDataElements = data.map((item) => {
    const tableDataElement = document.createElement("div");
    tableDataElement.classList.add("tableData");

    const classificationElement = document.createElement("p");
    classificationElement.innerText = item.classification;

    const infoElement = document.createElement("p");
    infoElement.innerText = item.info;

    const obesityElement = document.createElement("p");
    obesityElement.innerText = item.obesity;

    obesityElement.classList.add(
      item.obesity === "0"
        ? "good"
        : item.obesity === "I"
        ? "low"
        : item.obesity === "II"
        ? "medium"
        : "high"
    );

    tableDataElement.appendChild(classificationElement);
    tableDataElement.appendChild(infoElement);
    tableDataElement.appendChild(obesityElement);

    return tableDataElement;
  });

  tableDataElements.forEach((element) => {
    imcTable.appendChild(element);
  });
}

function cleanInputs() {
  heightInput.value = "";
  weightInput.value = "";
  imcNumber.classList = "";
  imcInfo.classList = "";
}

function validDigits(text) {
  return text.replace(/[^0-9,]/g, "");
}

function calcImc(height, weight) {
  const imc = (weight / (height * height)).toFixed(1);

  return imc;
}

function showOrHideResults() {
  calcContainer.classList.toggle("hide");
  resultContainer.classList.toggle("hide");
}

// Inicialização

createTable(data);

// Eventos

[heightInput, weightInput].forEach((element) => {
  element.addEventListener("input", (e) => {
    const updateValue = validDigits(e.target.value);

    e.target.value = updateValue;
  });
});

calcButton.addEventListener("click", (e) => {
  e.preventDefault();

  const height = +heightInput.value.replace(",", ".");
  const weight = +weightInput.value.replace(",", ".");

  if (!height || !weight) return;

  const imc = calcImc(height, weight);

  let info;

  data.forEach((item) => {
    if (imc >= item.min && imc <= item.max) {
      info = item.info;
    }
  });

  if (!info) return;

  imcNumber.innerText = imc;
  imcInfo.innerText = info;

  switch (info) {
    case "Magreza":
      imcNumber.classList.add("low");
      imcInfo.classList.add("low");
      break;
    case "Normal":
      imcNumber.classList.add("good");
      imcInfo.classList.add("good");
      break;
    case "Sobrepeso":
      imcNumber.classList.add("low");
      imcInfo.classList.add("low");
      break;
    case "Obesidade":
      imcNumber.classList.add("medium");
      imcInfo.classList.add("medium");
      break;
    case "Obesidade grave":
      imcNumber.classList.add("high");
      imcInfo.classList.add("high");
      break;
  }

  showOrHideResults();
});

cleanButton.addEventListener("click", (e) => {
  e.preventDefault();

  cleanInputs();
});

backButton.addEventListener("click", () => {
  cleanInputs();
  showOrHideResults();
});
