import { newVector, setTaskPutIntoVehicle } from "server";
import checkpoints from "./configs/checkpoints.json";
import fspromises from "fs/promises";

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

mp.events.add("playerEnterCheckpoint", () => []); // фикс бага с чекпоинтами
mp.events.add("playerExitCheckpoint", () => void 0);

export class Race {
  private declare vehicle: VehicleMp;
  private enterPosition: Vector3Mp;
  private player: PlayerMp;
  private dimension: number;
  private coldLap = true;
  private currentCheckpoint = 0;
  private declare lapTime: Date;
  private declare checkpoint: CheckpointMp;
  private declare checkpointCallback: (
    player: PlayerMp,
    checkpoint: CheckpointMp
  ) => void;

  public static topHot: ITop[];
  public static topCold: ITop[];
  private static topHotFile = "./topHot.json";
  private static topColdFile = "./topCold.json";
  private static vehicleStart = {
    position: {
      x: 1095.570068359375,
      y: 158.19786071777344,
      z: 81.42395782470703,
    },
    heading: 58 + 90,
  };

  private static async save() {
    const fs = eval('require("fs/promises")') as typeof fspromises;

    await fs.writeFile(this.topHotFile, JSON.stringify(this.topHot));
    await fs.writeFile(this.topColdFile, JSON.stringify(this.topCold));
  }

  public static async clear(type: RaceType) {
    if (type === "cold") {
      this.topCold = [];
    } else {
      this.topHot = [];
    }

    await this.save();
  }

  static {
    const fs = eval('require("fs/promises")') as typeof fspromises;

    (async () => {
      this.topHot = JSON.parse(
        (await fs.readFile(this.topHotFile)).toString("utf-8")
      );
      this.topCold = JSON.parse(
        (await fs.readFile(this.topColdFile)).toString("utf-8")
      );

      if (!Array.isArray(this.topHot)) {
        this.topHot = [];
        fs.writeFile(this.topHotFile, "[]");
      }

      if (!Array.isArray(this.topCold)) {
        this.topCold = [];
        fs.writeFile(this.topColdFile, "[]");
      }
    })();
  }

  static {
    mp.events.add("playerQuit", (player: PlayerMp) => {
      player.race?.destructor();
    });
  }

  constructor(player: PlayerMp) {
    this.player = player;
    this.enterPosition = player.position;
    this.dimension = player.id + 1000;
    this.player.race = this;
    this.player.dimension = this.dimension;
  }

  public destructor() {
    this.vehicle?.destroy();
    this.checkpoint?.destroy();
    this.checkpointCallback ??
      mp.events.remove("playerEnterCheckpoint", this.checkpointCallback);
  }

  public static timeFormat(time: Date) {
    time = new Date(time);

    let minutes = String(time.getMinutes());
    let seconds = String(time.getSeconds());
    let milleseconds = String(time.getMilliseconds());

    if (minutes.length === 1) {
      minutes = "0" + minutes;
    }

    if (seconds.length === 1) {
      seconds = "0" + seconds;
    }

    return `${minutes}:${seconds}.${milleseconds}`;
  }

  private spawnVehicle(vehicleName = "schafter3") {
    this.vehicle?.destroy();
    this.vehicle = mp.vehicles.new(
      vehicleName,
      newVector(Race.vehicleStart.position),
      {
        dimension: this.dimension,
        heading: Race.vehicleStart.heading,
      }
    );
    return this.vehicle;
  }

  public start() {
    this.player.outputChatBox("Вы начали гонку");
    this.nextCheckpoint();
    this.lapTime = new Date();
    setTaskPutIntoVehicle(this.player, this.spawnVehicle());
  }

  public stop() {
    this.player.outputChatBox("Вы закончили гонку");
    this.player.race = null;
    this.player.position = this.enterPosition;
    this.player.dimension = 0;
    this.destructor();
  }

  public restart() {
    this.lapTime = new Date();
    this.coldLap = true;
    setTaskPutIntoVehicle(this.player, this.spawnVehicle());
  }

  public static sortTop(top: ITop[]) {
    return [...top].sort((a, b) => <any>new Date(a.loopTime) - <any>new Date(b.loopTime));
  }

  private async endLap() {
    const time = new Date(<any>new Date() - <any>this.lapTime);
    this.player.outputChatBox(`Круг занял ${Race.timeFormat(time)}`);

    const lapData: ITop = {
      loopTime: time,
      scName: this.player.socialClub,
    };

    if (this.coldLap) {
      this.coldLap = false;
      Race.topCold.push(lapData);
    } else {
      Race.topHot.push(lapData);
    }

    this.lapTime = new Date();

    Race.topCold = Race.sortTop(Race.topCold).slice(0, 10);
    Race.topHot = Race.sortTop(Race.topHot).slice(0, 10);
    await Race.save();
  }

  private nextCheckpoint() {
    // Уничтожение старых сущностей
    this.checkpoint?.destroy();
    this.checkpointCallback ??
      mp.events.remove("playerEnterCheckpoint", this.checkpointCallback);

    const pos = newVector(checkpoints[this.currentCheckpoint]); // Позиция нового чекпоинта
    const isFinish = this.currentCheckpoint === checkpoints.length - 1;

    this.checkpoint = mp.checkpoints.new(
      isFinish ? 0 : 1,
      pos.add(new mp.Vector3(0, 0, -1)),
      5,
      {
        visible: true,
        dimension: this.dimension,
        color: isFinish ? [255, 0, 0, 255] : [255, 255, 255, 255],
        direction: isFinish
          ? newVector(checkpoints[0])
          : newVector(checkpoints[this.currentCheckpoint + 1]),
      }
    );

    this.checkpoint.showFor(this.player);

    this.checkpointCallback = (player, cp) => {
      if (cp === this.checkpoint && this.player === player) {
        if (this.currentCheckpoint === checkpoints.length - 1) {
          this.currentCheckpoint = 0;
          this.endLap();
        }

        this.currentCheckpoint += 1;
        this.nextCheckpoint();
      }
    };

    mp.events.add("playerEnterCheckpoint", this.checkpointCallback);
  }
}
