import { getlaptop } from "./api.js";
import {
  gettheme,
  getfavourites,
  savetheme,
  removefavourite,
  addfavourite,
  addcompare,
  getcompare,
} from "./storage.js";
const themeToggle = document.getElementById("themeToggle");
const laptopImage = document.getElementById("laptopImage");
const laptopCategory = document.getElementById("laptopCategory");
const laptopName = document.getElementById("laptopName");
const laptopDescription = document.getElementById("laptopDescription");
const laptopPrice = document.getElementById("laptopPrice");
const laptopCpu = document.getElementById("laptopCpu");
const laptopRam = document.getElementById("laptopRam");
const laptopStorage = document.getElementById("laptopStorage");
const laptopBattery = document.getElementById("laptopBattery");
const favoriteBtn = document.getElementById("favoriteBtn");
const compareBtn = document.getElementById("compareBtn");
const specBrand = document.getElementById("specBrand");
const specCategory = document.getElementById("specCategory");
const specCpu = document.getElementById("specCpu");
const specRam = document.getElementById("specRam");
const specStorage = document.getElementById("specStorage");
const specBattery = document.getElementById("specBattery");
const specWeight = document.getElementById("specWeight");
const specScreen = document.getElementById("specScreen");

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
const displayLaptopDetails = (laptop) => {
  laptopImage.src = laptop.image;
  laptopImage.alt = laptop.name;
  laptopCategory.textContent = laptop.category;
  laptopName.textContent = laptop.name;
  laptopDescription.textContent = laptop.description;
  laptopPrice.textContent = `EGP ${Number(laptop.price)}`;
  laptopCpu.textContent = laptop.cpu;
  laptopRam.textContent = `${laptop.ramGB} GB`;
  laptopStorage.textContent = `${laptop.storageGB} GB SSD`;
  laptopBattery.textContent = `${laptop.batteryHours} Hours`;
  specBrand.textContent = laptop.brand;
  specCategory.textContent = laptop.category;
  specCpu.textContent = laptop.cpu;
  specRam.textContent = `${laptop.ramGB} GB`;
  specStorage.textContent = `${laptop.storageGB} GB SSD`;
  specBattery.textContent = `${laptop.batteryHours} Hours`;
  specWeight.textContent = `${laptop.weightKg} KG`;
  specScreen.textContent = `${laptop.screenInches} Inches`;
  updateFavoriteButton();
};
let currentlap = null;
const loadLaptopDetails = async () => {
  try {
    const urlparm = new URLSearchParams(window.location.search);
    const laptopid = Number(urlparm.get("id"));
    if (!laptopid) throw new Error("Invalid laptop ID.");
    const laptops = await getlaptop();
    for (let i = 0; i < laptops.length; i++) {
      if (laptopid === laptops[i].id) {
        currentlap = laptops[i];
        break;
      }
    }
    displayLaptopDetails(currentlap);
  } catch (error) {
    console.error("Error loading laptop details:", error);
    laptopName.textContent = error.message;
  }
};
const updateFavoriteButton = () => {
  const favorites = getfavourites();
  const isFavorite = favorites.includes(currentlap.id);
  favoriteBtn.textContent = isFavorite
    ? "♥ Remove from Favorites"
    : "♡ Add to Favorites";
};
favoriteBtn.addEventListener("click", () => {
  if (!currentlap) return;

  const favorites = getfavourites();

  if (favorites.includes(currentlap.id)) {
    removefavourite(currentlap.id);
  } else {
    addfavourite(currentlap.id);
  }

  updateFavoriteButton();
});
compareBtn.addEventListener("click", () => {

    if (!currentlap) return;

    const compare = getcompare();

    if (compare.includes(currentlap.id)) {
        alert("This laptop is already in your comparison list.");
        return;
    }

    if (compare.length >= 4) {
        alert("You can compare up to 4 laptops only.");
        return;
    }

    addcompare(currentlap.id);

    alert("Laptop added to comparison!");

});
compareBtn.addEventListener("click", () => {

    if (!currentlap) return;

    const compare = getcompare();

    if (compare.includes(currentlap.id)) {
        window.location.href = "compare.html";
        return;
    }

    if (compare.length >= 4) {
        alert("You can compare up to 4 laptops only.");
        return;
    }

    addcompare(currentlap.id);

    window.location.href = "compare.html";

});
loadLaptopDetails();
