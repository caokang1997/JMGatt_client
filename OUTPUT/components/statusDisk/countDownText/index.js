Component({
  properties: {
    input: {
      type: null,
      observer: function(t) {
        "number" == typeof t ? (this.setData({
          remainingSeconds: t,
          displayContent: this.formatTime(t)
        }), this.startCountdown()) : (this.setData({
          displayContent: t.toString()
        }), this.countdownInterval && clearInterval(this.countdownInterval))
      }
    }
  },
  data: {
    remainingSeconds: 0,
    displayContent: "00:00"
  },
  methods: {
    startCountdown: function() {
      var t = this;
      this.countdownInterval && clearInterval(this.countdownInterval), this.countdownInterval = setInterval((function() {
        t.data.remainingSeconds > 0 ? t.setData({
          remainingSeconds: t.data.remainingSeconds - 1,
          displayContent: t.formatTime(t.data.remainingSeconds - 1)
        }) : clearInterval(t.countdownInterval)
      }), 1e3)
    },
    formatTime: function(t) {
      var n = Math.floor(t / 60),
        e = t % 60;
      return "".concat(this.padZero(n), ":").concat(this.padZero(e))
    },
    padZero: function(t) {
      return t < 10 ? "0".concat(t) : t
    }
  },
  detached: function() {
    this.countdownInterval && clearInterval(this.countdownInterval)
  }
});