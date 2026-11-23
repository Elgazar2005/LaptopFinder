import { getfavourites, addfavourite, removefavourite } from "./storage.js";

export const createlaptopcard = (laptop) => {
  const isFavorite = getfavourites().includes(laptop.id);
  return `
        <article class="laptop-card">

            <img
                src="${laptop.image}"
                alt="${laptop.name}"
                class="w-full h-48 object-contain mb-5"
            >

            <p class="text-sm text-primary font-semibold mb-2">
                ${laptop.category.toUpperCase()}
            </p>

            <h3 class="text-xl font-bold mb-3">
                ${laptop.name}
            </h3>

            <p class="text-2xl font-bold text-primary mb-5">
               EGP ${laptop.price}.
            </p>

            <div class="grid grid-cols-2 gap-3 text-sm text-muted mb-5">

                <p>
                    RAM: ${laptop.ramGB} GB
                </p>

                <p>
                    Storage: ${laptop.storageGB} GB
                </p>

                <p>
                    Battery: ${laptop.batteryHours} Hours
                </p>

                <p>
                    Weight: ${laptop.weightKg} KG
                </p>

            </div>

            <div class="flex gap-3">

                <a
                    href="details.html?id=${laptop.id}"
                    class="btn-action flex-1"
                >
                    View Details
                </a>

                <button
                    class="favorite-btn border border-slate-200 rounded-xl px-4"
                    data-id="${laptop.id}"
                    aria-label="Toggle favorite"
                >
                    ${isFavorite ? "❤️" : "♡"}
                </button>

            </div>

        </article>
    `;
};
export const renderLaptopCards = (laptops, container) => {
  container.innerHTML = laptops
    .map((laptop) => createlaptopcard(laptop))
    .join("");
};

export const handleFavoriteClick = (id) => {
  const favorites = getfavourites();

  if (favorites.includes(id)) {
    removefavourite(id);
  } else {
    addfavourite(id);
  }
};
