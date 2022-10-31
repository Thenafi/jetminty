"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
exports.__esModule = true;
var client_1 = require("@prisma/client");
var express_1 = __importDefault(require("express"));
var multer = require("multer");
var cors = require("cors");
var upload = multer();
var prisma = new client_1.PrismaClient();
var app = (0, express_1["default"])();
app.use(express_1["default"].urlencoded({ extended: true }));
app.use(express_1["default"].json());
app.get("/students", cors(), function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var users;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            prisma.student.findMany({
              skip: 40,
              take: 10,
            }),
          ];
        case 1:
          users = _a.sent();
          res.json(users);
          return [2 /*return*/];
      }
    });
  });
});
app.post("/entry_api", upload.none(), function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var aStudent, student, error_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          console.log(req.body);
          aStudent = {
            name: req.body.fname,
            id: req.body.clid,
            batch: +req.body.batch,
            dept: req.body.dept,
            sec: req.body.section,
            gender: req.body.gender,
            active: req.body.donor === "Yes" ? true : false,
            bloodGroup: req.body.blood,
            clg: req.body.clg,
            homeTown: req.body.htown,
            birthday: new Date(req.body.bDate),
            phoneNumber: req.body.phone,
            email: req.body.email,
            socialLink: req.body.link,
          };
          _a.label = 1;
        case 1:
          _a.trys.push([1, 3, , 4]);
          return [
            4 /*yield*/,
            prisma.student.create({
              data: aStudent,
            }),
          ];
        case 2:
          student = _a.sent();
          res.json(student);
          return [3 /*break*/, 4];
        case 3:
          error_1 = _a.sent();
          console.log(error_1);
          res.json(error_1);
          return [3 /*break*/, 4];
        case 4:
          return [2 /*return*/];
      }
    });
  });
});
app.get("/entry_api_test", upload.none(), function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var i, aStudent, student;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          i = 0;
          _a.label = 1;
        case 1:
          if (!(i < 10)) return [3 /*break*/, 4];
          aStudent = {
            name: "MD MAHMODUL HAQUE",
            id: "TE-1808105".concat(i),
            email: "01723558696".concat(i, "@gmail"),
            batch: 8,
            dept: "TEX",
            bloodGroup: "A+",
            homeTown: "Brahmanbaria",
            socialLink: "01723558696".concat(i),
            gender: "M",
            sec: "C",
            clg: "BAF SHAHEEN COLLEGE",
            active: false,
            birthday: new Date("1999-04-23"),
            phoneNumber: "01723558696".concat(i),
          };
          return [
            4 /*yield*/,
            prisma.student.create({
              data: aStudent,
            }),
          ];
        case 2:
          student = _a.sent();
          _a.label = 3;
        case 3:
          i++;
          return [3 /*break*/, 1];
        case 4:
          res.json("done");
          return [2 /*return*/];
      }
    });
  });
});
app.get("/entry_api_test2", upload.none(), function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var students, i, aStudent, student;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          students = [];
          for (i = 1000; i < 90000; i++) {
            aStudent = {
              name: "MD MAHMODUL HAQUE 01723558696${i}@gmail ",
              id: "TE-1808105".concat(i),
              email: "01723558696"
                .concat(i, "@gmail01723558696")
                .concat(i, "@gmail01723558696")
                .concat(i, "@gmail01723558696")
                .concat(i, "@gmail01723558696")
                .concat(i, "@gmail01723558696")
                .concat(i, "@gmail"),
              batch: 8,
              dept: "TEX",
              bloodGroup: "A+",
              homeTown:
                "01723558696${i}@gmail01723558696${i}@gmail01723558696${i}@gmail01723558696${i}@gmail01723558696${i}@gmail",
              socialLink: "01723558696"
                .concat(i, "@gmail01723558696")
                .concat(i, "@gmail01723558696")
                .concat(i, "@gmail01723558696")
                .concat(i, "@gmail01723558696")
                .concat(i, "@gmail01723558696")
                .concat(i, "@gmail"),
              gender: "M",
              sec: "C",
              clg: "01723558696${i}@gmail01723558696${i}@gmail01723558696${i}@gmail01723558696${i}@gmail",
              active: false,
              birthday: new Date("1999-04-23"),
              phoneNumber: "01723558696"
                .concat(i, "@gmail01723558696")
                .concat(i, "@gmail01723558696")
                .concat(i, "@gmail01723558696")
                .concat(i, "@gmail"),
            };
            students.push(aStudent);
          }
          return [
            4 /*yield*/,
            prisma.student.createMany({
              data: __spreadArray([], students, true),
            }),
          ];
        case 1:
          student = _a.sent();
          res.json(student);
          return [2 /*return*/];
      }
    });
  });
});
app.get("/getSingleStudent/:id", cors(), function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var id, student;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          id = req.params.id;
          return [
            4 /*yield*/,
            prisma.student.findUnique({
              where: {
                id: id,
              },
            }),
          ];
        case 1:
          student = _a.sent();
          res.json(student);
          return [2 /*return*/];
      }
    });
  });
});
const PORT = process.env.PORT || 3000;
var server = app.listen(PORT, function () {
  return console.log("\n\uD83D\uDE80 Server ready at: http://localhost:3000");
});
//# sourceMappingURL=index.js.map
