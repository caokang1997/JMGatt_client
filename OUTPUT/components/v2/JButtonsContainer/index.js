Component({
  options: {
    multipleSlots: !0
  },
  properties: {
    mainStyle: {
      type: String,
      value: "opacity: 1;"
    },
    column: {
      type: Number,
      value: 3,
      observer: function(a, t) {
        4 != a ? 3 != a ? 2 != a ? 1 != a ? this.setData({
          mainClass: "div-action-bar-3"
        }) : this.setData({
          mainClass: "div-action-bar-1"
        }) : this.setData({
          mainClass: "div-action-bar-2"
        }) : this.setData({
          mainClass: "div-action-bar-3"
        }) : this.setData({
          mainClass: "div-action-bar-4"
        })
      }
    }
  },
  data: {
    mainClass: "div-action-bar-3"
  },
  methods: {}
});