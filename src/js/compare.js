
import { getlaptop } from "./api.js";
import { gettheme, savetheme } from "./storage.js";

// HTML Elements
const themeToggle = document.getElementById("themeToggle");
const compareCount = document.getElementById("compareCount");
const compareHead = document.getElementById("compareHead");
const compareBody = document.getElementById("compareBody");
const comparisonSection = document.getElementById("comparisonSection");
const emptyCompare = document.getElementById("emptyCompare");
const clearCompare = document.getElementById("clearCompare");
const clearCompareContainer = document.getElementById("clearCompareContainer");

const COMPARE_KEY = "laptopCompare";

let comparedLaptops = [];


// Initialize Theme
const initializeTheme = () => {
    const currentTheme = gettheme();

    document.documentElement.classList.toggle(
        "dark",
        currentTheme === "dark"
    );

    themeToggle.textContent =
        currentTheme === "dark" ? "☀️" : "🌙";
};

if (themeToggle) {
    initializeTheme();

    themeToggle.addEventListener("click", () => {
        const isDark = document.documentElement.classList.toggle("dark");

        const newTheme = isDark ? "dark" : "light";

        savetheme(newTheme);

        themeToggle.textContent = isDark ? "☀️" : "🌙";
    });
}


// Get Compare IDs from localStorage
const getCompareList = () => {
    const savedList = localStorage.getItem(COMPARE_KEY);

    return savedList ? JSON.parse(savedList) : [];
};


// Save Compare IDs in localStorage
const saveCompareList = (ids) => {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(ids));
};


// Update Compare Count
const updateCompareCount = () => {
    compareCount.textContent = `${comparedLaptops.length} / 4 Selected`;
};


// Render Table Header
const renderCompareHeader = () => {

    let headerHTML = `
        <tr>
            <th class="p-5 text-slate-500 dark:text-slate-300 font-semibold">
                Specifications
            </th>
    `;

    comparedLaptops.forEach((laptop) => {

        headerHTML += `
            <th class="p-5 min-w-48">
                <div class="text-center">

                    <img
                        src="${laptop.image}"
                        alt="${laptop.name}"
                        class="h-28 w-full object-contain mb-3"
                    >

                    <h3 class="font-bold dark:text-white">
                        ${laptop.name}
                    </h3>

                    <button
                        class="remove-compare-btn text-sm text-red-500 hover:text-red-700 mt-3"
                        data-id="${laptop.id}"
                    >
                        Remove
                    </button>

                </div>
            </th>
        `;
    });

    headerHTML += `</tr>`;

    compareHead.innerHTML = headerHTML;
};


// Render Table Body
const renderCompareBody = () => {

    const specifications = [
        { label: "Price", key: "price", unit: " EGP", best: "min" },
        { label: "Brand", key: "brand" },
        { label: "Category", key: "category" },
        { label: "Processor", key: "cpu" },
        { label: "RAM", key: "ramGB", unit: " GB", best: "max" },
        { label: "Storage", key: "storageGB", unit: " GB", best: "max" },
        { label: "Battery", key: "batteryHours", unit: " Hours", best: "max" },
        { label: "Weight", key: "weightKg", unit: " KG", best: "min" },
        { label: "Screen Size", key: "screenInches", unit: " Inches", best: "max" },
    ];

    let bodyHTML = "";

    specifications.forEach((specification, index) => {

        const rowColor =
            index % 2 === 0
                ? "bg-white dark:bg-slate-800"
                : "bg-slate-50 dark:bg-slate-700";

        // Find the best value for this specification
        let bestValue = null;

        if (specification.best === "max") {

            bestValue = Math.max(
                ...comparedLaptops.map((laptop) =>
                    Number(laptop[specification.key])
                )
            );

        } else if (specification.best === "min") {

            bestValue = Math.min(
                ...comparedLaptops.map((laptop) =>
                    Number(laptop[specification.key])
                )
            );
        }

        bodyHTML += `
            <tr class="border-t border-slate-200 dark:border-slate-600 ${rowColor}">

                <th class="p-5 text-slate-500 dark:text-slate-300 font-medium">
                    ${specification.label}
                </th>
        `;

        comparedLaptops.forEach((laptop) => {

            const value = laptop[specification.key];

            let isBest = false;

            if (specification.best) {
                isBest = Number(value) === bestValue;
            }

            const displayValue = value + (specification.unit || "");

            bodyHTML += `
                <td class="p-5 text-center dark:text-slate-100
                    ${isBest
                        ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 font-bold"
                        : ""
                    }">

                    ${displayValue}

                    ${isBest ? " ★" : ""}

                </td>
            `;
        });

        bodyHTML += `</tr>`;
    });

    compareBody.innerHTML = bodyHTML;
};


// Render Everything
const renderComparison = () => {

    updateCompareCount();

    if (comparedLaptops.length === 0) {

        comparisonSection.classList.add("hidden");
        emptyCompare.classList.remove("hidden");
        clearCompareContainer.classList.add("hidden");

        return;
    }

    comparisonSection.classList.remove("hidden");
    emptyCompare.classList.add("hidden");
    clearCompareContainer.classList.remove("hidden");

    renderCompareHeader();
    renderCompareBody();
};


// Remove One Laptop
compareHead.addEventListener("click", (event) => {

    const removeButton = event.target.closest(".remove-compare-btn");

    if (!removeButton) return;

    const laptopId = Number(removeButton.dataset.id);

    const updatedIds = getCompareList().filter(
        (id) => Number(id) !== laptopId
    );

    saveCompareList(updatedIds);

    comparedLaptops = comparedLaptops.filter(
        (laptop) => laptop.id !== laptopId
    );

    renderComparison();
});


// Clear All Laptops
clearCompare.addEventListener("click", () => {

    saveCompareList([]);

    comparedLaptops = [];

    renderComparison();
});


// Load Comparison Data
const loadComparison = async () => {

    try {

        const allLaptops = await getlaptop();

        const compareIds = getCompareList();

        comparedLaptops = allLaptops.filter((laptop) =>
            compareIds.includes(Number(laptop.id))
        );

        // Remove IDs that no longer exist in JSON
        saveCompareList(comparedLaptops.map((laptop) => laptop.id));

        renderComparison();

    } catch (error) {

        console.error("Error loading comparison:", error);

        comparisonSection.classList.add("hidden");
        emptyCompare.classList.remove("hidden");
    }
};


loadComparison();
