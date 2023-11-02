import { initializeDB, editClient, validateData} from "./funciones.js"

const id = document.querySelector("#id")
const nombre = document.querySelector("#nombre")
const email = document.querySelector("#email")
const telefono = document.querySelector("#telefono")
const empresa = document.querySelector("#empresa")
const formulario = document.querySelector("#formulario")

document.addEventListener("DOMContentLoaded", initializeDB)

id.addEventListener("blur", validateData)
nombre.addEventListener("blur", validateData)
email.addEventListener("blur", validateData)
telefono.addEventListener("blur", validateData)
empresa.addEventListener("blur", validateData)
formulario.addEventListener("submit", function() {
    editClient(event, parseInt(id.value), nombre.value, email.value, telefono.value, empresa.value)
})