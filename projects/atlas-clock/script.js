// ==========================================
// DAFTAR TIMEZONE DUNIA
// ==========================================

const timezones = [
    "Africa/Abidjan",
    "Africa/Accra",
    "Africa/Addis_Ababa",
    "Africa/Algiers",
    "Africa/Cairo",
    "Africa/Casablanca",
    "Africa/Johannesburg",
    "Africa/Lagos",
    "Africa/Nairobi",
    "Africa/Tunis",

    "America/Anchorage",
    "America/Argentina/Buenos_Aires",
    "America/Bogota",
    "America/Caracas",
    "America/Chicago",
    "America/Denver",
    "America/Detroit",
    "America/Guatemala",
    "America/Halifax",
    "America/Lima",
    "America/Los_Angeles",
    "America/Mexico_City",
    "America/New_York",
    "America/Phoenix",
    "America/Santiago",
    "America/Sao_Paulo",
    "America/Toronto",
    "America/Vancouver",

    "Asia/Almaty",
    "Asia/Baghdad",
    "Asia/Bangkok",
    "Asia/Colombo",
    "Asia/Dhaka",
    "Asia/Dubai",
    "Asia/Hong_Kong",
    "Asia/Ho_Chi_Minh",
    "Asia/Jakarta",
    "Asia/Jerusalem",
    "Asia/Karachi",
    "Asia/Kathmandu",
    "Asia/Kolkata",
    "Asia/Kuala_Lumpur",
    "Asia/Manila",
    "Asia/Seoul",
    "Asia/Shanghai",
    "Asia/Singapore",
    "Asia/Taipei",
    "Asia/Tashkent",
    "Asia/Tehran",
    "Asia/Tokyo",

    "Australia/Adelaide",
    "Australia/Brisbane",
    "Australia/Darwin",
    "Australia/Melbourne",
    "Australia/Perth",
    "Australia/Sydney",

    "Europe/Amsterdam",
    "Europe/Athens",
    "Europe/Berlin",
    "Europe/Brussels",
    "Europe/Bucharest",
    "Europe/Copenhagen",
    "Europe/Dublin",
    "Europe/Helsinki",
    "Europe/Istanbul",
    "Europe/Lisbon",
    "Europe/London",
    "Europe/Madrid",
    "Europe/Moscow",
    "Europe/Oslo",
    "Europe/Paris",
    "Europe/Prague",
    "Europe/Rome",
    "Europe/Stockholm",
    "Europe/Vienna",
    "Europe/Warsaw",
    "Europe/Zurich",

    "Pacific/Auckland",
    "Pacific/Fiji",
    "Pacific/Guam",
    "Pacific/Honolulu",
    "Pacific/Port_Moresby",
    "Pacific/Tongatapu"
];

const globeCities = [
    { name: "New York", lat: 40.7, lon: -74 }, { name: "London", lat: 51.5, lon: -0.1 },
    { name: "Cairo", lat: 30, lon: 31 }, { name: "Jakarta", lat: -6.2, lon: 106.8 },
    { name: "Tokyo", lat: 35.7, lon: 139.7 }, { name: "Sydney", lat: -33.9, lon: 151.2 },
    { name: "Sao Paulo", lat: -23.5, lon: -46.6 }, { name: "Cape Town", lat: -33.9, lon: 18.4 }
];

function initGlobe() {
    const canvas = document.getElementById("globeCanvas");
    if (!canvas) return;
    const context = canvas.getContext("2d");
    let rotation = -18;
    let dragStart = null;
    let rotationStart = rotation;

    const continents = [
        [[-168, 72], [-140, 70], [-125, 52], [-105, 50], [-88, 28], [-100, 15], [-118, 22], [-130, 38], [-155, 48]],
        [[-82, 12], [-55, 8], [-48, -15], [-60, -55], [-72, -50], [-80, -20]],
        [[-18, 36], [8, 36], [34, 30], [50, 12], [38, -35], [12, -35], [-8, -5], [-20, 18]],
        [[40, 66], [125, 58], [150, 42], [135, 15], [105, 8], [75, 20], [54, 38]],
        [[112, -12], [153, -18], [146, -40], [120, -38], [112, -25]]
    ];

    function resize() {
        const size = canvas.getBoundingClientRect().width;
        const pixelRatio = window.devicePixelRatio || 1;
        canvas.width = size * pixelRatio;
        canvas.height = size * pixelRatio;
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

    function project(lon, lat, radius, center, offset) {
        const longitude = (lon + offset) * Math.PI / 180;
        const latitude = lat * Math.PI / 180;
        const depth = Math.cos(latitude) * Math.cos(longitude);
        return { x: center + radius * Math.cos(latitude) * Math.sin(longitude), y: center - radius * Math.sin(latitude), depth };
    }

    function draw() {
        const size = canvas.clientWidth;
        const center = size / 2;
        const radius = size * 0.37;
        context.clearRect(0, 0, size, size);
        const ocean = context.createRadialGradient(center - radius * 0.4, center - radius * 0.6, 3, center, center, radius * 1.15);
        ocean.addColorStop(0, "#347a77"); ocean.addColorStop(0.6, "#164e50"); ocean.addColorStop(1, "#0a292f");
        context.beginPath(); context.arc(center, center, radius, 0, Math.PI * 2); context.fillStyle = ocean; context.fill();
        context.save(); context.beginPath(); context.arc(center, center, radius, 0, Math.PI * 2); context.clip();

        context.strokeStyle = "rgba(190, 222, 184, .18)"; context.lineWidth = 0.7;
        for (let latitude = -60; latitude <= 60; latitude += 30) {
            context.beginPath();
            for (let longitude = -180; longitude <= 180; longitude += 5) { const point = project(longitude, latitude, radius, center, rotation); longitude === -180 ? context.moveTo(point.x, point.y) : context.lineTo(point.x, point.y); }
            context.stroke();
        }
        for (let longitude = -150; longitude <= 180; longitude += 30) {
            context.beginPath();
            for (let latitude = -90; latitude <= 90; latitude += 5) { const point = project(longitude, latitude, radius, center, rotation); latitude === -90 ? context.moveTo(point.x, point.y) : context.lineTo(point.x, point.y); }
            context.stroke();
        }

        continents.forEach(continent => {
            context.beginPath();
            continent.forEach(([longitude, latitude], index) => { const point = project(longitude, latitude, radius, center, rotation); index ? context.lineTo(point.x, point.y) : context.moveTo(point.x, point.y); });
            context.closePath(); context.fillStyle = "#82ad69"; context.fill(); context.strokeStyle = "rgba(194, 222, 154, .4)"; context.stroke();
        });
        globeCities.forEach(city => {
            const point = project(city.lon, city.lat, radius, center, rotation);
            if (point.depth > 0) { context.beginPath(); context.arc(point.x, point.y, 3.5, 0, Math.PI * 2); context.fillStyle = "#e5bc68"; context.shadowColor = "#e5bc68"; context.shadowBlur = 12; context.fill(); context.shadowBlur = 0; }
        });
        context.restore();
        context.beginPath(); context.arc(center, center, radius, 0, Math.PI * 2); context.strokeStyle = "rgba(197, 224, 176, .42)"; context.lineWidth = 1; context.stroke();
        requestAnimationFrame(() => { if (!dragStart) rotation += 0.035; draw(); });
    }

    canvas.addEventListener("pointerdown", event => { dragStart = event.clientX; rotationStart = rotation; canvas.setPointerCapture(event.pointerId); });
    canvas.addEventListener("pointermove", event => { if (dragStart !== null) rotation = rotationStart + (event.clientX - dragStart) * 0.45; });
    canvas.addEventListener("pointerup", () => { dragStart = null; });
    canvas.addEventListener("pointercancel", () => { dragStart = null; });
    window.addEventListener("resize", resize);
    resize(); draw();
}


// ==========================================
// MENGUBAH NAMA TIMEZONE MENJADI NAMA KOTA
// ==========================================

function getCityName(timezone) {

    let city = timezone.split("/").pop();

    city = city.replace(/_/g, " ");

    return city;
}


// ==========================================
// MENGUBAH TIMEZONE MENJADI NAMA NEGARA/WILAYAH
// ==========================================

function getCountryName(timezone) {

    let region = timezone.split("/")[0];

    const countries = {
        Africa: "Africa",
        America: "America",
        Asia: "Asia",
        Australia: "Australia",
        Europe: "Europe",
        Pacific: "Pacific"
    };

    return countries[region] || region;
}


// ==========================================
// MEMBUAT CARD CLOCK
// ==========================================

function displayClocks(list = timezones) {

    const clockList = document.getElementById("clockList");

    clockList.innerHTML = "";


    list.forEach((timezone, index) => {

        const city = getCityName(timezone);
        const country = getCountryName(timezone);

        const card = document.createElement("div");

        card.className = "clock-card";

        card.innerHTML = `
            <div class="city">
                ${city}
            </div>

            <div class="country">
                ${country}
            </div>

            <div
                class="time"
                id="time-${index}"
            >
                00:00:00
            </div>

            <div
                class="date"
                id="date-${index}"
            >
                Loading...
            </div>

            <div class="timezone">
                ${timezone}
            </div>
        `;

        clockList.appendChild(card);

    });


    updateClocks(list);
}


// ==========================================
// UPDATE SEMUA JAM
// ==========================================

function updateClocks(list = timezones) {

    const now = new Date();


    list.forEach((timezone, index) => {

        const time = new Intl.DateTimeFormat(
            "id-ID",
            {
                timeZone: timezone,

                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",

                hour12: false
            }
        ).format(now);


        const date = new Intl.DateTimeFormat(
            "id-ID",
            {
                timeZone: timezone,

                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        ).format(now);


        const timeElement =
            document.getElementById(`time-${index}`);

        const dateElement =
            document.getElementById(`date-${index}`);


        if (timeElement) {
            timeElement.textContent = time;
        }

        if (dateElement) {
            dateElement.textContent = date;
        }

    });

}


// ==========================================
// SEARCH
// ==========================================

function searchCity() {

    const input =
        document.getElementById("searchInput");

    const keyword =
        input.value.toLowerCase().trim();


    if (keyword === "") {

        displayClocks();

        return;
    }


    const results = timezones.filter(timezone => {

        const city =
            getCityName(timezone).toLowerCase();

        const region =
            getCountryName(timezone).toLowerCase();

        const zone =
            timezone.toLowerCase();


        return (
            city.includes(keyword) ||
            region.includes(keyword) ||
            zone.includes(keyword)
        );

    });


    displayClocks(results);


    if (results.length === 0) {

        document.getElementById("clockList").innerHTML = `
            <p style="
                grid-column: 1 / -1;
                color: #999;
                font-size: 18px;
            ">
                Kota atau timezone tidak ditemukan 🌍
            </p>
        `;

    }

}


// ==========================================
// SEARCH DENGAN ENTER
// ==========================================

document
    .getElementById("searchInput")
    .addEventListener("keydown", function(event) {

        if (event.key === "Enter") {

            searchCity();

        }

    });


// ==========================================
// UPDATE JAM SETIAP DETIK
// ==========================================

setInterval(() => {

    const input =
        document.getElementById("searchInput");

    const keyword =
        input.value.toLowerCase().trim();


    let list = timezones;


    if (keyword !== "") {

        list = timezones.filter(timezone => {

            const city =
                getCityName(timezone).toLowerCase();

            const region =
                getCountryName(timezone).toLowerCase();

            const zone =
                timezone.toLowerCase();


            return (
                city.includes(keyword) ||
                region.includes(keyword) ||
                zone.includes(keyword)
            );

        });

    }


    updateClocks(list);

}, 1000);


// ==========================================
// JALANKAN SAAT WEBSITE DIBUKA
// ==========================================

initGlobe();
displayClocks();