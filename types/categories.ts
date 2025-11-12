export type Category = {
  _id: string;
  name: string;
  image: string;
};

export type CategoriesResponse = {
  data: {
    categories: Category[];
  };
  total: number;
};
