Component({
  properties: {
    isEditing: {
      type: Boolean,
      value: !1
    },
    time: {
      type: String,
      value: ""
    },
    name: {
      type: String,
      value: ""
    },
    enabled: {
      type: Boolean,
      value: !1
    }
  },
  methods: {
    onClickItem: function() {
      this.triggerEvent("clickitem")
    },
    onToggleSwitch: function(e) {
      this.triggerEvent("toggleswitch", e.detail)
    },
    onClickDelete: function() {
      this.triggerEvent("clickdelete")
    }
  }
});