const FAVORITES_KEYS = "laptopFavorites";
const THEME_KEY = "laptopTheme";
export const getfavourites = () => {
  const savedfavourite = localStorage.getItem(FAVORITES_KEYS);
  if (savedfavourite) {
    return JSON.parse(savedfavourite);
  } else {
    return [];
  }
};
export const savefavourite = (favourite) => {
  localStorage.setItem(FAVORITES_KEYS, JSON.stringify(favourite));
};
export const addfavourite = (id) => {
  const favorites = getfavourites();
  if (!favorites.includes(id)) {
    favorites.push(id);
    savefavourite(favorites);
  }
};
export const removefavourite = (id) => {
  const favorites = getfavourites();
  const newfavourite = [];
  for (let i = 0; i < favorites.length; i++) {
    if (favorites[i] !== id) {
      newfavourite.push(favorites[i]);
    }
  }
  savefavourite(newfavourite);
};
export const clearfavorites = () => {
  savefavourite([]);
};
export const gettheme = () => {
  if (localStorage.getItem(THEME_KEY)) {
    return localStorage.getItem(THEME_KEY);
  } else {
    localStorage.setItem(THEME_KEY, "Light");
    return "Light";
  }
};

export const savetheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme);
};
export const getcompare = () => {
  return JSON.parse(localStorage.getItem("laptopCompare")) || [];
};

export const savecompare = (compare) => {
  localStorage.setItem("laptopCompare", JSON.stringify(compare));
};

export const addcompare = (id) => {
  const compare = getcompare();

  if (compare.includes(id)) return;

  if (compare.length >= 4) {
    alert("You can compare up to 4 laptops only.");
    return;
  }

  compare.push(id);
  savecompare(compare);
};

export const removecompare = (id) => {
  const compare = getcompare();

  const updatedCompare = compare.filter((laptopId) => laptopId !== id);

  savecompare(updatedCompare);
};

export const clearcompare = () => {
  localStorage.removeItem("laptopCompare");
};
