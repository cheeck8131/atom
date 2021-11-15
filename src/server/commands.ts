import { Race, RaceAction, RaceType } from "./race";

mp.events.addCommand({

  pos(player) {
    console.log(player.position, player.heading);
  },

  race(player, _, action, type) {
    switch (<RaceAction>action) {
      case "start": {
        if (player.race) {
          player.outputChatBox("Вы уже находитесь на гонке");
          return;
        } else {
          const race = new Race(player);
          race.start();
        }
        break;
      }

      case "stop": {
        if (player.race) {
          player.race.stop();
        } else {
          player.outputChatBox("Вы не находитесь на гонке");
        }
        break;
      }

      case "restart": {
        if (player.race) {
          player.race.restart();
        } else {
          player.outputChatBox("Вы не находитесь на гонке");
        }
        break;
      }

      case "top": {
        if (<RaceType>type === "cold") {
        } else {
        }
        break;
      }

      case "clear": {
        if (<RaceType>type === "cold") {
        } else {
        }
        break;
      }

      default: {
        break;
      }
    }

  },
});
