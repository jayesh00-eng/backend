
export default function FilterSidebar({ filters, setFilters }) {
  // Search aur filters update karne ke liye
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
  };

  // Saare filters reset karne ke liye
  const resetFilters = () => {
    setFilters((prev) => ({
      ...prev,
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      page: 1,
    }));
  };

  return (
    <aside className="filter-sidebar">
      <h3>Filter Products</h3>

      {/* Search */}
      <div className="filter-group">
        <label htmlFor="search">Search Products</label>

        <input
          type="text"
          id="search"
          name="search"
          placeholder="Search by product name..."
          value={filters.search}
          onChange={handleChange}
        />
      </div>

      {/* Category */}
      <div className="filter-group">
        <label htmlFor="category">Category</label>

        <select
          id="category"
          name="category"
          value={filters.category}
          onChange={handleChange}
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Home">Home</option>
          <option value="Books">Books</option>
          <option value="Accessories">Accessories</option>
          <option value="Sports">Sports</option>
        </select>
      </div>

      {/* Minimum Price */}
      <div className="filter-group">
        <label htmlFor="minPrice">Minimum Price (₹)</label>

        <input
          type="number"
          id="minPrice"
          name="minPrice"
          placeholder="Enter minimum price"
          min="0"
          value={filters.minPrice}
          onChange={handleChange}
        />
      </div>

      {/* Maximum Price */}
      <div className="filter-group">
        <label htmlFor="maxPrice">Maximum Price (₹)</label>

        <input
          type="number"
          id="maxPrice"
          name="maxPrice"
          placeholder="Enter maximum price"
          min="0"
          value={filters.maxPrice}
          onChange={handleChange}
        />
      </div>

      {/* Reset Button */}
      <button
        type="button"
        className="btn reset-btn"
        onClick={resetFilters}
      >
        Reset Filters
      </button>
    </aside>
  );
}