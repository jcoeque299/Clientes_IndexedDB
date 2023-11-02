import { initializeDB, saveClient, validateData } from "./funciones.js"

const nombre = document.querySelector("#nombre")
const email = document.querySelector("#email")
const telefono = document.querySelector("#telefono")
const empresa = document.querySelector("#empresa")
const formulario = document.querySelector("#formulario")

document.addEventListener("DOMContentLoaded", initializeDB)

nombre.addEventListener("blur", validateData)
email.addEventListener("blur", validateData)
telefono.addEventListener("blur", validateData)
empresa.addEventListener("blur", validateData)
formulario.addEventListener("submit", function() {
    saveClient(event, nombre.value, email.value, telefono.value, empresa.value)
})