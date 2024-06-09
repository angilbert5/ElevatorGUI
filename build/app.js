"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Direction = exports.Status = void 0;
const react_1 = require("react");
const react_dom_1 = __importDefault(require("react-dom"));
function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function sleep() {
    return __awaiter(this, void 0, void 0, function* () {
        yield timeout(2000);
    });
}
exports.Status = {
    IDLE: "IDLE",
    IDLE_PENDING: "IDLE_PENDING",
    MOVING_UP: "MOVING_UP",
    MOVING_DOWN: "MOVING_DOWN"
};
var Direction;
(function (Direction) {
    Direction["UP"] = "UP";
    Direction["DOWN"] = "DOWN";
})(Direction || (exports.Direction = Direction = {}));
class Elevator extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentFloor: 0,
            status: exports.Status.IDLE,
            requestedFloor: 0,
            previousStatus: exports.Status.IDLE,
            requestedFloors: []
        };
        this.maxFloors = 4;
        this.setCurrentFloor = this.setCurrentFloor.bind(this);
        this.moveElevator = this.moveElevator.bind(this);
        this.requestFloor = this.requestFloor.bind(this);
    }
    setCurrentFloor(upOrDown) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestedFloors = Array.from(this.state.requestedFloors);
            const currentFloor = upOrDown === Direction.UP
                ? this.state.currentFloor + 1
                : this.state.currentFloor - 1;
            const previousStatus = this.state.status;
            const status = !requestedFloors.includes(currentFloor)
                ? this.state.status
                : exports.Status.IDLE_PENDING;
            if (requestedFloors.includes(currentFloor)) {
                requestedFloors.splice(requestedFloors.indexOf(currentFloor), 1);
            }
            this.setState({
                currentFloor,
                status,
                previousStatus,
                requestedFloors
            }, () => __awaiter(this, void 0, void 0, function* () {
                // Simulates the door opening.
                yield sleep();
                this.setState({
                    status: exports.Status.IDLE
                }, () => {
                    // If this isn't the floor that was requested then we'll move to the next one.
                    if (this.state.requestedFloors.length) {
                        this.moveElevator();
                    }
                    else {
                        this.setState({
                            previousStatus: null
                        });
                    }
                });
            }));
        });
    }
    moveElevator() {
        return __awaiter(this, void 0, void 0, function* () {
            const ascendingFloors = this.state.requestedFloors.filter((item) => item > this.state.currentFloor);
            const descendingFloors = this.state.requestedFloors.filter((item) => item < this.state.currentFloor);
            const nextFloor = this.state.previousStatus === exports.Status.MOVING_UP && ascendingFloors.length
                ? ascendingFloors[0]
                : this.state.previousStatus === exports.Status.MOVING_DOWN &&
                    descendingFloors.length
                    ? descendingFloors[0]
                    : this.state.requestedFloors[0];
            if (typeof nextFloor !== "undefined" && this.state.status === exports.Status.IDLE) {
                this.setState({
                    status: nextFloor > this.state.currentFloor
                        ? exports.Status.MOVING_UP
                        : exports.Status.MOVING_DOWN
                }, () => __awaiter(this, void 0, void 0, function* () {
                    if (this.state.currentFloor !== nextFloor) {
                        yield sleep();
                        this.setCurrentFloor(nextFloor > this.state.currentFloor
                            ? Direction.UP
                            : Direction.DOWN);
                    }
                }));
            }
        });
    }
    requestFloor(requestedFloor) {
        if (requestedFloor !== this.state.currentFloor) {
            const requestedFloors = Array.from(this.state.requestedFloors);
            if (!requestedFloors.includes(requestedFloor)) {
                requestedFloors.push(requestedFloor);
            }
            this.setState({
                requestedFloors
            }, () => this.moveElevator());
        }
    }
    render() {
        return className = "elevator row items-center" >
            className;
        "flex justify-center";
        style = {};
        {
            flexDirection: "column";
        }
    }
}
    >
        className;
"elevator-example__status" >
    Current;
Floor: {
    " ";
}
{
    this.state.currentFloor === 0 ? "G" : this.state.currentFloor;
}
/div>
    < div;
className = "elevator-example__status" >
    Current;
Status: {
    this.state.status;
}
/div>
    < div;
className = "elevator-example__status" >
    Requested;
Floor(s);
{
    " ";
}
{
    this.state.requestedFloors.join(", ").replace("0", "G");
}
/div>
    < div;
className = "elevator-example__button flex";
style = {};
{
    flexWrap: "wrap";
}
    >
        className;
"elevator-example__button--item  flex items-center justify-center text-black disabled:text-gray-400";
onClick = {}();
this.requestFloor(0);
disabled = { this: .state.requestedFloors.includes(0) }
    >
        G
    < /button>
    < button;
className = "elevator-example__button--item  flex items-center justify-center text-black disabled:text-gray-400";
onClick = {}();
this.requestFloor(1);
disabled = { this: .state.requestedFloors.includes(1) }
    >
        1
    < /button>
    < button;
className = "elevator-example__button--item  flex items-center justify-center text-black disabled:text-gray-400";
onClick = {}();
this.requestFloor(2);
disabled = { this: .state.requestedFloors.includes(2) }
    >
        2
    < /button>
    < button;
className = "elevator-example__button--item  flex items-center justify-center text-black disabled:text-gray-400";
onClick = {}();
this.requestFloor(3);
disabled = { this: .state.requestedFloors.includes(3) }
    >
        3
    < /button>
    < button;
className = "elevator-example__button--item  flex items-center justify-center text-black disabled:text-gray-400";
onClick = {}();
this.requestFloor(4);
disabled = { this: .state.requestedFloors.includes(4) }
    >
        4
    < /button>
    < /div>
    < /div>
    < div;
className = "elevator-example__building";
id = "building" >
    className;
"elevator-example__shaft" >
    className;
"elevator-example__elevator" >
    className;
"elevator-example__elevator--cab";
style = {};
{
    backgroundImage: `url("https://i.imgur.com/qU2zQAS.png")`,
        bottom;
    `${(this.state.currentFloor * (this.maxFloors * 10)) / 2}%`;
}
    >
        className;
{
    `elevator-example__elevator--door left ${this.state.status === "IDLE" ||
        this.state.status === "IDLE_PENDING"
        ? "active-left"
        : ""}`;
}
/>
    < div;
className = {} `elevator-example__elevator--door right ${this.state.status === "IDLE" ||
    this.state.status === "IDLE_PENDING"
    ? "active-right"
    : ""}`;
/>
    < /div>
    < /div>
    < /div>
    < /div>
    < /div>;
;
react_dom_1.default.render(/>, document.getElementById("root")););
