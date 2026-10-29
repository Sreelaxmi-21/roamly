// =============================================
// ROAMLY - INTERACTIVE TRAVEL DISCOVERY WEBSITE
// =============================================


// DESTINATION DATA

const destinations = [

    {
        name: "Udaipur",
        country: "India",
        category: "Culture",
        emoji: "🏰",
        description: "Royal palaces, peaceful lakes and golden sunsets.",
        cost: 2200,
        season: "Oct–Mar",
        image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=900&q=80"
    },

    {
        name: "Bali",
        country: "Indonesia",
        category: "Beach",
        emoji: "🏝️",
        description: "Tropical shores, lush rice terraces and island calm.",
        cost: 4800,
        season: "Apr–Oct",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80"
    },

    {
        name: "Interlaken",
        country: "Switzerland",
        category: "Adventure",
        emoji: "🏔️",
        description: "Alpine views, mountain trails and clear blue lakes.",
        cost: 12500,
        season: "Jun–Sep",
        image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=900&q=80"
    },

    {
        name: "Jaipur",
        country: "India",
        category: "Culture",
        emoji: "🏯",
        description: "Pink architecture, colourful bazaars and historic forts.",
        cost: 2500,
        season: "Oct–Mar",
        image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=900&q=80"
    },

    {
        name: "Maldives",
        country: "Maldives",
        category: "Beach",
        emoji: "🌊",
        description: "Turquoise water, white sand and quiet island escapes.",
        cost: 10500,
        season: "Nov–Apr",
        image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=80"
    },

    {
        name: "Manali",
        country: "India",
        category: "Adventure",
        emoji: "🌲",
        description: "Mountain air, pine forests and scenic valleys.",
        cost: 3000,
        season: "Mar–Jun",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80"
    },

    {
        name: "Paris",
        country: "France",
        category: "City",
        emoji: "🗼",
        description: "Art, café culture and iconic city streets.",
        cost: 9500,
        season: "Apr–Jun",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80"
    },

    {
        name: "Tokyo",
        country: "Japan",
        category: "City",
        emoji: "🌸",
        description: "Neon-lit streets, tranquil gardens and unforgettable food.",
        cost: 7800,
        season: "Mar–May",
        image: "https://images.unsplash.com/photo-1540959733332-eab4de5d7f6e?auto=format&fit=crop&w=900&q=80"
    },

    {
        name: "Goa",
        country: "India",
        category: "Beach",
        emoji: "🌴",
        description: "Sunny beaches, coastal cafés and relaxed days.",
        cost: 2800,
        season: "Nov–Feb",
        image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=900&q=80"
    }

];


// SELECT HTML ELEMENTS

const $ = id => document.getElementById(id);

const grid = $("destinationGrid");
const search = $("destinationSearch");
const filters = $("categoryFilters");
const onlyFavorites = $("favoritesOnly");
const toast = $("toast");


// APPLICATION STATE

let activeCategory = "All";
let favorites = [];


// LOAD SAVED WISHLIST

try {

    const saved = JSON.parse(
        localStorage.getItem("roamlyFavorites") || "[]"
    );

    if (Array.isArray(saved)) {
        favorites = saved;
    }

} catch (error) {

    favorites = [];

}


// SHOW NOTIFICATION

function notify(message) {

    if (!toast) {
        return;
    }

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(notify.timer);

    notify.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2300);

}


// DISPLAY DESTINATION CARDS

function render() {

    if (!grid) {
        console.error("Roamly: destinationGrid was not found.");
        return;
    }

    const query = (search?.value || "")
        .trim()
        .toLowerCase();

    const results = destinations.filter(place => {

        const matchesText = [
            place.name,
            place.country,
            place.category
        ].some(value => value.toLowerCase().includes(query));

        const matchesCategory =
            activeCategory === "All" ||
            place.category === activeCategory;

        const matchesWishlist =
            !onlyFavorites?.checked ||
            favorites.includes(place.name);

        return (
            matchesText &&
            matchesCategory &&
            matchesWishlist
        );

    });


    // CLEAR OLD CARDS

    grid.replaceChildren();


    // EMPTY SEARCH RESULT

    if (results.length === 0) {

        const empty = document.createElement("p");

        empty.className = "empty-state";

        if (onlyFavorites?.checked && favorites.length === 0) {

            empty.textContent =
                "Your wishlist is empty. Tap a heart to save a destination. ♥";

        } else {

            empty.textContent =
                "No destinations found. Try another search or filter.";

        }

        grid.appendChild(empty);

        return;
    }


    // CREATE EACH DESTINATION CARD

    results.forEach(place => {

        const card = document.createElement("article");

        card.className = "destination-card";


        // IMAGE AREA

        const visual = document.createElement("div");

        visual.className =
            "destination-visual " +
            place.category.toLowerCase();


        const image = document.createElement("img");

        image.className = "destination-photo";

        image.src = place.image;

        image.alt = place.name + " travel scenery";

        image.loading = "lazy";


        // FALLBACK IF THE IMAGE CANNOT LOAD

        image.onerror = function () {

            image.remove();

            const emoji = document.createElement("span");

            emoji.className = "destination-emoji";

            emoji.textContent = place.emoji;

            visual.prepend(emoji);

        };

        visual.appendChild(image);


        // CATEGORY LABEL

        const category = document.createElement("span");

        category.className = "destination-category";

        category.textContent = place.category;

        visual.appendChild(category);


        // WISHLIST HEART

        const heart = document.createElement("button");

        heart.type = "button";

        heart.className =
            "favorite-button" +
            (favorites.includes(place.name) ? " active" : "");

        heart.textContent =
            favorites.includes(place.name) ? "♥" : "♡";

        heart.dataset.name = place.name;

        heart.setAttribute(
            "aria-pressed",
            String(favorites.includes(place.name))
        );

        heart.setAttribute(
            "aria-label",
            "Toggle " + place.name + " wishlist"
        );

        visual.appendChild(heart);


        // DESTINATION INFORMATION

        const info = document.createElement("div");

        info.className = "destination-info";


        const country = document.createElement("p");

        country.className = "destination-country";

        country.textContent = place.country;


        const title = document.createElement("h3");

        title.textContent = place.name;


        const description = document.createElement("p");

        description.textContent = place.description;


        // ESTIMATED PRICE AND BEST SEASON

        const meta = document.createElement("div");

        meta.className = "card-meta";


        const price = document.createElement("span");

        price.textContent =
            "Est. ₹" +
            place.cost.toLocaleString("en-IN") +
            "/day";


        const season = document.createElement("span");

        season.textContent = "☀ " + place.season;


        meta.append(price, season);


        // ASSEMBLE CARD

        info.append(
            country,
            title,
            description,
            meta
        );

        card.append(visual, info);

        grid.appendChild(card);

    });

}


// SEARCH DESTINATIONS

search?.addEventListener("input", render);


// FILTER BY CATEGORY

filters?.addEventListener("click", event => {

    const button = event.target.closest(
        "button[data-category]"
    );

    if (!button) {
        return;
    }

    activeCategory = button.dataset.category;

    filters
        .querySelectorAll("button[data-category]")
        .forEach(item => {

            item.classList.toggle(
                "selected",
                item === button
            );

        });

    render();

});


// FILTER SAVED DESTINATIONS

onlyFavorites?.addEventListener("change", render);


// ADD OR REMOVE WISHLIST ITEMS

grid?.addEventListener("click", event => {

    const button = event.target.closest(".favorite-button");

    if (!button) {
        return;
    }

    const name = button.dataset.name;

    if (favorites.includes(name)) {

        favorites = favorites.filter(
            item => item !== name
        );

    } else {

        favorites = [
            ...favorites,
            name
        ];

    }


    // SAVE WISHLIST IN THE BROWSER

    try {

        localStorage.setItem(
            "roamlyFavorites",
            JSON.stringify(favorites)
        );

    } catch (error) {

        console.warn(
            "The wishlist could not be saved in this browser."
        );

    }


    render();

    notify(
        favorites.includes(name)
            ? name + " saved to your wishlist ♥"
            : name + " removed from your wishlist"
    );

});


// SURPRISE ME FEATURE

$("surpriseButton")?.addEventListener("click", () => {

    const place = destinations[
        Math.floor(Math.random() * destinations.length)
    ];


    activeCategory = "All";


    // RESET FILTER BUTTON

    filters
        ?.querySelectorAll("button[data-category]")
        .forEach(button => {

            button.classList.toggle(
                "selected",
                button.dataset.category === "All"
            );

        });


    // SEARCH FOR THE RANDOM DESTINATION

    if (search) {
        search.value = place.name;
    }

    render();


    // SCROLL TO DESTINATIONS

    $("explore")?.scrollIntoView({
        behavior: "smooth"
    });


    notify(
        "Your surprise destination is " +
        place.name +
        "! ✨"
    );

});


// POPULATE TRIP PLANNER DESTINATIONS

const destinationSelect = $("tripDestination");

destinations.forEach(place => {

    if (!destinationSelect) {
        return;
    }

    const option = document.createElement("option");

    option.value = place.name;

    option.textContent =
        place.name + " — " + place.country;

    destinationSelect.appendChild(option);

});


// TRIP BUDGET ESTIMATOR

$("tripForm")?.addEventListener("submit", event => {

    event.preventDefault();


    const place = destinations.find(
        item => item.name === destinationSelect.value
    );

    const days = Number($("tripDays").value);

    const travellers = Number($("travellers").value);

    const style = $("travelStyle").value;


    // MULTIPLIERS FOR DIFFERENT TRAVEL STYLES

    const multipliers = {
        budget: 0.7,
        comfort: 1,
        premium: 1.8
    };


    // VALIDATE INPUTS

    if (
        !place ||
        !Number.isFinite(days) ||
        !Number.isFinite(travellers) ||
        days < 1 ||
        travellers < 1
    ) {

        notify(
            "Choose a destination and enter valid trip details."
        );

        return;

    }


    // CALCULATE THE ESTIMATE

    const total = Math.round(
        place.cost *
        days *
        travellers *
        multipliers[style]
    );


    // DISPLAY THE RESULT

    $("estimateAmount").textContent =
        "₹" + total.toLocaleString("en-IN");


    $("estimateDetails").textContent =
        `${days} day${days === 1 ? "" : "s"} in ${place.name} ` +
        `for ${travellers} traveller${travellers === 1 ? "" : "s"} ` +
        `(${style} style).`;


    notify("Your estimated trip budget is ready!");

});


// INITIAL PAGE RENDER

render();