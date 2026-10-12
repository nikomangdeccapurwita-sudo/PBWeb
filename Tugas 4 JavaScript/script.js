
const basicForm = document.getElementById("basicForm");
const nameInput = document.getElementById("nameInput");
const countInput = document.getElementById("countInput");
const basicError = document.getElementById("basicError");

const choiceSection = document.getElementById("choiceSection");
const choicesForm = document.getElementById("choicesForm");
const choiceInputs = document.getElementById("choiceInputs");
const choicesError = document.getElementById("choicesError");

const selectionSection = document.getElementById("selectionSection");
const selectionForm = document.getElementById("selectionForm");
const radioOptions = document.getElementById("radioOptions");
const checkboxOptions = document.getElementById("checkboxOptions");
const dropdownChoice = document.getElementById("dropdownChoice");
const emailInput = document.getElementById("emailInput");
const selectionError = document.getElementById("selectionError");

const resultSection = document.getElementById("resultSection");

// Variabel untuk menyimpan data pengguna
let userName = "";
let numberOfChoices = 0;

// Array untuk menyimpan teks pilihan
let choiceTexts = [];


// BAGIAN 1: INPUT NAMA DAN JUMLAH PILIHAN

basicForm.addEventListener("submit", function(event) {
    event.preventDefault();

    basicError.textContent = "";

    userName = nameInput.value.trim();
    numberOfChoices = Number(countInput.value);

    // Memeriksa nama
    if (userName === "") {
        basicError.textContent = "Nama tidak boleh kosong.";
        nameInput.focus();
        return;
    }

    // Memeriksa jumlah pilihan
    if (
        !Number.isInteger(numberOfChoices) ||
        numberOfChoices < 1 ||
        numberOfChoices > 20
    ) {
        basicError.textContent =
            "Jumlah pilihan harus berupa angka bulat 1 sampai 20.";

        countInput.focus();
        return;
    }

    // Menghapus input pilihan sebelumnya
    choiceInputs.replaceChildren();

    // Loop membuat input teks sesuai jumlah pilihan
    for (let i = 0; i < numberOfChoices; i++) {
        const row = document.createElement("div");
        row.className = "choice-row";

        const label = document.createElement("label");
        label.htmlFor = `choice${i}`;
        label.textContent = `Pilihan ${i + 1}`;

        const input = document.createElement("input");
        input.type = "text";
        input.id = `choice${i}`;
        input.name = "choiceText";
        input.placeholder = `Masukkan pilihan ${i + 1}`;
        input.required = true;

        row.append(label, input);
        choiceInputs.appendChild(row);
    }

    choiceSection.classList.remove("hidden");
    selectionSection.classList.add("hidden");
    resultSection.classList.add("hidden");

    choiceSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});


// BAGIAN 2: MENYIMPAN TEKS PILIHAN

choicesForm.addEventListener("submit", function(event) {
    event.preventDefault();

    choicesError.textContent = "";

    const inputs = [
        ...choiceInputs.querySelectorAll("input")
    ];

    // Menyimpan semua teks input ke array
    choiceTexts = inputs.map(function(input) {
        return input.value.trim();
    });

    // Memeriksa apakah ada pilihan kosong
    if (choiceTexts.some(function(text) {
        return text === "";
    })) {
        choicesError.textContent =
            "Semua teks pilihan harus diisi.";
        return;
    }

    // Mengosongkan pilihan sebelumnya
    radioOptions.replaceChildren();
    checkboxOptions.replaceChildren();
    dropdownChoice.replaceChildren();

    // Membuat pilihan awal pada dropdown
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "-- Pilih salah satu --";
    placeholder.disabled = true;
    placeholder.selected = true;

    dropdownChoice.appendChild(placeholder);

    // Loop untuk membuat radio, checkbox, dan dropdown
    choiceTexts.forEach(function(choice, index) {

        // Membuat radio button
        const radioWrap = document.createElement("div");
        radioWrap.className = "option-item";

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "radioChoice";
        radio.id = `radio${index}`;
        radio.value = choice;
        radio.required = index === 0;

        const radioLabel = document.createElement("label");
        radioLabel.htmlFor = `radio${index}`;
        radioLabel.textContent = choice;

        radioWrap.append(radio, radioLabel);
        radioOptions.appendChild(radioWrap);


        // Membuat checkbox
        const checkWrap = document.createElement("div");
        checkWrap.className = "option-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `check${index}`;
        checkbox.value = choice;

        const checkLabel = document.createElement("label");
        checkLabel.htmlFor = `check${index}`;
        checkLabel.textContent = choice;

        checkWrap.append(checkbox, checkLabel);
        checkboxOptions.appendChild(checkWrap);


        // Membuat opsi dropdown
        const option = document.createElement("option");
        option.value = choice;
        option.textContent = choice;

        dropdownChoice.appendChild(option);
    });

    selectionSection.classList.remove("hidden");
    resultSection.classList.add("hidden");

    selectionSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});


// BAGIAN 3: VALIDASI EMAIL DAN PILIHAN PENGGUNA

selectionForm.addEventListener("submit", function(event) {
    event.preventDefault();

    selectionError.textContent = "";

    const email = emailInput.value.trim();

    // Pattern matching untuk memeriksa format email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailPattern.test(email)) {
        alert(
            "Format email salah. Masukkan email dengan format nama@domain.com."
        );

        emailInput.value = "";
        emailInput.focus();

        selectionError.textContent =
            "Silakan masukkan ulang email dengan format yang benar.";

        return;
    }

    // Mengambil radio button yang dipilih
    const radio = document.querySelector(
        'input[name="radioChoice"]:checked'
    );

    // Memastikan radio dan dropdown telah dipilih
    if (!radio || !dropdownChoice.value) {
        selectionError.textContent =
            "Pilih satu opsi radio dan satu opsi dropdown.";
        return;
    }

    // Mengambil semua checkbox yang dicentang
    const checkedValues = [
        ...checkboxOptions.querySelectorAll(
            'input[type="checkbox"]:checked'
        )
    ].map(function(input) {
        return input.value;
    });

    let checkboxText;

    if (checkedValues.length > 0) {
        checkboxText = checkedValues.join(", ");
    } else {
        checkboxText = "Tidak ada";
    }

    // OUTPUT MENGGUNAKAN JAVASCRIPT DOM
    document.getElementById("resultText").textContent =
        `Hallo, nama saya ${userName}, email ${email}. ` +
        `Saya mempunyai sejumlah ${numberOfChoices} pilihan yaitu ` +
        `${choiceTexts.join(", ")}, dan saya memilih ${radio.value}.`;

    document.getElementById("resultDropdown").textContent =
        dropdownChoice.value;

    document.getElementById("resultRadio").textContent =
        radio.value;

    document.getElementById("resultCheckbox").textContent =
        checkboxText;

    resultSection.classList.remove("hidden");

    resultSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});


// BAGIAN 4: TOMBOL MULAI LAGI

document.getElementById("resetButton").addEventListener(
    "click",
    function() {
        basicForm.reset();
        choicesForm.reset();
        selectionForm.reset();

        choiceInputs.replaceChildren();
        radioOptions.replaceChildren();
        checkboxOptions.replaceChildren();
        dropdownChoice.replaceChildren();

        choiceSection.classList.add("hidden");
        selectionSection.classList.add("hidden");
        resultSection.classList.add("hidden");

        choiceTexts = [];

        nameInput.focus();
    }
);