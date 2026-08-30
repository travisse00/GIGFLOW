const Notification = require("../models/notificationModel");

const createNotification = async ({
  recipient,
  sender = null,
  type,
  message,
  order = null,
  review = null,
}) => {
  try {
    const notification = await Notification.create({
      recipient,
      sender,
      type,
      message,
      order,
      review,
    });

    /*
    ========================================
    REAL-TIME NOTIFICATION
    ========================================
    */

    try {
      const { getIO } = require("./socket");

      const io = getIO();

      io.to(`user_${recipient.toString()}`).emit(
        "newNotification",
        notification
      );
    } catch (socketError) {
      console.error(
        "NOTIFICATION SOCKET ERROR:",
        socketError.message
      );
    }

    return notification;
  } catch (error) {
    console.error(
      "CREATE NOTIFICATION ERROR:",
      error
    );

    return null;
  }
};

module.exports = createNotification;