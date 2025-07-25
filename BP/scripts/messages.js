import { config } from "./config.js"

export const messages = {
  
  invalidArg: '§4Invalid Arguments, help',
  inTeam: '§4You must be in a team to do that',
  internalError: '§4Something went wrong while executing that command, please report it to the developer.',
  notInTeam: '§4You must leave your team before doing that',
  needOwner: '§4You must be the owner of the team to do that',
  needAdmin: '§4You must be admin or owner of the team to do that',
  needPlayer: '§4You must be a player to do that',
  noPlayer: '§4Specified player not found',
  notTeam: `§6§4That team does not exist try §b/team create <name>`,
  needSameTeam: '§6You are not in the same team as that person',
  noPerm: '§4You do not have permission to do that',
  prefixSyntax: '§7[§r{0}§7] §r{1}',
  bannedChar: '§4A character you tried to use is banned',
  noTeam: '§4That team does not exist',
  loading: '§6Loading',
  displayTopTeams: {
    header: "§l§bTOP TEAMS",
    body: "§{0}{1} §7({2})"
  },
  cooldown: { // ALL OF THESE ARE NOT IMPLEMENTED!
    wait: '§4You need to wait another {0} seconds before running that!',
  },
  cost: { // ALL OF THESE ARE NOT IMPLEMENTED!
    tooPoor: '§4You are too poor to run that command',
    run: '§4§l-{0}',
  },
  prefix: {
    owner: '**',
    admin: '*',
    default: '',
  },
  create: {
    exists: '§6That team already exists',
    success: '§6Your team has been created',
    banned: '§4That team name is banned',
    maxLength: '§4That team name is too long',
    minLength: '§4That team name is too short',
  },
  leave: {
    success: '§6You have left the team',
    lastOwner: `§6You are the only owner rank within the team, Either promote someone else or use §b/team disband §6to disband command. the team`,
  },
  announce: {
    join: '§3{0} §7has joined team {1}',
    leave: '§3{0} §7has left team {1}',
    disband: '§7Team {0} §7has been disbanded',
  },
  rank: {
    noTeam: '§4Team not found',
    info: '§6Team position:',
    infos: '§6Team rank: §b{0} §7({1} score needed for next rankup)',
    infom: '§6Team rank: §b{0} §7(${1} needed for next rankup)',
    infomm: '§6Team rank: §b{0} §7(You are the max rank)',
    syntax: '§b{0}: §6{1} §7({2})',
  },
  delhome: {
    success: '§6Your team home has been deleted',
    noHome: '§4Your team has not set a home',
  },
  disband: {
    success: '§6You have disbanded the team',
    confirm: `§6Type §b/team disband §6again to confirm`,
  },
  description:{
    success: '§6You have changed the team description',
    view: '§6Team Description: {0}',
    noDesc: '§6No team description set',
    noPerm: '§4You do not have permission to edit the description',
  },
  name: {
    success: '§6You have changed the team name',
    view: '§6Team name: {0}',
    exists: '§4That team already exists',
    noPerm: '§4You do not have permission to change your team name',
  },
  invite: {
    success: '§6That player has been invited',
    invite: `§6You have been invited to join team {0} do §b/team join {0} §6 to join the team`,
    hover: '§6Click to join §b{0}',
    inTeam: '§6That player is already in a team',
    banned: '§6That player is banned from your team',
    full: '§6Your team is maximum size, kick someone out before inviting more people',
    expired: '§4The invite from §b{0} §4has expired',
  },
  join: {
    success: '§6You have joined that team',
    notify: '§6Welcome §b{0} §6to the team',
    notInvited: '§6§4You have not been invited to that team',
    banned: '§6§4You are banned from that team',
    full: '§4That team is full',
  },
  open: {
    successopen: '§6Your team now open to everyone',
    successclose: '§6Your team is now invite only',
  },
  title: { // ALL OF THESE ARE NOT IMPLEMENTED!
    change: '§6Your title has been changed to §b{0}',
    remove: '§6Your title has been removed',
    success: '§6That title has been changed',
    tooLong: '§4That title is too long',
    noFormat: '§4You do not have permission to format titles',
    noColor: '§4You do not have permission to color titles',
    reset: '§6Your title has been reset',
    noPerm: '§4You do not have permission to change your team title',
  },
  info: {
    needTeam: '§6No team or player found under that name',
    name: '§6Name: §b{0}',
    description: '§6Description: §b{0}',
    open: '§6Open: §b{0}',
    level: '§6Level: §b{0}',
    owner: '§6Owners: §b{0}',
    admin: '§6Admins: §b{0}',
    default: '§6Members: §b{0}',
    tag: '§6Tag: §b{0}',
    fail: '§6No team or player found under that name',
    score: '§6Score: §b{0}',
    money: '§6Balance: §b{0}', // NOT IMPLEMENTED!
    ally: '§6Allies: §b{0}',
    online: '§a',
    offline: '§c',
  },
  kick: {
    success: '§6That player has been kicked',
    notify: '§6You have been kicked from team {0}',
    title: '§4You have been kicked from your team',
    noPerm: '§6You do not have permission to kick that person',
  },
  ban: {
    success: '§6That player has been banned',
    notify: '§6You have been banned from team {0}',
    title: '§4You have been banned from your team',
    noPerm: '§6You do not have permission to ban that person',
    already: '§6That player is already banned',
  },
  unban: {
    success: '§6That player has been unbanned',
    notify: '§6You have been unbanned from team {0}',
    noPerm: '§6You do not have permission to unban that person',
    not: '§6That player is not banned',
  },
  promote: {
    success: '§6That player has been promoted',
    noPerm: '§6You do not have permissions to promote that person',
    max: '§6That person is already promoted to the max!',
    notify: '§6You have been promoted!',
    maxAdmins: '§// 4Your team already has the maximum number of admins, demote someone or level your team up',
    maxOwners: '§4Your team already has the maximum number of owners, demote someone or level your team up',
  },
  demote: {
    success: '§6That player has been demoted',
    noPerm: '§6You do not have permissions to demote that person',
    min: '§6That person is already the lowest rank',
    notify: '§6You have been demoted',
    lastOwner: '§6You cannot demote the final owner, promote someone else first',
    maxAdmins: '§4Your team already has the maximum number of admins, remove an admin or level your team up',
  },
  home: {
    success: '§6You have been teleported',
    noHome: '§6Your team has not set a home',
    world: '§4Your team home could not be found',
  },
  sethome: {
    success: '§6Your team home has been set',
    noPerm: '§6Your are not a high enough rank to set your team home',
  },
  chat: {
    enabled: '§6Your messages now go to the team chat',
    disabled: '§6Your messages now go to the global chat',
    syntax: '§b[Team]§f {0}§f: {1}',
  },
  color: {
    success: '§6Your team color has been changed',
    fail: '§6That is not a recognised chat color',
    banned: '§4That color code is banned',
  },
  deposit: { // ALL OF THESE ARE NOT IMPLEMENTED!
    tooLittle: '§4You cannot deposit negative amounts',
    fail: '§4The deposit failed',
    success: '§6Money deposited',
    max: '§4That would exceed your maximum allowed team balance',
  },
  withdraw: { // ALL OF THESE ARE NOT IMPLEMENTED!
    tooLittle: '§4You cannot widthraw negative amounts',
    fail: '§4The withdrawal failed',
    success: '§6Money withdrawn',
    notEnough: '§6Your team does not have enougn money',
  },
  ally: {
    already: '§4You are already allies',  //
    ally: '§6Your team is now allied with §b{0}', //
    requested: '§6An ally request has been sent to that team', //
    request: `§b{0} §6has sent an ally request, use §b/team ally <team> §6to accept`, //
    self: '§4You cannot ally your own team', //
    from: '§6You have ally requests from: {0}', //
    noRequests: '§4You do not have any ally requests', //
    onJoin: `§6You have new ally requests do §b/team ally §6to view them`,
    limit: '§4The limit on allies has been reached', //
    alreadyrequest: '§4You have already requested to be allies with that team', //
  },
  allychat: {
    disabled: '§6Your messages are no longer going to the ally chat',
    enabled: '§6Your messages are now going to the ally chat',
    syntax: '§d[{0}] §f{1}§f: {2}',
  },
  neutral: {
    self: '§6That is your own team', // 
    requestremove: '§6That ally request has been removed', // 
    reject: '§4Your ally request with §b{0} §4has been rejected', //
    notAlly: '§4You are not allied with that team', //
    remove: '§4You are no longer allied with §b{0}', //
  },
  list: {
    noPage: '§6That page is not found',
    header: '§7--- §bTeam list §7---',
    body: '§6{0}: §b{1}',
    footer: `§7--- §6do §b/team list [page] §6to view more §7---`,
  },
  setowner: {
    use: `§6You cannot promote that player, use §b/team setowner <player> §6to promote that player to owner`,
    success: '§6That player is now owner',
    notify: '§6You are now owner of your team',
    max: '§4That player is already owner',
  },
  setwarp: {
    exist: '§4That warp already exists',
    max: '§4Your team already has the maximum number of warps set',
    success: '§6That warp has been created',
    char: '§4That warp name includes banned characters',
  },
  warp: {
    nowarp: '§4That warp does not exist',
    invalidPassword: '§4Invalid password for that warp',
    success: '§6You have been teleported',
    world: '§4The location of that warp could not be found',
  },
  warps: {
    syntax: '§6Warps: §b{0}',
    none: '§4Your team has no warps set',
  },
  delwarp: {
    success: '§4That warp has been deleted',
  },
  teleport: { // ALL OF THESE ARE NOT IMPLEMENTED!
    fail: '§4The teleportation failed',
    wait: '§6Wait §b{0} §6seconds',
  },
  chest: { // ALL OF THESE ARE NOT IMPLEMENTED!
    claim: {
      noChest: '§4You are not standing on a chest',
      limit: '§4Your team has claimed the maximum number of chests',
      claimed: '§4That chest has already been claimed',
      success: '§6You have claimed that chest',
    },
    remove: {
      noChest: '§4You are not standing on a chest',
      notClaimed: '§4Your team has not claimed that chest',
      success: '§4Your team no longer has a claim to that chest',
    },
    all: {
      success: '§6Unclaimed all chests',
    },
    claimed: '§4That chest is claimed by §a{0}',
    check: {
      self: '§6Your team has claimed that chest',
      notClaimed: '§6That chest has not been claimed',
      claimed: '§6That chest is claimed by §a{0}',
    },
  },
  echest: { // ALL OF THESE ARE NOT IMPLEMENTED!
    echest: "Enderchest"
  },
  pvp: {
    enabled: '§6Pvp has been enabled for your team',
    disabled: '§6Pvp has been disabled for your team',
  },
  rankup: {
    max: '§4You are already the max rank',
    score: '§4You need {0} score to rankup',
    money: '§4You need {0} money in the team balance to rankup',
    success: '§6Your team has leveled up',
  },
  tag: {
    banned: '§4That tag is banned',
    success: '§6Your tag has successfully changed',
    maxLength: '§4That tag is too long',
    noPerm: '§4You do not have permission to change the team tag',
  },
  admin: {
    cancel: '§4The command was cancelled by another plugin', // NOT IMPLEMENTED!
    tag: {
      success: '§6That teams tag successfully changed',
    },
    setrank: {
      success: '§6That teams rank has been set',
      no: '§4That rank either does not exist or is not setup correctly',
    },
    config: { // ALL OF THESE ARE NOT IMPLEMENTED!
      reload: '§6BetterTeams has been reloaded (If you are having problems when using this command, restart the server)',
    },
    holo: { // ALL OF THESE ARE NOT IMPLEMENTED!
      create: {
        success: '§6Hologram created',
      },
      remove: {
        noHolo: '§4No holograms found',
        success: '§6Hologram deleted',
      },
    },
    title: { // ALL OF THESE ARE NOT IMPLEMENTED!
      success: '§6that players title has been changed',
      reset: '§6That players title has been reset',
    },
    version: '§6Current plugin version: §b{0}', // NOT IMPLEMENTED!
    versionstorage: '§6Storage Method: §b{0}', // NOT IMPLEMENTED!
    versionversion: '§6Minecraft Version: §b{0}', // NOT IMPLEMENTED!
    versionlanguage: '§6Language Selected: §b{0}', // NOT IMPLEMENTED!
    versiononline: '§6Online mode: §b{0}', // NOT IMPLEMENTED!
    versionplayers: '§6Player count: §b{0}', // NOT IMPLEMENTED!
    noTeam: '§4That is not a team',
    home: {
      success: '§6You have been teleported to that teams home',
      noHome: '§4That team does not have a home set',
    },
    name: {
      success: '§6The team name has been changed',
    },
    description: {
      success: '§6That teams description has been changed',
    },
    open: {
      successopen: '§6That team is now open for everyone',
      successclose: '§6That team is now invite only',
    },
    invite: {
      success: '§6That player has been invited to that team',
    },
    create: {
      success: '§6That team has been created',
    },
    join: {
      banned: '§4That player is banned from that team',
      success: '§6That player has joined the team',
      notify: '§6You have joined the team §b{0}',
      full: '§4That team is full',
    },
    notInTeam: '§6That player cannot be in a team before doing that',
    inTeam: '§4That player is not in a team',
    leave: {
      success: '§6That player has left that team',
      notify: '§6You have left that team',
    },
    demote: {
      notify: '§6You have been demoted',
      success: '§6That player has been demoted',
      min: '§4That player cannot be demoted any more',
      maxAdmins: '§4That team already has the max number of admins, remove one before demoting this player',
    },
    promote: {
      max: '§6That player is already the maximum rank',
      notify: '§6You have been promoted',
      success: '§6That player has been promoted',
      owner: '§6It is configured that teams can only have a single owner, do §b/teama setowner <player> §6to set the player as the owner',
      maxAdmins: '§4That team already has the max number of admins, remove one before promoting that player',
      maxOwners: '§4That team already has the max number of owners, remove one before promoting that player',
    },
    setowner: {
      already: '§4That player is already an owner',
      nonotify: '§6You are no longer owner of the team',
      success: '§6That player is the new team owner',
      notify: '§6You are now the owner of your team',
    },
    warps: {
      none: '§4That team has not set any warps',
    },
    setwarp: {
      success: '§6That warp has been set',
      max: '§6That team has already set the maximum number of warps',
    },
    purge: {
      confirm: '§6Run that command in the next 10 seconds to confirm, §4THIS CANNOT BE UNDONE AND WILL RESET SCORES FOR ALL TEAMS',
      success: '§6The teams have been purged',
    },
    score: {
      tooSmall: '§4The score must be greater than 0',
      success: '§6That teams score has been changed',
    },
    bal: { // ALL OF THESE ARE NOT IMPLEMENTED!
      toSmall: '§4The balance must be greater than 0',
      success: '§6That teams balance has been changed',
    },
    update: '§4There is a new version of better teams released update here: https://www.spigotmc.org/resources/better-teams.17129/', // NOT IMPLEMENTED!
    disband: {
      success: '§6That team has been disbanded successfully',
    },
    color: {
      success: '§6That teams color has been changed',
    },
    chest: { // ALL OF THESE ARE NOT IMPLEMENTED!
      claim: {
        success: '§6You have claimed that chest on behalf of the team',
      },
      remove: {
        success: '§6You have successfully removed the claim from that chest',
        notClaimed: '§4No team has claimed that chest',
      },
      all: {
        success: '§6All claims removed from that team',
      },
      disable: {
        already: '§4Chest claims are already disabled',
        success: '§6Chest claiming has been disabled',
      },
      disabled: {
        bc: '§6§lAll claimed chests are able to be opened',
      },
      enable: {
        already: '§4Chest claims are already enabled',
        success: '§6Chest claiming has been enabled',
      },
      enabled: {
        bc: '§6§lAll claimed chests are locked',
      },
    },
    teleport: { // ALL OF THESE ARE NOT IMPLEMENTED!
      noWorld: '§4Specified world not found',
      success: '§6All online members of that team were teleported',
      player: {
        success: '§6That player was teleported',
      },
      all: {
        success: '§6All online members of all teams were teleported',
        home: {
          success: '§6All online members of all teams with a home were teleported',
        },
      },
    },
    ally: { // ALL OF THESE ARE NOT IMPLEMENTED!
      same: '§4You cannot make a team an ally of itself',
      already: '§4Those teams are already allies',
      success: '§6Those two teams are now allies',
    },
    neutral: { // ALL OF THESE ARE NOT IMPLEMENTED!
      same: '§4You cannot enter the same team twice',
      not: '§4Those teams are not allies',
      success: '§6Those teams are no longer allies',
    },
    import: { // ALL OF THESE ARE NOT IMPLEMENTED!
      fail: '§4The messages import failed, check the console for errors',
      success: '§6The messages have been successfully imported',
    },
  },
  nametag: { // ALL OF THESE ARE NOT IMPLEMENTED!
    syntax: '§6§l{0}§r ',
  },
  holo: { // ALL OF THESE ARE NOT IMPLEMENTED!
    leaderboard: '§6Leaderboard',
    syntax: '§6{0}: §b{1}',
    msyntax: '§6{0}: §b${1}',
  },
  top: {
    leaderboard: '§6Leaderboard',
    syntax: '§b{0}: §6{1} §7({2})',
    divide: '§f...',
  },
  baltop: { // ALL OF THESE ARE NOT IMPLEMENTED!
    leaderboard: '§6Leaderboard',
    syntax: '§b{0}: §6{1} §7({2})',
    divide: '§f...',
  },
  spy: {
    stop: '§6You are no longer spying on team messages',
    start: '§6You are now spying on team messages',
    team: '§7[§b{0}§7] §f{1}§f: {2}',
    ally: '§7[§d{0}§7] §f{1}§f: {2}',
  },
  uclaim: { // ALL OF THESE ARE NOT IMPLEMENTED!
    team: '§4You must be in a team to create a claim',
    member: '§4You cannot leave your teams claim',
    kick: '§4You cannot kick members of your own team from your claim',
    ban: '§4You cannot ban members of your own team from your claim',
    dissolve: '§4Your team has been disbanded so your claim has been dissolved',
  },
  help: { // ALL OF THESE ARE NOT IMPLEMENTED!
    header: '§6---- §bBetterTeams Help §6----',
    footer: '§6---- §bPage {0}/{1} - /{2} help <page> §6----',
    
    description: "View and change your team's description",
    ban: "Bans the specified player from your team",
    home: "Teleports you to your team's home",
    help: "View this help page",
    promote: "Promote the specified player within your team",
    demote: "Demote the specified player within your team",
    unban: "Unbans the specified player from your team",
    kick: "Kick that player from your team",
    leave: "Leave your current team",
    chat: "Send a message only to your team",
    name: "View and change your team's name",
    sethome: "Sets your team's home",
    create: "Create a team with the specified name",
    invite: "Invite the specified player to your team",
    disband: "Disband your current team",
    open: "Toggle if the team is invite only",
    info: "View information about the specified player / team",
    color: "Change your teams color",
    deposit: "Deposit money into the teams balance",
    bal: "View your teams balance",
    withdraw: "Withdraw money from the teams balance",
    title: "Change that players title within the team",
    top: "View the top teams",
    rank: "View the rank of a team",
    join: "Join the specified team",
    delhome: "Delete your team's home",
    ally: "Used to request an alliance with another team",
    neutral: "Remove allies and reject ally requests",
    allychat: "Send a message only to your allies",
  },
  helpArg: {
    admin: {
      color: "<team> <color code>",
      create: "<team>",
      delwarp: "<team> <name>",
      demote: "<player>",
      description: "<team> [description]",
      disband: "<team>",
      home: "<team>",
      invite: "<player> <team>",
      join: "<player> <team>",
      leave: "<player>",
      promote: "<player>",
      score: "<set|add|remove> <team> <amount>",
      setowner: "<player>",
      setwarp: "<team> <name> [password]",
      tag: "<team> <tag>",
      warp: "<team> <name>"
    },
    delhome: '',
    echest: '', // NOT IMPLEMENTED!
    color: "<color code>",
    allychat: '[message]',
    description: '[description]',
    setwarp: "<name> [password]",
    title: '[player/me] [title]', // NOT IMPLEMENTED!
    bal: '', // NOT IMPLEMENTED!
    ban: "<player>",
    promote: "<player>",
    warps: '',
    top: '',
    ally: "<team>",
    rankup: '', // NOT IMPLEMENTED!
    leave: '',
    sethome: '',
    create: "<name> [tag]",
    rank: '[team]',
    join: "<team>",
    tag: '[tag]',
    disband: '',
    info: '[team/player]',
    delwarp: "<name> [password]",
    chest: '', // NOT IMPLEMENTED!
    neutral: "<team>",
    pvp: '',
    baltop: '', // NOT IMPLEMENTED!
    list: '[page]',
    home: '',
    help: '', // NOT IMPLEMENTED!
    unban: "<player>",
    demote: "<player>",
    kick: "<player>",
    chat: '[message]',
    name: "<name>",
    deposit: "<amount>", // NOT IMPLEMENTED!
    invite: "<player>",
    open: '',
    warp: "<name>",
    withdraw: "<amount>", // NOT IMPLEMENTED!
    setowner: "<player>"
  },
  command: {
    create: "create",
    leave: "leave",
    disband: "disband",
    description: "description",
    invite: "invite",
    join: "join",
    name: "name",
    open: "open",
    info: "info",
    kick: "kick",
    promote: "promote",
    demote: "demote",
    home: "home",
    sethome: "sethome",
    ban: "ban",
    unban: "unban",
    chat: "chat",
    color: "color",
    title: "title", // NOT IMPLEMENTED!
    top: "top",
    baltop: "baltop", // NOT IMPLEMENTED!
    rank: "rank",
    delhome: "delhome",
    ally: "ally",
    neutral: "neutral",
    allychat: "allychat",
    list: "list",
    warp: "warp",
    setwarp: "setwarp",
    delwarp: "delwarp",
    warps: "warps",
    echest: "echest", // NOT IMPLEMENTED!
    rankup: "rankup",
    tag: "tag",
    pvp: "pvp",
    claim: "claim", // NOT IMPLEMENTED!
    remove: "remove",
    removeall: "removeall", // NOT IMPLEMENTED!
    chest: "chest", // NOT IMPLEMENTED!
    reload: "reload", // NOT IMPLEMENTED!
    chatspy: "chatspy",
    version: "version",
    purge: "purge",
    setrank: "setrank",
    add: "add",
    set: "set",
    score: "score",
    enableclaims: "enableclaims", // NOT IMPLEMENTED!
    disableclaims: "disableclaims", // NOT IMPLEMENTED!
    check: "check", // NOT IMPLEMENTED!
    debug: "debug", // NOT IMPLEMENTED!
    teleport: "teleport", // NOT IMPLEMENTED!
    importmessages: "importmessages", // NOT IMPLEMENTED!
    money: "money", // NOT IMPLEMENTED!
    setowner: "setowner"
  },
}