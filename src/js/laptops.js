import { getlaptop } from "./api.js";
import { gettheme, savetheme } from "./storage.js";

import { renderLaptopCards, handleFavoriteClick } from "./ui.js";
const themeToggle=document.getElementById("themeToggle")
const laptopsContainer = document.getElementById("laptopsContainer");
const loadingSkeleton = document.getElementById("loadingSkeleton");
const errorMessage = document.getElementById("errorMessage");
const resultsCount = document.getElementById("resultCount");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const maxPriceFilter = document.getElementById("maxPriceFilter");
const ramFilter = document.getElementById("ramFilter");
const batteryFilter = document.getElementById("batteryFilter");
const applyFiltersButton = document.getElementById("applyFilters");
const clearFiltersButton = document.getElementById("clearFilters");
const sortSelect = document.getElementById("sortSelect");

let allLaptops = [];

const loadLaptops = async () => {
  try {
    loadingSkeleton.classList.remove("hidden");
    errorMessage.classList.add("hidden");

    allLaptops = await getlaptop();

    renderLaptopCards(allLaptops, laptopsContainer);

    resultsCount.textContent = `${allLaptops.length}`;
  } catch (error) {
    errorMessage.textContent = error.message;
    errorMessage.classList.remove("hidden");
  } finally {
    loadingSkeleton.classList.add("hidden");
  }
};

// Favorite button
laptopsContainer.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest(".favorite-btn");

  if (!favoriteButton) return;

  const laptopId = Number(favoriteButton.dataset.id);

  handleFavoriteClick(laptopId);

  renderLaptopCards(allLaptops, laptopsContainer);
});

loadLaptops();

const applyFilters = () => {
  let filteredLaptops = [...allLaptops];
  const searchValue = searchInput.value.toLowerCase();
  filteredLaptops = filteredLaptops.filter((laptop) => {
    return (
      laptop.name.toLowerCase().includes(searchValue) ||
      laptop.brand.toLowerCase().includes(searchValue)
    );
  });
  const selectedCategory = categoryFilter.value;

  if (selectedCategory !== "all") {
    filteredLaptops = filteredLaptops.filter((laptop) => {
      return laptop.category === selectedCategory;
    });
  }
  const maxPrice = Number(maxPriceFilter.value);
  if (maxPriceFilter.value !== "") {
    filteredLaptops = filteredLaptops.filter((laptop) => {
      return laptop.price <= maxPrice;
    });
  }
  const minRAM = Number(ramFilter.value);
  if (minRAM > 0) {
    filteredLaptops = filteredLaptops.filter((laptop) => {
      return laptop.ramGB >= minRAM;
    });
  }
  const minBattery = Number(batteryFilter.value);
  if (batteryFilter.value !== "") {
    filteredLaptops = filteredLaptops.filter((laptop) => {
      return laptop.batteryHours >= minBattery;
    });
  }

  const sortValue = sortSelect.value;

  if (sortValue === "price-low") {
    filteredLaptops.sort((a, b) => a.price - b.price);
  } else if (sortValue === "price-high") {
    filteredLaptops.sort((a, b) => b.price - a.price);
  } else if (sortValue === "battery-high") {
    filteredLaptops.sort((a, b) => b.batteryHours - a.batteryHours);
  } else if (sortValue === "battery-low") {
    filteredLaptops.sort((a, b) => a.batteryHours - b.batteryHours);
  } else if (sortValue === "weight-low") {
    filteredLaptops.sort((a, b) => a.weightKg - b.weightKg);
  } else if (sortValue === "weight-high") {
    filteredLaptops.sort((a, b) => b.weightKg - a.weightKg);
  }

  renderLaptopCards(filteredLaptops, laptopsContainer);
  resultsCount.textContent = filteredLaptops.length;
};
searchInput.addEventListener("input", applyFilters);
applyFiltersButton.addEventListener("click", applyFilters);
sortSelect.addEventListener("change", applyFilters);
clearFiltersButton.addEventListener("click", () => {
  searchInput.value = "";
  categoryFilter.value = "all";
  maxPriceFilter.value = "";
  ramFilter.value = "";
  batteryFilter.value = "";
  sortSelect.value = "default";

  applyFilters();
});const initializeTheme = () => {
  const currentTheme = gettheme();
  document.documentElement.classList.toggle("dark", currentTheme === "dark");
  themeToggle.textContent = currentTheme === "dark" ? "☀️" : "🌙";
};
themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.classList.toggle("dark");
  const newTheme = isDark ? "dark" : "light";
  savetheme(newTheme);
  themeToggle.textContent = isDark ? "☀️" : "🌙";
});
initializeTheme();