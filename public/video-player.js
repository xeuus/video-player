class SeekRangeBar {
    constructor(el) {
        this.el = el;
        this.destroy = this.destroy.bind(this);
        this.update = this.update.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.getPosition = this.getPosition.bind(this);
        this.updateFrame = this.updateFrame.bind(this);

        this.range = el.querySelector('[data-role="range"]');
        this.thumb = el.querySelector('[data-role="thumb"]');

        this.xPos = 0;
        this.listeners = [];

        window.addEventListener('mousedown', this.mouseDown);
        window.addEventListener('mousemove', this.mouseMove);
        window.addEventListener('mouseup', this.mouseUp);
        window.addEventListener('touchstart', this.mouseDown);
        window.addEventListener('touchend', this.mouseUp);
        window.addEventListener('touchmove', this.mouseMove);
    }

    getPosition(e) {
        return (e.touches && e.touches[0] && e.touches[0].clientX) || e.clientX;
    }

    subscribe(fn) {
        const index = this.listeners.indexOf(fn);
        if(index < 0)
            this.listeners.push(fn);
        return () => {
            const index = this.listeners.indexOf(fn);
            this.listeners.splice(index, 1);
        }
    }
    unsubscribe(fn) {
        const index = this.listeners.indexOf(fn);
        this.listeners.splice(index, 1);
    }

    mouseDown(e) {
        const {el, thumb} = this;
        if (!thumb.contains(e.target))
            return;
        this.dragged = true;
        this.lastMousePos = this.getPosition(e);
        this.lastXPos = this.xPos;
        this.componentWidth = el.getBoundingClientRect().width;

    }

    mouseMove(e) {
        if(this.dragged) {
            this.xPos = this.lastXPos + (this.getPosition(e) - this.lastMousePos);
            if(this.xPos < 0)
                this.xPos = 0;
            if(this.xPos > this.componentWidth)
                this.xPos = this.componentWidth;
            this.updateFrame();
        }
    }

    mouseUp(e) {
        if(this.dragged) {
            this.dragged = false;
            const percent = this.xPos / this.componentWidth;
            const a = this.listeners.some(a => !a(percent));
            if(a) {
                this.xPos = this.lastXPos;
                this.updateFrame();
            }
        }
    }

    update(current, duration) {
        if(this.dragged)
            return ;
        const {el} = this;
        const width = this.componentWidth = el.getBoundingClientRect().width;
        this.xPos = (current / duration) * width;
        this.updateFrame();
    }

    updateFrame() {
        const {range, thumb} = this;
        range.style.width = this.xPos + 'px';
        thumb.style.left = this.xPos + 'px';

    }

    destroy() {

        window.removeEventListener('mousedown', this.mouseDown);
        window.removeEventListener('mousemove', this.mouseMove);
        window.removeEventListener('mouseup', this.mouseUp);
        window.removeEventListener('touchstart', this.mouseDown);
        window.removeEventListener('touchend', this.mouseUp);
        window.removeEventListener('touchmove', this.mouseMove);
    }
}

class VideoPlayer {
    constructor(el) {
        this.el = el;
        this.destroy = this.destroy.bind(this);
        this.stopButtonClicked = this.stopButtonClicked.bind(this);
        this.controlButtonClicked = this.controlButtonClicked.bind(this);
        this.seekbarChanged = this.seekbarChanged.bind(this);
        this.eventPlayed = this.eventPlayed.bind(this);
        this.eventCanPlay = this.eventCanPlay.bind(this);
        this.eventPaused = this.eventPaused.bind(this);
        this.eventTimeUpdated = this.eventTimeUpdated.bind(this);

        this.updateSeekbar = this.updateSeekbar.bind(this);
        const video = this.video = el.querySelector('video');
        video.addEventListener('canplay', this.eventCanPlay);
        video.addEventListener('play', this.eventPlayed);
        video.addEventListener('pause', this.eventPaused);
        video.addEventListener('timeupdate', this.eventTimeUpdated);
        const controlButton = this.controlButton = el.querySelector('[data-action="control"]');
        controlButton.addEventListener('click', this.controlButtonClicked);
        const stopButton = this.stopButton = el.querySelector('[data-action="stop"]');
        stopButton.addEventListener('click', this.stopButtonClicked);
        this.seekbar = new SeekRangeBar(el.querySelector('[data-action="seekbar"]'));
        this.seekbar.subscribe(this.seekbarChanged);
    }

    updateSeekbar() {
        const {video, seekbar} = this;
        seekbar.update(video.currentTime, video.duration);
    }

    seekbarChanged(p) {
        const {video} = this;
        video.currentTime = p * video.duration;
        video.pause();
        return true;
    }

    eventCanPlay() {
        this.eventPaused();
        this.updateSeekbar();
    }

    eventPlayed() {
        this.controlButton.setAttribute('class', 'control-item state-pause');
    }

    eventPaused() {
        this.controlButton.setAttribute('class', 'control-item state-play');
    }

    eventTimeUpdated() {
        const {video} = this;
        this.updateSeekbar();
    }

    controlButtonClicked() {
        const {video} = this;
        if (video.paused)
            video.play();
        else
            video.pause();
    }

    stopButtonClicked() {
        const {video} = this;
        video.pause();
        video.currentTime = 0;
    }

    destroy() {
        const {stopButton, controlButton, video, seekbar} = this;
        video.removeEventListener('canplay', this.eventCanPlay);
        video.removeEventListener('play', this.eventPlayed);
        video.removeEventListener('pause', this.eventPaused);
        video.removeEventListener('timeupdate', this.eventTimeUpdated);
        controlButton.removeEventListener('click', this.controlButtonClicked);
        stopButton.removeEventListener('click', this.stopButtonClicked);
        this.seekbar.unsubscribe(this.seekbarChanged);
        seekbar.destroy();
    }
}