let currentSlide = 0;
let totalRealSlides = 0;
let isMoving = false;
let isSending = false;
const toastTimers = {};

function init() {
	let margin = window.innerWidth <= 600 ? 70 : 100;

	const homeElement = document.getElementById('home');
	if (homeElement && window.innerWidth > 992) {
		homeElement.style.height = `${window.innerHeight - margin}px`;
	}

	// Carousel setup
	const track = document.querySelector('.carousel-track');
	const slidesElements = document.querySelectorAll('.carousel-track .projectRow');
	
	if (slidesElements.length > 0) {
		totalRealSlides = slidesElements.length;
		setupCarouselIndicators();
		
		// Clone first and last slides for infinite effect
		const firstClone = slidesElements[0].cloneNode(true);
		const lastClone = slidesElements[totalRealSlides - 1].cloneNode(true);
		
		track.appendChild(firstClone);
		track.insertBefore(lastClone, slidesElements[0]);
		
		// Set initial position to the first real slide
		track.scrollLeft = track.clientWidth;
		currentSlide = 0;
		updateIndicators();

		// Handle infinite scroll jump and indicator updates
		track.addEventListener('scroll', () => {
			const scrollPos = track.scrollLeft;
			const itemWidth = track.clientWidth;
			
			const epsilon = itemWidth * 0.05;
			if (scrollPos < epsilon) { // Near 0 — on last clone, jump to last real slide
				track.style.scrollBehavior = 'auto';
				track.scrollLeft = totalRealSlides * itemWidth;
				track.style.scrollBehavior = 'smooth';
				updateIndicators();
				return;
			} else if (scrollPos > (totalRealSlides + 1) * itemWidth - epsilon) { // On first clone, jump to first real slide
				track.style.scrollBehavior = 'auto';
				track.scrollLeft = itemWidth;
				track.style.scrollBehavior = 'smooth';
				updateIndicators();
				return;
			}

			const index = Math.round(scrollPos / itemWidth) - 1;
			if (index >= 0 && index < totalRealSlides && index !== currentSlide) {
				currentSlide = index;
				updateIndicators();
			}
		});

		window.addEventListener('resize', () => {
			track.style.scrollBehavior = 'auto';
			track.scrollLeft = (currentSlide + 1) * track.clientWidth;
			track.style.scrollBehavior = 'smooth';
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
	if (!track || isMoving) return;

	isMoving = true;
	const itemWidth = track.clientWidth;
	const targetScrollPos = (currentSlide + direction + 1) * itemWidth;

	currentSlide = ((currentSlide + direction) + totalRealSlides) % totalRealSlides;
	updateIndicators();

	track.scrollTo({
		left: targetScrollPos,
		behavior: 'smooth'
	});

	let released = false;
	const release = () => { if (!released) { released = true; isMoving = false; } };
	track.addEventListener('scrollend', release, { once: true });
	setTimeout(release, 800);
}

function setSlide(index) {
	const track = document.querySelector('.carousel-track');
	if (!track || isMoving) return;

	isMoving = true;
	currentSlide = index;
	track.scrollTo({
		left: (currentSlide + 1) * track.clientWidth,
		behavior: 'smooth'
	});
	updateIndicators();

	let released = false;
	const release = () => { if (!released) { released = true; isMoving = false; } };
	track.addEventListener('scrollend', release, { once: true });
	setTimeout(release, 800);
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
	const element = document.getElementById(panel);
	if (!element) return;
	const offsetTop = element.offsetTop;
	const margin = window.innerWidth < 992 ? 70 : 100;

	window.scrollTo({
		top: offsetTop - margin,
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

	clearTimeout(toastTimers[toastElement.id]);
	toastElement.setAttribute('active', '');

	toastTimers[toastElement.id] = setTimeout(() => {
		toastElement.removeAttribute('active');
	}, 7500);

	toastElement.onclick = function() {
		clearTimeout(toastTimers[toastElement.id]);
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
		if (isSending) return;
		isSending = true;
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
			if (!res.ok) throw new Error(`Server error: ${res.status}`);
			const data = await res.json();
			console.log(data);
			toast(true);
		} catch (error) {
			console.error(error);
			toast(false);
		} finally {
			isSending = false;
		}
	} else {
		toast(null);
	}
}

function cleanTrolls(string) {
	const words = string.toLowerCase().split(/\s+/);
	if (words.includes('aunt') && words.includes('sum')) return false;
	if (words.includes('sum') || words.includes('bahd')) return false;
	return true;
}
