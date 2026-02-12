let currentStep = 1;
const totalSteps = 11;
const formData = {};
const countryData = {};
let jobList = {};
let countryList = [];
const educationLevels = [];
const platformList = [];
const medicalList = [];
let selectedJob = "";
var topBarExpanded = false;


const formCheck = new FormData();
formCheck.append("name", "Test Guy");
formCheck.append("job_id", 8);
formCheck.append("email", "test.guy@example.com");
formCheck.append("phone", "(62) 0812345678");

const dummyData = {
    "job_id": 1,
    "name": "Joseph",
    "gender": "male",
    "email": "email@example.com",
    "countryCode": "62",
    "phone": "89147951",
    "birthPlace": "Jakarta",
    "dob": "1998-12-03",
    "nationality": 1,
    "hasSocialMedia": "on",
    "social": {
        "1": {
            "socialplatform": 5,
            "sociallink": "www.twitter.com/banana"
        }
    },
    "hasEduBackground": "on",
    "edu": {
        "1": {
            "level": 1,
            "schoolname": "SD Harapan Bangsa",
            "edustartperiod": "2002-06-01",
            "eduendperiod": "2009-06-02",
            "remark": 70,
            "totalscore": 90,
            "edudocument": {
                "file_name": "document.pdf",
                "mime_type": "application/pdf",
                "file": "",
            }
        },
        "2": {
            "level": 1,
            "schoolname": "SD Harapan Bangsa",
            "edustartperiod": "2002-06-01",
            "eduendperiod": "2009-06-02",
            "remark": 70,
            "totalscore": 90,
            "edudocument": {
                "file_name": "document.pdf",
                "mime_type": "application/pdf",
                "file": "",
            }
        }
    },
    "hasWorkExp": "on",
    "workExp": {
        "1": {
            "workstartperiod": "2018-02-10",
            "workendperiod": "2019-03-12",
            "company": "Corpo",
            "jobtitle": "Banana",
            "takehomepay": 1000000,
            "jobdesc": "Banana"
        }
    },
    "hasTraining": "on",
    "training": {
        "1": {
            "trainingstartperiod": "2025-01-01",
            "trainingendperiod": "2025-02-01",
            "institute": "Training o",
            "scope": "buss",
            "trainingdesc": "boasf",
            "trainingdoc": {
                "file_name": "training.pdf",
                "mime_type": "application/pdf",
                "file": "",
            }
        }
    },
    "expectedSalary": 10000000,
    "availableDate": "2026-03-01",
    "cityAssignedConsent": "Yes",
    "countryAssignedConsent": "Yes",
    "hasHealth": "on",
    "health": {
        "1": {
            "sick": 1,
            "healthdescription": "hhoohohoho"
        },
        "2": {
            "sick": 2,
            "healthdescription": "sick ouch"
        }
    },
    "Qq1": "Yes",
    "Qq2": "Yes",
    "Qq2details": "Banana",
    "Qq3": "No",
    "Qq4": "Other",
    "Qq4details": "Banana",
    "recentPhoto": {
        "file_name": "photo.png",
        "mime_type": "image/png",
        "file": "",
    },
    "resume": {
        "file_name": "resume.pdf",
        "mime_type": "application/pdf",
        "file": "",
    },
    "portofolio": "www.porto.com"
}

function fillDummyData() {
    Object.keys(dummyData).forEach(key => {
        if (document.getElementById(key)) {
            document.getElementById(key).value = dummyData[key];
        }
    })
}

var submitData = {
    "job_id": 1,
    "name": "John Doe",
    "email": "Email@example.com",
    "phone": "(62) 8120487531",
    "gender": "male",
    "birth_place": "Bandung",
    "dob": "2026/10/9",
    "nationality": 1,
    "social_media": [{
        "platform": 4,
        "link": "www.instagram.com",
    }],
    "educational_bg": [{
        "level": "Bachelor (S1)",
        "school_name": "Universitas Mantap Jiwa",
        "start": "2021/10/1",
        "end": "2025/10/12",
        "remark": 90,
        "max_remark": 100,
        "document": "R0lGODlhtABkAPcAAAAAAAAAMwAAZgAAmQAAzAAA/wArAAArMwArZgArmQArzAAr/wBVAABVMwBVZgBVmQBVzABV/wCAAACAMwCAZgCAmQCAzACA/wCqAACqMwCqZgCqmQCqzACq/wDVAADVMwDVZgDVmQDVzADV/wD/AAD/MwD/ZgD/mQD/zAD//zMAADMAMzMAZjMAmTMAzDMA/zMrADMrMzMrZjMrmTMrzDMr/zNVADNVMzNVZjNVmTNVzDNV/zOAADOAMzOAZjOAmTOAzDOA/zOqADOqMzOqZjOqmTOqzDOq/zPVADPVMzPVZjPVmTPVzDPV/zP/ADP/MzP/ZjP/mTP/zDP//2YAAGYAM2YAZmYAmWYAzGYA/2YrAGYrM2YrZmYrmWYrzGYr/2ZVAGZVM2ZVZmZVmWZVzGZV/2aAAGaAM2aAZmaAmWaAzGaA/2aqAGaqM2aqZmaqmWaqzGaq/2bVAGbVM2bVZmbVmWbVzGbV/2b/AGb/M2b/Zmb/mWb/zGb//5kAAJkAM5kAZpkAmZkAzJkA/5krAJkrM5krZpkrmZkrzJkr/5lVAJlVM5lVZplVmZlVzJlV/5mAAJmAM5mAZpmAmZmAzJmA/5mqAJmqM5mqZpmqmZmqzJmq/5nVAJnVM5nVZpnVmZnVzJnV/5n/AJn/M5n/Zpn/mZn/zJn//8wAAMwAM8wAZswAmcwAzMwA/8wrAMwrM8wrZswrmcwrzMwr/8xVAMxVM8xVZsxVmcxVzMxV/8yAAMyAM8yAZsyAmcyAzMyA/8yqAMyqM8yqZsyqmcyqzMyq/8zVAMzVM8zVZszVmczVzMzV/8z/AMz/M8z/Zsz/mcz/zMz///8AAP8AM/8AZv8Amf8AzP8A//8rAP8rM/8rZv8rmf8rzP8r//9VAP9VM/9VZv9Vmf9VzP9V//+AAP+AM/+AZv+Amf+AzP+A//+qAP+qM/+qZv+qmf+qzP+q///VAP/VM//VZv/Vmf/VzP/V////AP//M///Zv//mf//zP///wAAAAAAAAAAAAAAACH5BAEAAPwALAAAAAC0AGQAAAj/AAEIBLBvn8CCBQcORGhQIcGGByEubMhQYcKHDC9GvFjRIUeJFkE+dDhyIkmNJUN+RJlR5EeSETe6RHhSIsqYGG1SbKlz5UycNYN61CkU6ESfKmkONRpSZs2bKaPi7DiVZ1KnS6WazNp0a1emObHKhPoSJtKhZIlmpVqSZ8+dacGCjeu1btqzY39qrXpX71y4at1eDbtW5N+iWlnOxJuTLlS+i/0mBtxV8FHKhWFORkz3L+OWQh+3VTr462bCkNl2ZFtVc2e7kvuKbaxXNOPZRh2THg36Mu7RriXnjh15du/KhnkX53paNWDnt4GbFR71tWzUtEMnj866eu3dPqFj/0YeHPFwzsvF6y6P/bdi7e9pK+a+k73p88yvq//Ovrt/tcjFZxlW/8l1mmnWpQdeRtr1t5t7AG7lXF7zjSfhdtTFh6CCFa43HYQJwheYVb61J515B6ao34IF7qXcU8SJGCCDJbZoW4YR4jfYfg1+aGKLh2EXHosWtubjfd6hB6NxNJLn438hFiYgiQQ+eCJzQWY52WdNXujgdRvKeOFxhNmIIYoawrakkF0aKWZpako5IpmrWVkWmjHmx+FbHr5ZYphyzigehAa+pmOcOxLZZ6Bo5TmjoEQS6qKhSeq5Jo+ZPWnnpkhySeFbkt6IZ6c5lqkof5qCieiYc3ZZ56KkKv9paaNMmvnlcoA+yuqgP9Z3ZF2HBmtqh6j6KWmQE8oHaq+F4hgrsMPyWSyjcArrqbKJwgptlLnWeGqPxjK7rYVDVhjqmVhW2m2VxIJL7Z+rQgapueKKmm6a1iqFqZPhAtncgp9mO+2z66rrbbuZ9svpuEwGfPDADM9a8KvSuqtrtQbLu2uk9aJLsIp7JqWtxhjj++LG9Nr6q5bcPiwyxCTDm2/D2Lqc8L2OxhvtyxazuubE5D7HscqjSqwzxTzffLHMGZ+c2tAL2/txy+xWrLTPtBodc7nLEo2zrEBz6fXSx/47JZ36Ru1xxCyHfNnITjNt8rUD7ny1ljOPK7bat/7/fHTQDlfdM95Nz502wvy+W7ZuZ7t6OMwp5u1Z0GNjXXKpdFNpd+IfS74l5XyniuvfNNeN9N2RF47540lzbrncq5eu+emuE244qXvDTR/VcXMt8OCp36436LoXKS6yANcsOOqUCj95raErzHvmaNPXbNFtX/ot88b7y3irvFZue+zDQ188iDlvLXTK0X+tteq5Q757+r2v33X7nauOO/Hyd78w8o0LH/7YRrrysUl8cVvcdwIItfO5L3tZ25eXROe3vCXLdKzjHvZApj3ETVB69KOe46w3KWcRcEUedJPijmc28DWwfxucXgbzArz5ge11vrNZ7YJHvucdcIAxU6CfnnK4vB02r4efMx8MeyVD2VXPf9d7IAcjuD0j+q+JbArc5j4oRc+h0GpWRN8N1adF2nExf85L4g8dCKUQAk55W1QhGpH4xdad8XVCfBcR43ilOU7NbTTUIBPd6MQRQrGEMXRj/Gp4RUJmEY5mlCMBvQjI7AiyjWOsXxlneMfx/bGDYOxkAln4vXndz4GffJ8ZySTJIJJygS5kHypPqEj+/zFSjKp8IwZJKDVaZnKVbeojHl85RPv9TpCpDJstL7kpLF5wdpxsJQ+TqUNLhnGQv9QlNHm5NggqU4m3xGYuCynAWXrzb4tkpqosmLxdHrKX58xXOq+JyXE+0p3nso8vczlPUdrQns98Yj5XNsVvrnGJ9QQaOV8YTmrKc5n0bKYjA2rIgW6QkqC0owrdwtGOevSjIA2pSEdK0pKa9KQoTalKV8rSlrr0pTCNqUxnStOa2vSmOM2pTk+6DoXEoSW6GMgDGKIPKmjmAdFoCS2Q2pKeDuSnGWHHQASQ1H0U9ag7zapJFUESCyDkqgoJwCkKAlaSDDUjwQDAWRnCVYd4Ff8hQQ3rWMvqEKZq9a4fTStVCyIPgUC1p3YNKgQ4WtS9MiSuCahqQfRa1b4CAKrzUIFYCxLUBLilsIrFq2Zbog9CCGCsCOnpEazq2VB8lQqGzYg+uArVgkQWABSgwlpJ+1mGiJayj2VrAEyrWtZu9recpUJiGSJVI1wWtZlFiFTfCtfHFtWuVhVuZqUKB6sqIrX7KG5Llgvc7no0rZvgyWoBMNrg7va4s3VLWn/63OkCgLlkpcJ5vUvfjMxDtsmVqkCMy5PbHne4HI3sWfOhAssyhMCDtS1568vg+GJ3sQqprmrly1vxyrajmHWtCqC7j8jCt6jzbbB3M8xR/ba2INzOJSx+j5va+6Y3H1RIMIrfK2L6SjW9bukrfPcR1BO3BMY4nnF620tcGjfXxzXGa1pl7NHIMpnE/03uPpbM2etmtqf8je6Dk6xVWiy4JZHFbk/h62GPPlepX0ZzazsrgAqXmcuaTWuWW8JVuwoDACHeR1/nbGEAQ5jPDOnrfIM62z3DGa90VchbX+uQ8iJkFwAIL4YvfFrNMDeuA8kzeA99V/3CZK3jFUieKTvZSUPX0yRhsqcfTItSc/rVsI61rGdN61rb+ta4zrWud82TgAAAOw==",
        "mime_type": "application/pdf",
        "file_name": "edu_document.pdf",
    }],
    "work_exp": [{
        "company_name": "Corpo",
        "position": "Job",
        "start": "2025/10/12",
        "end": "2026/2/23",
        "takehomepay": 9000000,
        "description": "Lorem Ipsum",
    }],
    "training": [{
        "institute": "training",
        "scope": "manager",
        "description": "Lorem ipsum",
        "start": "2023/8/23",
        "end": "2024/5/23",
        "document": "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",
        "mime_type": "application/pdf",
        "file_name": "training-doc.pdf",
    }],
    "expected_salary": 10000000,
    "available_date": "2026/3/1",
    "city_assigned_consent": "Yes",
    "country_assigned_consent": "Yes",
    "health": [{
        "sickness": 1,
        "description": "Lorem Ipsum",
    }],
    "quick_question_1": "Yes",
    "quick_question_2": "No",
    "quick_question_3": "No",
    "quick_question_4": "LinkedIn",
    "question_detail_2": "",
    "question_detail_4": "",
    "recent_photo": {
        "document": "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",
        "mime_type": "image/png",
        "file_name": "1.photo.png",
    },
    "resume": {
        "document": "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",
        "mime_type": "application/pdf",
        "file_name": "2.resume.pdf",
    },
    "portofolio": "www.porto.com",
};

async function submitDebug() {
    const response = await fetch("http://192.168.1.8/applicant/apply", {
        method: 'POST',
        body: JSON.stringify(submitData),
    }).then((response) => {
        console.log(response);
    }).catch((e) => {
        console.log(e);
    });
}

// json handling
const phoneCountryCode = document.getElementById('countryCode');
const nationalityList = document.getElementById('nationality');
const countryIcon = document.getElementById('countryIcon');
const countryIconPrev = document.getElementById('countryIconPrev');

async function fetchJobList() {
    const response = await fetch('http://192.168.1.8/applicant/jobs_list', {
        method: 'GET',
    });

    return await response.json();
}

async function fetchCountryCode() {
    const response = await fetch('http://192.168.1.8/applicant/res_country');
    return await response.json();
}

async function fetchEducationLevel() {
    const response = await fetch('http://192.168.1.8/applicant/education_level');
    return await response.json();
}

async function fetchSocialPlatform() {
    const response = await fetch('http://192.168.1.8/applicant/utm_list');
    return await response.json();
}

async function fetchMedicalList() {
    const response = await fetch ('http://192.168.1.8/applicant/medical_list');
    return await response.json();
}

async function checkApplicant() {
    formCheck.set("job_id", formData['job_id']);
    formCheck.set("name", document.getElementById('name').value);
    formCheck.set("email", document.getElementById('email').value);
    formCheck.set("phone", `(${document.getElementById('countryCode').value})${document.getElementById('phone')}`);
    // formCheck.set("job_id", 1);
    // formCheck.set("name", 'Ethasdn Carter');
    // formCheck.set("email", 'ethsdan.carter@example.com');
    // formCheck.set("phone", '987sd891');
    var data;
    const response = await fetch('http://192.168.1.8/applicant/check', {
        method: 'POST',
        body: formCheck,
    }).then((res) => {
        data = res.json().then((value) => {
            return value;
        });
    }).catch((e) => {
        // alert(e);
        data[0] = {"message": `An error has occured: ${e}`, "status": "reject"};
    });

    return (await data)[0];
}

fetchCountryCode().then((response) => {
    countryList = response['country_list'];
    countryList.sort((a, b) => {
        var value = a["country_phone"] > b["country_phone"];
        // console.log(value);
        return value ? 1 : -1;
    });
    if (countryList.length > 0) {
        phoneCountryCode.innerHTML = '<option value="">#</option>';
        nationalityList.innerHTML = '<option value="">Select your nationality</option>';
        [...countryList].forEach(country => {
            phoneCountryCode.innerHTML += `<option value=${country['country_phone']}>${country['country_phone']} (${country['country_code']})</option>`;
            nationalityList.innerHTML += `<option value=${country['country_id']}>${country['country_name']}</option>`;
        })
    }
});

fetchJobList().then((response) => {
    jobList = response['open_jobs'];
    if (jobList.length < 1) {
        document.getElementById('loading-job-display').style.display = 'none';
        document.getElementById('no-job-display').style.display = 'flex';
    } else {
        document.getElementById('no-job-display').style.display = 'none';
        document.getElementById('loading-job-display').style.display = 'none';
    }
    var jobListElement = document.getElementById('job-list');
    var jobEntry = document.getElementsByClassName('job-entry')[0];
    [...jobList].forEach(job => {
        var newEntry = jobEntry.cloneNode(true);
        newEntry.style.display = 'block';
        newEntry.setAttribute('onclick', `viewJobPosition(${job['jobs_id']})`);
        newEntry.innerHTML =
        `<h3 class="job-title">${job['jobs_name']}</h3>
        <p>${job['job_description']}</p>`;
        jobListElement.appendChild(newEntry);
    })
}).catch((e) => {
    document.getElementById('loading-job-display').style.display = 'none';
    document.getElementById('no-job-display').style.display = 'flex';
});

fetchEducationLevel().then((response) => {
    Object.keys(response["education_level"]).forEach(key => {
        educationLevels[key] = response["education_level"][key];
    })

    var eduLevelElement = document.getElementById('level-1');
    eduLevelElement.innerHTML = '<option value="">Choose level</option>';
    Object.values(educationLevels).forEach(level => {
        eduLevelElement.innerHTML += `<option value=${level['edu_id']}>${level['edu_name']}</option>`;

    })
})

fetchSocialPlatform().then((response) => {
    Object.keys(response["utm_list"]).forEach(key => {
        platformList[key] = response["utm_list"][key];
    })
    
    var socialElement = document.getElementById('socialplatform-1');
    socialElement.innerHTML = '<option value="">Choose Platform</option>';
    Object.values(platformList).forEach(platform => {
        socialElement.innerHTML += `<option value="${platform['utm_id']}">${platform['utm_name']}</option>`;
    })
})

fetchMedicalList().then((response) => {
    Object.keys(response["medical_type"]).forEach(key => {
        medicalList[key] = response["medical_type"][key];
    })

    var healthElement = document.getElementById('sick-1');
    healthElement.innerHTML = '<option value ="">Choose sickness type</option>';
    Object.values(medicalList).forEach(health => {
        healthElement.innerHTML += `<option value="${health['medical_id']}">${health['medical_name']}</option>`;
    })
})

function changeCountryIcon() {
    var flag;

    [...countryList].forEach(country => {
        // console.log(country['country_phone']);
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
    const table = document.getElementById(id);
    const inputs = table.querySelectorAll('input, select, textarea');
    if (self.checked) {
        document.getElementById(content).style.display = 'block';
        inputs.forEach(input => {
            input.required = true;
            if (input.parentElement.classList.contains('file-input-wrapper')) {
                fileOnChanged(input);
            }
        })
        self.value = 'on';
    } else {
        document.getElementById(content).style.display = 'none';
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
        })
        self.value = 'off';
    }
}

// file upload handler
function fileUploadHandler(self) {
    // get parent and then children list
    var parent = self.parentElement;
    var elements = [...parent.children];

    var input = elements[2];
    var label = elements[0];

    if (input.files.length) {
        input.value = '';
        label.textContent = "No file chosen";
        self.innerHTML = "<img src='assets/icons/upload-icon.svg' alt='Upload'>"
    } else {
        input.click();
    }
}

// custom input type file logic
function fileOnChanged(self) {
    var parent = self.parentElement;
    var elements = [...parent.children];

    var button = elements[1];
    var label = elements[0];

    if (self.files.length) {
        label.textContent = self.files[0].name;
        self.classList.remove('missing');
        parent.classList.remove('missing');
        button.innerHTML = "<img src='assets/icons/cancel-icon.svg' alt='x'>"
    } else {
        label.textContent = 'No file chosen';
        button.innerHTML = "<img src='assets/icons/upload-icon.svg' alt='x'>"
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

// toggle top bar
function toggleTopBar() {
    var topBar = document.getElementById('topbar');

    if (topBarExpanded) {
        [...topBar.children].forEach(entry => {
            if (entry.classList.contains('topbar-entry')) {
                topBar.removeChild(entry);
            }
        })
        topBarExpanded = false;
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
        topBarExpanded = true;
    }

}

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

async function validateCurrentStep(step) {
    const currentSection = document.getElementById(`section${currentStep}`);
    const allInputs = currentSection.querySelectorAll('input, select, textarea');
    const requiredInputs = currentSection.querySelectorAll('[required]');
    let hasInvalidInput = false;

    // refresh field status
    for (var input of allInputs) {
        input.classList.remove('missing');
    }

    for (var input of requiredInputs) {
        if (!input.value.trim()) {
            // input.focus();
            input.classList.add('missing');

            // alert('Please fill in all required fields.');
            hasInvalidInput = true;
        }
    }

    if (hasInvalidInput == false) {
        hasInvalidInput = await sectionValidator(step)
    };

    if (hasInvalidInput == false) {
        return true;
    } else {
        return false;
    }
}

function notificationHandler(message, status) {
    var notification = document.getElementById('notification');
    var backgroundColor;
    switch (status) {
        case "info": 
            backgroundColor = '#4CAF50';
            break;
        case "warning": 
            backgroundColor = '#ff4d4f';
            break;
        default: 
            backgroundColor = '#4CAF50';
            break;
    }

    notification.style.backgroundColor = backgroundColor;
    notification.innerHTML = message;
    notification.classList.add("active");

    setTimeout(() => {
        notification.classList.remove("active");
    }, 5000);
}

function fieldMissing(element) {
    element.classList.add('missing');
}

async function sectionValidator(step) {
    let hasInvalidField = false;

    // some section with simple inputs skip extra validation
    switch (step) {
        case 2: 
            // personal information
            if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById('email').value)) {
                fieldMissing(document.getElementById('email'));
                hasInvalidField = true;
            }
            // if (!/^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(document.getElementById('phone').value)) {
            //     fieldMissing(document.getElementById('phone'));
            //     hasInvalidField = true;
            // }
            if (Date.parse(document.getElementById('dob').value) > Date.now()) {
                fieldMissing(document.getElementById('dob'));
                hasInvalidField = true;
            }    
            
            // check applicant if previously applied
            hasInvalidField = checkApplicant().then((value) => {
                
                if (value["state"] === "allow") {
                    notificationHandler(value["message"], "info");
                    return false;
                } else {
                    notificationHandler(value["message"], "warning");
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

            periodStarts.forEach(inp => {
                var start = Date.parse(inp.value);
                var end = Date.parse(periodEnds[periodStarts.indexOf(inp)].value);
                if (start > end) {
                    fieldMissing(inp);
                    fieldMissing(periodEnds[periodStarts.indexOf(inp)]);
                    hasInvalidField = true;
                }
            })
            remarks.forEach(inp => {
                var remark = Number(inp.value);
                var total = Number(totalRemarks[remarks.indexOf(inp)].value);
                if (remark < 0 || total < 0) {
                    fieldMissing(inp);
                    fieldMissing(totalRemarks[remarks.indexOf(inp)]);
                    hasInvalidField = true;
                }
                if (remark > total) {
                    fieldMissing(inp);
                    fieldMissing(totalRemarks[remarks.indexOf(inp)]);
                    hasInvalidField = true;
                }
            })
            var inputs = document.getElementById('eduTable').querySelectorAll('input[type="file"][required]');
            inputs.forEach(inp => {
                if ((inp.files[0].size) > 2097152 || inp.files[0].type != "application/pdf") {
                    fieldMissing(inp);
                    hasInvalidField = true;
                }
            })
            break;
        case 5: 
            // work experience
            var periodStarts = [...document.getElementById('workExpTable').querySelectorAll('[id*=workstartperiod]')];
            var periodEnds = [...document.getElementById('workExpTable').querySelectorAll('[id*=workendperiod]')];
            var takeHomePay = [...document.getElementById('workExpTable').querySelectorAll('[id*=takehomepay]')];
            periodStarts.forEach(inp => {
                var start = Date.parse(inp.value);
                var end = Date.parse(periodEnds[periodStarts.indexOf(inp)].value);
                if (start > end) {
                    fieldMissing(inp);
                    fieldMissing(periodEnds[periodStarts.indexOf(inp)]);
                    hasInvalidField = true;
                }
            })
            takeHomePay.forEach(inp => {
                if (inp.value < 0) {
                    fieldMissing(inp);
                    hasInvalidField = true;
                }
            })
            break;
        case 6: 
            // training
            var periodStarts = [...document.getElementById('trainingTable').querySelectorAll('[id*=trainingstartperiod]')];
            var periodEnds = [...document.getElementById('trainingTable').querySelectorAll('[id*=trainingendperiod]')];

            periodStarts.forEach(inp => {
                var start = Date.parse(inp.value);
                var end = Date.parse(periodEnds[periodStarts.indexOf(inp)].value);
                if (start > end) {
                    fieldMissing(inp);
                    fieldMissing(periodEnds[periodStarts.indexOf(inp)]);
                    hasInvalidField = true;
                }
            })
            var inputs = document.getElementById('trainingTable').querySelectorAll('input[type="file"][required]');
            inputs.forEach(inp => {
                if ((inp.files[0].size) > 2097152 || inp.files[0].type != "application/pdf") {
                    fieldMissing(inp);
                    hasInvalidField = true;
                }
            })
            break;
        case 7: 
            // job expectations
            if (Number(document.getElementById('expectedSalary').value) < 0) {
                fieldMissing(document.getElementById('expectedSalary'));
                hasInvalidField = true;
            }
            if (Date.parse(document.getElementById('availableDate')) < Date.now()) {
                fieldMissing(document.getElementById('availableDate'));
                hasInvalidField = true;
            }
            break;
        case 10: 
            var recentPhoto = document.getElementById('recentPhoto');
            var resume = document.getElementById('resume');
            if ((recentPhoto.files[0].size) > 2097152) {
                fieldMissing(inp);
                hasInvalidField = true;
            }
            if ((resume.files[0].size) > 1048576) {
                fieldMissing(inp);
                hasInvalidField = true;
            }
            break;
        default: 
            hasInvalidField = false;
            break;
    }

    return hasInvalidField;
}

const base64 = file => new Promise((resolve, reject) => {
    try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            resolve(reader.result);
        };
    } catch(error) {
        // reader.onerror = reject;
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

function saveFormData() {
    const currentSection = document.getElementById(`section${currentStep}`);
    const isGroupingData = currentSection.classList.contains('grouped') ? true : false;
    const inputs = currentSection.querySelectorAll('input, select, textarea');
    var currentIndex = 1;
    var tableData = {};
    var rowData = {};
    inputs.forEach(input => {
        if (input.id) {
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
}

function loadFormData() {
    const currentSection = document.getElementById(`section${currentStep}`);
    const inputs = currentSection.querySelectorAll('input, select');

    inputs.forEach(input => {
        if (input.name && formData[input.name]) {
            input.value = formData[input.name];
        }
    })
}

function findJob(id) {
    var job = jobList.find(v => v["jobs_id"] === id);
    return job ?? null;
}

function updateSocialPlatforms(id, value) {
    const linkList = [
        {"utm_id": 4, "link": "www.facebook.com/"},
        {"utm_id": 5, "link": "www.x.com/"},
        {"utm_id": 6, "link": "www.linkedin.com/in/"},
        {"utm_id": 15, "link": "www.instagram.com/"},
    ];
    var link;

    linkList.forEach(platform => {
        if (platform["utm_id"] === Number(value)) {
            link = platform["link"];
        }
    });

    document.getElementsByClassName('link-header')[Number(id.split('-')[1])-1].innerHTML = link ?? 'www.link.com/';

    var inputs = document.querySelectorAll('select[id*=socialplatform]');
    var selectedPlatforms = Array.from(inputs).map(p => p.value).filter(v => v !== "");

    inputs.forEach(input => {
        Array.from(input.options).forEach(option => {
            option.disabled = false;

            if (option.value !== "" && option.value !== input.value && selectedPlatforms.includes(option.value)) {
                option.disabled = true;
            }
        })
    })
}

function viewJobPosition(id) {
    selectedJob = id;
    var job = findJob(id);
    
    document.getElementById('job-detail-title').innerHTML = job['jobs_name'];
    document.getElementById('job-detail-description').innerHTML = job['job_description'];
    document.getElementById('job-index').style.display = 'flex';
    document.getElementById('job-list').style.display = 'none';
}

function backToJobList() {
    document.getElementById('job-index').style.display = 'none';
    document.getElementById('job-list').style.display = 'flex';
}

function selectJobPosition(id) {
    formData['job_id'] = id;
    changeStep(1);
}

async function changeStep(direction, isValidated = true) {
    if (isValidated && direction === 1 && !await(validateCurrentStep(currentStep))) {
        return;
    }

    saveFormData();


    document.getElementById(`section${currentStep}`).classList.remove('active')

    currentStep += direction;

    if (document.getElementById(`section${currentStep}`) == null) {
        currentStep -= direction;
    }
    document.getElementById(`section${currentStep}`).classList.add('active')

    // loadFormData();

    if (currentStep === totalSteps) {
        showPreview();
    }

    document.getElementById('prevBtn').style.display = currentStep === 1 ? 'none' : 'flex';
    document.getElementById('nextBtn').style.display = (currentStep === 1 || currentStep === totalSteps) ? 'none' : 'flex';
    document.getElementById('submitBtn').style.display = (currentStep === totalSteps ? 'flex' : 'none');

    updateProgress();
}

async function showPreview() {
    submitData = {
        "job_id": formData["job_id"],
        "name": formData["name"],
        "email": formData["email"],
        "phone": `(${formData["countryCode"]})${formData["phone"]}`,
        "gender": formData["gender"],
        "birth_place": formData["birthPlace"],
        "dob": formData["dob"],
        "nationality": formData["nationality"],
        "social_media": Object.values(formData['social'] || {}).map(s => ({
            "platform": s["socialplatform"],
            "link": s["sociallink"],
        })),
        "educational_bg": await Promise.all(Object.values(formData['edu'] || {}).map(async (e) => ({
            "level": e["level"],
            "level_name": educationLevels.length != 0 ? (educationLevels.find(edu => edu["edu_id"] === Number(e["level"])) ? educationLevels.find(edu => edu["edu_id"] === Number(e["level"]))["edu_name"] : "") : "",
            "school_name": e["schoolname"],
            "start": e["edustartperiod"],
            "end": e["eduendperiod"],
            "remark": e["remark"],
            "max_remark": e["totalscore"],
            "document": await base64(e["edudocument"]["file"]),
            "mime_type": e["edudocument"]["mime_type"],
            "file_name": e["edudocument"]["file_name"],
        }))),
        "work_exp": Object.values(formData['workExp'] || {}).map(w => ({
            "company_name": w["company"],
            "position": w["jobtitle"],
            "start": w["workstartperiod"],
            "end": w["workendperiod"],
            "takehomepay": w["takehomepay"],
            "description": w["jobdesc"],
        })),
        "training": await Promise.all(Object.values(formData["training"] || {}).map(async (t) => ({
            "institute": t["institute"],
            "scope": t["scope"],
            "description": t["trainingdesc"],
            "start": t["trainingstartperiod"],
            "end": t["trainingendperiod"],
            "document": await base64(t["trainingdoc"]["file"]),
            "mime_type": t["trainingdoc"]["mime_type"],
            "file_name": t["trainingdoc"]["file_name"],
        }))),
        "expected_salary": formData["expectedSalary"],
        "available_date": formData["availableDate"],
        "city_assigned_consent": formData["cityAssignedConsent"],
        "country_assigned_consent": formData["countryAssignedConsent"],
        "health": Object.values(formData["health"] || {}).map(h => ({
            "sickness": h["sick"],
            "description": h["healthdescription"],
        })),
        "quick_questions":[
            {"question": "Are you willing to let us contact your previous employer for reference?", "answer": formData["Qq1"],},
            {"question": "Have you ever been involved in any legal case?", "answer": formData["Qq2"],},
            {"question": "Have you previously applied to PT Kapit Mas?", "answer": formData["Qq3"],},
            {"question": "Where did you first learn about the job vacancy at PT Kapit Mas?", "answer": formData["Qq4"],},
            {"question": "Please provide details of involved case", "answer": formData["Qq2details"],},
            {"question": "Please provide details of job vacancy knowledge", "answer": formData["Qq4details"],},
        ],
        "recent_photo": {
            "document": await base64(formData["recentPhoto"]["file"]),
            "mime_type": formData["recentPhoto"]["mime_type"],
            "file_name": `1.${formData["recentPhoto"]["file_name"]}`,
        },
        "resume": {
            "document": await base64(formData["resume"]["file"]),
            "mime_type": formData["resume"]["mime_type"],
            "file_name": `2.${formData["resume"]["file_name"]}`,
        },
        "portofolio": formData["portofolio"],
    };
    // [...Object.keys(submitData['params'])].forEach(field => {
    //     if (typeof submitData['params'][field] === "object") {
    //         submitData['params'][field] = [...Object.values(submitData['params'][field])];
    //         [...submitData['params'][field]].forEach(row => {
    //             if (typeof row === "object") {
    //                 // console.log(row);
    //                 [...Object.entries(row)].forEach(e => {
    //                     if (typeof e[1] === "object") {
    //                         console.log(e[1]);
    //                         row[e[0]] = e[1];
    //                     }
    //                 })
    //             }
    //         })
    //     }
    // })
    console.log(submitData);
    // console.log(formData);
    const test = document.getElementById('preview-screen');
    const numeralInputs = document.getElementsByClassName('numeral');
    const dateInputs = document.getElementsByClassName('date');

    // makes it into a map where each entry is a list of [0] for label and [1] for value
    Object.entries(dummyData).forEach(data => {
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
            var nationality = countryList.find(v => v['country_id'] === cellData);
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

            if (firstRow == null) return;

            var table = firstRow.parentElement;

            Object.keys(cellData).forEach(e => {
                var rowCellData = cellData[e];
                targetElement = document.getElementById(`${data[0]}Prev-${e}`);
                
                Object.keys(rowCellData).forEach(column => {
                    // if there is no table row for the cell, create a new one
                    if (targetElement == null) {
                        var newElement = firstRow.cloneNode(true);
                        newElement.id = newElement.id.replace('-1', `-${e}`);
                        [...newElement.children].forEach(row => {
                            var cellElement;
                            Object.keys(rowCellData).forEach(col => {
                                cellElement = row.querySelector(`[id*=${col}-1Prev]`);
                                if (cellElement) cellElement.id = cellElement.id.replace('-1', `-${e}`);
                            })
                        })
                        table.appendChild(newElement);

                        targetElement = document.querySelector(`[id*=${column}-${e}Prev]`);

                        if (Object.keys(rowCellData[column]).includes('file')) {
                            targetElement.innerHTML = rowCellData[column]['file_name'] ?? '';
                        } else {
                            switch (column) {
                                case "socialplatform":
                                    targetElement.innerHTML = platformList.find(p => p["utm_id"] === Number(rowCellData[column]))["utm_name"];
                                    break;
                                case "level":
                                    targetElement.innerHTML = educationLevels.find(edu => edu["edu_id"] === Number(rowCellData[column]))["edu_name"];
                                    break;
                                case "sick":
                                    targetElement.innerHTML = medicalList.find(h => h["medical_id"] === Number(rowCellData[column]))["medical_name"];
                                    break;
                                default:
                                    targetElement.innerHTML = rowCellData[column] ?? '';
                                    break;
                            }
                        }
                    } else {
                        targetElement = document.querySelector(`[id*=${column}-${e}Prev]`);
                        if (Object.keys(rowCellData[column]).includes('file')) {
                            targetElement.innerHTML = rowCellData[column]['file_name'] ?? '';
                        } else {
                            switch (column) {
                                case "socialplatform":
                                    targetElement.innerHTML = platformList.find(p => p["utm_id"] === Number(rowCellData[column]))["utm_name"];
                                    break;
                                case "level":
                                    targetElement.innerHTML = educationLevels.find(edu => edu["edu_id"] === Number(rowCellData[column]))["edu_name"];
                                    break;
                                case "sick":
                                    targetElement.innerHTML = medicalList.find(h => h["medical_id"] === Number(rowCellData[column]))["medical_name"];
                                    break;
                                default:
                                    targetElement.innerHTML = rowCellData[column] ?? '';
                                    break;
                            }
                        }
                    }
                })
            })

        }

        // show data debug
        // test.innerHTML += `<div>${data[0]} : ${cellData}</div>`;
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
                alert('Please fill all required fields');
                return false;
            }
        }
    }
    console.log('form data:', formData);
    submitForm();
    return true;
}


function submitForm() {
    // turn file inputs to base64
    // var inputs = document.querySelectorAll('input[type="file"]');
    // [...inputs].forEach(input => {
    //     if (formData[input.id]) {
            
    //         base64(formData[input.id]).then((value) => {
    //             formData[input.id] = value;
    //         })
    //     }
    // })

    fetch("http://192.168.1.8/applicant/apply", {
        method: 'POST',
        body: JSON.stringify(submitData),
    }).then((response) => {
        console.log(response);
    });

    console.log('submitted:', formData);

    document.getElementsByClassName('page')[0].classList.add('complete');
    document.getElementById('success-panel').style.display = 'block';
    document.getElementById('sidebar').style.display = 'none';
    document.getElementById('applicationForm').style.display = 'none';
}

function addTableRow(tableId, tableRow, button) {
    const table = document.getElementById(tableId);
    const row = document.getElementById(tableRow);
    const addRowButton = document.getElementById(button).parentElement.cloneNode(true);
    const newRow = row.cloneNode(true);
    const tbody = table.lastElementChild;


    // increment id per new row
    const rowId = row.id.replace('-1', '');
    const rowCount = document.querySelectorAll(`[id*="${rowId}"]`).length;

    newRow.id = row.id.replace('-1', '') + `-${rowCount + 1}`;
    const content = [...newRow.children];
    content.forEach(row => {
        let elements = [...row.children];
        elements.forEach(element => {
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

    tbody.appendChild(newRow);
    tbody.appendChild(addRowButton);
}

function removeTableRow(tableId, obj) {
    const table = document.getElementById(tableId).lastElementChild;
    const selectedRow = obj.parentNode.parentNode;
    const rowIdHeader = table.firstElementChild.id.replace('-1', '');
    const rows = table.querySelectorAll(`[id*="${rowIdHeader}"]`);
    const selectedRowId = selectedRow.id.split('-')[2];

    // const content = [...rows.children];

    if (rows.length <= 1) {
        alert('Cannot delete the only entry');
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

    // fix table row numbering
    rows.forEach(row => {
        const thisRowNumber = row.id.split('-')[2];
        if (thisRowNumber > selectedRowId) {
            row.id = rowIdHeader + '-' + (thisRowNumber - 1);
            let cells = [...row.children];
            cells.forEach(cell => {
                let elements = [...cell.children];
                elements.forEach(element => {
                    if (element.hasAttribute('id')) {
                        // update element and formData numbering
                        delete formData[element.id];
                        let elementNumber = element.id.split('-')[1];
                        element.id = element.id.replace(`-${elementNumber}`, `-${thisRowNumber - 1}`)
                        formData[element.id] = element.value;
                    }
                })
            })
        }
    })
}

updateProgress();