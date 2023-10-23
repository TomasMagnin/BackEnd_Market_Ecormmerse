const addProductForm = document.getElementById("addProductForm");
const addProductFormReal = document.getElementById("addProductFormReal");
const productsList = document.getElementById("productsList");

async function deleteProduct(id) {
    const response = await fetch(`/api/products/${id}`, {
        method: "delete",
    })
    if(response.ok){
        const li = document.getElementById(id);
        li.remove();
    }else{
        console.error()
        alert("Product couldn't be deleted")
    }
};

function deleteProductSocket(id) {
    socket.emit('deleteProduct', id)
};

try {
    addProductForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(addProductForm);
        const entries = Array.from(formData.entries());
        const formDataObject = entries.reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {});
        const response = await fetch("/api/products", {
            method: "post",
            body: JSON.stringify(formDataObject),
            headers: {
                "content-type": "application/json"
            }
        })
        const product = await response.json();
        if(response.ok) {
            alert('product created')
            window.location.assign(window.location.href)
            const li = `
            <li id="${product.id}">
                <div>
                    <p>${product.title} - ${product.description} - ${product.price} - ${product.thumbnail} - ${product.code} - ${product.stock} - ${product.category}</p>
                    <button onclick="deleteProduct('${product.id}')">Delete</button>
                </div>
            </li>
            `;
            productsList.innerHTML += li
            addProductForm.reset();
        }else{
            alert("Error, product not loaded");
        }
    });
}catch(error){};

try {
    socket.on('connect', () => {
        console.info("Successful connection");
    });
    socket.on('addedProduct', product => {
        const li = `
        <li id="${product.id}">
            <div>
                <p>${product.title} - ${product.description} - ${product.price} - ${product.thumbnail} - ${product.code} - ${product.stock} - ${product.category}</p>
                <button onclick="deleteProductSocket('${product.id}')">Delete</button>
            </div>
        </li>
        `;
        productsList.innerHTML += li
    });

    socket.on('deletedProduct', (id) => {
        const li = document.getElementById(id);
        li.remove();
    });

addProductFormReal.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(addProductFormReal);
    const entries = Array.from(formData.entries());
    const formDataObject = entries.reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
    }, {});
    socket.emit('addProduct', formDataObject);
});
        addProductFormReal.reset();
}catch(error){};

///----------FETCH CART----------

const API_URL = 'http://localhost:8080/api';
let cartId = localStorage.getItem('cart-id');
if (!cartId) {
    createNewCart();
    cartId = localStorage.getItem('cart-id');
}

function putIntoCart(_id) {
    const url = API_URL + '/carts/' + cartId + '/product/' + _id;
    const data = {};
    const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
};
    fetch(url, options)
        .then((response) => response.json())
        .then((res) => {
            console.info(res);
            alert('added');
        })
    .catch((error) => {
        console.error('Error:', error);
        alert(JSON.stringify(error));
    });
}

function createNewCart() {
    const url = API_URL + '/carts';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    fetch(url, options)
        .then((response) => {
            response.json()
        .then((res) => {
            console.info(res);
            localStorage.setItem('cart-id', res._id);
            return res._id;
        });
        })
    .catch((error) => {
        console.error('Error:', error);
        alert(JSON.stringify(error));
    });
}

function clearCart() {
    if (!cartId) {
        return;
    }

    const url = `${API_URL}/carts/${cartId}`;
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    fetch(url, options)
        .then((response) => {
            if (response.ok) {
                console.info('Cart cleared');
            } else {
                console.error('Failed to clear the cart');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error clearing the cart');
        });
}