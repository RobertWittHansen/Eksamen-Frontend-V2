import { API_URL } from "../../settings.js";
import {
    sanitizeStringWithTableRows,
    handleHttpErrors
}    from "../../utils.js"

const URL = API_URL + "productOrders";


export function initProductOrders(){
    fetchAllProductOrders();
    document.getElementById("btn-submit-productOrders").onclick = addNewProductOrder
    document.getElementById("tbl-body").onclick = targetProductOrdersId
}

async function fetchAllProductOrders(){
    const productOrdersFormServer = await fetch(URL)
        .then((res) => res.json())
    showAllProductOrders(productOrdersFormServer); //kalder showAllProductOrders.
}


//fra products backend Entity class.
function showAllProductOrders(data) {
    const tableRows = data.map(productOrder => `
    <tr>
    <td>${productOrder.quantity}</td>
    <td>
    <button id="${productOrder.id}-column-id-edit" type="button"  class="btn btn-primary" style="width: 100% !important;" data-bs-toggle="modal" data-bs-target="#modal-edit-ProductOrder">Edit</button>
    </td>
    </tr>`)

    // her looper vi igennem hele server data. (join ny linje)
    const tableRowsString = tableRows.join("\n")
// vi finder table body id.
    document.getElementById("tbl-body").innerHTML = sanitizeStringWithTableRows(tableRowsString);
}


async function addNewProductOrder(){
    try {
        const newProductOrder = {}

        newProductOrder.quantity = document.getElementById("add-quantity").value

        var productOrderToJson = JSON.stringify(newProductOrder)
        var options = {}
        options.method = "POST"
        options.headers ={"Content-type": "application/json"}
        options.body = productOrderToJson

        await fetch(URL + "/", options)
            .then(res => res.json())
            .then(handleHttpErrors)

    }catch (err){ }
    fetchAllProductOrders();
}

function targetProductOrdersId(event){
    const target = event.target
    const id = target.id.replace("-column-id-edit", "")
    document.getElementById("id-edit-productOrder").value = id
    renderProductOrderForEdit(id)
    document.getElementById("btn-submit-edited-productOrder").onclick = editProductOrder
    document.getElementById("btn-delete-productOrder").onclick = deleteProductOrder
}

async function editProductOrder(){
    const editedProduct = {}
//henter data
    editProductOrder.quantity = document.getElementById("edit-quantity").value

    var productOrderToJson = JSON.stringify(editedProduct)
    var productOrderId = document.getElementById("id-edit-productOrder").value

    var options = {}
    options.method = "PUT"
    options.headers ={"Content-type": "application/json"}
    options.body = productOrderToJson

    await fetch(URL + "/" + productOrderId, options)

    fetchAllProductOrders();
}

async function renderProductOrderForEdit(id) {
    const productOrder = await fetch(URL + "/" + id,)
        .then((res) => res.json())

    document.getElementById("edit-quantity").value = productOrder.quantity
}

async function deleteProductOrder(){
    var productOrderId = document.getElementById("id-edit-productOrder").value

    var options = {}
    options.method = "DELETE"
    options.headers ={"Content-type": "application/json"}

    await fetch(URL + "/" + productOrderId, options)

    fetchAllProductOrders();
}















