enum GridFilterTypeEnum {
  MATCH = "match",
  RANGE = "range",
  VALUE_SEARCH = "valueSearch",
}

type GridFilterValue<T> = {
  type: GridFilterTypeEnum.MATCH | GridFilterTypeEnum.RANGE;
  filter: Extract<T, string | number>;
  filterTo?: Extract<T, string | number>;
};

type GridFilterSetValues<T> = {
  type: GridFilterTypeEnum.VALUE_SEARCH;
  values: T[];
};

abstract class CoreClass {
	name: string = '';	
}

class Category extends CoreClass {
	constructor(
		public name: string,
		public films: Film[]
	) {
		super();
	}
}

class Film extends CoreClass {
  constructor(
    public name: string,
    public year: number,
    public rating: number,
    public awards: string[]
  ) {
    super();
  }
}

abstract class List {
	abstract applySearchValue(filter: GridFilterValue<string>): void;
}

class FilmList extends List {
  private films: Film[];
  private filters: Partial<{
    name: GridFilterValue<string>;
    year: GridFilterValue<number>;
    rating: GridFilterValue<number>;
    awards: GridFilterSetValues<string>;
  }> = {};

  constructor(films: Film[]) {
		super();
    this.films = films;
  }

  applySearchValue(filter: GridFilterValue<string>) {
    this.filters.name = filter;
  }

  applyFiltersValue(filters: {
    year?: GridFilterValue<number>;
    rating?: GridFilterValue<number>;
    awards?: GridFilterSetValues<string>;
  }) {
    this.filters = { ...this.filters, ...filters };
  }

  filterFilms(): Film[] {
    return this.films.filter((film) => {
      if (this.filters.name && film.name !== this.filters.name.filter) {
        return false;
      }

			// others filters logic
      return true;
    });
  }
}

class CategoryList extends List {
  private categories: Category[];
  private filter: GridFilterValue<string> | null = null;

  constructor(categories: Category[]) {
		super();
    this.categories = categories;
  }

  applySearchValue(filter: GridFilterValue<string>) {
    this.filter = filter;
  }

  filterCategories(): Category[] {
    if (!this.filter) return this.categories;
    return this.categories.filter((category) => category.name.includes(this.filter!.filter));
  }
}