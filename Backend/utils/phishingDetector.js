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