const slot = document.getElementById("main-panel");

fetch("../Forms/personal_information.html")
    .then(r => r.text())
    .then(html => {
        slot.innerHTML = html;
        initEducationalBackground();
    });

var payload;

function initPersonalForm() {

    const form = document.getElementById("personal-info");

    const fullName = document.getElementById("fullName");
    const gender = document.getElementById("gender");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const birthPlace = document.getElementById("birthPlace");
    const dob = document.getElementById("dob");
    const nationality = document.getElementById("nationality");
    const countryCode = document.getElementById("countryCode");
    const nextBtn = document.getElementById("nextBtn");

    function isEmailValid(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function isPhoneValid(value) {
        return /^[0-9]{6,15}$/.test(value);
    }

    function checkForm() {
        const valid =
            fullName.value.trim() !== "" &&
            gender.value !== "" &&
            isEmailValid(email.value.trim()) &&
            isPhoneValid(phone.value.trim()) &&
            birthPlace.value.trim() !== "" &&
            dob.value !== "" &&
            nationality.value !== "";

        nextBtn.disabled = !valid;
    }

    phone.addEventListener("input", () => {
        phone.value = phone.value.replace(/[^\d]/g, "");
        checkForm();
    });

    [
        fullName,
        gender,
        email,
        birthPlace,
        dob,
        nationality
    ].forEach(el => {
        el.addEventListener("input", checkForm);
        el.addEventListener("change", checkForm);
    });

    form.addEventListener("submit", e => {
        e.preventDefault();

        payload = {
            fullName: fullName.value.trim(),
            gender: gender.value,
            email: email.value.trim(),
            phone: countryCode.value + phone.value.trim(),
            birthPlace: birthPlace.value.trim(),
            dob: dob.value,
            nationality: nationality.value
        };

        
        console.log("Form data:", payload);
        
        alert("Personal information saved.");

        fetch("../Forms/educational_background.html").then(r => r.text()).then(html => {slot.innerHTML = html; initEducationalBackground();});
    });
}

function initEducationalBackground() {

    const form = document.getElementById("educational-background");

    const fullName = document.getElementById("fullName");
    const gender = document.getElementById("gender");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const birthPlace = document.getElementById("birthPlace");
    const dob = document.getElementById("dob");
    const nationality = document.getElementById("nationality");
    const countryCode = document.getElementById("countryCode");
    const nextBtn = document.getElementById("nextBtn");

    function isEmailValid(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function isPhoneValid(value) {
        return /^[0-9]{6,15}$/.test(value);
    }

    function checkForm() {
        const valid =
            fullName.value.trim() !== "" &&
            gender.value !== "" &&
            isEmailValid(email.value.trim()) &&
            isPhoneValid(phone.value.trim()) &&
            birthPlace.value.trim() !== "" &&
            dob.value !== "" &&
            nationality.value !== "";

        nextBtn.disabled = !valid;
    }

    // phone.addEventListener("input", () => {
    //     phone.value = phone.value.replace(/[^\d]/g, "");
    //     checkForm();
    // });

    // [
    //     fullName,
    //     gender,
    //     email,
    //     birthPlace,
    //     dob,
    //     nationality
    // ].forEach(el => {
    //     el.addEventListener("input", checkForm);
    //     el.addEventListener("change", checkForm);
    // });

    // form.addEventListener("submit", e => {
    //     e.preventDefault();

    //     // payload = {
    //     //     fullName: fullName.value.trim(),
    //     //     gender: gender.value,
    //     //     email: email.value.trim(),
    //     //     phone: countryCode.value + phone.value.trim(),
    //     //     birthPlace: birthPlace.value.trim(),
    //     //     dob: dob.value,
    //     //     nationality: nationality.value
    //     // };

    //     fetch("../Forms/personal_information.html").then(r => r.text()).then(html => {slot.innerHTML = html; initPersonalForm();});

    //     console.log("Form data:", payload);

    //     alert("Educational Background saved.");
    // });
}
