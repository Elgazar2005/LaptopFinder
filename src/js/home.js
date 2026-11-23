import { getlaptop } from "./api.js";
import { gettheme, savetheme } from "./storage.js";
const totalLaptops = document.getElementById("totalLaptops");
const categoriesCount = document.getElementById("categoriesCount");
export const themeToggle = document.getElementById("themeToggle");

const LoadHomeData = async () => {
  try {
    if (!totalLaptops || !categoriesCount) {
      return;
    }
    const laptops = await getlaptop();
    totalLaptops.innerText = laptops.length;
    const allCategories = [];
    laptops.forEach((laptop) => {
      allCategories.push(laptop.category);
    });
    const category = [];
    for (let i = 0; i < allCategories.length; i++) {
      let exist = false;
      for (let j = 0; j < category.length; j++) {
        if (allCategories[i] === category[j]) {
          exist = true;
          break;
        }
      }
      if (exist === false) {
        category.push(allCategories[i]);
      }
    }
    categoriesCount.innerText = category.length;
  } catch (error) {
    console.error("Error loading home data:", error);
  }
};
const initializeTheme = () => {
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
LoadHomeData();
initializeTheme();
