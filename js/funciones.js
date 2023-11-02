const btnSubmit = document.querySelector("#formulario input[type='submit']")
const listaClientes = document.querySelector("#listado-clientes")

let db

const formData = {
    nombre: "",
    email: "",
    telefono: "",
    empresa: ""
}

if (document.querySelector("#id")) {
    formData.id = ""
}

export function initializeDB() {
    let request = indexedDB.open("clientes")

    request.addEventListener("success", startDB)
    request.addEventListener("upgradeneeded", initializeDBStorage)
}

function startDB(e) {
    db = e.target.result
}

function initializeDBStorage(e) {
    let database = e.target.result
    let storage = database.createObjectStore("clientes", {keyPath: "id", autoIncrement: true})
    storage.createIndex("buscarNombre", "nombre", {unique: false})
}

export function getClients() {
    clearClientsHTML()
    let transaction = db.transaction("clientes")
    let storage = transaction.objectStore("clientes")
    let cursor = storage.openCursor()
    cursor.addEventListener("success", showClients)
}

function showClients(e) {
    const row = document.createElement("tr")
    listaClientes.appendChild(row)
    let cursor = e.target.result
    if (cursor) {
        let nameColumn = document.createElement("td")
        let phoneColumn = document.createElement("td")
        let companyColumn = document.createElement("td")
        let deleteClientHTML = document.createElement("button")
        deleteClientHTML.setAttribute("id", cursor.value.id)
        deleteClientHTML.textContent = "Borrar"
        nameColumn.textContent = cursor.value.nombre
        phoneColumn.textContent = cursor.value.telefono
        companyColumn.textContent = cursor.value.empresa
        row.appendChild(nameColumn)
        row.appendChild(phoneColumn)
        row.appendChild(companyColumn)
        row.append(deleteClientHTML)
        deleteClientHTML.addEventListener("click", function() {
            deleteClient(parseInt(deleteClientHTML.getAttribute("id")))
        })
        cursor.continue()
    }
}

function clearClientsHTML() {
    while (listaClientes.firstChild) {
        listaClientes.removeChild(listaClientes.firstChild)
    }
}

export function saveClient(e, nombreForm, correoForm, telefonoForm, empresaForm) {
    e.preventDefault()
    let transaction = db.transaction("clientes", "readwrite")
    let storage = transaction.objectStore("clientes")
    storage.add({
        nombre: nombreForm,
        correo: correoForm,
        telefono: telefonoForm,
        empresa: empresaForm
    })
}

export function editClient(e, idForm, nombreForm, correoForm, telefonoForm, empresaForm) {
    e.preventDefault()
    let transaction = db.transaction("clientes", "readwrite")
    let storage = transaction.objectStore("clientes")
    let request = storage.get(idForm)
    request.addEventListener("success", function() {
        storage.put({
            nombre: nombreForm,
            correo: correoForm,
            telefono: telefonoForm,
            empresa: empresaForm,
            id: idForm
        })
    })
}

function deleteClient(id) {
    let transaction = db.transaction("clientes", "readwrite")
    let storage = transaction.objectStore("clientes")
    transaction.addEventListener("complete", getClients)
    storage.delete(id)
}

export function validateData(e) {
    if (e.target.value.trim() === '') {
        showErrorAlert(`El campo ${e.target.id} es obligatorio`, e.target.parentElement)
        formData[e.target.name] = ""
        console.log(formData)
        enableOrDisableSubmitButton()
        return
    }
    if (e.target.id === 'id' && isNaN(e.target.value)) {
        showErrorAlert('La ID no es válida', e.target.parentElement)
        formData[e.target.name] = ""
        console.log(formData)
        enableOrDisableSubmitButton()
        return
    }
    if (e.target.id === 'email' && !validateEmail(e.target.value)) {
        showErrorAlert('El email no es válido', e.target.parentElement)
        formData[e.target.name] = ""
        console.log(formData)
        enableOrDisableSubmitButton()
        return
    }
    if (e.target.id === 'telefono' && !validatePhoneNumber(e.target.value)) {
        showErrorAlert('El telefono no es válido', e.target.parentElement)
        formData[e.target.name] = ""
        console.log(formData)
        enableOrDisableSubmitButton()
        return
    }
    clearErrorAlert(e.target.parentElement)
    formData[e.target.name] = e.target.value.trim().toLowerCase()
    console.log(formData)
    enableOrDisableSubmitButton()
}

function validateEmail(email) {
    const validation = new RegExp('^(.+)@(\\S+)$')
    if (validation.test(email)) {
        return true
    }
    return false
}

function validatePhoneNumber(phone) {
    const validation = new RegExp('^[0-9]{2,3}-? ?[0-9]{6,7}$')
    if (validation.test(phone)) {
        return true
    }
    return false
}

function showErrorAlert(message, location) {
    clearErrorAlert(location)
    const error = document.createElement("p")
    error.textContent = message
    error.classList.add("bg-red-600", "text-center", "text-white", "p-2")
    location.appendChild(error)
}

function clearErrorAlert(location) {
    const alert = location.querySelector(".bg-red-600")
    if (alert) {
        alert.remove()
    }
}

function enableOrDisableSubmitButton() {
    const values = Object.values(formData)
    if (values.includes("")) {
        btnSubmit.classList.add("opacity-50")
        btnSubmit.disabled = true
        return
    }
    btnSubmit.classList.remove("opacity-50")
    btnSubmit.disabled = false
}