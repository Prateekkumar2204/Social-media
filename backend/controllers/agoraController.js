const { RtmTokenBuilder, RtmRole } = require("agora-access-token");

const getAgoraToken = (req, res) => {
  const uid = req.query.uid;

  if (!uid) {
    return res.status(400).json({ error: "UID is required" });
  }

  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtmTokenBuilder.buildToken(
    process.env.AGORA_APP_ID,
    process.env.AGORA_APP_CERTIFICATE,
    uid,
    RtmRole.Rtm_User,
    privilegeExpiredTs
  );

  return res.status(200).json({ token });
};

module.exports = { getAgoraToken };