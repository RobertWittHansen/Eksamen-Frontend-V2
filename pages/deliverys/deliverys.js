import { API_URL } from "../../settings.js";
import {
    sanitizeStringWithTableRows,
    handleHttpErrors
}    from "../../utils.js"

const URL = API_URL + "deliverys";

export function initDeliverys(){
    fetchAllDeliverys();
    document.getElementById("btn-submit-delivery").onclick = addNewDelivery
    document.getElementById("tbl-body").onclick = targetDeliveryId
}
async function fetchAllDeliverys(){
    const deliverysFormServer = await fetch(URL).then((res) => res.json())
    showAllDeliverys(deliverysFormServer); //kalder showAllDeliverys.
}
function showAllDeliverys(data) {
    const tableRows = data.map(delivery => `
    <tr>
    <td>${delivery.deliveryDate}</td>
    <td>${delivery.fromWareHouse}</td>
    <td>${delivery.destination}</td>
    <td>
    <button id="${delivery.id}-column-id-edit" type="button"  class="btn btn-primary" style="width: 100% !important;" data-bs-toggle="modal" data-bs-target="#modal-edit-Delivery">Edit</button>
    </td>
    </tr>`)

    // her looper vi igennem hele server data. (join ny linje)
    const tableRowsString = tableRows.join("\n")
// vi finder table body id.
    document.getElementById("tbl-body").innerHTML = sanitizeStringWithTableRows(tableRowsString);
}

async function addNewDelivery(){
    try {
        const newDelivery = {}

        newDelivery.deliveryDate = document.getElementById("add-deliveryDate").value
        newDelivery.fromWareHouse = document.getElementById("add-fromWareHouse").value
        newDelivery.destination = document.getElementById("add-destination").value

        var deliveryToJson = JSON.stringify(newDelivery)
        var options = {}
        options.method = "POST"
        options.headers ={"Content-type": "application/json"}
        options.body = deliveryToJson

        await fetch(URL + "/", options)
            .then(r => r.json())
            .then(handleHttpErrors)

    }catch (err){
    }
    fetchAllDeliverys()
}

function targetDeliveryId(event){
    const target = event.target
    const id = target.id.replace("-column-id-edit", "")
    document.getElementById("id-edit-delivery").value = id
    renderDeliveryForEdit(id)
    document.getElementById("btn-submit-edited-delivery").onclick = editDelivery
    document.getElementById("btn-delete-delivery").onclick = deleteDelivery
}


//Henviser til Product html
async function editDelivery(){
    const editDelivery = {}
//henter data
    editDelivery.deliveryDate = document.getElementById("edit-deliveryDate").value
    editDelivery.fromWareHouse = document.getElementById("edit-fromWareHouse").value
    editDelivery.destination = document.getElementById("edit-destination").value


    var deliveryToJson = JSON.stringify(editedDelivery)
    var deliveryId = document.getElementById("id-edit-delivery").value

    var options = {}
    options.method = "PUT"
    options.headers ={"Content-type": "application/json"}
    options.body = deliveryToJson

    await fetch(URL + "/" + deliveryId, options)

    fetchAllDeliverys()
}


//sætter data i html
async function renderDeliveryForEdit(id) {
    const delivery = await fetch(URL + "/" + id,)
        .then((res) => res.json())

    document.getElementById("edit-deliveryDate").value = delivery.deliveryDate
    document.getElementById("edit-fromWareHouse").value = delivery.fromWareHouse
    document.getElementById("edit-destination").value = delivery.destination
}
async function deleteDelivery(){
    var deliveryId = document.getElementById("id-edit-delivery").value

    var options = {}
    options.method = "DELETE"
    options.headers ={"Content-type": "application/json"}

    await fetch(URL + "/" + deliveryId, options)

    fetchAllDeliverys()}













