   // ═══════════════════════════════════════════════════════════
    // 1. NAVBAR SCROLL EFFECT
    // ═══════════════════════════════════════════════════════════
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    // ═══════════════════════════════════════════════════════════
    // 2. MOBILE MENU
    // ═══════════════════════════════════════════════════════════
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });
    function closeMobile() {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }

    // ═══════════════════════════════════════════════════════════
    // 3. REVEAL ON SCROLL — staggered per grid group
    // ═══════════════════════════════════════════════════════════
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), idx * 130);
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => revealObserver.observe(el));

    // ═══════════════════════════════════════════════════════════
    // 4. ACTIVE NAV HIGHLIGHT
    // ═══════════════════════════════════════════════════════════
    const sections   = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');
    const secObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navAnchors.forEach(a => a.style.color = '');
          const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
          if (a) a.style.color = 'var(--accent)';
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(s => secObserver.observe(s));

    // ═══════════════════════════════════════════════════════════
    // 5. ADVANCED CUSTOM CURSOR + COMET TRAIL
    // ═══════════════════════════════════════════════════════════
    const dot    = document.getElementById('cursor-dot');
    const ring   = document.getElementById('cursor-ring');
    const canvas = document.getElementById('cursor-trail-canvas');
    const ctx    = canvas.getContext('2d');

    // Resize canvas
    function resizeCanvas() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse state
    let mx = -200, my = -200;       // real mouse pos
    let rx = -200, ry = -200;       // ring lerp pos
    let isHover = false, isClick = false;

    // Trail particles
    const particles = [];
    const MAX_PARTICLES = 28;

    class TrailParticle {
      constructor(x, y) {
        this.x = x; this.y = y;
        this.size   = Math.random() * 3 + 1;
        this.alpha  = 0.7 + Math.random() * 0.3;
        this.decay  = 0.035 + Math.random() * 0.025;
        this.vx     = (Math.random() - 0.5) * 0.6;
        this.vy     = (Math.random() - 0.5) * 0.6 - 0.4;
        // Cycle between accent colours
        const colours = ['79,158,255', '167,139,250', '34,211,238'];
        this.colour = colours[Math.floor(Math.random() * colours.length)];
      }
      update() {
        this.x  += this.vx;
        this.y  += this.vy;
        this.alpha -= this.decay;
        this.size  *= 0.97;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(this.size, 0.1), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.colour},${Math.max(this.alpha,0)})`;
        ctx.shadowBlur   = 10;
        ctx.shadowColor  = `rgba(${this.colour},0.5)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Mouse move
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';

      // Spawn trail particle every other move
      if (particles.length < MAX_PARTICLES) {
        particles.push(new TrailParticle(mx, my));
      } else {
        particles.splice(0, 1);
        particles.push(new TrailParticle(mx, my));
      }
    });

    // Click burst
    window.addEventListener('mousedown', e => {
      isClick = true;
      document.body.classList.add('cursor-clicking');
      // Burst: spawn 8 particles
      for (let i = 0; i < 8; i++) {
        const p = new TrailParticle(e.clientX, e.clientY);
        p.vx = (Math.random() - 0.5) * 4;
        p.vy = (Math.random() - 0.5) * 4;
        p.size = Math.random() * 4 + 2;
        particles.push(p);
      }
    });
    window.addEventListener('mouseup', () => {
      isClick = false;
      document.body.classList.remove('cursor-clicking');
    });

    // Hover detection on interactive elements
    const hoverTargets = 'a, button, .project-card, .contact-link, .btn, .hamburger, .nav-logo';
    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', () => { isHover = true; document.body.classList.add('cursor-hover'); });
      el.addEventListener('mouseleave', () => { isHover = false; document.body.classList.remove('cursor-hover'); });
    });

    // Animation loop
    function animateCursor() {
      // Lerp ring toward mouse (smooth lag)
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw trail
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        if (p.alpha <= 0) { particles.splice(i, 1); continue; }
        p.draw();
      }

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      dot.style.opacity  = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
    });

    // ═══════════════════════════════════════════════════════════
    // 6. PROJECT CARD — 3D TILT + CARD GLOW TRACKING
    // ═══════════════════════════════════════════════════════════
    document.querySelectorAll('.project-card').forEach(card => {
      const glow = card.querySelector('.card-glow');

      card.addEventListener('mousemove', e => {
        const rect   = card.getBoundingClientRect();
        const cx     = rect.width  / 2;
        const cy     = rect.height / 2;
        const dx     = e.clientX - rect.left  - cx;
        const dy     = e.clientY - rect.top   - cy;
        const tiltX  = -(dy / cy) * 8;   // max ±8deg
        const tiltY  =  (dx / cx) * 8;

        card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(4px)`;

        // Move glow beam to cursor position
        if (glow) {
          glow.style.left = (e.clientX - rect.left)  + 'px';
          glow.style.top  = (e.clientY - rect.top)   + 'px';
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)';
        card.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s, border-color 0.4s';
        setTimeout(() => { card.style.transition = ''; }, 600);
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'box-shadow 0.4s, border-color 0.4s';
      });
    });

    // ═══════════════════════════════════════════════════════════
    // 7. MAGNETIC BUTTONS (hero CTAs)
    // ═══════════════════════════════════════════════════════════
    document.querySelectorAll('.hero-actions .btn').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width  / 2);
        const dy = e.clientY - (rect.top  + rect.height / 2);
        btn.style.transform = `translate(${dx * 0.25}px, ${dy * 0.25}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s, border-color 0.3s';
        setTimeout(() => { btn.style.transition = ''; }, 500);
      });
    });

    // ═══════════════════════════════════════════════════════════
    // 8. CONTACT CARDS — subtle parallax on mousemove
    // ═══════════════════════════════════════════════════════════
    document.querySelectorAll('.contact-link').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const dx = (e.clientX - rect.left - rect.width  / 2) / rect.width;
        const dy = (e.clientY - rect.top  - rect.height / 2) / rect.height;
        card.style.transform = `translateY(-4px) rotateX(${-dy*5}deg) rotateY(${dx*5}deg)`;
        card.style.transition = 'box-shadow 0.3s, border-color 0.3s';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'all 0.5s cubic-bezier(0.16,1,0.3,1)';
        setTimeout(() => { card.style.transition = ''; }, 500);
      });
    });

    // ═══════════════════════════════════════════════════════════
    // 9. HERO IMAGE PARALLAX 
    // ═══════════════════════════════════════════════════════════
    const heroImg = document.querySelector('.hero-img-wrap img');
    if (heroImg) {
      window.addEventListener('scroll', () => {
        const offset = window.scrollY * 0.18;
        heroImg.style.transform = `translateY(${offset}px)`;
      }, { passive: true });
    }

    // ═══════════════════════════════════════════════════════════
    // 10. TYPING EFFECT on hero headline (subtle word reveal)
    // ═══════════════════════════════════════════════════════════
    // Split each word in hero-headline into animated spans
    const headline = document.querySelector('.hero-headline');
    if (headline) {
      // Wrap words so they can slide in individually
      headline.innerHTML = headline.innerHTML.replace(/(\S+)/g, (match, word) => {
        return `<span class="hw" style="display:inline-block;overflow:hidden;vertical-align:top"><span class="hwi" style="display:inline-block">${word}</span></span>&nbsp;`;
      });
      const wordItems = headline.querySelectorAll('.hwi');
      wordItems.forEach((w, i) => {
        w.style.cssText = `transform:translateY(100%);transition:transform 0.7s ${0.5 + i*0.08}s cubic-bezier(0.16,1,0.3,1)`;
        requestAnimationFrame(() => requestAnimationFrame(() => {
          w.style.transform = 'translateY(0)';
        }));
      });
    }