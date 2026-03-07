let currentSlide = 0;
let slides = [];

function init() {
	let margin = 100;
	
	if (window.screen.width <= 600) {
		margin = 70;
	} else if (window.screen.width > 992) {
		document.getElementById('home').style.height = `${window.innerHeight - margin}px`;
	}

	// Carousel setup
	slides = document.querySelectorAll('.carousel-track .projectRow');
	if (slides.length > 0) {
		setupCarouselIndicators();
		updateCarousel();
	}

	setTimeout(() => {
		window.scrollTo({ 
			top: 0
		});
	}, 200);
}

function setupCarouselIndicators() {
	const indicatorsContainer = document.getElementById('carouselIndicators');
	indicatorsContainer.innerHTML = '';
	
	slides.forEach((_, index) => {
		const dot = document.createElement('div');
		dot.classList.add('indicator-dot');
		if (index === currentSlide) dot.classList.add('active');
		dot.onclick = () => setSlide(index);
		indicatorsContainer.appendChild(dot);
	});
}

function moveCarousel(direction) {
	currentSlide += direction;
	
	if (currentSlide >= slides.length) {
		currentSlide = 0;
	} else if (currentSlide < 0) {
		currentSlide = slides.length - 1;
	}
	
	updateCarousel();
}

function setSlide(index) {
	currentSlide = index;
	updateCarousel();
}

function updateCarousel() {
	const track = document.querySelector('.carousel-track');
	const percentage = -(currentSlide * 100);
	track.style.transform = `translateX(${percentage}%)`;
	
	const dots = document.querySelectorAll('.indicator-dot');
	dots.forEach((dot, index) => {
		if (index === currentSlide) {
			dot.classList.add('active');
		} else {
			dot.classList.remove('active');
		}
	});
}

function moveToPanel(panel, isMobile) {
	const element = document.getElementById(panel).offsetTop;

	let margin = 100;

	if (window.screen.width < 992) {
		margin = 70;
	}

	window.scrollTo({ 
		top: element - margin,
		behavior: 'smooth'
	});

	if (isMobile) {
		showMobileMenu();
	}
}

function showMobileMenu() {
	const menu = document.getElementById('mobileMenu');

	if (menu.style.display == 'none') {
		menu.style.display = 'flex';
	} else {
		menu.style.display = 'none';
	}
}

function goToLink(url) {
	if (url == 'git') {
		url = 'https://github.com/Murnster';
	} else if (url == 'linkedin') {
		url = 'https://www.linkedin.com/in/ryanmurney/';
	}

	window.open(url, '_blank');
}

function toast(success) {
	let toast;

	if (success) {
		toast = document.getElementById('successToast');
	} else if (success === false) {
		toast = document.getElementById('errorToast')
	} else {
		toast = document.getElementById('questionToast');
	}

	toast.setAttribute('active', '');

	const toastTimeout = setTimeout(() => {
		toast.removeAttribute('active');
	}, 7500);

	toast.onclick = function() {
		clearTimeout(toastTimeout);
		toast.removeAttribute('active');
	}
}

async function sendEmail() {
	const name = document.getElementById('contactName');
	const email = document.getElementById('contactEmail');
	const phone = document.getElementById('contactPhone');
	const message = document.getElementById('contactMessage');

	if (name.value == '') {
		name.focus();
		toast(null);
	} else if (email.value == '') {
		email.focus();
		toast(null);
	} else if (phone.value == '') {
		phone.focus();
		toast(null);
	} else if (message.value == '') {
		message.focus();
		toast(null);
	} else {
		if (cleanTrolls(name.value + ' ' + email.value + ' ' + phone.value + ' ' + message.value)) {
			await fetch('/email', {
				method: 'POST',
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: name.value,
					email: email.value,
					phone: phone.value,
					message: message.value
				})
			})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				toast(true);
			})
			.catch((error) => {
				console.error(error);
				toast(false);
			});
		} else {
			toast(null);
		}
	}
}

function cleanTrolls(string) {
	const words = string.split(' ');
	var sendEmail = true;
		
	if (string.indexOf('aunt sum') != -1) {
		sendEmail = false;
	}

	if (
		words.indexOf('sum') != -1 ||
		words.indexOf('bahd') != -1
	) {
		sendEmail = false;
	}

	return sendEmail;
}