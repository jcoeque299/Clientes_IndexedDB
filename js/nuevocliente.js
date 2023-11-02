import { initializeDB, saveClient, validateData } from "./funciones.js"

const nombre = document.querySelector("#nombre")
const email = document.querySelector("#email")
const telefono = document.querySelector("#telefono")
const empresa = document.querySelector("#empresa")
export const btnSubmit = document.querySelector("#formulario input[type='submit']")

document.addEventListener("DOMContentLoaded", initializeDB)

nombre.addEventListener("blur", validateData)
email.addEventListener("blur", validateData)
telefono.addEventListener("blur", validateData)
empresa.addEventListener("blur", validateData)
btnSubmit.addEventListener("submit", saveClient(nombre, email, telefono, empresa))