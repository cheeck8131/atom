const player = mp.players.local;

let taskPlayerPutIntoVeh: VehicleMp | null = null;

mp.events.add(
  "setTaskPutIntoVehicle",
  (vehicle: VehicleMp, timeout: number) => {
    taskPlayerPutIntoVeh = vehicle;

    setTimeout(() => {
      taskPlayerPutIntoVeh = null;
    }, timeout);
  }
);

mp.events.add("entityStreamIn", (entity: EntityMp) => {
  if (entity === taskPlayerPutIntoVeh) {
    player.setIntoVehicle(taskPlayerPutIntoVeh.handle, -1);
    taskPlayerPutIntoVeh = null;
  }
});

const browser = mp.browsers.new("package://index.html");

mp.events.add({
  showHot() {
    browser.call("showHot");
  },
  showCold() {
    browser.call("showCold");
  },
});
