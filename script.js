const canvas = document.getElementById('confetti-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

const DEFAULT_GUEST_NAME = 'Khách mời';
const FALLBACK_INVITATION = {
    id: 'default',
    graduateName: 'Vương Thiện Khánh Giao',
    degree: 'Tân cử nhân',
    mainPhoto: 'image/unnamed.jpg',
    mainPhotoPosition: 'center calc(26% + 60px)',
    quote: 'Sự hiện diện và những lời chúc tốt đẹp của bạn sẽ làm cho buổi lễ thêm phần ý nghĩa.',
    ceremony: {
        titleKicker: 'Lễ',
        title: 'Tốt Nghiệp',
        year: '2026',
        time: '15:30 - 16:30',
        day: 'Thứ Bảy',
        date: '20.06.2026'
    },
    school: {
        prefix: 'ĐẠI HỌC',
        name: 'NGUYỄN TẤT THÀNH',
        englishName: 'NGUYEN TAT THANH UNIVERSITY',
        logo: 'image/logo.jpg'
    },
    location: {
        label: 'Tại',
        name: 'ĐẠI HỌC NGUYỄN TẤT THÀNH',
        address: 'Cơ sở An Phú Đông, 331A - 331B Đỗ Mười, An Phú Đông, Quận 12, TP.HCM'
    },
    guests: [{ id: 'khach-moi', name: DEFAULT_GUEST_NAME }],
    gallery: []
};

let width = 0;
let height = 0;
const confetti = [];
const colors = ['#d8b56d', '#f3df9b', '#06172f', '#0d2c55', '#fff7e7'];

function resize() {
    if (!canvas) return;

    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

function getInvitations() {
    return Array.isArray(window.INVITATION_DATABASE) && window.INVITATION_DATABASE.length > 0
        ? window.INVITATION_DATABASE
        : [FALLBACK_INVITATION];
}

function matchesRouteId(item, routeId) {
    if (!item || !routeId) return false;

    const normalizedRouteId = String(routeId).toLowerCase();
    const ids = [item.id, item.slug, ...(Array.isArray(item.aliases) ? item.aliases : [])]
        .filter(Boolean)
        .map((value) => String(value).toLowerCase());

    return ids.includes(normalizedRouteId);
}

function getPrettyRoute(invitations) {
    const rawSegments = decodeURIComponent(window.location.pathname)
        .replace(/\\/g, '/')
        .split('/')
        .map((segment) => segment.trim())
        .filter(Boolean);

    const segments = rawSegments.filter((segment) => {
        const lowerSegment = segment.toLowerCase();
        return lowerSegment !== 'index.html' && !lowerSegment.includes('.');
    });

    const invitationIndex = segments.findIndex((segment) => {
        return invitations.some((invitation) => matchesRouteId(invitation, segment));
    });

    if (invitationIndex === -1) {
        return { invitationId: null, guestId: null };
    }

    return {
        invitationId: segments[invitationIndex],
        guestId: segments[invitationIndex + 1] || null
    };
}

function getSelectedInvitation() {
    const params = new URLSearchParams(window.location.search);
    const invitations = getInvitations();
    const route = getPrettyRoute(invitations);
    const selectedId = route.invitationId || params.get('id') || params.get('person') || params.get('graduate');

    return invitations.find((item) => matchesRouteId(item, selectedId)) || invitations[0] || FALLBACK_INVITATION;
}

function getSelectedGuest(invitation) {
    const params = new URLSearchParams(window.location.search);
    const directName = params.get('to') || params.get('guestName');
    const route = getPrettyRoute(getInvitations());
    const selectedGuestId = route.guestId || params.get('guest') || params.get('guestId');

    if (directName) {
        return { id: 'custom', name: directName };
    }

    if (Array.isArray(invitation.guests)) {
        const guest = invitation.guests.find((item) => matchesRouteId(item, selectedGuestId))
            || invitation.guests[0]
            || { id: 'khach-moi', name: DEFAULT_GUEST_NAME };
        return { ...guest, name: guest.name || guest.guestName || DEFAULT_GUEST_NAME };
    }

    return { id: 'khach-moi', name: DEFAULT_GUEST_NAME };
}

function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element && value) element.textContent = value;
}

function setImage(selector, src, alt = '') {
    const image = document.querySelector(selector);
    if (!image || !src) return;

    image.src = src;
    image.alt = alt;
}

function renderGallery(invitation) {
    const grid = document.querySelector('.gallery-grid');
    if (!grid) return;

    const images = Array.isArray(invitation.gallery) ? invitation.gallery.filter(Boolean) : [];
    const graduateName = invitation.graduateName || invitation.name || FALLBACK_INVITATION.graduateName;
    grid.innerHTML = '';

    images.forEach((src, index) => {
        const figure = document.createElement('figure');
        figure.className = 'gallery-card';

        const image = document.createElement('img');
        image.src = src;
        image.alt = `Ảnh tốt nghiệp phụ ${index + 1} của ${graduateName}`;
        image.loading = index > 1 ? 'lazy' : 'eager';

        figure.appendChild(image);
        grid.appendChild(figure);
    });
}

function applyInvitationData() {
    const invitation = getSelectedInvitation();
    const guest = getSelectedGuest(invitation);
    const ceremony = invitation.ceremony || FALLBACK_INVITATION.ceremony;
    const school = invitation.school || FALLBACK_INVITATION.school;
    const location = invitation.location || FALLBACK_INVITATION.location;
    const graduateName = invitation.graduateName || invitation.name || FALLBACK_INVITATION.graduateName;
    const graduatePhotoSrc = invitation.mainPhoto || invitation.photo || FALLBACK_INVITATION.mainPhoto;

    document.title = `Lời Mời Dự Lễ Tốt Nghiệp - ${graduateName}`;

    const description = document.querySelector('meta[name="description"]');
    if (description) {
        description.setAttribute('content', `Thân mời ${guest.name} đến dự lễ tốt nghiệp của ${graduateName}`);
    }

    setImage('.brand-block img', school.logo, `Logo Đại học ${school.name}`);
    setText('.brand-block p', school.prefix);
    setText('.brand-block h1', school.name);
    setText('.brand-block span', school.englishName);

    setText('.title-kicker', ceremony.titleKicker);
    setText('.title-block h2', ceremony.title);
    setText('.year-line', ceremony.year);
    setText('.graduate-name', graduateName);
    setText('.degree-line', invitation.degree);
    setText('.guest-name', guest.name);

    const detailItems = document.querySelectorAll('.detail-item');
    if (detailItems[0]) {
        detailItems[0].querySelector('span').textContent = 'Vào lúc';
        detailItems[0].querySelector('strong').textContent = ceremony.time;
    }
    if (detailItems[1]) {
        detailItems[1].querySelector('span').textContent = ceremony.day;
        detailItems[1].querySelector('strong').textContent = ceremony.date;
    }

    setText('.location-details span', location.label);
    setText('.location-details strong', location.name);
    setText('.location-details p', location.address);
    setText('.quote-block p', invitation.quote);

    setImage('.graduate-photo', graduatePhotoSrc, graduateName);
    const graduatePhoto = document.querySelector('.graduate-photo');
    if (graduatePhoto && invitation.mainPhotoPosition) {
        graduatePhoto.style.objectPosition = invitation.mainPhotoPosition;
    }

    renderGallery(invitation);
    window.currentInvitation = { invitation, guest };
}

class Confetto {
    constructor() {
        this.reset(true);
        this.size = Math.random() * 7 + 4;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 4 - 2;
        this.shape = Math.random() > 0.45 ? 'rect' : 'circle';
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    reset(randomY = false) {
        this.x = Math.random() * width;
        this.y = randomY ? Math.random() * height - height : -24;
        this.speedY = Math.random() * 1.6 + 0.7;
        this.speedX = Math.random() * 1.4 - 0.7;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;

        if (this.y > height + 24) this.reset();
        if (this.x > width + 24) this.x = -24;
        if (this.x < -24) this.x = width + 24;
    }

    draw() {
        if (!ctx) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;

        if (this.shape === 'rect') {
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 1.45);
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}

function initConfetti() {
    if (!canvas || !ctx) return;

    resize();
    for (let i = 0; i < 44; i += 1) {
        confetti.push(new Confetto());
    }
}

function animate() {
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    confetti.forEach((piece) => {
        piece.update();
        piece.draw();
    });
    requestAnimationFrame(animate);
}

function initGuestName() {
    const guestName = document.querySelector('.guest-name');
    if (!guestName) return;

    guestName.addEventListener('focus', function () {
        if (this.textContent.trim() === DEFAULT_GUEST_NAME) {
            this.textContent = '';
        }
    });

    guestName.addEventListener('blur', function () {
        if (this.textContent.trim() === '') {
            this.textContent = DEFAULT_GUEST_NAME;
        }
    });

    guestName.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.blur();
        }
    });
}

function initBackgroundMusic() {
    const music = document.getElementById('background-music');
    const toggle = document.querySelector('.music-toggle');
    const label = toggle ? toggle.querySelector('.music-label') : null;

    if (!music || !toggle || !label) return;

    music.volume = 0.36;
    music.autoplay = true;
    music.loop = true;

    const updateToggle = () => {
        const isPlaying = !music.paused && !music.ended && !music.muted;
        toggle.classList.toggle('is-playing', isPlaying);
        toggle.setAttribute('aria-pressed', String(isPlaying));
        label.textContent = isPlaying ? 'Tắt nhạc' : 'Bật nhạc';
    };

    const tryPlay = (withSound = true) => {
        if (withSound) music.muted = false;

        const playRequest = music.play();

        if (playRequest && typeof playRequest.catch === 'function') {
            playRequest.then(() => {
                if (withSound) music.muted = false;
                updateToggle();
            }).catch(() => {
                updateToggle();
            });
        } else {
            updateToggle();
        }
    };

    const startMutedThenUnmute = () => {
        music.muted = true;

        const mutedPlayRequest = music.play();
        const unmuteAndPlay = () => {
            music.muted = false;
            tryPlay(true);
        };

        if (mutedPlayRequest && typeof mutedPlayRequest.catch === 'function') {
            mutedPlayRequest.then(() => {
                setTimeout(unmuteAndPlay, 250);
            }).catch(() => {
                tryPlay(true);
            });
            return;
        }

        setTimeout(unmuteAndPlay, 250);
    };

    toggle.addEventListener('click', () => {
        if (music.paused || music.muted) {
            tryPlay();
            return;
        }

        music.pause();
        updateToggle();
    });

    document.addEventListener('pointerdown', () => {
        if (music.paused || music.muted) tryPlay();
    }, { once: true });

    window.addEventListener('load', () => {
        tryPlay(true);
    }, { once: true });

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && (music.paused || music.muted)) {
            tryPlay(true);
        }
    });

    music.addEventListener('play', updateToggle);
    music.addEventListener('pause', updateToggle);
    music.addEventListener('volumechange', updateToggle);
    music.addEventListener('canplay', () => {
        if (music.paused || music.muted) tryPlay(true);
    }, { once: true });

    startMutedThenUnmute();
    [350, 900, 1800, 3000].forEach((delay) => {
        setTimeout(() => {
            if (music.paused || music.muted) tryPlay(true);
        }, delay);
    });
    updateToggle();
}

window.addEventListener('resize', resize);
document.addEventListener('DOMContentLoaded', () => {
    applyInvitationData();
    initGuestName();
    initBackgroundMusic();
    initConfetti();
    animate();
});
