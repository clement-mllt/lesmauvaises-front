export class controlSpeedHandler {
  constructor() {

    this.maxSpeed = 50;
    this.acceleration = 0.1;
    this.deceleration = 0.95;


    this.touchStartY = 0;
    this.lastTouchY = 0;
    this.lastTouchTime = 0;
    this.touchVelocity = 0;


    this.currentSpeed = 0;
    this.targetPosition = 0;
    this.currentPosition = window.pageYOffset;
    this.isScrolling = false;
    this.rafId = null;
    this.lastDelta = 0;


    this.debugElement = document.getElementById("currentSpeed");


    this.onWheel = this.onWheel.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.update = this.update.bind(this);


    this.init();
  }

  init() {

    window.addEventListener("wheel", this.onWheel, {passive: false});


    window.addEventListener("touchstart", this.onTouchStart, {passive: false});
    window.addEventListener("touchmove", this.onTouchMove, {passive: false});
    window.addEventListener("touchend", this.onTouchEnd, {passive: false});

    this.targetPosition = window.pageYOffset;
    this.currentPosition = window.pageYOffset;
    this.update();
  }

  onTouchStart(e) {
    e.preventDefault();
    this.touchStartY = e.touches[0].clientY;
    this.lastTouchY = this.touchStartY;
    this.lastTouchTime = Date.now();
    this.touchVelocity = 0;
  }

  onTouchMove(e) {
    e.preventDefault();
    const currentY = e.touches[0].clientY;
    const deltaY = this.lastTouchY - currentY;
    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastTouchTime;


    if (deltaTime > 0) {
      this.touchVelocity = deltaY / deltaTime;
    }


    const cappedDelta =
      Math.sign(deltaY) * Math.min(Math.abs(deltaY), this.maxSpeed);
    this.targetPosition += cappedDelta;


    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    this.targetPosition = Math.max(0, Math.min(this.targetPosition, maxScroll));

    this.lastTouchY = currentY;
    this.lastTouchTime = currentTime;
    this.isScrolling = true;
  }

  onTouchEnd(e) {
    e.preventDefault();


    const cappedMomentum =
      Math.sign(momentum) * Math.min(Math.abs(momentum), this.maxSpeed);
    this.targetPosition += cappedMomentum;


    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    this.targetPosition = Math.max(0, Math.min(this.targetPosition, maxScroll));
  }

  onWheel(e) {
    e.preventDefault();
    const delta = e.deltaY;
    const cappedDelta =
      Math.sign(delta) * Math.min(Math.abs(delta), this.maxSpeed);
    this.targetPosition += cappedDelta;

    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    this.targetPosition = Math.max(0, Math.min(this.targetPosition, maxScroll));

    this.isScrolling = true;
  }

  update() {
    const distance = this.targetPosition - this.currentPosition;

    if (Math.abs(distance) > 0.1 || Math.abs(this.currentSpeed) > 0.1) {

      const desiredSpeed =
        Math.sign(distance) *
        Math.min(Math.abs(distance) * this.acceleration, this.maxSpeed);


      this.currentSpeed +=
        (desiredSpeed - this.currentSpeed) * this.acceleration;


      this.currentSpeed *= this.deceleration;


      this.currentPosition += this.currentSpeed;


      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      this.currentPosition = Math.max(
        0,
        Math.min(this.currentPosition, maxScroll)
      );


      window.scrollTo(0, this.currentPosition);


      if (this.debugElement) {
        this.debugElement.textContent = `Current Speed: ${this.currentSpeed.toFixed(
          2
        )} px/frame`;
      }

      this.isScrolling = true;
    } else {
      this.currentSpeed = 0;
      this.isScrolling = false;

      if (this.debugElement) {
        this.debugElement.textContent = "Stopped";
      }
    }

    this.rafId = requestAnimationFrame(this.update);
  }

  setSpeed(newSpeed) {
    this.maxSpeed = newSpeed;
  }

  destroy() {
    window.removeEventListener("wheel", this.onWheel);
    window.removeEventListener("touchstart", this.onTouchStart);
    window.removeEventListener("touchmove", this.onTouchMove);
    window.removeEventListener("touchend", this.onTouchEnd);
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }
}
