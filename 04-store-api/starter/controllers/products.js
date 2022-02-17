const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
    const products = await Product.find(req.query);
    res.status(200).json(products);
};

const getAllProducts = async (req, res) => {
    const {featured, company, name, sort, fields, numericFilters} = req.query;
    const queryObject = {};

    if (featured) {
        queryObject.featured = featured === 'true' ? true: false;
    }

    if (company) {
        queryObject.company = company;
    }

    if (name) {
        queryObject.name = {$regex: name, $options: 'i'};
    }

    if (numericFilters) {
        const operatorMap = {
            ">": "$gt",
            ">=": "$gte",
            "=": "$eq",
            "<": "$lt",
            "<=": "$lte"
        };
        const regex = /\b(>|>=|=|<|<=)\b/g;
        let filters = numericFilters.replace(regex, (match) => `-${operatorMap[match]}-`);
        const options = ['price', 'rating'];
        filters = filters.split(",").forEach((item) => {
            const [field, operator, value] = item.split("-");
            if (options.includes(field)) {
                queryObject[field] = {[operator]: Number(value)};
            }
        });
        console.log(queryObject);
    }

    let result = Product.find(queryObject);

    if (sort) {
        const predicates = sort.split(",").join(" ");
        result = result.sort(predicates);
    } else {
        // default sort
        result = result.sort("createdAt");
    }

    if (fields) {
        const select = fields.split(",").join(" ");
        result = result.select(select);
    }

    // manual pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10; // page size
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(parseInt(limit));

    const products = await result;
    res.status(200).json({products, found: products.length});
};

module.exports = {
    getAllProducts,
    getAllProductsStatic
}