const btnSubmit = document.querySelector("#formulario input[type='submit']")
const id = document.querySelector("#id")
const nombre = document.querySelector("#nombre")
const email = document.querySelector("#email")
const telefono = document.querySelector("#telefono")
const empresa = document.querySelector("#empresa")
const formulario = document.querySelector("#formulario")
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
        
        //Si este objeto no existe y se usa la funcion de editar cliente usando los datos directamente del cursor, dara una excepción "cursor.value not defined"
        const cursorData = {
            "id": cursor.value.id,
            "nombre": cursor.value.nombre,
            "telefono": cursor.value.telefono,
            "email": cursor.value.correo,
            "empresa": cursor.value.empresa
        }

        let idColumn = document.createElement("td")
        let nameColumn = document.createElement("td")
        let emailColumn = document.createElement("td")
        let phoneColumn = document.createElement("td")
        let companyColumn = document.createElement("td")
        let editClientHTML = document.createElement("button")
        let deleteClientHTML = document.createElement("button")

        idColumn.textContent = cursorData.id
        nameColumn.textContent = cursorData.nombre
        emailColumn.textContent = cursorData.email
        phoneColumn.textContent = cursorData.telefono
        companyColumn.textContent = cursorData.empresa

        editClientHTML.style.margin = "5px"
        editClientHTML.textContent = "Editar"

        deleteClientHTML.textContent = "Borrar"
        deleteClientHTML.style.margin = "5px"

        row.appendChild(idColumn)
        row.appendChild(nameColumn)
        row.appendChild(emailColumn)
        row.appendChild(phoneColumn)
        row.appendChild(companyColumn)
        row.appendChild(editClientHTML)
        row.appendChild(deleteClientHTML)
        
        createClientHTMLListeners(editClientHTML, deleteClientHTML, cursorData)
        
        cursor.continue()
    }
}

function createClientHTMLListeners(editClientHTML, deleteClientHTML, cursorData) {
    //Almacenamiento temporal de datos para pasarlos a editar-cliente.html mediante la funcion retrieveClientToEditId
    editClientHTML.addEventListener("click", function() {
        sessionStorage.setItem("id", cursorData.id)
        sessionStorage.setItem("nombre", cursorData.nombre)
        sessionStorage.setItem("telefono", cursorData.telefono)
        sessionStorage.setItem("email", cursorData.email)
        sessionStorage.setItem("empresa", cursorData.empresa)
        window.location.href = "editar-cliente.html"
    })
    deleteClientHTML.addEventListener("click", function() {
        deleteClient(parseInt(cursorData.id))
    })
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
    showOKMessage(formulario)
}

export function editClient(e, idForm, nombreForm, correoForm, telefonoForm, empresaForm) {
    e.preventDefault()
    let transaction = db.transaction("clientes", "readwrite")
    let storage = transaction.objectStore("clientes")
    let request = storage.get(idForm)
    request.addEventListener("success", function() {
        if (request.result !== undefined) {
            storage.put({
                nombre: nombreForm,
                correo: correoForm,
                telefono: telefonoForm,
                empresa: empresaForm,
                id: idForm
            })
            clearErrorAlert(formulario)
            showOKMessage(formulario)
        }
        else {
            showErrorAlert("Cliente no encontrado", formulario)
        }
    })
    
}

export function retrieveClientToEditId() {
    id.value = sessionStorage.getItem("id")
    nombre.value = sessionStorage.getItem("nombre")
    email.value = sessionStorage.getItem("email")
    telefono.value = sessionStorage.getItem("telefono")
    empresa.value = sessionStorage.getItem("empresa")
    sessionStorage.clear()
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
    const validation = new RegExp(/^\+?(6\d{2}|7[1-9]\d{1})\d{6}$/)
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

function showOKMessage(location) {
    const alertaExito = document.createElement('p')
      alertaExito.classList.add('bg-green-500', 'text-white', 'p-2', 'text-center', 'rounded-lg', 'mt-10', 'font-bold', 'text-sm', 'uppercase')
      if (formData.id) {
        alertaExito.textContent = 'Cliente editado correctamente'
      }
      else {
        alertaExito.textContent = 'Cliente añadido correctamente'
      }

      location.appendChild(alertaExito)

      setTimeout(() => {
        alertaExito.remove()
    }, 3000)
}