import { getClients, initializeDB } from "./funciones.js"

const mostrar = document.querySelector("#mostrar")

document.addEventListener("DOMContentLoaded", initializeDB)
mostrar.addEventListener("click", getClients)
