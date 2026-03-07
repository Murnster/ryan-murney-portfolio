let currentSlide = 0;
let totalRealSlides = 0;

function init() {
	let margin = 100;
	
	if (window.screen.width <= 600) {
		margin = 70;
	} else if (window.screen.width > 992) {
		const homeElement = document.getElementById('home');
		if (homeElement) {
			homeElement.style.height = `${window.innerHeight - margin}px`;
		}
	}

	// Carousel setup
	const track = document.querySelector('.carousel-track');
	const slidesElements = document.querySelectorAll('.carousel-track .projectRow');
	
	if (slidesElements.length > 0) {
		totalRealSlides = slidesElements.length;
		setupCarouselIndicators();
		
		// Update indicators on scroll with a slight debounce/throttle
		let isScrolling;
		track.addEventListener('scroll', () => {
			window.clearTimeout(isScrolling);
			isScrolling = setTimeout(() => {
				const index = Math.round(track.scrollLeft / track.clientWidth);
				if (index !== currentSlide) {
					currentSlide = index;
					updateIndicators();
				}
			}, 50);
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
	if (!indicatorsContainer) return;
	indicatorsContainer.innerHTML = '';
	
	for (let i = 0; i < totalRealSlides; i++) {
		const dot = document.createElement('div');
		dot.classList.add('indicator-dot');
		if (i === 0) dot.classList.add('active');
		dot.onclick = () => setSlide(i);
		indicatorsContainer.appendChild(dot);
	}
}

function moveCarousel(direction) {
	const track = document.querySelector('.carousel-track');
	if (!track) return;

	currentSlide += direction;
	
	if (currentSlide < 0) currentSlide = totalRealSlides - 1;
	if (currentSlide >= totalRealSlides) currentSlide = 0;
	
	track.scrollTo({
		left: currentSlide * track.clientWidth,
		behavior: 'smooth'
	});
	updateIndicators();
}

function setSlide(index) {
	const track = document.querySelector('.carousel-track');
	if (!track) return;

	currentSlide = index;
	track.scrollTo({
		left: currentSlide * track.clientWidth,
		behavior: 'smooth'
	});
	updateIndicators();
}

function updateIndicators() {
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
	if (!menu) return;
	menu.classList.toggle('active');
}

function goToLink(url) {
	const links = {
		'git': 'https://github.com/Murnster',
		'linkedin': 'https://www.linkedin.com/in/ryanmurney/'
	};
	window.open(links[url] || url, '_blank');
}

function toast(success) {
	let toastElement;

	if (success === true) {
		toastElement = document.getElementById('successToast');
	} else if (success === false) {
		toastElement = document.getElementById('errorToast');
	} else {
		toastElement = document.getElementById('questionToast');
	}

	if (!toastElement) return;

	toastElement.setAttribute('active', '');

	const toastTimeout = setTimeout(() => {
		toastElement.removeAttribute('active');
	}, 7500);

	toastElement.onclick = function() {
		clearTimeout(toastTimeout);
		toastElement.removeAttribute('active');
	}
}

async function sendEmail() {
	const name = document.getElementById('contactName');
	const email = document.getElementById('contactEmail');
	const phone = document.getElementById('contactPhone');
	const message = document.getElementById('contactMessage');

	if (!name.value) { name.focus(); toast(null); return; }
	if (!email.value) { email.focus(); toast(null); return; }
	if (!phone.value) { phone.focus(); toast(null); return; }
	if (!message.value) { message.focus(); toast(null); return; }

	const fullText = `${name.value} ${email.value} ${phone.value} ${message.value}`;
	
	if (cleanTrolls(fullText)) {
		try {
			const res = await fetch('/email', {
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
			});
			const data = await res.json();
			console.log(data);
			toast(true);
		} catch (error) {
			console.error(error);
			toast(false);
		}
	} else {
		toast(null);
	}
}

function cleanTrolls(string) {
	const words = string.toLowerCase().split(' ');
	if (string.toLowerCase().includes('aunt sum')) return false;
	if (words.includes('sum') || words.includes('bahd')) return false;
	return true;
}
