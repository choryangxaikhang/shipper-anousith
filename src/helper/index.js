import Notiflix, { Loading } from "notiflix";
import React from "react";
import moment from "moment";
import loadingImage from "../img/loading.gif";
import sound from "../audio/sound.wav";
import { io } from "socket.io-client";
var start_year = new Date().getFullYear();
export const ITEM_PER_PAGE = 50;
export const aws_url_image = "s3://bithose-bucket/image/";
export const aws_url_images =
  "https://bithouse-bucket.s3.ap-southeast-1.amazonaws.com/images/";
export const newSound = new Audio(sound);
// export const socketServer = io("https://api.bit-houses.com");
// export const TOKEN = "ANS_COD";
export const FONT_SIZE = { fontSize: "15px" };
export const PRIMARY_COLOR = "#de0a0af2";
export const TOKEN = "APP-SHIPPER";
//get staff login
export const getStaffLogin = () => {
  let json = localStorage.getItem(TOKEN);
  let staff = parseJwt(json);
  return staff;
};
//clear localStorage
export const clearLocalStorage = () => {
  localStorage.removeItem(TOKEN);
};

export const detectPhoneNumber = (phon) => {
  if (String(phon)?.length >= 8) {
    return "85620" + phon;
  } else {
    return "85630" + phon;
  }
};

// year
export const getYearCustom = () => {
  let getYearCustom = [];
  for (let date = start_year; date > 2020; date--) {
    getYearCustom.push(date);
  }
  return getYearCustom;
};
//  paystatus
export const payStatus = (item) => {
  if (item === "ORIGIN") {
    return "ຊຳລະຕົ້ນທາງ";
  } else if (item === "DESTINATION") {
    return "ຊຳລະປາຍທາງ";
  } else {
    return "-";
  }
};

//get local branch
export const getLocalHouse = () => {
  let local = localStorage.getItem("HOUSE");
  if (local) {
    local = JSON.parse(local);
    return local;
  } else {
    let userLogin = getStaffLogin();
    userLogin = userLogin?.data?.house;
    return userLogin;
  }
};
// province
export const getLocalProvince = () => {
  let local = localStorage.getItem("PROVINCE");
  if (local) {
    local = JSON.parse(local);
    return local;
  } else {
    let userLogin = getStaffLogin();
    userLogin = userLogin?.data?.province;
    return userLogin;
  }
};

// educationlevel
export const getEducationLevel = () => {
  let getYear = [];
  var start_year = new Date().getFullYear();
  for (var i = start_year; i < start_year + 10; i++) {
    getYear.push(i - 1 + "-" + i);
  }
  return getYear;
};
// ກຳນົດ ເຄື່ອງໝາຍ ບັງຄັບໃຫ້ປ້ອນຂໍ້ມູນ
export const valiDate = () => {
  return <font style={{ color: "red" }}> * </font>;
};

// ກຳນົດ ເພດ
export const setGender = (gender) => {
  let res = "";
  switch (gender) {
    case "MALE":
      res = "ຊາຍ";
      break;
    case "FEMALE":
      res = "ຍິງ";
      break;
    case "OTHER":
      res = "ບໍ່ລະບຸ";
      break;
  }
  return res;
};

// ກຳນົດ ສະຖານະພາບ
export const MaritualStatus = (maritualStatus) => {
  let status = "";
  switch (maritualStatus) {
    case "SINGLE":
      status = "ໂສດ";
      break;
    case "MARRIAGE":
      status = "ເເຕ່ງງານ";
      break;
  }
  return status;
};

export const ITEM_PAGE_LIST = [
  { itemPage: "1" },
  { itemPage: "2" },
  { itemPage: "3" },
  { itemPage: "4" },
  { itemPage: "5" },
  { itemPage: "ທັງໜົດ" },
];

export const bracket = (tag) => {
  let st = "(";
  let en = ")";
  let i = st + tag + en;
  return i;
};

export const messageConfirm = (title, action) => {
  Notiflix.Confirm.show(
    "ເເຈ້ງເຕືອນ",
    title,
    "ຕົກລົງ",
    "ຍົກເລີກ",
    async function () {
      action();
    },
    function () {
      return false;
    }
  );
};
export const paiStatus = (status) => {
  if (status === 1) {
    return "ຈ່າຍແລ້ວ";
  } else if (status === 0) {
    return "ຍັງບໍ່ທັນຈ່າຍ";
  } else {
    return "-";
  }
};

export const chargeOnShop = (chargeOnShop) => {
  if (chargeOnShop === 1) {
    return <small className="text-success">
      <i className="fas fa-circle-check mr-1"/>
      ຈ່າຍຕົ້ນທາງແລ້ວ</small>;
  } else if (chargeOnShop === 0) {
    return <small className="text-danger">
      <i className="fas fa-exclamation mr-1" />
      ເກັບປາຍທາງ</small>;
  } else {
    return "-";
  }
};

//set params
export const setParams = (key, val) => {
  const urlSearch = window.location.search;
  if (urlSearch.search(key) === -1) {
    const _symbol = urlSearch ? "&" : "";
    const _search = `${urlSearch}${_symbol}${key}=${val ? val : ""}`;
    return _search;
  } else {
    const params = new URLSearchParams(urlSearch);
    const oldValue = params.get(key);
    const newUrl = urlSearch.replace(
      `${key}=${oldValue}`,
      `${key}=${val ? val : ""}`
    );
    return newUrl;
  }
};

// ວັນທີເດືອນປີເລີ່ມວັນທີ ເລີ່ມເດືອນ ເລີ່ມປີ
export const startOfMonth = () => {
  return moment().subtract(3, "months").startOf("month").format("YYYY-MM-DD");
};
//ວັນທີ່  ໑ ຂອງເດືອນ
export const startMonth = () => {
  return moment().clone().startOf("month").format("YYYY-MM-DD");
};

// ວັນທີເດືອນປີ ທ້າຍວັນທີ ທ້າເດືອນ ທ້າຍປີ
export const endOfMonth = () => {
  return moment().clone().endOf("month").format("YYYY-MM-DD");
};

//  ກຳນົດ ອາຍຸ
export const age = (age) => {
  let today = new Date();
  let y = today.getFullYear();
  let dob = moment(age).format("YYYY");
  return y - dob;
};

// ກຳນົດ ຟໍແມັດເງິນ
export const currency = (value) => {
  let currencys = new Intl.NumberFormat("en-CA").format(value);
  if (value !== 0) return currencys;
  else if (value === 0) return "0";
  else return "";
};

//formatDateTime
export const formatDateTime = (dateTime) => {
  let resp = moment(dateTime).format("DD-MM-YYYY, HH:mm");
  return resp;
};

// ກຳນົດ ວັນທີປັດຈຸບັນ(ພາສາລາວ)
export const formatDate = (dateTime) => {
  moment.locale("lo");
  let resp = moment(dateTime).format("DD MMMM YYYY");
  if (dateTime) return resp;
  else return "-";
};

// ກຳນົດ ວັນທີປັດຈຸບັນ(/)
export const formateDateSlash = (slashData) => {
  let resp = moment(slashData).format("YYYY/MM/DD");
  return resp;
};

// ກຳນົດ ວັນທີປັດຈຸບັນ(-)
export const formatDateDash = (dashDate) => {
  let resp = moment(dashDate).format("YYYY-MM-DD");
  return resp;
};

// ກຳນົດ ວັນທີປັດຈຸບັນ(ຖັດໄປ 1 ອາທິດ)
export const nextSevenDay = () => {
  var nextSenvenDay = moment().add(7, "days");
  var nextSevenDays = moment(nextSenvenDay).format("YYYY-MM-DD");
  return nextSevenDays;
};

// ກຳນົດ ວັນທີປັດຈຸບັນ(ຖັດໄປ 1 ມື້)
export const nextOneDay = () => {
  var nextOneDay = moment().add(1, "days");
  var nextOneDays = moment(nextOneDay).format("YYYY-MM-DD");
  return nextOneDays;
};

// ກຳນົດ ວັນທີ ແລະ ເວລາປັດຈຸບັນ(ພາສາລາວ)
export const toDay = () => {
  moment.locale("lo");
  var today = new Date();
  var todays = moment(today).format("DD/MM/YY, HH:mm");
  return todays;
};

// ກຳນົດ ວັນທີປັດຈຸບັນ(-)
export const toDayDash = () => {
  var today = new Date();
  var todays = moment(today).format("YYYY-MM-DD");
  return todays;
};

export const unixTimeFormat = (x) => {
  let res = moment.unix(x).format("YYYY-MM-DD HH:SS");
  if (res) return res;
};

export const loadingScreen = () => {
  return Loading.hourglass({
    backgroundColor: "rgba(245, 74, 7,0.2)",
    svgColor: "#de0a0af2",
  });
};
export const closeLoadingScreen = () => {
  return Loading.move();
};

export const reconvertDay = (day) => {
  let result = "";
  switch (day) {
    case "MONDAY":
      result = "ຈັນ";
      break;
    case "TUESDAY":
      result = "ອັງຄານ";
      break;
    case "WEDNESDAY":
      result = "ພຸດ";
      break;
    case "THURSDAY":
      result = "ພະຫັດ";
      break;
    case "FRIDAY":
      result = "ສຸກ";
      break;
    case "SATURDAY":
      result = "ເສົາ";
      break;
    case "SUNDAY":
      result = "ອາທິດ";
      break;
    default:
      result = "ຈັນ";
  }
  return result;
};

// ກຳນົດ ການຈັດລຽງຕາມຄ່າຕ່າງໆ
export const SortBy = ({ sort }) => {
  return (
    <div
      onClick={() => {
        sort();
      }}
      style={{
        float: "right",
        marginRight: 5,
        cursor: "pointer",
      }}
    >
      <i classNameName="fa fa-sort"></i>
    </div>
  );
};

// =======>>> month

export const _month = [
  {
    id: "01",
    month: "ມັງກອນ",
  },
  {
    id: "02",
    month: "ກຸມພາ",
  },
  {
    id: "03",
    month: "ມີນາ",
  },
  {
    id: "04",
    month: "ເມສາ",
  },
  {
    id: "05",
    month: "ພຶດສະພາ",
  },
  {
    id: "06",
    month: "ມີຖຸນາ",
  },
  {
    id: "07",
    month: "ກໍລະກົດ",
  },
  {
    id: "08",
    month: "ສິງຫາ",
  },
  {
    id: "09",
    month: "ກັນຍາ",
  },
  {
    id: "10",
    month: "ຕຸລາ",
  },
  {
    id: "11",
    month: "ພະຈິກ",
  },
  {
    id: "12",
    month: "ທັນວາ",
  },
];

export const startLoading = () => {
  return Notiflix.Loading.standard("Loading...");
};
export const stopLoading = () => {
  return Notiflix.Loading.remove();
};

export const messageSuccess = (e) => {
  Notiflix.Notify.init({ position: "center-top" });
  Notiflix.Notify.success(e);
};

export const messageError = (e) => {
  Notiflix.Notify.init({ position: "center-top" });
  Notiflix.Notify.failure(e);
};

export const messageWarning = (e) => {
  Notiflix.Notify.init({ position: "center-top" });
  Notiflix.Notify.warning(e);
};
export const startSpriner = (color) => {
  return (
    <div classNameName={`spinner-border text-${color}`} role="status">
      <span classNameName="sr-only">ກຳລັງໂຫຼດຂໍ້ມູນ...</span>
    </div>
  );
};

export const loadingData = (size, content) => {
  return (
    <>
      <img
        src={loadingImage}
        alt="loading"
        style={{ width: size, height: size }}
      />{" "}
      {content}
    </>
  );
};
//createdAt ວັນທີ່ timestamp
export const startDate_gte = (date) => {
  return moment(date).unix();
};
export const endDate_lt = (date) => {
  return moment(date).unix();
};

export const createdAt_gte = (date) => {
  const _date = date ? date : new Date();
  return moment(_date).format("YYYY-MM-DD");
};

export const createdAt_lt = (date) => {
  const _date = date ? date : new Date();
  return moment(_date).add(1, "days").format("YYYY-MM-DD");
};

//updatedAt
export const updatedAt_gte = (date) => {
  const _date = date ? date : new Date();
  return moment(_date).format("YYYY-MM-DD");
};
export const updatedAt_lt = (date) => {
  const _date = date ? date : new Date();
  return moment(_date).add(1, "days").format("YYYY-MM-DD");
};
//confirm
export const notiflixConfirm = (title, cb) => {
  Notiflix.Confirm.show(
    "ແຈ້ງເຕືອນ",
    title,
    "ຕົກລົງ",
    "ຍົກເລີກ",
    () => {
      cb();
    },
    () => {
      return false;
    }
  );
};

//limit input number only
export const numberOnlyInput = (event) => {
  if (!/[0-9]/.test(event.key)) {
    event.preventDefault();
  }
};

export const userStatus = (item) => {
  if (item === "SUPER_ADMIN") {
    return "ບໍລິຫານສູງສຸດ";
  } else if (item === "IT") {
    return "ໄອທີ";
  } else if (item === "HR") {
    return "ບຸກຄາລະກອນ";
  } else if (item === "ACCOUNTANT") {
    return "ບັນຊີ";
  } else if (item === "FINANCE") {
    return "ການເງິນ";
  } else if (item === "LAW") {
    return "ກົດໝາຍ";
  } else if (item === "STATE_DIRECTOR") {
    return "ຫົວໜ້າບໍລິຫານແຂວງ";
  } else if (item === "BRANCH_DIRECTOR") {
    return "ເຈົ້າຂອງກິດຈະການ";
  } else if (item === "ADMIN") {
    return "ເອັດມິນ";
  } else if (item === "CALL_CENTER") {
    return "ພ/ງ ຕ້ອນຮັບ";
  } else if (item === "CUSTOMER_SERVICE") {
    return "ພ/ງ ບໍລິການລູກຄ້າ";
  } else if (item === "DRIVER") {
    return "ໄລເດີ້";
  } else if (item === "SHIPPER") {
    return "ພະນັກງານຂົນສົ່ງ";
  } else {
    return "-";
  }
};

export const equimentStatus = (house) => {
  if (house === "INACTIVE") {
    return "ໃຊ້ງານ";
  } else if (house === "BROKED") {
    return "ບ໋ອກ";
  } else if (house === "FIXING") {
    return "ສ້ອມແປງ";
  } else if (house === "UNACTIVE") {
    return "ເປ່ເພ";
  } else {
    return "-";
  }
};
export const StatusEquiment = (status) => {
  if (status === "FEE") {
    return "ສ້າງໃໝ່";
  } else if (status === "FULL") {
    return "ຖືກນຳໃຊ້ແລ້ວ";
  } else {
    return "-";
  }
};
// bill auto
export const randomBillNo = (pr = "B-") => {
  for (let i = 1; i <= 8; i++) pr += ~~(Math.random() * 8);
  return pr;
};

export const ItemStatus = (itemStatus) => {
  if (itemStatus === "CANCELED") {
    return "ຍົກເລິກ";
  } else if (itemStatus === "COMPLETED") {
    return "ສົ່ງສຳເລັດ";
  } else if (itemStatus === "LOCKED") {
    return "ລ໋ອກສາຍ";
  } else if (itemStatus === "ORIGIN_RECEIVED") {
    return "ສາຂາຕົ້ນທາງ";
  } else if (itemStatus === "ORIGIN_TRANSFERRING") {
    return "ກຳລັງເຄື່ອນຍ້າຍ";
  } else if (itemStatus === "DEST_RECEIVED") {
    return "ຮອດປາຍທາງ";
  } else if (itemStatus === "REQUESTING") {
    return "ກຳລັງຮ້ອງຂໍ";
  } else if (itemStatus === "ASSIGNING") {
    return "ການມອບ";
  } else if (itemStatus === "ASSIGNED_SHIPPER") {
    return "ກຳລັງຈັດສົ່ງ";
  } else if (itemStatus === "DELIVERED") {
    return "ຈັດສົ່ງແລ້ວ";
  } else if (itemStatus === "CREATING") {
    return "ການສ້າງ";

  } else {
    return "-";
  }
};
export const ShipperStatus = (status) => {
  if (status === "CANCELED") {
    return <span className="text-danger">ລົ້ມເຫຼວ</span>
  } else if (status === "REQUESTING") {
    return <span className="text-danger">ກຳລັງຮ້ອງຂໍ</span>
  } else if (status === "RECEIVED") {
    return <span className="text-success">ຮັບອໍເດີແລ້ວ</span>
  } else if (status === "DEPARTURE") {
    return <span className="text-success">ກຳລັງຈັດສົ່ງ</span>
  } else {
    return "-";
  }
};

export const StatusDelivery = (status) => {
  if (status === "NOT_ANSWER_CALL") {
    return <span className="text-danger">ໂທບໍ່ຮັບສາຍ</span>
  } else if (status === "CAN_NOT_CONTACT") {
    return <span className="text-danger">ບໍ່ສາມາດສົ່ງໄດ້</span>
  } else if (status === "CAN_NOT_SENT") {
    return <span className="text-danger">ບໍ່ສາມາດຕິດຕໍ່ໄດ້</span>
  } else {
    return "-";
  }
};

// get user role from token
export const parseJwt = (token) => {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};