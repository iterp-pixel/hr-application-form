// TODO: Remove debug tools before deployment
let currentStep = 1;
const totalSteps = 11;
const formData = {};
var submitData = {};
const countryData = {};
const jobList = {};
const countryList = [];
const educationLevels = [];
const platformList = [];
const medicalList = [];
let selectedJob = "";
var topBarExpanded = false;

// element variables
const splashScreen = document.getElementById("splash-screen");
const phoneCountryCode = document.getElementById('countryCode');
const nationalityList = document.getElementById('nationality');
const countryIcon = document.getElementById('countryIcon');
const countryIconPrev = document.getElementById('countryIconPrev');
const notification = document.getElementById('notification');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const confirmAgreeCheckbox = document.getElementById('confirmation-agreement');
const topBar = document.getElementById('topbar');

var currentSectionElements = document.getElementById('section1').querySelectorAll('input, select, textarea');

// initialize form
document.getElementById(`section${currentStep}`).classList.add('active');
document.getElementById('prevBtn').style.display = currentStep === 1 ? 'none' : 'flex';
document.getElementById('nextBtn').style.display = (currentStep === 1 || currentStep === totalSteps) ? 'none' : 'flex';
document.getElementById('submitBtn').style.display = (currentStep === totalSteps ? 'flex' : 'none');

// Check applicant form
const formCheck = new FormData();
formCheck.append("name", "");
formCheck.append("job_id", 0);
formCheck.append("email", "");
formCheck.append("phone", "");

// splash screen
document.querySelector(".layout").classList.add("splash");
document.getElementById("splash-screen").addEventListener("animationend", () => {
    document.getElementById("splash-screen").style.display = "none";
    document.querySelector(".layout").classList.remove("splash");
    topBar.style.display = 'block';
    document.getElementById('sidebar').classList.add('active');
    document.getElementById('applicationForm').style.display = 'block';

    if (localStorage.getItem("formData")) {
        document.getElementById('restoreForm').style.display = 'block';
        document.querySelector('.layout').style.display = 'none';
    } else {
        fetchData();
    }
})

// api fetch handling
function fetchData() {
    fetchCountryCode().then((response) => {
        const data = JSON.parse(response)['country_list'];
        Object.keys(data).forEach(key => {
            countryList[key] = data[key];
        })
        countryList.sort((a, b) => {
            var value = a["country_phone"] > b["country_phone"];
            return value ? 1 : -1;
        });
        if (countryList.length > 0) {
            phoneCountryCode.innerHTML = '<option value="">#</option>';
            nationalityList.innerHTML = '<option value="">Select your nationality</option>';
            [...countryList].forEach(country => {
                phoneCountryCode.innerHTML += `<option value=${country['country_phone']}>${country['country_phone']} (${country['country_code']})</option>`;
                nationalityList.innerHTML += `<option value=${country['country_id']}>${country['country_name']}</option>`;
            })

            if (formData["countryCode"]) {
                phoneCountryCode.value = formData["countryCode"];
                changeCountryIcon();
            };
            if (formData["nationality"]) {
                nationalityList.value = formData["countryCode"];
            };
        }
    }).catch(() => {
        notificationHandler(`Country; Could not fetch data`, "error");
    });

    fetchJobList().then((response) => {
        const data = JSON.parse(response)['open_jobs'];
        Object.keys(data).forEach(key => {
            jobList[key] = data[key];
        })
        if (jobList.length < 1) {
            document.getElementById('loading-job-display').style.display = 'none';
            document.getElementById('no-job-display').style.display = 'flex';
        } else {
            document.getElementById('no-job-display').style.display = 'none';
            document.getElementById('loading-job-display').style.display = 'none';
        }
        var jobListElement = document.getElementById('job-list').querySelector('.panel-body');
        var jobEntry = document.getElementsByClassName('job-entry')[0];
        Object.values(jobList).forEach(job => {
            var newEntry = jobEntry.cloneNode(true);
            newEntry.style.display = 'block';
            newEntry.setAttribute('onclick', `viewJobPosition(${job['jobs_id']})`);
            newEntry.innerHTML =
            `<h3 class="job-title">${job['jobs_name']}</h3>
            <p>${job['job_description']}</p>`;
            jobListElement.appendChild(newEntry);
        })
    }).catch(() => {
        document.getElementById('loading-job-display').style.display = 'none';
        document.getElementById('no-job-display').style.display = 'flex';
        notificationHandler(`Jobs; Could not fetch data`, "error");
    });

    fetchEducationLevel().then((response) => {
        const data = JSON.parse(response)["education_level"];
        Object.keys(data).forEach(key => {
            educationLevels[key] = data[key];
        })

        var eduLevelElement = document.getElementById('level-1');
        eduLevelElement.innerHTML = '<option value="">Choose level</option>';
        Object.values(educationLevels).forEach(level => {
            eduLevelElement.innerHTML += `<option value=${level['edu_id']}>${level['edu_name']}</option>`;
        })

        if (formData["edu"]) {
            Object.keys(formData["edu"]).forEach(e => {
                eduLevelElement = document.getElementById(`level-${e}`);
                eduLevelElement.innerHTML = '<option value="">Choose level</option>';
                Object.values(educationLevels).forEach(level => {
                    eduLevelElement.innerHTML += `<option value=${level['edu_id']}>${level['edu_name']}</option>`;
                });
                eduLevelElement.value = formData["edu"][e]["level"];
                updateMobileTable(eduLevelElement);
            })
            
            toggleFieldEndDate(document.getElementById('level-1'));
        };
    }).catch(() => {
        notificationHandler(`Education; Could not fetch data`, "error");
    })

    fetchSocialPlatform().then((response) => {
        const data = JSON.parse(response)["utm_list"];    
        Object.keys(data).forEach(key => {
            platformList[key] = data[key];
        })
        
        var socialElement = document.getElementById('socialplatform-1');
        socialElement.innerHTML = '<option value="">Choose Platform</option>';
        Object.values(platformList).forEach(platform => {
            socialElement.innerHTML += `<option value="${platform['utm_id']}">${platform['utm_name']}</option>`;
        });

        if (formData["social"]) {
            Object.keys(formData["social"]).forEach(e => {
                socialElement = document.getElementById(`socialplatform-${e}`);
                socialElement.innerHTML = '<option value="">Choose Platform</option>';
                Object.values(platformList).forEach(platform => {
                    socialElement.innerHTML += `<option value="${platform['utm_id']}">${platform['utm_name']}</option>`;
                });
                socialElement.value = formData["social"][e]["socialplatform"];
                updateSocialPlatforms(socialElement.id, socialElement.value);
                updateMobileTable(socialElement);
            })
        };
    }).catch(() => {
        notificationHandler(`Platforms; Could not fetch data`, "error");
    })

    fetchMedicalList().then((response) => {
        const data = JSON.parse(response)["medical_type"];
        Object.keys(data).forEach(key => {
            medicalList[key] = data[key];
        })

        var healthElement = document.getElementById('sick-1');
        healthElement.innerHTML = '<option value ="">Choose sickness type</option>';
        Object.values(medicalList).forEach(health => {
            healthElement.innerHTML += `<option value="${health['medical_id']}">${health['medical_name']}</option>`;
        })

        if (formData["health"]) {
            Object.keys(formData["health"]).forEach(e => {
                healthElement = document.getElementById(`sick-${e}`);
                healthElement.innerHTML = '<option value ="">Choose sickness type</option>';
                Object.values(medicalList).forEach(health => {
                    healthElement.innerHTML += `<option value="${health['medical_id']}">${health['medical_name']}</option>`;
                })
                healthElement.value = formData["health"][e]["sick"];
                updateMobileTable(healthElement);
            })
        };
    }).catch(() => {
        notificationHandler(`Medical; Could not fetch data`, "error");
    })
}

// on phone country code change function to change the ui flag icon
function changeCountryIcon() {
    var flag;

    [...countryList].forEach(country => {
        if (country['country_code'] === phoneCountryCode.options[phoneCountryCode.selectedIndex].innerHTML.split('(')[1].replace(')', '')) {
            flag = country['country_flag'];
        }
    });

    if (flag) {
        countryIcon.innerHTML = `<img width="100%" src="${flag}" alt='' />`;
        countryIconPrev.innerHTML = `<img width="100%" src="${flag}" alt='' />`;
    } else {
        countryIcon.innerHTML = `<img width="100%" src="" alt='' />`;
        countryIconPrev.innerHTML = `<img width="100%" src="" alt='' />`;
    }
}

// section checkboxes
function toggleSection(self, content, id) {
    console.log(self, content, id);
    const table = document.getElementById(id);
    const mobileTable = document.getElementById(table.id.replace('Table', 'MobileTable')).querySelector('tbody');
    const contentElement = document.getElementById(content);
    const inputs = table.querySelectorAll('input, select, textarea');

    const onAnimationEnd = () => {
        contentElement.style.display = 'none';
        contentElement.removeEventListener("animationend", onAnimationEnd);

        inputs.forEach(input => {
            input.classList.remove('missing');
            if (input.parentElement.classList.contains('file-input-wrapper')) {
                fileOnChanged(input);
            }
            if (!input.id.includes('-1')) {
                input.parentElement.parentElement.remove();
            }
            input.value = '';
            input.required = false;
            updateMobileTable(input);
        });
        updateNextButton();
        [...mobileTable.children].forEach(child => {
            if (child.hasAttribute('id') && !child.id.includes('-1')) {
                child.remove();
            }
        })

    }
    if (self.checked) {
        contentElement.style.display = 'block';
        contentElement.classList.remove("hidden");
        inputs.forEach(input => {
            input.required = true;
            if (input.parentElement.classList.contains('file-input-wrapper')) {
                fileOnChanged(input);
            }
        })
        self.value = 'on';
        updateNextButton();
    } else {
        contentElement.classList.add("hidden");
        contentElement.removeEventListener("animationend", onAnimationEnd);
        contentElement.addEventListener("animationend", onAnimationEnd);

        self.value = 'off';
    }
}

// quick question field toggler
function toggleField(self, id) {
    var value = self.value;
    var field = document.getElementById(id);
    var fieldRow = field.parentElement.parentElement;
    if (value == 'Yes' || value == 'Others') {
        fieldRow.style.display = 'block';
        field.required = true;
    } else {
        fieldRow.style.display = 'none';
        field.value = '';
        field.required = false;
    }
}

document.getElementById('topbar').addEventListener("transitionend", (e) => {
    if (e.propertyName === "height" && e.target.style.height === "90px") {
        topBar.scrollTop = 0;
        [...topBar.children].forEach(entry => {
            if (entry.classList.contains('topbar-entry')) {
                topBar.removeChild(entry);
            }
        })
        topBarExpanded = false;
    }
})

// toggle top bar for mobile
function toggleTopBar() {
    if (topBarExpanded) {
        topBar.style.height = "90px";
        topBar.style.overflow = "hidden";
    } else {
        var steps = document.querySelectorAll('[id*=step]');
        steps.forEach(step => {
            if (!step.id.includes('-')) {
                var entry = document.createElement("div");
                entry.classList.add('topbar-entry');
                entry.innerHTML = document.getElementById(`${step.id}`).innerHTML.split('<')[0].trim();
                if (Number(step.id.split('p')[1]) === currentStep) entry.classList.add('active')
                else if (Number(step.id.split('p')[1]) < currentStep) entry.classList.add('completed');
                topBar.appendChild(entry);
            }
        })
        topBar.style.height = "420px";
        topBar.style.overflow = "auto";
        topBarExpanded = true;
    }
}

// Update form progress when pressing next button
function updateProgress() {
    var progressElement = document.getElementById('step-progress');
    var progressTitle = document.getElementById('step-progress-title');

    if (topBarExpanded) toggleTopBar();

    progressTitle.innerHTML = `<h2>${document.getElementById(`step${currentStep}`).innerHTML.split('<')[0].trim()}</h2>`;
    progressElement.innerHTML = `<div style="font-weight:bold;">${currentStep}</div><div style="color: var(--text-secondary);">/${totalSteps}</div>`;

    for (let i = 1; i <= totalSteps; i++) {
        const step = document.getElementById(`step${i}`);
        const circle = step.firstElementChild;

        step.classList.remove('active', 'completed', 'row');
        circle.classList.remove('completed');

        if (i < currentStep) {
            step.classList.add('completed', 'row');
            circle.classList.add('completed');
        } else if (i === currentStep) {
            step.classList.remove('completed');
            step.classList.add('active');
        }
    }
}

// client-side validation per form sections
async function validateCurrentStep(step) {
    const currentSection = document.getElementById(`section${currentStep}`);
    const allInputs = currentSection.querySelectorAll('input, select, textarea');
    const requiredInputs = currentSection.querySelectorAll('[required]');
    let hasInvalidInput = false;
    let hasValidatedSection = false;
    let validationMessage = "";

    // refresh field status
    for (var input of allInputs) {
        input.classList.remove('missing');
    }

    for (var input of requiredInputs) {
        if (!input.value.trim()) {
            input.classList.add('missing');
            validationMessage = "Please fill all required fields!";
            hasInvalidInput = true;
        }
    }

    if (hasInvalidInput == false) {
        hasInvalidInput = await sectionValidator(step);
        hasValidatedSection = true;
    };

    if (hasInvalidInput == false) {
        return true;
    } else {
        if (!hasValidatedSection) notificationHandler(validationMessage, "error");
        return false;
    }
}

// Notification animation and toggling
notification.addEventListener("animationend", (e) => {
    if (e.animationName === "fadeOut") notification.classList.remove("fade-out");
})
function notificationHandler(message, status) {
    const notificationElement = document.createElement('div');
    notificationElement.classList.add('panel-notification');
    // notification.classList.remove("active", "error", "info");

    const onAnimationEnd = (e) => {
        if (e.animationName === "fadeOutNotif") {
            notificationElement.removeEventListener("animationend", onAnimationEnd);
            notificationElement.remove();
        };
    }

    switch (status) {
        case "info":
            notificationElement.classList.add("info");
            break;
        case "error":
            notificationElement.classList.add("error");
            break;
        default:
            break;
    }

    notificationElement.innerHTML = message;
    notificationElement.classList.add("active");
    notification.appendChild(notificationElement);

    notificationElement._timer = window.setTimeout(() => {
        notificationElement.classList.remove("active", "error", "info");
        notificationElement.classList.add("fade-out");
        notificationElement.addEventListener("animationend", onAnimationEnd);
    }, 5000);
}

// update field input css if user tries to submit without data
function fieldMissing(element) {
    element.classList.add('missing');
}

// remove required attribute on end date input when it is the highest level (edu) or latest date (workExp)
function toggleFieldEndDate(element) {
    const baseId = element.id.split('-')[0];
    const group = document.querySelectorAll(`select[id*="${baseId}"], input[id*="${baseId}"]`);
    var maxValue;

    if (group.length === 1) {
        maxValue = element.type === 'date' ? Date.parse(group[0].value) : Number(group[0].value);
    } else {
        var values = [...group].map(e => e.type === 'date' ? Date.parse(e.value) : Number(e.value));
        maxValue = Math.max(...values);
    }

    group.forEach(e => {
        const target = e.parentElement.parentElement.parentElement.querySelector(`input[id*="endperiod-${e.id.split('-')[1]}"]`);
        var value = e.type === 'date' ? Date.parse(e.value) : Number(e.value);
        if (value === maxValue) {
            target.required = false;
        } else {
            target.required = true;
        };

    })
}

// Extra client-side validation
async function sectionValidator(step) {
    let hasInvalidField = false;
    var validImageTypes = ["image/png", "image/jpg"];

    // some section with simple inputs skip extra validation
    switch (step) {
        case 2: 
            var currentDate = new Date(Date.now());
            var selectedDate = new Date(Date.parse(document.getElementById('dob').value));
            // personal information
            if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById('email').value)) {
                fieldMissing(document.getElementById('email'));
                notificationHandler("Please fill in a valid email address.", "error");
                return true;
            }
            
            if (!validatePhoneNumber(`(+${document.getElementById('countryCode').value}) ${document.getElementById('phone').value}`)) {
                fieldMissing(document.getElementById('phone'));
                notificationHandler("Please fill in a valid phone number", "error");
                return true;
            }

            if (selectedDate.getFullYear() > (currentDate.getFullYear() - 13)) {
                fieldMissing(document.getElementById('dob'));
                notificationHandler("You need to be at least 13 years old to apply.", "error");
                return true;
            }    
            
            // check applicant if previously applied
            hasInvalidField = checkApplicant(formCheck, formData['job_id']).then((response) => {
                if (response["state"] === "allow") {
                    notificationHandler(response["message"], "info");
                    return false;
                } else {
                    notificationHandler(response["message"], "error");
                    return true;
                }
            });
            break;
        case 4: 
            // educational background
            var periodStarts = [...document.getElementById('eduTable').querySelectorAll('[id*=edustartperiod]')];
            var periodEnds = [...document.getElementById('eduTable').querySelectorAll('[id*=eduendperiod]')];
            var remarks = [...document.getElementById('eduTable').querySelectorAll('[id*=remark]')];
            var totalRemarks = [...document.getElementById('eduTable').querySelectorAll('[id*=totalscore]')];

            hasInvalidField = validateDateRange(periodStarts, periodEnds);
            
            if (hasInvalidField) return hasInvalidField;
            remarks.forEach(inp => {
                var remark = Number(inp.value);
                var total = Number(totalRemarks[remarks.indexOf(inp)].value);
                if (remark < 0 || total < 0) {
                    fieldMissing(inp);
                    fieldMissing(totalRemarks[remarks.indexOf(inp)]);
                    notificationHandler("Grade cannot be less than 0.", "error");
                    hasInvalidField = true;
                    return;
                }
                if (remark > total) {
                    fieldMissing(inp);
                    fieldMissing(totalRemarks[remarks.indexOf(inp)]);
                    notificationHandler("Grade cannot be bigger than max grade.", "error");
                    hasInvalidField = true;
                    return;
                }
            })
            if (hasInvalidField) return hasInvalidField;
            var inputs = document.getElementById('eduTable').querySelectorAll('input[type="file"][required]');
            inputs.forEach(inp => {
                if ((inp.files[0].size) > 2097152 || inp.files[0].type != "application/pdf") {
                    fieldMissing(inp);
                    notificationHandler("Attachment(s) is either bigger than 2MB or not the correct file type", "error");
                    hasInvalidField = true;
                    return;
                }
            })
            break;
        case 5: 
            // work experience
            var periodStarts = [...document.getElementById('workExpTable').querySelectorAll('[id*=workstartperiod]')];
            var periodEnds = [...document.getElementById('workExpTable').querySelectorAll('[id*=workendperiod]')];
            var takeHomePay = [...document.getElementById('workExpTable').querySelectorAll('[id*=takehomepay]')];

            hasInvalidField = validateDateRange(periodStarts, periodEnds);

            if (hasInvalidField) return hasInvalidField;
            takeHomePay.forEach(inp => {
                if (inp.value < 0) {
                    fieldMissing(inp);
                    notificationHandler("Take home pay cannot be less than 0.", "error");
                    hasInvalidField = true;
                    return;
                }
            })
            break;
        case 6: 
            // training
            var periodStarts = [...document.getElementById('trainingTable').querySelectorAll('[id*=trainingstartperiod]')];
            var periodEnds = [...document.getElementById('trainingTable').querySelectorAll('[id*=trainingendperiod]')];

            hasInvalidField = validateDateRange(periodStarts, periodEnds);

            if (hasInvalidField) return hasInvalidField;
            var inputs = document.getElementById('trainingTable').querySelectorAll('input[type="file"][required]');
            inputs.forEach(inp => {
                if ((inp.files[0].size) > 2097152 || inp.files[0].type != "application/pdf") {
                    fieldMissing(inp);
                    notificationHandler("Attachment(s) is either bigger than 2MB or not the correct file type.", "error");
                    hasInvalidField = true;
                    return;
                }
            })
            break;
        case 7: 
            // job expectations
            if (Number(document.getElementById('expectedSalary').value) < 0) {
                fieldMissing(document.getElementById('expectedSalary'));
                notificationHandler("Expected salary cannot be less than 0.", "error");
                return true;
            }
            if (Date.parse(document.getElementById('availableDate').value) < Date.now()) {
                fieldMissing(document.getElementById('availableDate'));
                notificationHandler("Available date cannot be before today.", "error");
                return true;
            }
            break;
        case 10: 
            var recentPhoto = document.getElementById('recentPhoto');
            var resume = document.getElementById('resume');
            if ((recentPhoto.files[0].size) > 1048576 || (!validImageTypes.includes(recentPhoto.files[0].type))) {
                fieldMissing(recentPhoto);
                notificationHandler("Recent photo is either bigger than 1MB or not the correct file type.", "error");
                return true;
            }
            if ((resume.files[0].size) > 2097152 || resume.files[0].type != "application/pdf") {
                fieldMissing(resume);
                notificationHandler("Resume is either bigger than 2MB or not the correct file type.", "error");
                return true;
            }
            break;
        default: 
            hasInvalidField = false;
            break;
    }

    return hasInvalidField;
}

// file blob to base64 converter
const base64 = file => new Promise((resolve) => {
    try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            resolve(reader.result.split(',')[1]);
        };
    } catch {
        resolve("");
    }
}) 

function inputTypeSaveHandler(input) {
    if (input.type == 'file') {
        var uploadData = {
            'file_name': input.files[0] ? input.files[0].name : '',
            'mime_type':input.files[0] ? input.files[0].type : '',
            'file':input.files[0],
        };

        return uploadData;
    }
    if (input.type == 'number') {
        return Number(input.value);
    }
    return input.value;
}

function autoSaveForm() {
    notificationHandler("Autosaving...");
    saveFormData();
}

function saveFormData() {
    const currentSection = document.getElementById(`section${currentStep}`);
    const isGroupingData = currentSection.classList.contains('grouped') ? true : false;
    const inputs = currentSection.querySelectorAll('input, select, textarea');
    var currentIndex = 1;
    var tableData = {};
    var rowData = {};

    // checks each inputs to save
    inputs.forEach(input => {
        if (input.id) {
            if (input.id === "phone") {
                try {
                    formData[input.id] = phoneUtil.parse(`(+${phoneCountryCode.value}) ${input.value}`).values_[2];
                    return;
                } catch {
                    formData[input.id] = input.value;
                }
            }
            // recursive input saving for table form sections
            if (isGroupingData) {
                if (input.id.includes('-')) {
                    var column = input.id.split('-')[0];
                    var rowIndex = Number(input.id.split('-')[1]);

                    // clear rowData if it is a new row and save the previous row
                    if (currentIndex != rowIndex) {
                        tableData[rowIndex - 1] = rowData;
                        rowData = {};
                        currentIndex = rowIndex;
                    }

                    rowData[column] = inputTypeSaveHandler(input);
                } else {
                    formData[input.id] = input.value;
                }
                return;
            }

            // save each value in a key
            formData[input.id] = inputTypeSaveHandler(input)
        }
    })

    // table form save handling
    if (isGroupingData && Object.keys(rowData).length > 0) {
        tableData[currentIndex] = rowData; // save last row
        var table = currentSection.querySelector('table'); 
        formData[table.id.replace('Table', '')] = tableData;
    }

    // saving to localStorage everytime user clicks next
    var formCatalyst = cleanDataStructure(formData);
    localStorage.setItem("formData", JSON.stringify(formCatalyst));
}

// clearing attachment input before putting in localStorage
function cleanDataStructure(value) {
    if (Array.isArray(value)) {
        return value.map(cleanDataStructure);
    }

    if (value && typeof value === "object") {
        if ("file_name" in value || "mime_type" in value) return "";
        const data = {};
        for (const key in value) {
            data[key] = cleanDataStructure(value[key]);
        }

        return data;
    }

    // primitive value
    return value;
}

async function closeRestoreWindow(value) {
    fetchData();
    if (value) {
        const savedData = JSON.parse(localStorage.getItem("formData"));

        // fill input fields
        Object.keys(savedData).forEach(k => {
            var inputElement = document.getElementById(k);
            formData[k] = savedData[k];

            // does not fill in file input and tries to fill in table sections
            if (typeof savedData[k] === 'object') {
                if (Object.keys(savedData[k]).includes("file_name")) return;
                Object.entries(savedData[k]).forEach(data => {
                    Object.entries(data[1]).forEach(cell => {
                        var tableCell = document.getElementById(`${cell[0]}-${data[0]}`);

                        // creates new table row if it can't find one
                        if (!tableCell) {
                            var titleCaseSection = k.replace('Exp', "").charAt(0).toUpperCase() + k.substring(1).replace('Exp', "");
                            addTableRow(`${k}Table`, `${k.replace('Exp', "")}-row-1`, `add${titleCaseSection}Row`);
                            tableCell = document.getElementById(`${cell[0]}-${data[0]}`);
                        };
                        tableCell.value = cell[1];
                        updateMobileTable(tableCell);
                    })
                })
            }
            
            if (inputElement) {
                inputElement.value = savedData[k]
                if (inputElement.type === 'checkbox' && inputElement.id != "confirmation-agreement") {
                    inputElement.checked = (savedData[k] === "on" ? true : false);
                    inputElement.onchange();
                };
            };
        });

        if (savedData["hasEduBackground"] === "on") toggleFieldEndDate(document.getElementById('edustartperiod-1'));
        if (savedData["hasWorkExp"] === "on") toggleFieldEndDate(document.getElementById('workstartperiod-1'));

        notificationHandler("Previous draft restored.", "info");
    } else {
        localStorage.clear();
    }
    document.getElementById('restoreForm').style.display = 'none';
    document.querySelector('.layout').style.display = 'flex';
    
    setInterval(autoSaveForm, 1800000);
}

function findJob(id) {
    var job = Object.values(jobList).find(v => v["jobs_id"] === id);
    return job ?? null;
}

function updateSocialPlatforms(id, value) {
    var platform = linkList.find(p => p["utm_id"] === Number(value));
    var link = platform ? platform["link"] : null;

    document.getElementsByClassName('link-header')[Number(id.split('-')[1])-1].innerHTML = link ?? 'www.link.com/';

    // var inputs = document.querySelectorAll('select[id*=socialplatform]');
    // var selectedPlatforms = Array.from(inputs).map(p => p.value).filter(v => v !== "");

    // inputs.forEach(input => {
    //     Array.from(input.options).forEach(option => {
    //         option.disabled = false;

    //         if (option.value !== "" && option.value !== input.value && selectedPlatforms.includes(option.value)) {
    //             option.disabled = true;
    //         }
    //     })
    // })
}

function updateMobileTable(element) {
    var value = element.value;
    var mobileElement = document.getElementById(`mobile-${element.id}`);
    
    if (mobileElement === null) return;

    if (element.tagName === 'SELECT') {
        mobileElement.innerHTML = value != "" ? element.options[element.selectedIndex].innerHTML : "...";
    } else {
        mobileElement.innerHTML = value != "" ? value : "...";
    }
}

function viewJobPosition(id) {
    selectedJob = id;
    const jobListElement = document.getElementById('job-index');
    var job = findJob(id);
    
    document.getElementById('job-detail-description').innerHTML = job['job_description'];
    jobListElement.style.display = 'flex';
    jobListElement.querySelectorAll('.job-title').forEach(e => {
        e.innerHTML = job['jobs_name'];
    })
    document.getElementById('job-list').style.display = 'none';
    document.getElementById('applyBtn').style.display = 'block';
}

function backToJobList() {
    document.getElementById('job-index').style.display = 'none';
    document.getElementById('job-list').style.display = 'block';
    document.getElementById('applyBtn').style.display = 'none';
}

function selectJobPosition(id) {
    formData['job_id'] = id;
    changeStep(1);
    document.getElementById('applyBtn').style.display = 'none';
}

confirmAgreeCheckbox.addEventListener("change", () => {
    if (confirmAgreeCheckbox.checked) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
})

document.addEventListener("change", updateNextButton);

function updateNextButton() {
    var emptyFieldsLength = 0;
    currentSectionElements.forEach(element => {
        if (element.value === "" && element.hasAttribute('required')) {
            emptyFieldsLength += 1;
        }
    });
    
    if (emptyFieldsLength === 0) {
        nextBtn.disabled = false;
    } else {
        nextBtn.disabled = true;
    }
};

async function changeStep(direction) {
    if (direction === 1 && !await(validateCurrentStep(currentStep))) {
        return;
    }

    if (document.getElementById('applyBtn').style.display === 'block') document.getElementById('applyBtn').style.display = 'none';

    saveFormData();


    document.getElementById(`section${currentStep}`).classList.remove('active');
    document.getElementById(`section${currentStep}`).classList.remove('missing');

    if (document.getElementById(`section${currentStep + direction}`) != null) currentStep += direction;

    document.getElementById(`section${currentStep}`).classList.add('active');
    currentSectionElements = document.getElementById(`section${currentStep}`).querySelectorAll('input, select, textarea');
    updateNextButton();

    if (currentStep === totalSteps) showPreview();

    document.getElementById('prevBtn').style.display = currentStep === 1 ? 'none' : 'flex';
    document.getElementById('nextBtn').style.display = (currentStep === 1 || currentStep === totalSteps) ? 'none' : 'flex';
    document.getElementById('submitBtn').style.display = (currentStep === totalSteps ? 'flex' : 'none');

    updateProgress();
}

function previewColumnData(column, rowCellData, targetElement, targetElementMobile) {
    var previewData;
    switch (column) {
        case "socialplatform":
            previewData = platformList.find(p => p["utm_id"] === Number(rowCellData[column]));
            targetElement.innerHTML = previewData != null ? previewData["utm_name"] : "";
            targetElementMobile.innerHTML = previewData != null ? previewData["utm_name"] : "";
            break;
        case "sociallink":
            previewData = linkList.find(p => p["utm_id"] === Number(rowCellData["socialplatform"]));
            targetElement.innerHTML = `${previewData != null ? previewData["link"] : ""}${rowCellData[column]}`;
            targetElementMobile.innerHTML = `${previewData != null ? previewData["link"] : ""}${rowCellData[column]}`;
            break;
        case "level":
            previewData = educationLevels.find(edu => edu["edu_id"] === Number(rowCellData[column]));
            targetElement.innerHTML = previewData != null ? previewData["edu_name"] : "";
            targetElementMobile.innerHTML = previewData != null ? previewData["edu_name"] : "";
            break;
        case "sick":
            previewData = medicalList.find(h => h["medical_id"] === Number(rowCellData[column]));
            targetElement.innerHTML = previewData != null ? previewData["medical_name"] : "";
            targetElementMobile.innerHTML = previewData != null ? previewData["medical_name"] : "";
            break;
        default:
            targetElement.innerHTML = rowCellData[column] ?? '';
            targetElementMobile.innerHTML = rowCellData[column] ?? '';
            break;
    }
};

async function showPreview() {
    const test = document.getElementById('preview-screen');
    const numeralInputs = document.getElementsByClassName('numeral');
    const dateInputs = document.getElementsByClassName('date');

    // makes it into a map where each entry is a list of [0] for label and [1] for value
    Object.entries(formData).forEach(data => {
        var targetElement = document.getElementById(`${data[0]}Prev`);

        var cellData = data[1];

        // show job position
        if (data[0] === 'job_id') {
            var job = findJob(data[1]);
            targetElement.innerHTML = job ? job['jobs_name'] : '';
            return;
        }

        // show nationality
        if (data[0] === 'nationality') {
            var nationality = countryList.find(v => v['country_id'] === Number(cellData));
            targetElement.innerHTML = nationality ? nationality['country_name'] : "";
            return;
        }

        // show file name for input type file
        if (cellData instanceof File) {
            targetElement.innerHTML = cellData['name'] ?? '';
            return;
        }

        if (targetElement != null) {
            // toggle section preview
            if (data[0].includes('has')) {
                if (cellData == 'on') {
                    targetElement.style.display = 'flex';
                } else {
                    targetElement.style.display = 'none';
                }
                return;
            }

            // possibly temporary
            // toggle quick question details in preview section
            if (targetElement.id == 'Qq2detailsPrev' || targetElement.id == 'Qq4detailsPrev') {
                if (cellData != '') {
                    targetElement.parentElement.parentElement.style.display = 'flex';
                } else {
                    targetElement.parentElement.parentElement.style.display = 'none';
                }
            }

            // show value to target element
            targetElement.innerHTML = cellData ?? '';
        }

        // showing data from table inputs
        if (typeof cellData === "object") {
            // preview file
            if (Object.keys(cellData).includes('file')) {
                targetElement.innerHTML = cellData['file_name'] ?? '';
                return;
            };

            var firstRow = document.getElementById(`${data[0]}Prev-1`);
            var firstRowMobile = document.getElementById(`${data[0]}Prev-mobile-1`);

            if (firstRow == null || firstRowMobile == null) return;

            var table = firstRow.parentElement;
            var tableMobile = firstRowMobile.parentElement;

            Object.keys(cellData).forEach(e => {
                var rowCellData = cellData[e];
                targetElement = document.getElementById(`${data[0]}Prev-${e}`);
                var targetElementMobile = document.getElementById(`mobile-${data[0]}Prev-${e}`);
                
                Object.keys(rowCellData).forEach(column => {
                    // if there is no table row for the cell, create a new one
                    if (targetElement == null && targetElementMobile == null) {
                        var newElement = firstRow.cloneNode(true);
                        var newElementMobile = firstRowMobile.cloneNode(true);

                        newElement.id = newElement.id.replace('-1', `-${e}`);
                        newElementMobile.id = newElementMobile.id.replace('-1', `-${e}`);

                        [...newElement.children].forEach(row => {
                            var cellElement;
                            Object.keys(rowCellData).forEach(col => {
                                cellElement = row.querySelector(`[id*=${col}-1Prev]`);
                                if (cellElement) cellElement.id = cellElement.id.replace('-1', `-${e}`);
                            })
                        });
                        [...newElementMobile.children].forEach(row => {
                            var cellElement;
                            Object.keys(rowCellData).forEach(col => {
                                cellElement = row.querySelector(`[id*=${col}-1Prev]`);
                                if (cellElement) cellElement.id = cellElement.id.replace('-1', `-${e}`);
                            })
                        });
                        table.appendChild(newElement);
                        tableMobile.appendChild(newElementMobile);
                    }
                    targetElement = document.querySelector(`[id*=${column}-${e}Prev]`);
                    targetElementMobile = document.querySelector(`[id*=mobile-${column}-${e}Prev]`);

                    if (Object.keys(rowCellData[column]).includes('file')) {
                        targetElement.innerHTML = rowCellData[column]['file_name'] ?? '';
                    } else {
                        previewColumnData(column, rowCellData, targetElement, targetElementMobile);
                    }
                })
            })

        }
    });

    // format preview
    [...numeralInputs].forEach(input => {
        if (!isNaN(parseInt(input.innerHTML))) {
            input.innerHTML = Number(input.innerHTML).toLocaleString();
        }
    });

    [...dateInputs].forEach(input => {
        var date = new Date(input.innerHTML);
        if (date != 'Invalid Date') {
            input.innerHTML = date.toLocaleDateString();
        }
    });
}

function openTab(content) {
    if (!content) return;

    let url;

    if (content instanceof File) {
        url = URL.createObjectURL(content);
    } else if (content instanceof HTMLElement) {
        if (content.innerHTML === "") return;

        let value = content.innerHTML.trim();
        if (!/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(value)) {
            value = 'https://' + value;
        }
        url = value;
    } else if (content instanceof URL) {
        url = content.href;
    } else if (typeof content === "string") {
        let value = content.trim();
        if (!/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(value)) {
            value = 'https://' + value;
        }
        url = value;
    } else {
        return;
    }
    window.open(url, "_blank");

}

function checkForm(form) {
    var inputs = form.querySelectorAll('input, select, textarea');
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].hasAttribute('required')) {
            if (inputs[i].value == '') {
                notificationHandler('Please fill all required fields!', "error");
                return false;
            }
        }
    }
    formatData(formData);
    return true;
}

function formatDate(date) {
    var parsedDate = new Date(Date.parse(date));
    var formattedDate = parsedDate.toLocaleDateString("en-US", {year:'numeric', month:'2-digit', day:'2-digit'}).split("/");
    var newDate =`${formattedDate[2]}/${formattedDate[0]}/${formattedDate[1]}`;
    return date != "" ? newDate : "";
}

async function formatData(data) {
    var parsedPhoneNumber;
    try {
        parsedPhoneNumber = phoneUtil.parse(`(+${data["countryCode"]}) ${data["phone"]}`).values_[2];
    } catch {
        notificationHandler("Failed to submit application, please check your phone number");
        return;
    }
    submitData = {
        "job_id": data["job_id"],
        "name": data["name"],
        "email": data["email"],
        "phone": `(+${data["countryCode"]}) ${parsedPhoneNumber}`,
        "gender": data["gender"],
        "birth_place": data["birthPlace"],
        "dob": formatDate(data["dob"]),
        "nationality": data["nationality"],
        "expected_salary": data["expectedSalary"],
        "available_date": formatDate(data["availableDate"]),
        "city_assigned_consent": data["cityAssignedConsent"],
        "country_assigned_consent": data["countryAssignedConsent"],
        "quick_questions":[
            {"question": "Are you willing to let us contact your previous employer for reference?", "answer": data["Qq1"],},
            {"question": "Have you ever been involved in any legal case?", "answer": data["Qq2"],},
            {"question": "Have you previously applied to PT Kapit Mas?", "answer": data["Qq3"],},
            {"question": "Where did you first learn about the job vacancy at PT Kapit Mas?", "answer": data["Qq4"],},
            {"question": "Please provide details of involved case", "answer": data["Qq2details"],},
            {"question": "Please provide details of job vacancy knowledge", "answer": data["Qq4details"],},
        ],
        "recent_photo": await base64(data["recentPhoto"]["file"]),
        "resume": {
            "document": await base64(data["resume"]["file"]),
            "mime_type": data["resume"]["mime_type"],
            "file_name": `2.${data["resume"]["file_name"]}`,
        },
        "portofolio": data["portofolio"],
    };

    if (data["hasSocialMedia"] === "on") {
        submitData["social_media"] = Object.values(data['social'] || {}).map(s => ({
            "platform": s["socialplatform"],
            "link": `${linkList.find(p => p["utm_id"] === Number(s["socialplatform"]))["link"]}${s["sociallink"]}`,
        }));
    }

    if (data["hasEduBackground"] === "on") {
        submitData["educational_bg"] = await Promise.all(Object.values(data['edu'] || {}).map(async (e) => ({
            "edu_id": e["level"],
            "level": educationLevels.length != 0 ? (educationLevels.find(edu => edu["edu_id"] === Number(e["level"])) ? educationLevels.find(edu => edu["edu_id"] === Number(e["level"]))["edu_name"] : "") : "",
            "school_name": e["schoolname"],
            "start": formatDate(e["edustartperiod"]),
            "end": formatDate(e["eduendperiod"]),
            "remark": e["remark"],
            "max_remark": e["totalscore"],
            "document": await base64(e["edudocument"]["file"]),
            "mime_type": e["edudocument"]["mime_type"],
            "file_name": e["edudocument"]["file_name"],
        })));
    }

    if (data["hasWorkExp"] === "on") {
        submitData["work_exp"] = Object.values(data['workExp'] || {}).map(w => ({
            "company_name": w["company"],
            "position": w["jobtitle"],
            "start": formatDate(w["workstartperiod"]),
            "end": formatDate(w["workendperiod"]),
            "takehomepay": w["takehomepay"],
            "description": w["jobdesc"],
        }));
    }

    if (data["hasTraining"] === "on") {
        submitData["training"] = await Promise.all(Object.values(data["training"] || {}).map(async (t) => ({
            "institute": t["institute"],
            "scope": t["scope"],
            "description": t["trainingdesc"],
            "start": formatDate(t["trainingstartperiod"]),
            "end": formatDate(t["trainingendperiod"]),
            "document": await base64(t["trainingdoc"]["file"]),
            "mime_type": t["trainingdoc"]["mime_type"],
            "file_name": t["trainingdoc"]["file_name"],
        })));
    }

    if (data["hasHealth"] === "on") {
        submitData["health"] = Object.values(data["health"] || {}).map(h => ({
            "sickness": h["sick"],
            "description": h["healthdescription"],
        }));
    }

    submitForm();
}

async function submitForm() {
    const formSubmit = new FormData();
    for (var key in submitData) {
        if (typeof submitData[key] === "object") {
            formSubmit.append(key, JSON.stringify(submitData[key]));
            continue;
        }
        formSubmit.append(key, submitData[key]);
    }
    notificationHandler("Submitting your application...");
    submitApplication(formSubmit).then((res) => {
        console.log(res, JSON.parse(res)["message"]);
    
        document.getElementsByClassName('page')[0].classList.add('complete');
        document.getElementById('success-panel').style.display = 'block';
        document.getElementById('topbar').style.display = 'none';
        document.getElementById('sidebar').style.display = 'none';
        document.getElementById('applicationForm').style.display = 'none';

        localStorage.clear();
    }).catch((e) => {
        console.log(e);
        notificationHandler("We were not able to submit your application, please try again later.", "error");
    });
}

function addTableRow(tableId, tableRow, button) {
    const table = document.getElementById(tableId);
    const row = document.getElementById(tableRow);
    const addRowButton = document.getElementById(button).parentElement.cloneNode(true);
    const newRow = row.cloneNode(true);
    const tbody = table.lastElementChild;
    
    const mobileRow = document.getElementById(`${row.id.replace('row', 'mobile')}`);
    const newMobileRow = mobileRow.cloneNode(true);
    const mobileAddButton = document.getElementById(button).parentElement.cloneNode(true);;
    mobileAddButton.removeAttribute('id');

    // increment id per new row
    const rowId = row.id.replace('-1', '');
    const rowCount = document.querySelectorAll(`[id*="${rowId}"]`).length;

    newRow.id = row.id.replace('-1', '') + `-${rowCount + 1}`;
    newMobileRow.id = newMobileRow.id.replace('-1', `-${rowCount + 1}`);
    const content = [...newRow.children];
    content.forEach(row => {
        [...row.children].forEach(element => {
            element.classList.remove('missing');
            
            if (element.hasAttribute('id')) {
                element.id = element.id.replace('-1', `-${rowCount + 1}`);
            }

            // special condition for the custom file input
            if (element.classList.contains('file-input-wrapper')) {
                let inputElements = [...element.children];
                inputElements.forEach(e => {
                    e.classList.remove('missing');
                    if (e.hasAttribute('id')) {
                        e.id = e.id.replace('-1', `-${rowCount + 1}`);
                    }
                    if (e.hasAttribute('name')) {
                        e.name = e.name.replace('-1', `-${rowCount + 1}`);
                    };
                })
            }
        })
    });

    // mobile UI
    [...newMobileRow.children].forEach(row => {
        [...row.children].forEach(element => {
            if (element.hasAttribute('id')) {
                element.id = element.id.replace('-1', `-${rowCount + 1}`);
                element.innerHTML = "...";
            } else {
                [...element.children].forEach(e => {
                    if (e.hasAttribute('id')) {
                        e.id = e.id.replace('-1', `-${rowCount + 1}`);
                        e.innerHTML = "...";
                    }
                })
            }
        })
    })

    // clearing input values
    newRow.querySelectorAll('input, textarea').forEach(i => {
        i.value = '';

        // special logic for custom input file reset
        if (i.parentElement.classList.contains('file-input-wrapper')) {
            let button = [...i.parentElement.children][1];
            button.innerHTML = "<img src='assets/icons/upload-icon.svg' alt='x'>";
        }
    });

    newRow.querySelectorAll('input').forEach(i => {
        i.selectedIndex = '';
    })

    newRow.querySelectorAll('span').forEach(i => {
        if (i.classList.contains('file-name')) {
            i.textContent = 'No file chosen';
        }
    })

    tbody.removeChild(tbody.lastElementChild);
    mobileRow.parentElement.removeChild(mobileRow.parentElement.lastElementChild);
    
    tbody.appendChild(newRow);
    mobileRow.parentElement.appendChild(newMobileRow);
    
    tbody.appendChild(addRowButton);
    mobileRow.parentElement.appendChild(mobileAddButton);

    // update next button status
    currentSectionElements = document.getElementById(`section${currentStep}`).querySelectorAll('input, select, textarea');
    updateNextButton();
}

function removeTableRow(tableId, obj) {
    const table = document.getElementById(tableId).lastElementChild;
    const selectedRow = obj.parentNode.parentNode;
    const mobileRow = document.getElementById(selectedRow.id.replace('row', 'mobile'));
    const rowIdHeader = table.firstElementChild.id.replace('-1', '');
    const rows = table.querySelectorAll(`[id*="${rowIdHeader}"]`);
    const mobileTableRows = mobileRow.parentElement.querySelectorAll(`[id*=${mobileRow.id.split('-')[0]}-${mobileRow.id.split('-')[1]}]`);
    const selectedRowId = selectedRow.id.split('-')[2];

    if (rows.length <= 1) {
        console.log(tableId);
        const checkboxSection = document.getElementById(tableId).parentElement.parentElement.parentElement.querySelector('[id*=has]');
        const sectionContent = document.getElementById(tableId).parentElement.parentElement.id;
        const tableIdSection = tableId;
        checkboxSection.checked = false;
        toggleSection(checkboxSection, sectionContent, tableIdSection);
        return;
    }

    // deleting related data in formData before deleting the row
    [...selectedRow.children].forEach(td => {
        [...td.children].forEach(e => {
            if (e.hasAttribute('id')) {
                delete formData[e.id];
            }
        })
    })
    selectedRow.remove();
    mobileRow.remove();

    // fix table row numbering
    rows.forEach(row => {
        const thisRowNumber = row.id.split('-')[2];
        if (thisRowNumber > selectedRowId) {
            row.id = rowIdHeader + '-' + (thisRowNumber - 1);
            var cells = [...row.children];
            cells.forEach(cell => {
                var elements = [...cell.children];
                elements.forEach(element => {
                    if (element.hasAttribute('id')) {
                        // update element and formData numbering
                        delete formData[element.id];
                        var elementNumber = element.id.split('-')[1];
                        element.id = element.id.replace(`-${elementNumber}`, `-${thisRowNumber - 1}`);
                        formData[element.id] = element.value;
                    } else if (element.classList.contains('file-input-wrapper')) {
                        var e = element.querySelector('input');
                        var span = element.querySelector('span');
                        var button = element.querySelector('button');
                        var elementNumber = e.id.split('-')[1];

                        span.id = span.id.replace(`-${elementNumber}`, `-${thisRowNumber - 1}`);
                        button.id = button.id.replace(`-${elementNumber}`, `-${thisRowNumber - 1}`);
                        e.name = e.name.replace(`-${elementNumber}`, `-${thisRowNumber - 1}`);
                        e.id = e.id.replace(`-${elementNumber}`, `-${thisRowNumber - 1}`);
                    }
                })
            })
        }
    })
    mobileTableRows.forEach(row => {
        const thisRowNumber = row.id.split('-')[2];
        if (thisRowNumber > selectedRowId) {
            row.id = row.id.split('-')[0] + '-' + row.id.split('-')[1] + '-' + (thisRowNumber - 1);
            var cells = [...row.children];
            cells.forEach(cell => {
                var elements = [...cell.children];
                elements.forEach(element => {
                    if (element.hasAttribute('id')) {
                        var elementNumber = element.id.split('-')[2];
                        element.id = element.id.replace(`-${elementNumber}`, `-${thisRowNumber - 1}`);
                    } else {
                        [...element.children].forEach(e => {
                            if (e.hasAttribute('id')) {
                                var elementNumber = e.id.split('-')[2];
                                e.id = e.id.replace(`-${elementNumber}`, `-${thisRowNumber - 1}`);
                            }
                        })
                    }
                })
            })
        }
    })

    // update next button status
    currentSectionElements = document.getElementById(`section${currentStep}`).querySelectorAll('input, select, textarea');
    updateNextButton();
}

let isDragging = false;
let startY, startBottom;
const bottomSheet = document.getElementById('bottom-sheet');
const darkenBg = document.getElementById('background');
var mobileSelectedRow;

// close bottom sheet if switched from mobile to desktop ui
window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
        if (bottomSheet.classList.contains('active')) toggleBottomSheet();
        if (document.querySelector('.page').classList.contains('complete')) document.querySelector('.layout').style.flexDirection = "column";
    } else {
        if (document.querySelector('.page').classList.contains('complete')) document.querySelector('.layout').style.flexDirection = "row";
    }
})

function toggleBottomSheet(element) {
    var sheetBody = bottomSheet.querySelector('.sheet-body');
    var tableForm;
    if (element) tableForm = document.getElementById(element.id.replace('mobile', 'row'));

    bottomSheet.style.height = "500px";
    darkenBg.classList.remove('active');
    if (bottomSheet.classList.contains('active')) {
        mobileSelectedRow = "";
        bottomSheet.classList.remove('active');
        darkenBg.classList.remove('active');
    } else {
        darkenBg.classList.add('active');
        mobileSelectedRow = element;
        switch(element.id.split("-")[0]) {
            case "social":
                sheetBody.innerHTML = `
                <div class="row">
                    <div class="panel-title">
                        <h2 style="display: block; font-size: 24px;">Social Platform</h2>
                        <p>Choose your social media platform and enter your profile username below.</p>
                    </div>
                    <button type="button" class="close-btn" onclick="toggleBottomSheet()"><img src="assets/icons/cancel-icon.svg" alt="X"></button>
                </div>
                <div class="field">
                    <label for="socialplatform-mobile">Platform</label>
                    <select id="socialplatform-mobile" onfocus="this.classList.remove('missing')" required>
                        <option value="">Choose Platform</option>
                    </select>
                </div>
                <div class="field">
                    <label for="sociallink-mobile">Link Platform</label>
                    <input id="sociallink-mobile" type="text" onfocus="this.classList.remove('missing')" placeholder="Input Link" required>
                </div>
                <button class="btn" disabled type="Add" onclick="mobileAddData('${element.id}')">Add</button>
                `;
                sheetBody.querySelector('[id="socialplatform-mobile"]').innerHTML = `<option value="">Choose Platform</option>`;
                Object.values(platformList).forEach(platform => {
                    sheetBody.querySelector('[id="socialplatform-mobile"]').innerHTML += `<option value="${platform['utm_id']}">${platform['utm_name']}</option>`;
                })
                break;
            case "edu":
                sheetBody.innerHTML = `
                <div class="row">
                    <div class="panel-title">
                        <h2 style="display: block; font-size: 24px;">Educational Background</h2>
                        <p>Please provide your educational background details accurately.</p>
                    </div>
                    <button type="button" class="close-btn" onclick="toggleBottomSheet()"><img src="assets/icons/cancel-icon.svg" alt="X"></button>
                </div>
                <div class="field">
                    <label for="level-mobile">Education Level</label>
                    <select id="level-mobile" onfocus="this.classList.remove('missing')" required>
                        <option value="">Choose Level</option>
                    </select>
                </div>
                <div class="field">
                    <label for="schoolname-mobile">School Name</label>
                    <input id="schoolname-mobile" type="text" onfocus="this.classList.remove('missing')" placeholder="Input Name">
                </div>
                <div class="row">
                    <div class="field">
                        <label for="edustartperiod-mobile">Start Periode Study</label>
                        <input id="edustartperiod-mobile" onfocus="this.classList.remove('missing')" type="date">
                    </div>
                    <div class="field">
                        <label for="eduendperiod-mobile">Until Periode Study</label>
                        <input id="eduendperiod-mobile" type="date" onfocus="this.classList.remove('missing')">
                    </div>
                </div>
                <label for="edustartperiod-mobile">Start Periode Study</label>
                <div class="row fixed field">
                    <input id="remark-mobile" type="number" min="0" placeholder="0" onfocus="this.classList.remove('missing')">
                    from
                    <input id="totalscore-mobile" type="number" min="0" placeholder="0" onfocus="this.classList.remove('missing')">
                </div>
                <div class="field">
                    <label for="edudocument-mobile">Upload Document</label>
                    <div class="file-input-wrapper" onfocus="this.classList.remove('missing')">
                        <span class="file-name" id="edudocument-name-mobile">No file chosen</span>
                        <button type="button" class="file-btn" id="edudocument-btn-mobile"
                            onclick="fileUploadHandler(this, 'edudocument-name-mobile', 'edudocument-mobile')">
                            <img src="assets/icons/upload-icon.svg" alt="Upload">
                        </button>
                        <input type="file" name="edudocument-mobile" id="edudocument-mobile"
                            onchange="fileOnChanged(this, 'edudocument-name-mobile', 'edudocument-btn-mobile')" required
                            accept=".pdf" onfocus="this.classList.remove('missing')">
                    </div>
                    <p class="text-secondary">Max. Size 2MB with format .PDF</p>
                </div>
                <button class="btn" disabled type="Add" onclick="mobileAddData('${element.id}')">Add</button>
                `;
                sheetBody.querySelector('[id="level-mobile"]').innerHTML = `<option value="">Choose Level</option>`;
                Object.values(educationLevels).forEach(platform => {
                    sheetBody.querySelector('[id="level-mobile"]').innerHTML += `<option value="${platform['edu_id']}">${platform['edu_name']}</option>`;
                })
                break;
            case "work":
                sheetBody.innerHTML = `
                <div class="row">
                    <div class="panel-title">
                        <h2 style="display: block; font-size: 24px;">Work Experience</h2>
                        <p>Please provide details of your previous work experience.</p>
                    </div>
                    <button type="button" class="close-btn" onclick="toggleBottomSheet()"><img src="assets/icons/cancel-icon.svg" alt="X"></button>
                </div>
                <div class="field">
                    <label for="company-mobile">Company Name</label>
                    <input id="company-mobile" type="text" onfocus="this.classList.remove('missing')" placeholder="Input Name">
                </div>
                <div class="field">
                    <label for="jobtitle-mobile">Job Title</label>
                    <input id="jobtitle-mobile" type="text" onfocus="this.classList.remove('missing')" placeholder="Input Name">
                </div>
                <div class="row">
                    <div class="field">
                        <label for="workstartperiod-mobile">Start Periode</label>
                        <input id="workstartperiod-mobile" onfocus="this.classList.remove('missing')" type="date">
                    </div>
                    <div class="field">
                        <label for="workendperiod-mobile">End Periode</label>
                        <input id="workendperiod-mobile" onfocus="this.classList.remove('missing')" type="date">
                    </div>
                </div>
                <div class="field">
                    <label for="takehomepay-mobile">Take Home Pay</label>
                    <div class="phone hover">
                        <div
                            style="margin:0px; padding: 10px; border-right: 1px solid #e5e7eb; font-weight: 500;">
                            Rp</div>
                        <input type="number" id="takehomepay-mobile" name="takehomepay-mobile" min="0"  placeholder="0"
                            required onfocus="this.classList.remove('missing')">
                    </div>
                </div>
                <div class="field">
                    <label for="jobdesc-mobile">Description</label>
                    <textarea maxlength="350" id="jobdesc-mobile" required onfocus="this.classList.remove('missing')"></textarea>
                </div>
                <button class="btn" disabled type="Add" onclick="mobileAddData('${element.id}')">Add</button>
                `;
                break;
            case "training":
                sheetBody.innerHTML = `
                <div class="row">
                    <div class="panel-title">
                        <h2 style="display: block; font-size: 24px;">Training</h2>
                        <p>Please provide details of the training or course you have.</p>
                    </div>
                    <button type="button" class="close-btn" onclick="toggleBottomSheet()"><img src="assets/icons/cancel-icon.svg" alt="X"></button>
                </div>
                <div class="row">
                    <div class="field">
                        <label for="trainingstartperiod-mobile">Start Periode</label>
                        <input id="trainingstartperiod-mobile" type="date" onfocus="this.classList.remove('missing')">
                    </div>
                    <div class="field">
                        <label for="trainingendperiod-mobile">End Periode</label>
                        <input id="trainingendperiod-mobile" type="date" onfocus="this.classList.remove('missing')">
                    </div>
                </div>
                <div class="field">
                    <label for="institute-mobile">Institute Name</label>
                    <input id="institute-mobile" type="text" placeholder="Input Name" onfocus="this.classList.remove('missing')">
                </div>
                <div class="field">
                    <label for="scope-mobile">Scope Training</label>
                    <input id="scope-mobile" type="text" placeholder="Input Name" onfocus="this.classList.remove('missing')">
                </div>
                <div class="field">
                    <label for="trainingdesc-mobile">Description</label>
                    <textarea maxlength="350" id="trainingdesc-mobile" onfocus="this.classList.remove('missing')"></textarea>
                </div>
                <div class="field">
                    <label for="trainingdoc-mobile">Upload Document</label>
                    <div class="file-input-wrapper" onfocus="this.classList.remove('missing')">
                        <span class="file-name" id="trainingdoc-name-mobile">No file chosen</span>
                        <button type="button" class="file-btn" id="trainingdoc-btn-mobile"
                            onclick="fileUploadHandler(this, 'trainingdoc-name-mobile', 'trainingdoc-mobile')">
                            <img src="assets/icons/upload-icon.svg" alt="Upload">
                        </button>
                        <input type="file" name="trainingdoc-mobile" id="trainingdoc-mobile"
                            onchange="fileOnChanged(this, 'trainingdoc-name-mobile', 'trainingdoc-btn-mobile')" required
                            accept=".pdf" onfocus="this.classList.remove('missing')">
                    </div>
                    <p class="text-secondary">Max. Size 2MB with format .PDF</p>
                </div>
                <button class="btn" disabled type="Add" onclick="mobileAddData('${element.id}')">Add</button>
                `;
                break;
            case "health":
                sheetBody.innerHTML = `
                <div class="row">
                    <div class="panel-title">
                        <h2 style="display: block; font-size: 24px;">Health Information</h2>
                        <p>Please provide your health information accurately for record purposes.</p>
                    </div>
                    <button type="button" class="close-btn" onclick="toggleBottomSheet()"><img src="assets/icons/cancel-icon.svg" alt="X"></button>
                </div>
                <div class="field">
                    <label for="sick-mobile">Sick Type</label>
                    <select id="sick-mobile" onfocus="this.classList.remove('missing')" required>
                        <option value="">Choose Platform</option>
                    </select>
                </div>
                <div class="field">
                    <label for="healthdescription-mobile">Description</label>
                    <textarea maxlength="350" id="healthdescription-mobile" onfocus="this.classList.remove('missing')" type="text" placeholder="Input Description"></textarea>
                </div>
                <button class="btn" disabled type="Add" onclick="mobileAddData('${element.id}')">Add</button>
                `;
                sheetBody.querySelector('[id="sick-mobile"]').innerHTML = `<option value="">Choose Platform</option>`;
                Object.values(medicalList).forEach(platform => {
                    sheetBody.querySelector('[id="sick-mobile"]').innerHTML += `<option value="${platform['medical_id']}">${platform['medical_name']}</option>`;
                })
                break;
            default:
                break;
        }

        // fill in existing data to bottom sheet form
        [...sheetBody.querySelectorAll('input, select, textarea')].forEach(input => {
            var formInput = tableForm.querySelector(`[id="${input.id.replace('mobile', element.id.split('-')[2])}"]`);
            
            if (input.type === "file") {
                if (formInput.files.length) {
                    const dt = new DataTransfer();
                    dt.items.add(formInput.files[0]);
                    input.files = dt.files;
                    fileOnChanged(input);
                }
            } else {
                input.value = formInput.value;
            }
        })
        toggleBottomSheetButton();
        bottomSheet.scrollTop = 0;
        bottomSheet.classList.add('active');
    }
}

function mobileAddData(element) {
    var formElement = document.getElementById(element.replace('mobile', 'row'));
    var sheetInputs = bottomSheet.querySelectorAll('input, select, textarea');
    var hasEmptyFields = false;

    [...sheetInputs].forEach(input => {
        if (input.value === "") {
            hasEmptyFields = true;
            input.classList.add('missing');
        };
        if (!hasEmptyFields) {
            var formInputId = input.id.replace("mobile", formElement.id.split('-')[2]);
            var formInput = formElement.querySelector(`[id="${formInputId}"]`);
            if (input.type === "file") {
                if (input.files.length) {
                    const dt = new DataTransfer();
                    dt.items.add(input.files[0]);
                    formInput.files = dt.files;
                    fileOnChanged(formInput);
                } else {
                    hasEmptyFields = true;
                }
            } else {
                formInput.value = input.value;
            }
            updateMobileTable(formInput);
        }
    });
    if (!hasEmptyFields) {
        toggleBottomSheet();
        currentSectionElements = document.getElementById(`section${currentStep}`).querySelectorAll('input, select, textarea');
        updateNextButton();
    } else {
        notificationHandler("Please input required fields!", "error");
    }
}

bottomSheet.addEventListener("change", toggleBottomSheetButton);

function toggleBottomSheetButton() {
    const bottomSheetInputs = bottomSheet.querySelectorAll('input, select, textarea');
    
    const addBtn = bottomSheet.querySelector('.btn');
    var emptyFieldsLength = 0;
    bottomSheetInputs.forEach(element => {
        if (element.value === "" && element.hasAttribute('required')) {
            emptyFieldsLength += 1;
        }
    });

    if (emptyFieldsLength === 0) {
        addBtn.disabled = false;
    } else {
        addBtn.disabled = true;
    }
};

document.querySelector('.sheet-grabber').addEventListener("touchstart", startDragging);
document.querySelector('.sheet-grabber').addEventListener("mousedown", startDragging);

function startDragging(e) {
    e.preventDefault();
    isDragging = true;
    startY = e instanceof TouchEvent ? e.touches[0].clientY : e.clientY;
    startBottom = parseInt(getComputedStyle(bottomSheet).height);

    if (e instanceof TouchEvent) {
        document.addEventListener("touchmove", drag);
        document.addEventListener("touchend", stopDragging);
    } else {
        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", stopDragging);
    }
}

function drag(e) {
    if (!isDragging) return;
    if (Number(bottomSheet.style.height.replace('px', '')) < 100) {
        toggleBottomSheet();
        stopDragging();
        return;
    };
    const deltaY = (e instanceof TouchEvent ? e.touches[0].clientY : e.clientY) - startY;
    bottomSheet.style.height = Math.min(Math.max(startBottom - deltaY, 0), window.innerHeight) + "px";
}

function stopDragging() {
    isDragging = false;
    document.removeEventListener("touchmove", drag);
    document.removeEventListener("touchend", stopDragging);

    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseend", stopDragging);
}

updateProgress();
