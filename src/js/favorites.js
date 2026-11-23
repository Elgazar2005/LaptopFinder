import { getlaptop } from "./api.js";

import {
  gettheme,
  savetheme,
  getfavourites,
  removefavourite,
  clearfavorites,
} from "./storage.js";

// HTML Elements
const themeToggle = document.getElementById("themeToggle");
const averagePrice = document.getElementById("averagePrice");
const favoritesCount = document.getElementById("favoritesCount");
const favoritesContainer = document.getElementById("favoritesContainer");

const emptyFavorites = document.getElementById("emptyFavorites");
const clearFavorites = document.getElementById("clearFavorites");

// Theme
const calculateAveragePrice = (favorites) => {
  if (favorites.length === 0) {
    averagePrice.textContent = "EGP 0";
    return;
  }

  let totalPrice = 0;

  favorites.forEach((laptop) => {
    totalPrice += Number(laptop.price);
  });

  const average = totalPrice / favorites.length;

  averagePrice.textContent = `EGP ${average}`;
};
const initializeTheme = () => {
  const currentTheme = gettheme();

  document.documentElement.classList.toggle("dark", currentTheme === "dark");

  themeToggle.textContent = currentTheme === "dark" ? "☀️" : "🌙";
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

// Display Favorites Count
const updateFavoritesCount = () => {
  favoritesCount.textContent = getfavourites().length;
};

// Render Favorite Laptops
const renderFavorites = (favorites) => {
  favoritesCount.textContent = favorites.length;
  favoritesCount.textContent = favorites.length;
  calculateAveragePrice(favorites);

  if (favorites.length === 0) {
    favoritesContainer.innerHTML = "";

    emptyFavorites.classList.remove("hidden");
    clearFavorites.classList.add("hidden");

    return;
  }

  emptyFavorites.classList.add("hidden");
  clearFavorites.classList.remove("hidden");

  let cardsHTML = "";

  favorites.forEach((laptop) => {
    cardsHTML += `
            <div class="laptop-card">

                <img
                    src="${laptop.image}"
                    alt="${laptop.name}"
                    class="w-full h-48 object-contain mb-5"
                >

                <p class="text-sm text-primary font-semibold">
                    ${laptop.category}
                </p>

                <h3 class="text-xl font-bold dark:text-white mt-2">
                    ${laptop.name}
                </h3>

                <p class="text-muted dark:text-slate-400 mt-2">
                    ${laptop.cpu}
                </p>

                <p class="text-primary text-xl font-bold mt-4">
                    EGP ${Number(laptop.price)}
                </p>

                <div class="flex gap-3 mt-5">

                    <a
                        href="details.html?id=${laptop.id}"
                        class="btn-action flex-1"
                    >
                        View Details
                    </a>

                    <button
                        class="remove-favorite-btn border border-red-500 text-red-500 rounded-xl px-4 hover:bg-red-50 dark:hover:bg-red-950"
                        data-id="${laptop.id}"
                        title="Remove from Favorites"
                    >
                        ♥
                    </button>

                </div>

            </div>
        `;
  });

  favoritesContainer.innerHTML = cardsHTML;
};

// Load Favorites
const loadFavorites = async () => {
  try {
    const allLaptops = await getlaptop();

    const favoriteIds = getfavourites();

    const favoriteLaptops = allLaptops.filter((laptop) =>
      favoriteIds.includes(laptop.id),
    );

    renderFavorites(favoriteLaptops);
  } catch (error) {
    console.error("Error loading favorites:", error);

    emptyFavorites.classList.remove("hidden");
    emptyFavorites.textContent = error.message;
  }
};

// Remove One Favorite
favoritesContainer.addEventListener("click", (event) => {
  const removeButton = event.target.closest(".remove-favorite-btn");

  if (!removeButton) return;

  const laptopId = Number(removeButton.dataset.id);

  removefavourite(laptopId);

  loadFavorites();
});

// Clear All Favorites
clearFavorites.addEventListener("click", () => {
  clearfavorites();

  loadFavorites();
});

loadFavorites();
