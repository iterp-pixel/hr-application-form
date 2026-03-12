const API_CONFIG = {
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

const linkList = [
    {"utm_id": 4, "link": "www.facebook.com/"},
    {"utm_id": 5, "link": "www.x.com/"},
    {"utm_id": 6, "link": "www.linkedin.com/in/"},
    {"utm_id": 15, "link": "www.instagram.com/"},
];

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

function validateFile(file, type) {
    const config = API_CONFIG.fileUpload[type];
    if (!config) return { valid: false, error: 'Unknown file type' };
    
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

function validateDateRange(periodStarts, periodEnds) {
    var hasInvalidField = false;
    periodStarts.forEach(inp => {
        var start = Date.parse(inp.value);
        var end = Date.parse(periodEnds[periodStarts.indexOf(inp)].value);
        if (start > end) {
            fieldMissing(inp);
            fieldMissing(periodEnds[periodStarts.indexOf(inp)]);
            notificationHandler("End date period cannot be bigger than start date period.", "error");
            hasInvalidField = true;
            return;
        }
    });

    return hasInvalidField;
}

function validatePhoneNumber(number) {
    try {
        // const parsed = phoneUtil.parse(number);
        // return phoneUtil.isValidNumber(parsed);
        return true;
    } catch {
        return false;
    }
}