const detectPhishing = (message) => {

    let riskScore = 0;
    let reasons = [];

    const text = message.toLowerCase();

    // -------------------------
    // Suspicious Keywords
    // -------------------------

    const suspiciousKeywords = [

        "urgent",
        "verify",
        "bank",
        "otp",
        "password",
        "click here",
        "login",
        "gift",
        "winner",
        "claim",
        "limited time",
        "account suspended"

    ];

    suspiciousKeywords.forEach((word) => {

        if (text.includes(word)) {

            riskScore += 10;
            reasons.push(`Keyword Detected: ${word}`);

        }

    });

    // -------------------------
    // URL Detection
    // -------------------------

    const urlRegex = /(https?:\/\/[^\s]+)/gi;

    if (urlRegex.test(text)) {

        riskScore += 20;
        reasons.push("URL Detected");

    }
    // -------------------------
    // Suspicious Domain Detection
    // -------------------------

    const suspiciousDomains = [

        ".xyz",
        ".top",
        ".click",
        ".gq",
        ".tk",
        ".work"

    ];

    suspiciousDomains.forEach((domain) => {

        if (text.includes(domain)) {

            riskScore += 20;

            reasons.push(`Suspicious Domain: ${domain}`);

        }

    });

    // -------------------------
    // IP Address URL Detection
    // -------------------------

    const ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/;

    if (ipRegex.test(text)) {

        riskScore += 25;

        reasons.push("IP Address URL Detected");

    }

    // -------------------------
// Multiple URL Detection
// -------------------------

const urls = text.match(/https?:\/\/[^\s]+/g);

if (urls && urls.length > 1) {

    riskScore += 10;

    reasons.push("Multiple URLs Found");

}
    // -------------------------
    // Short URL Detection
    // -------------------------

    const shortUrls = [

        "bit.ly",
        "tinyurl",
        "t.co",
        "goo.gl"

    ];

    shortUrls.forEach((site) => {

        if (text.includes(site)) {

            riskScore += 20;
            reasons.push("Shortened URL Detected");

        }

    });

    // -------------------------
    // Email Detection
    // -------------------------

    const emailRegex = /\S+@\S+\.\S+/;

    if (emailRegex.test(text)) {

        riskScore += 5;
        reasons.push("Email Address Found");

    }

    // -------------------------
    // Final Result
    // -------------------------

    let result = "SAFE";

    if (riskScore >= 70) {

        result = "PHISHING";

    }

    else if (riskScore >= 30) {

        result = "SUSPICIOUS";

    }

    return {

        riskScore,
        reasons,
        result

    };

};

module.exports = detectPhishing;