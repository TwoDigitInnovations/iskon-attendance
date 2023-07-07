const mongoose = require("mongoose");
const Devotees = mongoose.model("Devotees");
const Attendance = mongoose.model("Attendance");
const response = require("./../responses");
const moment = require("moment");

module.exports = {
  // saveAttendance: async (req, res) => {
  //   try {
  //     const payload = req.body;
  //     let user;
  //     let updatedUser = {};
  //     user = await Devotees.find({
  //       name: payload.name,
  //       phone: payload.phone,
  //     }).lean();

  //     console.log(user);
  //     let userDetail = {
  //       phone: payload.phone,
  //       name: payload.name,
  //       address: payload.address || "",
  //       occupation: payload.occupation || "",
  //       marital_status: payload.marital_status,
  //       user_id: payload.user_id,
  //     };
  //     if (user.length) {
  //       let attendance = new Attendance({
  //         devotee_id: user[0]._id,
  //         user_id: payload.user_id,
  //         attendance_date: payload.date,
  //       });
  //       const at = await attendance.save();
  //       const dev = await Devotees.findByIdAndUpdate(user[0]._id, userDetail, {
  //         new: true,
  //         upsert: true,
  //       });
  //       updatedUser = {
  //         devotees: dev,
  //         attendance: at,
  //       };
  //       return response.created(res, updatedUser);
  //     } else {
  //       let devotees = new Devotees(userDetail);
  //       const dev = await devotees.save();
  //       console.log("dev===========>", dev);
  //       if (dev) {
  //         let attendance = new Attendance({
  //           devotee_id: dev._id,
  //           user_id: dev.user_id,
  //           attendance_date: payload.date,
  //         });
  //         const at = await attendance.save();
  //         updatedUser = {
  //           devotees: dev,
  //           attendance: at,
  //         };
  //         return response.created(res, updatedUser);
  //       }
  //     }
  //   } catch (error) {
  //     return { message: "err" };
  //   }
  // },

  saveAttendance: async (req, res) => {
    try {
      const payload = req.body;
      let user;
      let devotee;
      let updatedUser = {};
      user = await Devotees.find({
        name: payload.name,
        phone: payload.phone,
      }).lean();

      // console.log('I got this user',user[0]);
      // console.log('New date value is',new Date (new Date().setHours(23, 59, 59)));
      // console.log('New date value is+1',new Date(new Date(new Date().setDate(new Date().getDate()+1)).setHours(23, 59, 59)));

      devotee = await Attendance.find({
        devotee_id: user[0]._id,
        //attendance_date:  { $gte: new Date (new Date().setHours(23, 59, 59)), $lte: new Date(new Date(new Date().setDate(new Date().getDate()+1)).setHours(23, 59, 59)) },
        attendance_date: payload.date,
      }).lean();
      // console.log('I got this devotee',devotee);
      //console.log("this is userr.......",user);
      let userDetail = {
        phone: payload.phone,
        name: payload.name,
        address: payload.address || "",
        occupation: payload.occupation || "",
        marital_status: payload.marital_status,
        user_id: payload.user_id,
      };
      if (user.length) {
        if (devotee.length === 0) {
          let attendance = new Attendance({
            devotee_id: user[0]._id,
            user_id: payload.user_id,
            attendance_date: payload.date,
          });
          const at = await attendance.save();
          const dev = await Devotees.findByIdAndUpdate(
            user[0]._id,
            userDetail,
            {
              new: true,
              upsert: true,
            }
          );
          updatedUser = {
            devotees: dev,
            attendance: at,
          };
          return response.created(res, updatedUser);
        } else {
          return response.error(res, {
            name: "Error",
            message: "Attendace Already Saved",
            stack: "",
          });
        }
      } else {
        let devotees = new Devotees(userDetail);
        const dev = await devotees.save();
        console.log("dev===========>", dev);
        if (dev) {
          let attendance = new Attendance({
            devotee_id: dev._id,
            user_id: dev.user_id,
            attendance_date: payload.date,
          });
          const at = await attendance.save();
          updatedUser = {
            devotees: dev,
            attendance: at,
          };
          return response.created(res, updatedUser);
        }
      }
    } catch (error) {
      return { message: "err" };
    }
  },

  getDevotees: async (req, res) => {
    const payload = req.body;
    const devotees = await Devotees.find({
      user_id: payload.user_id,
    });
    return response.ok(res, devotees);
  },

  getAttendance: async (req, res) => {
    const payload = req.body;
    let startDate = new Date(
      new Date(payload?.date).setDate(new Date(payload?.date).getDate())
    );
    let endDate = new Date(
      new Date(payload?.date).setDate(new Date(payload?.date).getDate() + 1)
    );
    const at = await Attendance.find({
      user_id: payload.user_id,
      attendance_date: {
        $gte: new Date(startDate).getTime(),
        $lt: new Date(endDate).getTime(),
      },
    }).populate("devotee_id");
    return response.ok(res, at);
  },

  getAllAttendance: async (req, res) => {
    const payload = req.body;
    console.log(payload);
    const at = await Attendance.find({
      user_id: payload.user_id,
    });
    return response.ok(res, at);
  },

  formatedAttendance: async (req, res) => {
    try {
      const payload = req.body;
      let endDate = new Date(
        new Date(payload?.endDate).setDate(
          new Date(payload?.endDate).getDate() + 1
        )
      );
      let cond = {
        user_id: req.body.user_id,
        attendance_date: {
          $gte: new Date(payload?.startDate).getTime(),
          $lt: new Date(endDate).getTime(),
        },
      };
      const attendance = await Attendance.find(cond);
      let devotees = await Devotees.find({ user_id: req.body.user_id });
      let obj = [];
      devotees.map((i) => {
        let attt = [];
        attendance.map((ele) => {
          if (ele?.devotee_id.toString() === i?._id.toString()) {
            attt.push(moment(ele?.attendance_date).format("D"));
          }
        });
        obj.push({
          devotee: i,
          attendance: attt,
        });
      });
      return response.ok(res, { obj, attendance });
    } catch (error) {
      return response.error(res, error);
    }
  },
};
