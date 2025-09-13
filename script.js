// ===================== CONFIG =====================
// 👉 Coloca aquí tu API Key de OpenWeatherMap
const API_KEY = "TU_API_KEY";
// Referencias al DOM
const popup = document.getElementById("popup");
const okBtn = document.getElementById("okBtn");
const loading = document.createElement("p");
loading.id = "loading";
document.body.appendChild(loading);
const card = document.createElement("div");
card.className = "card hidden";
document.body.appendChild(card);
const searchBox = document.createElement("div");
searchBox.className = "hidden searchBox";
searchBox.innerHTML = `
<input type="text" id="cityInput" placeholder="Escribe tu ciudad">
<button id="searchBtn"><i class="fas fa-search"></i> Buscar</button>
`;
document.body.appendChild(searchBox);
const cityInput = searchBox.querySelector("#cityInput");
const searchBtn = searchBox.querySelector("#searchBtn");
// ===================== EVENTOS =====================
okBtn.addEventListener("click", () => {
 popup.classList.add("hidden");
 solicitarUbicacion();
});
searchBtn.addEventListener("click", () => {
 if (cityInput.value.trim() !== "") {
   getWeatherByCity(cityInput.value.trim());
 }
});
// ===================== FUNCIONES =====================
function solicitarUbicacion() {
 if (navigator.geolocation) {
   loading.textContent = "🔍 Solicitando permiso de ubicación...";
   navigator.geolocation.getCurrentPosition(
     (pos) => {
       const lat = pos.coords.latitude;
       const lon = pos.coords.longitude;
       loading.textContent = "📡 Ubicación aceptada. Obteniendo clima...";
       getWeather(lat, lon);
     },
     (err) => {
       manejarErrores(err);
     }
   );
 } else {
   loading.textContent = "⚠️ Geolocalización no soportada.";
 }
}
function manejarErrores(err) {
 if (err.code === 1) {
   loading.textContent = "❌ Permiso denegado. Ingresa tu ciudad:";
 } else if (err.code === 2) {
   loading.textContent = "⚠️ No se pudo determinar tu ubicación.";
 } else if (err.code === 3) {
   loading.textContent = "⌛ Tiempo de espera agotado.";
 } else {
   loading.textContent = "❌ Error desconocido.";
 }
 searchBox.classList.remove("hidden");
}
async function getWeather(lat, lon) {
 try {
   loading.textContent = "⏳ Cargando clima...";
   const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`;
   const res = await fetch(url);
   const data = await res.json();
   mostrarClima(data);
 } catch {
   loading.textContent = "⚠️ Error al obtener datos del clima.";
 }
}
async function getWeatherByCity(city) {
 try {
   loading.textContent = "⏳ Cargando clima...";
   const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`;
   const res = await fetch(url);
   const data = await res.json();
   if (data.cod === "404") {
     loading.textContent = "⚠️ Ciudad no encontrada.";
   } else {
     mostrarClima(data);
   }
 } catch {
   loading.textContent = "⚠️ Error al obtener datos del clima.";
 }
}
function mostrarClima(data) {
 loading.textContent = "";
 card.classList.remove("hidden");
 const temp = Math.round(data.main.temp);
 const feels = Math.round(data.main.feels_like);
 const desc = data.weather[0].description;
 const humidity = data.main.humidity;
 const wind = data.wind.speed;
 const icon = data.weather[0].icon;
 card.innerHTML = `
<h2>${data.name}, ${data.sys.country}</h2>
<img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="icono clima">
<p><strong>${temp}°C</strong> (Sensación: ${feels}°C)</p>
<p>${desc.toUpperCase()}</p>
<p>💧 Humedad: ${humidity}%</p>
<p>🌬️ Viento: ${wind} m/s</p>
 `;
 cambiarFondo(data.weather[0].main);
}
function cambiarFondo(clima) {
 switch (clima.toLowerCase()) {
   case "clear":
     document.body.style.background = "linear-gradient(to right, #00c6ff, #0072ff)";
     break;
   case "rain":
     document.body.style.background = "linear-gradient(to right, #3a3d40, #181719)";
     break;
   case "clouds":
     document.body.style.background = "linear-gradient(to right, #bdc3c7, #2c3e50)";
     break;
   case "snow":
     document.body.style.background = "linear-gradient(to right, #e6e9f0, #eef1f5)";
     break;
   default:
     document.body.style.background = "linear-gradient(45deg, red, green, blue)";
     break;
 }
}
