import { btnSubmit } from "./nuevocliente.js"

let db

const formData = {
    nombre: "",
    email: "",
    telefono: "",
    empresa: ""
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
    let storage = database.createObjectStore("clientes", {keyPath: "id"})
    storage.createIndex("buscarNombre", "nombre", {unique: false})
}

export function saveClient(nombre, correo, telefono, empresa) {
    let transaction = db.transaction(["clientes"], "readwrite")
    let storage = transaction.objectStore("clientes")
    storage.add({
        nombre: nombre,
        correo: correo,
        telefono: telefono,
        empresa: empresa
    })
}

export function editClient(nombre, correo, telefono, empresa) {
    let transaction = db.transaction(["clientes"], "readwrite")
    let storage = transaction.objectStore("clientes")
    storage.put({
        nombre: nombre,
        correo: correo,
        telefono: telefono,
        empresa: empresa
    })
}

export function validateData(e) {
    if (e.target.value.trim() === '') {
        showErrorAlert(`El campo ${e.target.id} es obligatorio`, e.target.parentElement)
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