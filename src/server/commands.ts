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
          const cold = Race.sortTop(Race.topCold);
          // player.call("showCold", [JSON.stringify(cold)]);
          player.outputChatBox("Топ кругов (холодный круг)");
          for (const top of cold) {
            player.outputChatBox(
              `#${cold.indexOf(top) + 1} ${top.scName} ${Race.timeFormat(
                top.loopTime
              )}`
            );
          }
        } else {
          const hot = Race.sortTop(Race.topHot);
          // player.call("showHot", [JSON.stringify(hot)]);
          player.outputChatBox("Топ кругов (горячий круг)");
          for (const top of hot) {
            player.outputChatBox(
              `#${hot.indexOf(top) + 1} ${top.scName} ${Race.timeFormat(
                top.loopTime
              )}`
            );
          }
        }
        break;
      }

      case "clear": {
        Race.clear(<RaceType>type);
        player.outputChatBox("Вы очистили топ");
        break;
      }

      default: {
        break;
      }
    }
  },
});
