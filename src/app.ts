import React, { Component, ReactElement, useState } from 'react';
import ReactDOM from "react-dom";

type ElevatorProps = Record<string, unknown>;

type ElevatorState = {
  currentFloor: number;
  status: string;
  requestedFloor: string | number;
  previousStatus: string | null;
  requestedFloors: number[];
};

function timeout(ms: number): Promise<() => unknown> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function sleep() {
  await timeout(2000);
}

export const Status = {
  IDLE: "IDLE",
  IDLE_PENDING: "IDLE_PENDING",
  MOVING_UP: "MOVING_UP",
  MOVING_DOWN: "MOVING_DOWN"
};

export enum Direction {
  UP = "UP",
  DOWN = "DOWN"
}

class Elevator extends Component<ElevatorProps, ElevatorState> {
  private readonly maxFloors: number;
  constructor(props: ElevatorProps) {
    super(props);

    this.state = {
      currentFloor: 0,
      status: Status.IDLE,
      requestedFloor: 0,
      previousStatus: Status.IDLE,
      requestedFloors: []
    };

    this.maxFloors = 4;
    this.setCurrentFloor = this.setCurrentFloor.bind(this);
    this.moveElevator = this.moveElevator.bind(this);
    this.requestFloor = this.requestFloor.bind(this);
  }

  async setCurrentFloor(upOrDown: Direction): Promise<void> {
    const requestedFloors = Array.from(this.state.requestedFloors);
    const currentFloor =
      upOrDown === Direction.UP
        ? this.state.currentFloor + 1
        : this.state.currentFloor - 1;
    const previousStatus = this.state.status;
    const status = !requestedFloors.includes(currentFloor)
      ? this.state.status
      : Status.IDLE_PENDING;

    if (requestedFloors.includes(currentFloor)) {
      requestedFloors.splice(requestedFloors.indexOf(currentFloor), 1);
    }

    this.setState(
      {
        currentFloor,
        status,
        previousStatus,
        requestedFloors
      },
      async () => {
        // Simulates the door opening.
        await sleep();

        this.setState(
          {
            status: Status.IDLE
          },
          () => {
            // If this isn't the floor that was requested then we'll move to the next one.
            if (this.state.requestedFloors.length) {
              this.moveElevator();
            } else {
              this.setState({
                previousStatus: null
              });
            }
          }
        );
      }
    );
  }

  async moveElevator(): Promise<void> {
    const ascendingFloors = this.state.requestedFloors.filter(
      (item) => item > this.state.currentFloor
    );
    const descendingFloors = this.state.requestedFloors.filter(
      (item) => item < this.state.currentFloor
    );

    const nextFloor =
      this.state.previousStatus === Status.MOVING_UP && ascendingFloors.length
        ? ascendingFloors[0]
        : this.state.previousStatus === Status.MOVING_DOWN &&
          descendingFloors.length
        ? descendingFloors[0]
        : this.state.requestedFloors[0];

    if (typeof nextFloor !== "undefined" && this.state.status === Status.IDLE) {
      this.setState(
        {
          status:
            nextFloor > this.state.currentFloor
              ? Status.MOVING_UP
              : Status.MOVING_DOWN
        },
        async () => {
          if (this.state.currentFloor !== nextFloor) {
            await sleep();
            this.setCurrentFloor(
              nextFloor > this.state.currentFloor
                ? Direction.UP
                : Direction.DOWN
            );
          }
        }
      );
    }
  }

  requestFloor(requestedFloor: number): void {
    if (requestedFloor !== this.state.currentFloor) {
      const requestedFloors = Array.from(this.state.requestedFloors);

      if (!requestedFloors.includes(requestedFloor)) {
        requestedFloors.push(requestedFloor);
      }

      this.setState(
        {
          requestedFloors
        },
        () => this.moveElevator()
      );
    }
  }

  render(): ReactElement {
    return (
        <div className="elevator row items-center">
          <div
            className="flex justify-center"
            style={{ flexDirection: "column" }}
          >
            <div className="elevator-example__status">
              Current Floor:{" "}
              {this.state.currentFloor === 0 ? "G" : this.state.currentFloor}
            </div>
            <div className="elevator-example__status">
              Current Status: {this.state.status}
            </div>
            <div className="elevator-example__status">
              Requested Floor(s):{" "}
              {this.state.requestedFloors.join(", ").replace("0", "G")}
            </div>
            <div
              className="elevator-example__button flex"
              style={{ flexWrap: "wrap" }}
            >
              <button
                className="elevator-example__button--item  flex items-center justify-center text-black disabled:text-gray-400"
                onClick={() => this.requestFloor(0)}
                disabled={this.state.requestedFloors.includes(0)}
              >
                G
              </button>
              <button
                className="elevator-example__button--item  flex items-center justify-center text-black disabled:text-gray-400"
                onClick={() => this.requestFloor(1)}
                disabled={this.state.requestedFloors.includes(1)}
              >
                1
              </button>
              <button
                className="elevator-example__button--item  flex items-center justify-center text-black disabled:text-gray-400"
                onClick={() => this.requestFloor(2)}
                disabled={this.state.requestedFloors.includes(2)}
              >
                2
              </button>
              <button
                className="elevator-example__button--item  flex items-center justify-center text-black disabled:text-gray-400"
                onClick={() => this.requestFloor(3)}
                disabled={this.state.requestedFloors.includes(3)}
              >
                3
              </button>
              <button
                className="elevator-example__button--item  flex items-center justify-center text-black disabled:text-gray-400"
                onClick={() => this.requestFloor(4)}
                disabled={this.state.requestedFloors.includes(4)}
              >
                4
              </button>
            </div>
          </div>
          <div className="elevator-example__building" id="building">
            <div className="elevator-example__shaft">
              <div className="elevator-example__elevator">
                <div
                  className="elevator-example__elevator--cab"
                  style={{
                    backgroundImage: `url("https://i.imgur.com/qU2zQAS.png")`,
                    bottom: `${
                      (this.state.currentFloor * (this.maxFloors * 10)) / 2
                    }%`
                  }}
                >
                  <div
                    className={`elevator-example__elevator--door left ${
                      this.state.status === "IDLE" ||
                      this.state.status === "IDLE_PENDING"
                        ? "active-left"
                        : ""
                    }`}
                  />
                  <div
                    className={`elevator-example__elevator--door right ${
                      this.state.status === "IDLE" ||
                      this.state.status === "IDLE_PENDING"
                        ? "active-right"
                        : ""
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
  
  ReactDOM.render(<Elevator />, document.getElementById("root"));