/**
 * Makes an API request with timeout and error handling
 * @param {string} url - The API endpoint URL
 * @param {object} options - Fetch options
 * @returns {Promise} - Response data or error
 */
async function apiRequest(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    try {
        const response = await fetch(url, {
            ...options,
        });

        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }
        
        return await response.text();
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            throw new Error('Request timeout. Please check your internet connection.');
        }
        
        if (error.message.includes('Failed to fetch')) {
            throw new Error('Network error. Please check your connection or try again later.');
        }
        
        throw error;
    }
}

async function fetchJobList() {
    try {
        return await apiRequest('/api/jobs', {
            method: 'POST',
        });
    } catch(e) {
        notificationHandler(`Failed to load job listings${e.message.includes('429') ? ', too many request attempts' : ''}. Please try again later.`, 'error');
    }
}

async function fetchCountryCode() {
    try {
        return await apiRequest('/api/countries', {
            method: 'POST',
        });
    } catch(e) {
        notificationHandler(`Failed to load country list${e.message.includes('429') ? ', too many request attempts' : ''}. Please try again later.`, 'error');
    }
}

async function fetchEducationLevel() {
    try {
        return await apiRequest('/api/educations', {
            method: 'POST',
        });
    } catch(e) {
        notificationHandler(`Failed to load education levels${e.message.includes('429') ? ', too many request attempts' : ''}. Please try again later.`, 'error');
    }
}

async function fetchSocialPlatform() {
    try {
        return await apiRequest('/api/socials', {
            method: 'POST',
        });
    } catch(e) {
        notificationHandler(`Failed to load social media platforms${e.message.includes('429') ? ', too many request attempts' : ''}. Please try again later.`, 'error');
    }
}

async function fetchMedicalList() {
    try {
        return await apiRequest('/api/medicals', {
            method: 'POST',
        });
    } catch(e) {
        notificationHandler(`Failed to load medical condition list${e.message.includes('429') ? ', too many request attempts' : ''}. Please try again later.`, 'error');
    }
}

/**
 * Check if applicant already exists
 * @param {FormData} formCheck - Form data to check
 */
async function checkApplicant(formCheck, jobId) {
    formCheck.set("job_id", jobId);
    formCheck.set("name", document.getElementById('name').value);
    formCheck.set("email", document.getElementById('email').value);
    formCheck.set("phone", `(+${document.getElementById('countryCode').value}) ${document.getElementById('phone').value}`);
    try {
        const response = await apiRequest('/check', {
            method: 'POST',
            body: formCheck,
        }); 

        if (Object.keys(response).includes("errors")) {
            const elements = document.getElementById('section2').querySelectorAll('input');
            response["errors"].forEach((e) => {
                var compareVal = e[0];
                if (e[1].includes('Phone')) compareVal = compareVal.split(') ')[1];
                if (Object.values(elements).map((i => i.value)).includes(compareVal)) {
                    Object.values(elements).find(i => i.value === compareVal).classList.add('missing');
                };
                notificationHandler(e[1], "error");
            });

            return {
                message: `Invalid inputs`,
                status: "reject",
            };
        }

        return response[0];
    } catch(e) {
        return {
            message: `${e.message.includes('429') ? 'Too many request attempts, please try again later' : 'An error has occurred, please try again later.'}`,
            status: "reject"
        };
    }
}

/**
 * Submit application
 * @param {FormData} formData - Complete application form data
 */
async function submitApplication(formData) {
    try {
        const response = await apiRequest('/apply', {
            method: 'POST',
            body: formData,
        });

        if (Object.keys(response).includes("errors")) {
            const elements = document.getElementById('section2').querySelectorAll('input');
            response["errors"].forEach((e) => {
                var compareVal = e[0];
                if (e[1].includes('Phone')) compareVal = compareVal.split(') ')[1];
                if (Object.values(elements).map((i => i.value)).includes(compareVal)) {
                    Object.values(elements).find(i => i.value === compareVal).classList.add('missing');
                };
                notificationHandler(e[1], "error");
            });

            throw new Error("You have invalid inputs");
        }
        
        return response;
    } catch(error) {
        let errorMessage = "Please try again later";
        if (error.message.includes('429')) errorMessage = "Too many attempts, please try again later";

        console.log(error);

        notificationHandler(`Submission failed: ${errorMessage}`, 'error');
        throw error;
    }
}

function fileUploadHandler(self) {
    const parent = self.parentElement;
    const elements = [...parent.children];
    const input = elements[2];
    const label = elements[0];

    if (input.files.length) {
        input.value = '';
        label.textContent = "No file chosen";
        self.innerHTML = "<img src='assets/icons/upload-icon.svg' alt='Upload'>";
    } else {
        input.click();
    }
}

function fileOnChanged(self) {
    const parent = self.parentElement;
    const elements = [...parent.children];
    const button = elements[1];
    const label = elements[0];

    if (self.files.length) {
        const file = self.files[0];
        
        // Determine file type based on input ID or accept attribute
        let fileType = 'document'; // default
        if (self.id.includes('recentPhoto') || self.accept.includes('image')) {
            fileType = 'photo';
        } else if (self.id.includes('resume')) {
            fileType = 'resume';
        }
        
        // Validate file
        const validation = validateFile(file, fileType);
        
        if (!validation.valid) {
            notificationHandler(validation.error, 'error');
            self.value = '';
            label.textContent = 'No file chosen';
            button.innerHTML = "<img src='assets/icons/upload-icon.svg' alt='Upload'>";
            return;
        }
        
        label.textContent = file.name;
        self.classList.remove('missing');
        parent.classList.remove('missing');
        button.innerHTML = "<img src='assets/icons/cancel-icon.svg' alt='Remove'>";
    } else {
        label.textContent = 'No file chosen';
        button.innerHTML = "<img src='assets/icons/upload-icon.svg' alt='Upload'>";
    }
}
