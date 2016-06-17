// @codekit-prepend "libs/jquery.js", "libs/jquery.bxslider.min.js", "libs/audio5.js"

// Codigo js para página Historias del Agua

/*

var	body = document.body,
	html = document.documentElement;
var alto_ventana = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
var alto = isNaN(window.innerHeight) ? window.clientHeight : window.innerHeight;
var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

setInterval(function()
{ },3000);

variable = (condition) ? true-value : false-value;

function insertAfter(newNode, referenceNode)
{
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function hasClass(el, cls)
{
	return el.className && new RegExp("(\\s|^)" + cls + "(\\s|$)").test(el.className);
}
*/

var carrus = {};
var scrll = {};
var navS = {};

var audio = {};
audio.audios = [];

function getOffsetTop( obj ) {
	var curtop = 0;
	if (obj.offsetParent) {
		do {
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
		return curtop;
	}
}

function has_Class(el, cls) {
	return el.className && new RegExp("(\\s|^)" + cls + "(\\s|$)").test(el.className);
}


function carruseles(){
	carrus.args__txt = {};

	$(".js--carrusel__1").bxSlider(carrus.args__txt);
	$(".js--carrusel__2").bxSlider(carrus.args__txt);
	$(".js--carrusel__3").bxSlider(carrus.args__txt);
	$(".js--carrusel__4").bxSlider(carrus.args__txt);
	$(".js--carrusel__5").bxSlider(carrus.args__txt);
	$(".js--carrusel__6").bxSlider(carrus.args__txt);
}

function mostrar_menu() {
	scrll.value = $(window).scrollTop();
	scrll.menu = document.querySelector(".js--menu");

	if(scrll.top < scrll.value) {
		if ( !scrll.menu.classList.contains("oculto") ) {
			scrll.menu.classList.add("oculto");
		}
	} else {
		if ( scrll.menu.classList.contains("oculto") ) {
			scrll.menu.classList.remove("oculto");
		}
	}
	scrll.top = scrll.value;
}

function nav__scroll() {
	navS.secciones = document.querySelectorAll(".js--seccion--scroll");
	navS.nav = document.querySelector(".js--nav--scroll");

	for(var i=0,j=navS.secciones.length;i<j;i++) {
		// Crear botones en navegador
		navS.btn = document.createElement("button");
		navS.btn.classList.add("js--btn--scroll");
		navS.nav.appendChild(navS.btn);
	}

	// Asignar data a cada seccion
	Array.prototype.forEach.call(navS.secciones, function(secc, i) {
		secc.setAttribute("data-seccion", i);
	});

	// 
	navS.btns = document.querySelectorAll(".js--btn--scroll");
	Array.prototype.forEach.call(navS.btns, function(btn, i) {

		var seccion = document.querySelector(".js--seccion--scroll[data-seccion='" + i + "']");

		btn.addEventListener("click", function () {

			Array.prototype.filter.call( btn.parentNode.children, function( otro ){
				if ( otro !== btn && has_Class(otro, 'activo')) {
					otro.classList.remove("activo");
				}
			});

			btn.classList.add("activo");

			setTimeout(function () {
				$('html, body').animate({
					scrollTop: getOffsetTop( seccion )
				}, 600);
			}, 100);
		});
	});
}

function scroll() {
	scrll.tOut = false;
	scrll.milSec = 100;

	scrll.top = $(window).scrollTop();

	window.onscroll = function () {

		if ( scrll.tOut !== false ) {
			clearTimeout(scrll.tOut);
		}
		scrll.tOut = setTimeout(mostrar_menu, scrll.milSec);

	};
}


var playPause = function () {
	this[this.playing ? 'pause' : 'play']();
};
function initAudio (archivo, reproducir, estado, volumen, rep_flip, rango, btn_volumen, vol_flip, vol_texto) {
	var audio5js = new Audio5js({
		ready: function () {
			var el_archivo = archivo;
			this.load(el_archivo);
			var duracion;

			// Progreso
			this.on('timeupdate', function (position, duration) {
				// Duracion Total

				duracion = parseInt(duration);

				// Posicion
				var posicion = position.split(":");
				var segundo =  parseInt(posicion[0]*60)+parseInt(posicion[1]);
				// Porcentaje
				var porcentaje = parseInt(segundo) * 100/parseInt(duracion) ;
				porcentaje = Number(porcentaje).toFixed(1);
		      // Mover el rango
				rango.value = porcentaje;
			}, this);

			// Loop
			this.on('ended', function () {
				audio5js.playPause();
			}, this);
			
			//this.play();

			reproducir.onclick = function() {
				rep_flip.classList.toggle("cambio");
				estado = reproducir.getAttribute("data-estado");

				if (estado === "pausa" )
				{
					reproducir.setAttribute("data-estado","play");
				}
				else if (estado === "play" )
				{
					reproducir.setAttribute("data-estado","pausa");
				}

				audio5js.playPause();
			};

			btn_volumen.onclick = function() {
				vol_flip.classList.toggle("cambio");
				volumen = btn_volumen.getAttribute("data-volumen");

				if (volumen === "suena" )
				{
					btn_volumen.setAttribute("data-volumen","silencio");
					vol_texto.textContent = "Volumen";
					audio5js.volume(0);
				}
				else if (volumen === "silencio" )
				{
					btn_volumen.setAttribute("data-volumen","suena");
					vol_texto.textContent = "Silencio";
					audio5js.volume(1);
				}
			};

			rango.onchange =  function () {
				var momento = this.value;
				momento = momento * duracion / 100;
				momento = momento.toFixed(1);
				audio5js.seek(momento);
			};

		}
	});
	audio.audios.push(audio5js);
}
function reproductor()
{
	// Audios de cada sección
	audio.secciones = document.querySelectorAll(".js--seccion--audio");

	Array.prototype.forEach.call(audio.secciones, function(el, i){

		var elAudio = el.getAttribute("data-audio");
		var btn_reproductor = el.querySelector(".js-reproducir");
		var rango = el.querySelector(".js-rango");
		var btn_volumen = el.querySelector(".js-volumen");
		var rep_flip = btn_reproductor.querySelector(".flip-container");
		var vol_flip = btn_volumen.querySelector(".flip-container");
		var vol_texto = btn_volumen.querySelector(".js-texto");
		var estado;
		var volumen;

		initAudio(elAudio, btn_reproductor, estado, volumen, rep_flip, rango, btn_volumen, vol_flip, vol_texto, i);

	});
}


document.addEventListener('DOMContentLoaded', function(){
	carruseles();
	nav__scroll();
	scroll();
	reproductor();
});