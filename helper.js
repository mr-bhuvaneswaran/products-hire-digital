const fs = require('fs');

exports.getProductList = (page, limit) => {

    try {
        const products = JSON.parse(fs.readFileSync('./products.json', 'utf8'));
        return products.sort(comparator).slice(Number(page) * Number(limit) , (Number(page) * Number(limit)) + Number(limit) );
    } catch (err) {
        console.error(err);
        return [];
    }

}

function comparator(a, b) {
    let minDate = new Date();
    minDate.setTime(0);
    a.updatedAt = a.updatedAt ? new Date(a.updatedAt) : minDate;
    b.updatedAt = b.updatedAt ? new Date(b.updatedAt) : minDate;

    a.updatedAt.setHours(0,0,0,0);
    b.updatedAt.setHours(0,0,0,0);

    let diff = b.updatedAt.getTime() - a.updatedAt.getTime();
    if(diff == 0) {
        return b.productId - a.productId;
    } else return diff;

}

// For simplicity sake validations are not included
exports.createProduct = (data)=>  {

    try {

        data.productId = getNextId() + 1;
        data.createdAt = new Date();
        data.updatedAt = new Date();
        data.productPrice = Number(data.productPrice);
        data.salePrice = Number(data.salePrice);


        const products = JSON.parse(fs.readFileSync('./products.json', 'utf8'));
        products.push(data);
        fs.writeFileSync('./products.json', JSON.stringify(products));

        return data;
    
    } catch (err) {
        console.error(err);
        return {message : 'Product creation failed'};
    }

}
// For simplicity sake validations are not included
exports.updateProduct = (data) => {

    console.log(data.productId);

    data.updatedAt = new Date();
    data.productPrice = Number(data.productPrice);
    data.salePrice = Number(data.salePrice);

    try {
        const products = JSON.parse(fs.readFileSync('./products.json', 'utf8'));
        const index = products.findIndex(item => item.productId == data.productId);
        if(index != -1) {
            products[index] = data;
            fs.writeFileSync('./products.json', JSON.stringify(products));
            return data;

        } else {
            return {message : 'No product found'};
        }
    
    } catch (err) {
        console.error(err);
        return {message : 'Product update failed'};
    }

}

function getNextId() {
    const products = JSON.parse(fs.readFileSync('./products.json', 'utf8'));
    return (products[products.length - 1]).productId;
}