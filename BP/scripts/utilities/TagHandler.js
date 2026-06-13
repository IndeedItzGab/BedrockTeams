import { world, system } from "@minecraft/server"

export class TagHandler {
  static add(playerId, team) {
    system.run(() => {
      const player = world.getPlayers().find(player => player.id === playerId)
      if(!player) return;

      // remove old rank tag first to avoid stacking
      const oldTag = player.getTags().find(tag => tag.startsWith("bedrockteams_prefix:"));
      if(oldTag) player.removeTag(oldTag);
      
      player.addTag(`bedrockteams_prefix:${team}`);
      this.update(playerId);
    })
  }

  static remove(playerId) {
    system.run(() => {
      const player = world.getPlayers().find(player => player.id === playerId)
      if(!player) return;

      const teamTag = player.getTags().find(tag => tag.includes("bedrockteams_prefix:"));
      if(teamTag) {
        player.removeTag(teamTag)
      }

      this.update(playerId);
    })
  }

  static update(playerId) {
    const player = world.getPlayers().find(player => player.id === playerId)
    if(!player) return;

    const rankTag = player.getTags().find(tag => tag.includes("essentialcc_prefix:"))?.split(":")[1];
    const teamTag = player.getTags().find(tag => tag.includes("bedrockteams_prefix:"))?.split(":")[1];

    // Fix for EssentialCC (SHALL BE REMOVED HERE IN THE FUTURE UPDATES)
    if(rankTag) {
      player.chatNamePrefix = `§l${rankTag} §r`;
    } else {
      player.chatNamePrefix = undefined;
    }

  
    if(rankTag && teamTag) {
      player.nameTag = `§l§i[ ${rankTag} §i]\n${teamTag} ${player.name}`
    } else if(rankTag) {
      player.nameTag = `§l§i[ ${rankTag} §i]\n${player.name}`
    } else if(teamTag) {
      player.nameTag = `${teamTag} ${player.name}`
    } else {
      player.nameTag = player.name
    }
  }
}