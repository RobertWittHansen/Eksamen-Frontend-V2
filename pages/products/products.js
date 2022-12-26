import { API_URL } from "../../settings.js";
import {
    sanitizeStringWithTableRows,
    handleHttpErrors
}    from "../../utils.js"

const URL = API_URL + "products";

export function initProducts(){
    fetchAllProducts();
    document.getElementById("btn-submit-product").onclick = addNewProduct
    document.getElementById("tbl-body").onclick = targetProductId
}

async function fetchAllProducts(){
    const productsFormServer = await fetch(URL).then((res) => res.json())
    showAllProducts(productsFormServer); //kalder showAllProducts.
}

//fra products backend Entity class.
function showAllProducts(data) {
    const tableRows = data.map(product => `
    <tr>
    <td>${product.name}</td>
    <td>${product.price}</td>
    <td>${product.weight}</td>
    <td>
    <button id="${product.id}-column-id-edit" type="button"  class="btn btn-primary" style="width: 100% !important;" data-bs-toggle="modal" data-bs-target="#modal-edit-Product">Edit</button>
    </td>
    </tr>`)

    // her looper vi igennem hele server data. (join ny linje)
    const tableRowsString = tableRows.join("\n")
// vi finder table body id.
    document.getElementById("tbl-body").innerHTML = sanitizeStringWithTableRows(tableRowsString);
}

    async function addNewProduct(){
        try {
            const newProduct = {}

            newProduct.name = document.getElementById("add-name").value
            newProduct.price = document.getElementById("add-price").value
            newProduct.weight = document.getElementById("add-weight").value

            var productToJson = JSON.stringify(newProduct)
            var options = {}
            options.method = "POST"
            options.headers ={"Content-type": "application/json"}
            options.body = productToJson

            await fetch(URL + "/", options)
                .then(handleHttpErrors)

        }catch (err){
            console.log(err);
        }
        fetchAllProducts();
    }

function targetProductId(event){
    const target = event.target
    const id = target.id.replace("-column-id-edit", "")
    document.getElementById("id-edit-product").value = id
    renderProductForEdit(id)
    document.getElementById("btn-submit-edited-product").onclick = editProduct
    document.getElementById("btn-delete-product").onclick = deleteProduct
}

//Henviser til Product html
async function editProduct(){
    const editedProduct = {}
//henter data
    editedProduct.name = document.getElementById("edit-name").value
    editedProduct.price = document.getElementById("edit-price").value
    editedProduct.weight = document.getElementById("edit-weight").value


    var productToJson = JSON.stringify(editedProduct)
    var productId = document.getElementById("id-edit-product").value

    var options = {}
    options.method = "PUT"
    options.headers ={"Content-type": "application/json"}
    options.body = productToJson

    await fetch(URL + "/" + productId, options)

    fetchAllProducts();
}

//sætter data i html
async function renderProductForEdit(id) {
    const product = await fetch(URL + "/" + id,)
        .then((res) => res.json())

    document.getElementById("edit-name").value = product.name
    document.getElementById("edit-price").value = product.price
    document.getElementById("edit-weight").value = product.weight
}
async function deleteProduct(){
    var productId = document.getElementById("id-edit-product").value

    var options = {}
    options.method = "DELETE"
    options.headers ={"Content-type": "application/json"}

    await fetch(URL + "/" + productId, options)

    fetchAllProducts();
}