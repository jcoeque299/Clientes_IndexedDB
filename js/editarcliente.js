import { initializeDB, saveClient, editClient, validateData} from "./funciones.js"

const nombre = document.querySelector("#nombre")
const email = document.querySelector("#email")
const telefono = document.querySelector("#telefono")
const empresa = document.querySelector("#empresa")
const btnSubmit = document.querySelector("#formulario input[type='submit']")

nombre.addEventListener("blur", validateData)
email.addEventListener("blur", validateData)
telefono.addEventListener("blur", validateData)
empresa.addEventListener("blur", validateData)
btnSubmit.addEventListener("submit", editClient(nombre, email, telefono, empresa))