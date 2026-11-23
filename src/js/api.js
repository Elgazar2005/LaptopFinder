export const getlaptop = async () => {
  try {
    const response = await fetch("./data/laptops.json");
    if (!response.ok) {
      throw new Error("failed to load laptop data");
    } else {
      const laptops = await response.json();
      return laptops;
    }
  } catch (e) {
    console.error("Error loading laptops:", e);

    throw new Error("Could not load laptop data. Please try again.");
  }
};
