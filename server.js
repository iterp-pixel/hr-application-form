const express = require('express');
const { check, validationResult } = require('express-validator');
const multer = require('multer');
const isBase64 = require('is-base64');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const upload = multer({
    limits: { fieldSize: 2 * 1024 * 1024, fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!allowed.includes(file.mimetype)) {
            return cb(new Error('Invalid file type'));
        }
        cb(null, true);
    }
    });
const app = express();
const port = 8000;
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // attempts
});


process.loadEnvFile('.env');

app.set('trust proxy', '127.0.0.1');
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://unpkg.com"],
            scriptSrcAttr: ["'self'", "'unsafe-inline'"],
            connectSrc: ["'self'"],
            imgSrc: ["'self'", "https:", "data:"],
        }
    }
}));
app.use(cors({
    origin: [`${process.env.ORIGIN}`],
    method: ["GET", "POST"]
}));
app.use(express.json({ limit: "1mb" }));
app.use(upload.array());
app.use('/api/', limiter);
app.use('/check', limiter);
app.use('/apply', limiter);
app.use(limiter);

app.use(express.static(path.join(__dirname, 'public')));

// staging environment headers
// app.use((req, res, next) => {
//     res.header("X-Odoo-Database", "KAPITMAS_DEMO");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

//     next();
    
// })

// check applicant function
async function checkApplicant(formData) {
    const response = await fetch(`${process.env.SERVER_BASE}/applicant/check`, {
        method: 'POST',
        body: formData,
    });

    return await response.json();
}

async function fetchApi(url, res) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error();
        res.send(await response.text());
    } catch {
        res.status(500).json({error: "Internal Server Error"});
    }
}

// api fetch calls
let countryList;
async function fetchCountryList() {
    console.log('fetching country list...');
    if (fs.existsSync('country_list.json')) {
        fs.readFile('country_list.json', (err, data) => {
            if (!err && data) {
                countryList = data.toString();
            }
        })
    } else {
        try {
            const response = await fetch(`${process.env.SERVER_BASE}/applicant/res_country`);
            if (!response.ok) throw new Error();
            const result = await response.text();
            countryList = result;
            console.log("creating country_list.json");
            fs.writeFile('country_list.json', countryList, 'utf-8', (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('written into country_list.json');
            });
        } catch (error) {
            console.log(error);
        }
    }
    console.log('done');
}

app.post('/api/countries', async (req, res) => res.send(countryList))

app.post('/api/jobs', async (req, res) => fetchApi(`${process.env.SERVER_BASE}/applicant/jobs_list`, res))

app.post('/api/socials', async (req, res) => fetchApi(`${process.env.SERVER_BASE}/applicant/utm_list`, res))

app.post('/api/educations', async (req, res) => fetchApi(`${process.env.SERVER_BASE}/applicant/education_level`, res))

app.post('/api/medicals', async (req, res) => fetchApi(`${process.env.SERVER_BASE}/applicant/medical_list`, res))

// check applicant
app.post('/check', [
    check('job_id', 'Invalid job position').isNumeric().trim().escape(),
    check('name', 'Name must be less than 200 characters').isLength({max: 200}).trim().escape(),
    check('email', 'Email is not valid').isEmail().normalizeEmail(),
    check('phone').custom((value) => {
        let valid;
        try {
            const number = phoneUtil.parse(value);
            valid = phoneUtil.isValidNumber(number);
        } catch (error) {
            console.log(error);
            throw new Error("Error when parsing phone number, please re-check");
        }
        if (!valid) throw new Error("Phone number is not valid");
        return true;
    }).trim().escape(),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            var errorList = errors["errors"];
            return res.json({ errors:  errorList.map((e) => [e["value"], e["msg"]])});
        }
        const request = req.body;
        const formData = new FormData;
    
        Object.entries(request).forEach((e) => {
            formData.set(e[0], e[1]);
        })
    
        const result = await checkApplicant(formData);
    
        res.send(result);
    } catch {
        res.status(500).json({error: "Internal server error"});
    }
})

// form submission
app.post('/apply', [
    check('job_id', 'Invalid job position').isInt().trim().escape(),
    check('name', 'Name must be less than 200 characters').isLength({max: 200}).trim().escape(),
    check('email', 'Email is not valid').isEmail().normalizeEmail(),
    check('phone').custom((value) => {
        let valid;
        try {
            const number = phoneUtil.parse(value);
            valid = phoneUtil.isValidNumber(number);
        } catch {
            throw new Error("Error when parsing phone number, please re-check");
        }
        if (!valid) throw new Error("Phone number is not valid");
        return true;
    }).trim().escape(),
    check('gender', 'Gender does not exist in list').isString().isIn(['male', 'female']).trim().isString().escape(),
    check('birth_place', 'Birth place must be less than 100 characters').isLength({max: 100}).isString().trim().escape(),
    check('dob', 'Date of birth is not valid').matches(/^\d{4}\/\d{2}\/\d{2}$/).trim().custom((value) => {
        const dob = new Date(value).getFullYear();
        const earliestDate = new Date(Date.now()).getFullYear() - 13;
        if (dob > earliestDate) throw new Error("You need to be at least 13 years old to apply");
        return true;
    }),
    check('nationality', 'Nationality is not valid').isInt().trim().escape(),
    check('social_media').optional().custom((value) => {
        let data;
        try {
            data = JSON.parse(value);
        } catch {
            throw new Error("Invalid social media inputs");
        }

        if (!Array.isArray(data)) throw new Error("Invalid social media inputs");

        data.forEach((e) => {
            if (!Number.isInteger(Number(e.platform))) throw new Error("Invalid social platform selected");
            if (typeof e.link != "string" || e.link.length > 200) throw new Error("Username must be less than 200 characters");
        })

        return true;
    }).customSanitizer((value) => {
        const data = JSON.parse(value);

        const sanitized = data.map((e) => ({
            platform: Number(e.platform),
            link: e.link.trim(),
        }));

        return JSON.stringify(sanitized);
    }),
    check('educational_bg').optional().custom((value) => {
        let data;
        let hasOneEmptyEndDate = false;

        try {
            data = JSON.parse(value);
        } catch {
            throw new Error("Invalid educational background inputs")
        }

        if (!Array.isArray(data)) throw new Error("Invalid educational background inputs");
        
        data.forEach((e) => {
            if (!Number.isInteger(Number.parseInt(e.edu_id))) throw new Error("Invalid education level");
            if (typeof e.level != "string" || e.level.length > 150) throw new Error("Invalid level name");
            if (typeof e.school_name != "string" || e.school_name.length > 200) throw new Error("School name must be less than 200 characters");
            if (!/^\d{4}\/\d{2}\/\d{2}$/.test(e.start)) throw new Error("Invalid education start date");
            if (e.end != "") {
                if (!/^\d{4}\/\d{2}\/\d{2}$/.test(e.end)) throw new Error("Invalid education end date");
                if (Date.parse(e.start) > Date.parse(e.end)) throw new Error("Education start date cannot be bigger than end date");
            } else if (hasOneEmptyEndDate) {
                throw new Error("There cannot be multiple empty end dates in education background");
            } else {
                hasOneEmptyEndDate = true;
            }
            if (!Number.isFinite(Number.parseFloat(e.remark)) || !Number.isFinite(Number.parseFloat(e.max_remark))) throw new Error("Invalid grade");
            if (Number.parseFloat(e.remark) > Number.parseFloat(e.max_remark)) throw new Error("Grade cannot be bigger than max grade");
            if (e.document === "" || Buffer.byteLength(e.document, 'base64') > 2 * 1024 * 1024 || !isBase64(e.document) || typeof e.mime_type != "string" || typeof e.file_name != "string" || e.mime_type == "" || e.file_name == "") throw new Error("Invalid education document");
        })

        return true;
    }).customSanitizer((value) => {
        const data = JSON.parse(value);

        const sanitized = data.map((e) => ({
            edu_id: Number(e.edu_id),
            level: e.level.trim(),
            school_name: e.school_name.trim(),
            start: e.start.trim(),
            end: e.end ? e.end.trim() : "",
            remark: Number(e.remark),
            max_remark: Number(e.max_remark),
            document: e.document,
            mime_type: e.mime_type.trim(),
            file_name: e.file_name.trim()
        }));

        return JSON.stringify(sanitized);
    }),
    check('work_exp').optional().custom((value) => {
        let data;
        let hasOneEmptyEndDate = false;

        try {
            data = JSON.parse(value);
        } catch {
            throw new Error("Invalid work experience inputs")
        }

        if (!Array.isArray(data)) throw new Error("Invalid work experience inputs");
        
        data.forEach((e) => {
            if (typeof e.company_name != "string" || e.company_name.length > 200) throw new Error("Company name must be less than 200 characters");
            if (typeof e.position != "string" || e.position.length > 200) throw new Error("Job position must be less than 200 characters");
            if (!/^\d{4}\/\d{2}\/\d{2}$/.test(e.start)) throw new Error("Invalid work start date");
            if (e.end != "") {
                if (!/^\d{4}\/\d{2}\/\d{2}$/.test(e.end)) throw new Error("Invalid work end date");
                if (Date.parse(e.start) > Date.parse(e.end)) throw new Error("Work start date cannot be bigger than end date");
            } else if (hasOneEmptyEndDate) {
                throw new Error("There cannot be multiple empty end dates in work background");
            } else {
                hasOneEmptyEndDate = true;
            }
            if (!Number.isFinite(Number.parseFloat(e.takehomepay)) || Number.parseFloat(e.takehomepay) < 0) throw new Error("Invalid take home pay amount");
            if (typeof e.description != "string" || e.description.length > 350) throw new Error("Job description must be less than 350 characters");
        })

        return true;
    }).customSanitizer((value) => {
        const data = JSON.parse(value);

        const sanitized = data.map((e) => ({
            company_name: e.company_name.trim(),
            position: e.position.trim(),
            start: e.start.trim(),
            end: e.end ? e.end.trim() : "",
            takehomepay: Number(e.takehomepay),
            description: e.description.trim(),
        }));

        return JSON.stringify(sanitized);
    }),
    check('training').optional().custom((value) => {
        let data;

        try {
            data = JSON.parse(value);
        } catch {
            throw new Error("Invalid training inputs")
        }

        if (!Array.isArray(data)) throw new Error("Invalid training inputs");
        
        data.forEach((e) => {
            if (typeof e.institute != "string" || e.institute.length > 150) throw new Error("Training institute name must be less than 150 characters");
            if (typeof e.scope != "string" || e.scope.length > 100) throw new Error("Training scope must be less than 100 characters");
            if (typeof e.description != "string" || e.description.length > 350) throw new Error("Training description must be less than 350 characters");
            if (!/^\d{4}\/\d{2}\/\d{2}$/.test(e.start)) throw new Error("Invalid training start date");
            if (!/^\d{4}\/\d{2}\/\d{2}$/.test(e.end)) throw new Error("Invalid training end date");
            if (Date.parse(e.start) > Date.parse(e.end)) throw new Error("Training start date cannot be bigger than end date");
            if (e.document === "" || Buffer.byteLength(e.document, 'base64') > 2 * 1024 * 1024 || !isBase64(e.document) || typeof e.mime_type != "string" || typeof e.file_name != "string" || e.mime_type == "" || e.file_name == "") throw new Error("Invalid education document");
        })

        return true;
    }).customSanitizer((value) => {
        const data = JSON.parse(value);

        const sanitized = data.map((e) => ({
            institute: e.institute.trim(),
            scope: e.scope.trim(),
            description: e.description.trim(),
            start: e.start.trim(),
            end: e.end ? e.end.trim() : "",
            document: e.document,
            mime_type: e.mime_type.trim(),
            file_name: e.file_name.trim()
        }));

        return JSON.stringify(sanitized);
    }),
    check('expected_salary', 'Expected salary is not valid').isInt().trim().escape(),    
    check('available_date', 'Available date is not valid').matches(/^\d{4}\/\d{2}\/\d{2}$/).trim().custom((value) => {
        if (Date.parse(value) < Date.now()) throw new Error("Available date cannot be bigger than current date");
        return true;
    }),
    check('city_assigned_consent', 'City assignment consent is invalid').isString().isIn(['Yes', 'No']).trim().escape(),    
    check('country_assigned_consent', 'Out of country assignment consent is invalid').isString().isIn(['Yes', 'No']).trim().escape(),
    check('health').optional().custom((value) => {
        let data;
        try {
            data = JSON.parse(value);
        } catch {
            throw new Error("Invalid health inputs");
        }

        if (!Array.isArray(data)) throw new Error("Invalid health inputs");

        data.forEach((e) => {
            if (!Number.isInteger(Number.parseInt(e.sickness))) throw new Error("Invalid health type selected");
            if (typeof e.description != "string" || e.description.length > 350) throw new Error("Description must be less than 350 characters");
        })

        return true;
    }).customSanitizer((value) => {
        const data = JSON.parse(value);

        const sanitized = data.map((e) => ({
            sickness: Number(e.sickness),
            description: e.description.trim(),
        }));

        return JSON.stringify(sanitized);
    }),
    check('recent_photo', "Invalid recent photo").isBase64(),
    check('resume', "Invalid resume base").custom((value) => {
        let data;
        try {
            data = JSON.parse(value);
        } catch {
            throw new Error("Invalid resume");
        }
        // console.log(data);
        if (Buffer.byteLength(data.document, 'base64') > 2 * 1024 * 1024 || !isBase64(data.document)) throw new Error("Invalid resume document");
        if (typeof data.mime_type != "string") throw new Error("Invalid resume mime type");
        if (typeof data.file_name != "string") throw new Error("Invalid resume file name");

        return true;
    }).customSanitizer((value) => {
        const data = JSON.parse(value);

        const sanitized = {
            document: data.document,
            mime_type: data.mime_type.trim(),
            file_name: data.file_name.trim(),
        }

        return JSON.stringify(sanitized);
    }),
    check('portofolio', 'Portofolio is not valid').isString().trim().escape(),
], async (req, res) => {
    try {
        let response;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            var errorList = errors["errors"];
            return res.json({ errors:  errorList.map((e) => [e["value"], e["msg"]])});
        }
        const request = req.body;
        const formData = new FormData;
        const applicantData = new FormData;
        applicantData.append('job_id', request.job_id);
        applicantData.append('name', request.name);
        applicantData.append('email', request.email);
        applicantData.append('phone', request.phone);
    
        Object.entries(request).forEach((e) => {
            formData.set(e[0], e[1]);
        })
    
        // recheck applicant before applying
        const check = await checkApplicant(applicantData);
    
        if (check != null && Array.isArray(check) && check[0].state == "allow") {
            response = await fetch(`${process.env.SERVER_BASE}/applicant/apply`, {
                method: 'POST',
                body: formData,
            });
        } else if (Array.isArray(check)) {
            return res.send(check);
        }
    
        const result = await response.json();
    
        res.send(result);
    } catch {
        res.status(500).json({error: "Internal server error"});
    }
})

// redirecto if invalid route given
app.use((req, res) => res.redirect('/'));

fetchCountryList().then(() => {
    app.listen(port, '0.0.0.0', () => {
        console.log(`Listening in port ${port}`);
        console.log(`environment: ${process.env.SERVER_BASE}`);
    })
})

