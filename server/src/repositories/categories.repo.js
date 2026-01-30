import Category from "../models/category.model.js";

export const categoryRepository = {
  findByName: (name) =>
    Category.findOne({
      categoryName: new RegExp(`^${name}$`, "i"),
      isDeleted: false,
    }),

  create: (data) => Category.create(data),
  findById: (id) =>
    Category.findOne({ _id: id, isDeleted: false }),

  updateById: (id, data) =>
    Category.findOneAndUpdate(
      { _id: id, isDeleted: false },
      data,
      { new: true }
    ),

  softDelete: (id) =>
    Category.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    ),

  toggleList: (id, isListed) =>
    Category.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isListed },
      { new: true }
    ),

  findAll: ({ search, page, limit, sort,select="",isListed}) => {
    const query = {
      isDeleted: false,
      ...(search && {
        categoryName: { $regex: search, $options: "i" },
      }),
    };

    if(isListed){
      query.isListed = isListed
    }

    return Promise.all([
      Category.find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit).select(select),
      Category.countDocuments(query),
    ]);
  },
};
