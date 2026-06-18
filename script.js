/* =====================================================
   PORTFOLIO SCRIPT
   Berisi: preloader, navbar scroll state, indikator nav
   aktif, animasi fade-in saat scroll, smooth scroll,
   menu mobile, dan handler form kontak.
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
	/* ---------------------------------------------------
     1. PRELOADER
     Disembunyikan setelah halaman selesai dimuat, dengan
     jeda minimum singkat agar animasi tidak terasa kedip.
  --------------------------------------------------- */
	const preloader = document.getElementById("preloader");
	const minDelay = new Promise((resolve) => setTimeout(resolve, 500));
	const pageLoad = new Promise((resolve) => {
		if (document.readyState === "complete") resolve();
		else window.addEventListener("load", resolve);
	});

	Promise.all([minDelay, pageLoad]).then(() => {
		preloader.classList.add("loaded");
	});

	/* ---------------------------------------------------
     2. NAVBAR: ubah tampilan saat halaman di-scroll
  --------------------------------------------------- */
	const mainNav = document.getElementById("mainNav");

	const toggleNavBackground = () => {
		if (window.scrollY > 40) {
			mainNav.classList.add("scrolled");
		} else {
			mainNav.classList.remove("scrolled");
		}
	};
	toggleNavBackground();
	window.addEventListener("scroll", toggleNavBackground);

	/* ---------------------------------------------------
     3. SCROLLSPY + INDIKATOR NAV YANG BERGESER
     Menandai link aktif sesuai section yang sedang
     dilihat, lalu menggeser pill indikator ke posisinya.
  --------------------------------------------------- */
	const navLinks = Array.from(
		document.querySelectorAll(".nav-link[data-section]"),
	);
	const navIndicator = document.getElementById("navIndicator");
	const sections = navLinks
		.map((link) => document.getElementById(link.dataset.section))
		.filter(Boolean);

	const moveIndicator = (targetLink) => {
		if (!targetLink || window.innerWidth < 992) return;
		navIndicator.style.width = `${targetLink.offsetWidth}px`;
		navIndicator.style.transform = `translateX(${targetLink.offsetLeft}px)`;
	};

	const setActiveLink = (sectionId) => {
		navLinks.forEach((link) => {
			const isActive = link.dataset.section === sectionId;
			link.classList.toggle("active", isActive);
			if (isActive) moveIndicator(link);
		});
	};

	if ("IntersectionObserver" in window) {
		const spyObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setActiveLink(entry.target.id);
					}
				});
			},
			{ rootMargin: "-45% 0px -50% 0px", threshold: 0 },
		);

		sections.forEach((section) => spyObserver.observe(section));
	}

	// Posisikan indikator dengan benar saat pertama kali dimuat & saat resize
	window.addEventListener("load", () => {
		const activeLink = document.querySelector(".nav-link.active");
		moveIndicator(activeLink);
	});
	window.addEventListener("resize", () => {
		const activeLink = document.querySelector(".nav-link.active");
		moveIndicator(activeLink);
	});

	/* ---------------------------------------------------
     4. TUTUP MENU MOBILE SAAT LINK DIKLIK
  --------------------------------------------------- */
	const navCollapseEl = document.getElementById("navMenu");
	const navCollapse = navCollapseEl
		? new bootstrap.Collapse(navCollapseEl, { toggle: false })
		: null;

	navLinks.forEach((link) => {
		link.addEventListener("click", () => {
			if (navCollapse && navCollapseEl.classList.contains("show")) {
				navCollapse.hide();
			}
		});
	});

	/* ---------------------------------------------------
     5. ANIMASI FADE-IN SAAT ELEMEN MUNCUL DI VIEWPORT
  --------------------------------------------------- */
	const fadeEls = document.querySelectorAll(".fade-up");

	if ("IntersectionObserver" in window) {
		const fadeObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const delay = entry.target.dataset.delay || 0;
						setTimeout(() => entry.target.classList.add("is-visible"), delay);
						fadeObserver.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.15 },
		);

		fadeEls.forEach((el) => fadeObserver.observe(el));
	} else {
		// Fallback bila browser tidak mendukung IntersectionObserver
		fadeEls.forEach((el) => el.classList.add("is-visible"));
	}

	/* ---------------------------------------------------
     6. FORM KONTAK
     Karena website ini statis (tanpa backend), pesan
     disiapkan sebagai email melalui mailto: setelah
     validasi sederhana berhasil.
  --------------------------------------------------- */
	const contactForm = document.getElementById("contactForm");
	const formSuccess = document.getElementById("formSuccess");

	if (contactForm) {
		contactForm.addEventListener("submit", (e) => {
			e.preventDefault();

			const nameInput = document.getElementById("formName");
			const emailInput = document.getElementById("formEmail");
			const messageInput = document.getElementById("formMessage");

			if (!contactForm.checkValidity()) {
				contactForm.classList.add("was-validated");
				formSuccess.classList.remove("show");
				return;
			}

			const subject = encodeURIComponent(
				`Pesan dari Portfolio - ${nameInput.value}`,
			);
			const body = encodeURIComponent(
				`Nama: ${nameInput.value}\nEmail: ${emailInput.value}\n\nPesan:\n${messageInput.value}`,
			);

			// Buka klien email pengguna dengan data form yang sudah terisi
			window.location.href = `mailto:example@gmail.com?subject=${subject}&body=${body}`;

			formSuccess.classList.add("show");
			contactForm.classList.remove("was-validated");
			contactForm.reset();
		});
	}
});
