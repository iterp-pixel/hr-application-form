// API Config
const API_CONFIG = {
    baseURL: 'http://192.168.1.8',
    endpoints: {
        jobsList: '/applicant/jobs_list',
        countryList: '/applicant/res_country',
        educationLevel: '/applicant/education_level',
        utmList: '/applicant/utm_list',
        medicalList: '/applicant/medical_list',
        checkApplicant: '/applicant/check',
        submitApplication: '/applicant/apply'
    },
    timeout: 10000,
    fileUpload: {
        photo: {
            maxSize: 1024 * 1024, // 1MB in bytes
            allowedTypes: ['image/jpeg', 'image/png'],
            allowedExtensions: ['.jpg', '.jpeg', '.png']
        },
        resume: {
            maxSize: 2 * 1024 * 1024, // 2MB in bytes
            allowedTypes: ['application/pdf'],
            allowedExtensions: ['.pdf']
        },
        document: {
            maxSize: 2 * 1024 * 1024, // 2MB in bytes
            allowedTypes: ['application/pdf'],
            allowedExtensions: ['.pdf']
        }
    }
}

// Helper function to get full API URL
function getApiUrl(endpoint) {
    return `${API_CONFIG.baseURL}${API_CONFIG.endpoints[endpoint] || endpoint}`;
}

// Helper function to validate file size and type
function validateFile(file, type) {
    const config = API_CONFIG.fileUpload[type];
    if (!config) {
        console.error(`Unknown file type: ${type}`);
        return { valid: false, error: 'Unknown file type' };
    }
    
    // Check file size
    if (file.size > config.maxSize) {
        const maxSizeMB = (config.maxSize / (1024 * 1024)).toFixed(1);
        return { 
            valid: false, 
            error: `File size exceeds ${maxSizeMB}MB limit` 
        };
    }
    
    // Check file type
    if (!config.allowedTypes.includes(file.type)) {
        return { 
            valid: false, 
            error: `Invalid file type. Allowed types: ${config.allowedExtensions.join(', ')}` 
        };
    }
    
    return { valid: true };
}