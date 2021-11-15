import { newVector } from "server";

mp.events.add("playerReady", (player: PlayerMp) => {
  player.spawn(
    newVector({
      x: 1115.7628173828125,
      y: 166.2401580810547,
      z: 81.91388702392578,
    })
  );
});
