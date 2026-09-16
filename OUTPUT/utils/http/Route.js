var e = require("./JomooCloudRequest.js"),
  t = e.request,
  n = e.request1,
  o = e.requestRaw,
  r = e.requestAfterAutoLogin,
  a = e.requestRawAfterAutoLogin;
module.exports = {
  authLogin: function(e) {
    return t("/customized/pub/authlogin", {
      code: e
    }, "POST")
  },
  getCustonmListMode: function(e) {
    return r("/customized/listMode", e, "POST")
  },
  saveSelectedModes: function(e) {
    return r("/customized/saveMode", e, "POST")
  },
  getModeParams: function(e) {
    return r("/customized/getModeParams", e, "POST")
  },
  saveParams: function(e) {
    return r("/customized/saveParams", e, "POST")
  },
  getCurrVersion: function(e) {
    return r("/otaForWechat/getCurrVersion", e, "POST")
  },
  downloadUpgradeFile: function(e) {
    return a("/otaForWechat/downloadUpgradeFile", e, "POST")
  },
  updateUpgradeStatus: function(e) {
    return a("/otaForWechat/updateUpgradeStatus", e, "POST")
  },
  getLstVersion: function(e) {
    return r("/otaForWechat/getLstVersion", e, "POST")
  },
  veritifyAntiChannel: function(e) {
    return a("/antiChannelForWechat/veritifyAntiChannel", e, "POST")
  },
  saveRelMes: function(e) {
    return a("/antiChannelForWechat/saveRel", e, "POST")
  },
  updateActivateResult: function(e) {
    return a("/antiChannelForWechat/activate", e, "POST")
  },
  uploadGrowingData: function(e) {
    return n("/coldata/nfcdatamge/pri/colnfcdatasbyapp", e, "POST")
  },
  bindAiVoiceDeviceMac: function(e) {
    return r("/aiVoice/bindVoice", e, "POST")
  },
  loadAiVoiceDeviceMac: function(e) {
    return r("/aiVoice/loadVoice", e, "POST")
  },
  uploadSettingParamsForRemoteNFC: function(e) {
    return o("/sceneBoxControl/saveParams", e, "POST")
  },
  updateDeviceInfoBurning: function(e) {
    return r("/nfcUsed/burned", e, "POST")
  }
};