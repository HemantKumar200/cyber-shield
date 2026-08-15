// ============================================
// CYBER SHIELD DASHBOARD
// ============================================


// ============================================
// Authentication
// ============================================

const token =
    localStorage.getItem("cyberShieldToken");


const savedUser =
    localStorage.getItem("cyberShieldUser");


if (!token) {

    window.location.href = "login.html";

}


// ============================================
// User
// ============================================

let user = null;


try {

    user = JSON.parse(savedUser);

} catch (error) {

    console.log("User data not found");

}


if (user) {

    const firstName =
        user.fullName
            ? user.fullName.split(" ")[0]
            : "User";


    document.getElementById(
        "userName"
    ).textContent =
        user.fullName || "User";


    document.getElementById(
        "welcomeName"
    ).textContent =
        firstName;


    document.getElementById(
        "userInitial"
    ).textContent =
        firstName.charAt(0).toUpperCase();

}


// ============================================
// API Helper
// ============================================

async function apiRequest(
    url,
    options = {}
) {

    const response =
        await fetch(
            url,
            {

                ...options,

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${token}`,

                    ...(options.headers || {})

                }

            }
        );


    const data =
        await response.json();


    if (
        response.status === 401 ||
        response.status === 403
    ) {

        localStorage.removeItem(
            "cyberShieldToken"
        );

        localStorage.removeItem(
            "cyberShieldUser"
        );

        window.location.href =
            "login.html";

        return null;

    }


    return data;

}


// ============================================
// Dashboard Stats
// ============================================

async function loadDashboardStats() {

    try {

        const data =
            await apiRequest(
                "http://localhost:8080/api/dashboard/stats"
            );


        if (!data || !data.success) {

            console.log(
                "Unable to load dashboard stats"
            );

            return;

        }


        const stats =
            data.stats;


        document.getElementById(
            "totalScans"
        ).textContent =
            stats.totalScans;


        document.getElementById(
            "safeScans"
        ).textContent =
            stats.safe;


        document.getElementById(
            "suspiciousScans"
        ).textContent =
            stats.suspicious;


        document.getElementById(
            "phishingScans"
        ).textContent =
            stats.phishing;


        document.getElementById(
            "averageRisk"
        ).textContent =
            stats.averageRisk;


        updateRiskStatus(
            stats.averageRisk
        );

    }

    catch (error) {

        console.error(
            "Dashboard Stats Error:",
            error
        );

    }

}


// ============================================
// Risk Status
// ============================================

function updateRiskStatus(
    risk
) {

    const status =
        document.getElementById(
            "riskStatus"
        );


    const description =
        document.getElementById(
            "riskDescription"
        );


    if (risk === 0) {

        status.textContent =
            "No scans yet";

        description.textContent =
            "Start scanning messages to understand your security risk.";

        return;

    }


    if (risk <= 30) {

        status.textContent =
            "Low Risk";

        description.textContent =
            "Your recent activity looks relatively safe.";

    }

    else if (risk <= 60) {

        status.textContent =
            "Moderate Risk";

        description.textContent =
            "Some activity requires your attention.";

    }

    else if (risk <= 80) {

        status.textContent =
            "High Risk";

        description.textContent =
            "Several threats may require immediate attention.";

    }

    else {

        status.textContent =
            "Critical Risk";

        description.textContent =
            "Your recent scans indicate significant phishing risk.";

    }

}


// ============================================
// Scan History
// ============================================

async function loadScanHistory() {

    try {

        const data =
            await apiRequest(
                "http://localhost:8080/api/scan/history"
            );


        if (!data || !data.success) {

            return;

        }


        const scans =
            data.data || [];


        renderRecentScans(
            scans.slice(0, 5)
        );


        renderHistory(
            scans
        );

    }

    catch (error) {

        console.error(
            "History Error:",
            error
        );

    }

}


// ============================================
// Recent Scans
// ============================================

function renderRecentScans(
    scans
) {

    const container =
        document.getElementById(
            "recentScans"
        );


    if (!scans.length) {

        container.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-shield-halved"></i>

                <p>No scans yet.</p>

                <span>
                    Scan your first message to
                    see activity here.
                </span>

            </div>

        `;

        return;

    }


    container.innerHTML =
        scans.map(
            scan => createScanHTML(scan)
        ).join("");

}


// ============================================
// Scan HTML
// ============================================

function createScanHTML(
    scan
) {

    const result =
        scan.result || "SAFE";


    const resultClass =
        result.toLowerCase();


    let icon =
        "fa-shield-check";


    if (result === "PHISHING") {

        icon =
            "fa-skull-crossbones";

    }

    else if (result === "SUSPICIOUS") {

        icon =
            "fa-triangle-exclamation";

    }


    const date =
        scan.scannedAt
            ? new Date(
                scan.scannedAt
            ).toLocaleString()
            : "Recently";


    return `

        <div class="scan-item">

            <div class="
                scan-status-icon
                ${resultClass}
            ">

                <i class="
                    fa-solid
                    ${icon}
                "></i>

            </div>


            <div>

                <div class="scan-message">

                    ${escapeHTML(
                        scan.message
                    )}

                </div>

                <div class="scan-time">

                    ${date}

                </div>

            </div>


            <div class="scan-risk">

                ${scan.riskScore || 0}/100

            </div>

        </div>

    `;

}


// ============================================
// Full History
// ============================================

function renderHistory(
    scans
) {

    const container =
        document.getElementById(
            "historyList"
        );


    if (!scans.length) {

        container.innerHTML = `

            <div class="empty-state">

                <i class="
                    fa-solid
                    fa-clock-rotate-left
                "></i>

                <p>
                    No scan history available.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        scans.map(
            scan => createScanHTML(scan)
        ).join("");

}


// ============================================
// Message Scanner
// ============================================

async function scanMessage() {

    const input =
        document.getElementById(
            "messageInput"
        );


    const message =
        input.value.trim();


    if (!message) {

        alert(
            "Please enter a message to scan."
        );

        return;

    }


    const button =
        document.getElementById(
            "scanBtn"
        );


    button.disabled = true;

    button.innerHTML = `

        <i class="fa-solid fa-spinner fa-spin"></i>

        Analyzing...

    `;


    try {

        const data =
            await apiRequest(
                "http://localhost:8080/api/scan/message",
                {

                    method: "POST",

                    body: JSON.stringify({

                        message

                    })

                }
            );


        if (
            !data ||
            !data.success
        ) {

            alert(
                data?.message ||
                "Unable to scan message."
            );

            return;

        }


        displayScanResult(
            data.data
        );


        // Refresh dashboard data

        await loadDashboardStats();

        await loadScanHistory();

    }

    catch (error) {

        console.error(
            "Scan Error:",
            error
        );

        alert(
            "Unable to connect to Cyber Shield server."
        );

    }

    finally {

        button.disabled = false;

        button.innerHTML = `

            <i class="
                fa-solid
                fa-magnifying-glass
            "></i>

            Analyze Message

        `;

    }

}


// ============================================
// Display Result
// ============================================

function displayScanResult(
    scan
) {

    const resultBox =
        document.getElementById(
            "scanResult"
        );


    const resultIcon =
        document.getElementById(
            "resultIcon"
        );


    const title =
        document.getElementById(
            "resultTitle"
        );


    const risk =
        document.getElementById(
            "resultRisk"
        );


    const reasons =
        document.getElementById(
            "resultReasons"
        );


    const recommendations =
        document.getElementById(
            "resultRecommendations"
        );


    const result =
        scan.result || "SAFE";


    const resultClass =
        result.toLowerCase();


    resultIcon.className =
        `result-icon ${resultClass}`;


    if (result === "PHISHING") {

        resultIcon.innerHTML =
            '<i class="fa-solid fa-skull-crossbones"></i>';

    }

    else if (result === "SUSPICIOUS") {

        resultIcon.innerHTML =
            '<i class="fa-solid fa-triangle-exclamation"></i>';

    }

    else {

        resultIcon.innerHTML =
            '<i class="fa-solid fa-shield-check"></i>';

    }


    title.textContent =
        result;


    risk.textContent =
        scan.riskScore || 0;


    reasons.innerHTML =
        (scan.reasons || [])
            .map(
                reason =>
                    `<li>${escapeHTML(reason)}</li>`
            )
            .join("");


    recommendations.innerHTML =
        (scan.recommendations || [])
            .map(
                item =>
                    `<li>${escapeHTML(item)}</li>`
            )
            .join("");


    resultBox.classList.remove(
        "hidden-result"
    );


    resultBox.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

}


// ============================================
// Character Counter
// ============================================

const messageInput =
    document.getElementById(
        "messageInput"
    );


messageInput.addEventListener(
    "input",
    () => {

        document.getElementById(
            "characterCount"
        ).textContent =
            `${messageInput.value.length} characters`;

    }
);


// ============================================
// Navigation
// ============================================

const navItems =
    document.querySelectorAll(
        ".nav-item[data-section]"
    );


navItems.forEach(
    item => {

        item.addEventListener(
            "click",
            event => {

                event.preventDefault();


                const section =
                    item.dataset.section;


                switchSection(
                    section
                );


                navItems.forEach(
                    nav => {

                        nav.classList.remove(
                            "active"
                        );

                    }
                );


                item.classList.add(
                    "active"
                );

            }
        );

    }
);


// ============================================
// Switch Section
// ============================================

function switchSection(
    section
) {

    const overview =
        document.getElementById(
            "overviewSection"
        );


    const scanner =
        document.getElementById(
            "scannerSection"
        );


    const history =
        document.getElementById(
            "historySection"
        );


    overview.classList.add(
        "hidden-section"
    );

    scanner.classList.add(
        "hidden-section"
    );

    history.classList.add(
        "hidden-section"
    );


    if (section === "scanner") {

        scanner.classList.remove(
            "hidden-section"
        );

    }

    else if (section === "history") {

        history.classList.remove(
            "hidden-section"
        );

    }

    else {

        overview.classList.remove(
            "hidden-section"
        );

    }

}


// ============================================
// Start Scan Button
// ============================================

document.getElementById(
    "startScanBtn"
).addEventListener(
    "click",
    () => {

        switchSection("scanner");


        navItems.forEach(
            nav => {

                nav.classList.remove(
                    "active"
                );

                if (
                    nav.dataset.section ===
                    "scanner"
                ) {

                    nav.classList.add(
                        "active"
                    );

                }

            }
        );

    }
);


// ============================================
// View History
// ============================================

document.getElementById(
    "viewHistoryBtn"
).addEventListener(
    "click",
    () => {

        switchSection("history");


        navItems.forEach(
            nav => {

                nav.classList.remove(
                    "active"
                );

                if (
                    nav.dataset.section ===
                    "history"
                ) {

                    nav.classList.add(
                        "active"
                    );

                }

            }
        );

    }
);


// ============================================
// Scan Button
// ============================================

document.getElementById(
    "scanBtn"
).addEventListener(
    "click",
    scanMessage
);


// ============================================
// Logout
// ============================================

document.getElementById(
    "logoutBtn"
).addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "cyberShieldToken"
        );

        localStorage.removeItem(
            "cyberShieldUser"
        );


        window.location.href =
            "login.html";

    }
);


// ============================================
// Mobile Menu
// ============================================

document.getElementById(
    "mobileMenu"
).addEventListener(
    "click",
    () => {

        document.getElementById(
            "sidebar"
        ).classList.toggle("open");

    }
);


// ============================================
// Security
// ============================================

function escapeHTML(
    value
) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// ============================================
// INITIAL LOAD
// ============================================

loadDashboardStats();

loadScanHistory();