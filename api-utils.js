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
        return await apiRequest(getApiUrl('jobsList'), {
            method: 'GET',
        });
    } catch {
        notificationHandler('Failed to load job listings. Please refresh the page.', 'error');
    }
}

async function fetchCountryCode() {
    try {
        return await apiRequest(getApiUrl('countryList'), {
            method: 'GET',
        });
    } catch {
        notificationHandler('Failed to load country list. Please refresh the page.', 'error');
    }
}

async function fetchEducationLevel() {
    try {
        return await apiRequest(getApiUrl('educationLevel'), {
            method: 'GET',
        });
    } catch {
        notificationHandler('Failed to load education levels. Please refresh the page.', 'error');
    }
}

async function fetchSocialPlatform() {
    try {
        return await apiRequest(getApiUrl('utmList'), {
            method: 'GET',
        });
    } catch {
        notificationHandler('Failed to load social media platforms. Please refresh the page.', 'error');
    }
}

async function fetchMedicalList() {
    try {
        return await apiRequest(getApiUrl('medicalList'), {
            method: 'GET',
        });
    } catch {
        notificationHandler('Failed to load medical conditions list. Please refresh the page.', 'error');
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
    formCheck.set("phone", `(${document.getElementById('countryCode').value}) ${document.getElementById('phone').value}`);
    try {
        const response = await apiRequest(getApiUrl('checkApplicant'), {
            method: 'POST',
            body: formCheck,
        });        

        return JSON.parse(response)[0];
    } catch {
        return {
            message: `An error has occurred, please try again later.`,
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
        const response = await apiRequest(getApiUrl('submitApplication'), {
            method: 'POST',
            body: formData,
        });
        
        return response;
    } catch(error) {
        notificationHandler(`Submission failed: ${error.message}`, 'error');
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
