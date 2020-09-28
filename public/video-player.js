class VideoPlayer {
    constructor(el) {
        this.el = el;
        this.stopButtonClicked = this.stopButtonClicked.bind(this);
        this.controlButtonClicked = this.controlButtonClicked.bind(this);
        this.eventPlayed = this.eventPlayed.bind(this);
        this.eventPaused = this.eventPaused.bind(this);
        const video = this.video = el.querySelector('video');
        video.addEventListener('play', this.eventPlayed);
        video.addEventListener('pause', this.eventPaused);
        video.addEventListener('seeking', () => {
            console.log('pr')
        });
        const controlButton = this.controlButton = el.querySelector('[data-action="control"]');
        controlButton.addEventListener('click', this.controlButtonClicked);

        const stopButton = this.stopButton = el.querySelector('[data-action="stop"]');
        stopButton.addEventListener('click', this.stopButtonClicked);


        this.eventPaused();
    }
    eventPlayed() {
        this.controlButton.setAttribute('class', 'control-item state-pause');
    }
    eventPaused() {
        this.controlButton.setAttribute('class', 'control-item state-play');
    }

    controlButtonClicked() {
        const {video} = this;
        if(video.paused)
            video.play();
        else
            video.pause();
    }
    stopButtonClicked() {
        const {video} = this;
        video.pause();
        video.currentTime = 0 ;
    }

    destroy() {
        const {stopButton, controlButton, video} = this;
        video.removeEventListener('play', this.eventPlayed);
        video.removeEventListener('pause', this.eventPaused);
        controlButton.removeEventListener('click', this.controlButtonClicked);
        stopButton.removeEventListener('click', this.stopButtonClicked);
    }
}