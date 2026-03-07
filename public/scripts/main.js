let currentSlide = 1;
let slides = [];
let totalRealSlides = 0;
let isTransitioning = false;

function init() {
	let margin = 100;
	
	if (window.screen.width <= 600) {
		margin = 70;
	} else if (window.screen.width > 992) {
		document.getElementById('home').style.height = `${window.innerHeight - margin}px`;
	}

	// Carousel setup
	const track = document.querySelector('.carousel-track');
	const originalSlides = document.querySelectorAll('.carousel-track .projectRow');
	
	if (originalSlides.length > 0) {
		totalRealSlides = originalSlides.length;
		
		// Clone first and last slides
		const firstClone = originalSlides[0].cloneNode(true);
		const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);
		
		// Add clones to track
		track.appendChild(firstClone);
		track.insertBefore(lastClone, originalSlides[0]);
		
		// Update slides list
		slides = document.querySelectorAll('.carousel-track .projectRow');
		
		// Initial positioning (start at first real slide)
		track.style.transform = `translateX(-100%)`;
		
		setupCarouselIndicators();
		
		// Add transition end listener for infinite loop jump
		track.addEventListener('transitionend', () => {
			isTransitioning = false;
			if (currentSlide >= slides.length - 1) {
				track.style.transition = "none";
				currentSlide = 1;
				track.style.transform = `translateX(-${currentSlide * 100}%)`;
			} else if (currentSlide <= 0) {
				track.style.transition = "none";
				currentSlide = slides.length - 2;
				track.style.transform = `translateX(-${currentSlide * 100}%)`;
			}
		});
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
	
	for (let i = 0; i < totalRealSlides; i++) {
		const dot = document.createElement('div');
		dot.classList.add('indicator-dot');
		if (i === 0) dot.classList.add('active'); // Start at first real slide
		dot.onclick = () => setSlide(i);
		indicatorsContainer.appendChild(dot);
	}
}

function moveCarousel(direction) {
	if (isTransitioning) return;
	
	const track = document.querySelector('.carousel-track');
	isTransitioning = true;
	track.style.transition = "transform 0.5s ease-in-out";
	currentSlide += direction;
	track.style.transform = `translateX(-${currentSlide * 100}%)`;
	updateIndicators();
}

function setSlide(index) {
	if (isTransitioning) return;
	
	const track = document.querySelector('.carousel-track');
	isTransitioning = true;
	track.style.transition = "transform 0.5s ease-in-out";
	currentSlide = index + 1; // Adjust for clone
	track.style.transform = `translateX(-${currentSlide * 100}%)`;
	updateIndicators();
}

function updateIndicators() {
	const dots = document.querySelectorAll('.indicator-dot');
	let realIndex = currentSlide - 1;
	
	// Handle clone indices for indicators
	if (currentSlide === 0) realIndex = totalRealSlides - 1;
	if (currentSlide === slides.length - 1) realIndex = 0;
	
	dots.forEach((dot, index) => {
		if (index === realIndex) {
			dot.classList.add('active');
		} else {
			dot.classList.remove('active');
		}
	});
}

function updateCarousel() {
	// Deprecated in favor of direct updates in move/set functions for better control over transition
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