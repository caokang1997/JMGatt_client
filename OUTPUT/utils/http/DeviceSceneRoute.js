var e = require("./JomooCloudRequest.js").requestAfterAutoLogin;
module.exports = {
  getDeviceScenes: function(t) {
    return e("/sceneForWechat/getSceneInfo", t, "POST")
  },
  updateDeviceScene: function(t) {
    return e("/sceneForWechat/saveSceneInfo", t, "POST")
  }
};