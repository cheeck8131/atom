import fs from "fs/promises";
import { newVector } from "server";

export type RaceAction = "start" | "stop" | "restart" | "top" | "clear";
export type RaceType = "cold" | "hot";

interface ITop {
  loopTime: Date;
  scName: string;
}

declare global {
  interface PlayerMp {
    race: Race | null;
  }
}

export class Race {
  declare private vehicle: VehicleMp;
  private enterPosition: Vector3Mp;
  private player: PlayerMp;
  private loops: Date[] = [];

  public static topHot: ITop[];
  public static topCold: ITop[];

  static {
    (async () => {
      this.topHot = JSON.parse(
        (await fs.readFile("./topHot.json")).toString("utf-8")
      );
      this.topCold = JSON.parse(
        (await fs.readFile("./topCold.json")).toString("utf-8")
      );

      if (!Array.isArray(this.topHot)) {
        this.topHot = [];
        fs.writeFile("./topHot.json", "[]");
      }

      if (!Array.isArray(this.topCold)) {
        this.topCold = [];
        fs.writeFile("./topCold.json", "[]");
      }
    })();
  }

  constructor(player: PlayerMp) {
    this.player = player;
    this.enterPosition = player.position;
    this.spawnVehicle();
  }

  private spawnVehicle() {
    this.vehicle = mp.vehicles.new(
      "schafter3",
      newVector({
        x: 1099.162841796875,
        y: 164.43771362304688,
        z: 81.84321594238281,
      })
    );
    return this.vehicle;
  }

  public start() {
    this.player.outputChatBox("Вы начали гонку");
    this.player.putIntoVehicle(this.vehicle, 0);
  }

  public stop() {
    this.player.outputChatBox("Вы закончили гонку");
    this.player.race = null;
    this.player.position = this.enterPosition;
  }

  public restart() {
    this.vehicle.destroy();
    this.spawnVehicle();
    this.player.putIntoVehicle(this.vehicle, 0);
  }
}
