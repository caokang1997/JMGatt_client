Component({
  properties: {
    itemId: {
      type: Number,
      value: 0
    },
    imageUrl: {
      type: String,
      value: ""
    },
    title: {
      type: String,
      value: ""
    },
    desc: {
      type: String,
      value: ""
    },
    statusText: {
      type: String,
      value: "已联动"
    },
    statusColor: {
      type: String,
      value: "#724FFD"
    },
    viewStyle: {
      type: String,
      value: ""
    },
    marginHorizontal: {
      type: Number,
      value: 40
    },
    enable: {
      type: Boolean,
      value: !1
    }
  },
  data: {
    cardStyle: ""
  },
  lifetimes: {},
  methods: {
    onTap: function() {
      console.debug("onTap", this.data.itemId), this.triggerEvent("onTap", {
        id: this.data.itemId
      })
    }
  }
});