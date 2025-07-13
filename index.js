const savedPlayerCounts = [];

const elements = (() => {
  const elements = {};
  return (id) => {
    if (!elements[id]) elements[id] = document.querySelector("#" + id);
    return elements[id];
  }
})();

const diep = (() => {
  async function fetchData() {
    const url = "https://lb.diep.io/api/lb/pc";
    const response = await fetch(url);
    const content = await response.json();
    return content;
  }

  function parseRawGamemode(gamemode) {
    const parsedGamemode = {
      teams: "2TDM",
      "4teams": "4TDM",
      sandbox: "Sandbox",
      maze: "Maze",
      ffa: "FFA",
      event: "Event"
    }[gamemode];
    return parsedGamemode || `Unknown#${gamemode}`;
  }

  function createRegionHeader(region, totalPlayers) {
    const regionString = region.regionName;
    const regionCharacters = regionString.split("");
    const regionHTML = regionCharacters.map((character, index) => {
      return `<div class="bounceLetter" style="
        animation-delay: ${0.5 * (index - regionCharacters.length)}s;
      ">${character}</div>`;
    }).join("");

    const regionName = document.createElement("p");
    regionName.className = "regionName";
    regionName.innerHTML = regionHTML;

    const regionPlayers = document.createElement("p");
    regionPlayers.className = "regionPlayers";
    regionPlayers.innerText = region.numPlayers;

    const regionPercentage = document.createElement("p");
    regionPercentage.className = "regionPercentage";
    regionPercentage.innerText = (100 * region.numPlayers / totalPlayers).toFixed(1);

    return [regionName, regionPlayers, regionPercentage];
  }

  function createLobbyContainer(lobby) {
    const lobbyContainer = document.createElement("div");
    lobbyContainer.className = "lobbyContainer";
    
    const gamemodeString = parseRawGamemode(lobby.gamemode);
    const gamemodeCharacters = gamemodeString.split("");
    const gamemodeHTML = gamemodeCharacters.map((character, index) => {
      return `<div class="bounceLetter" style="
        animation-delay: ${0.5 * (index - gamemodeCharacters.length)}s;
      ">${character}</div>`;
    }).join("");

    const gamemodeText = document.createElement("p");
    gamemodeText.className = "gamemode";
    gamemodeText.innerHTML = gamemodeHTML;
    lobbyContainer.appendChild(gamemodeText);

    const playersText = document.createElement("p");
    playersText.className = "gamemodePlayers";
    playersText.innerText = lobby.numPlayers;
    lobbyContainer.appendChild(playersText);

    return lobbyContainer;
  }

  function createRegionContainer(region, totalPlayers) {
    const container = document.createElement("div");
    container.className = "regionContainer";

    createRegionHeader(region, totalPlayers).forEach((element) => {
      container.appendChild(element);
    });

    region.lobbies.sort((lobbyA, lobbyB) => {
      return lobbyB.numPlayers - lobbyA.numPlayers;
    })

    region.lobbies.forEach((lobby) => {
      const element = createLobbyContainer(lobby);
      container.appendChild(element);
    });

    return container;
  }

  function updateTotalChange() {
    const change = savedPlayerCounts[0] - savedPlayerCounts.at(-1);
    const plus = change > 0 ? "+" : "";

    const multiplier = 20 / savedPlayerCounts.length;

    elements("totalChange").hidden = false;
    elements("totalChange").innerText = plus + (change * multiplier).toFixed(1);
  }

  function displayData(content) {
    elements("heading").innerText = "diep.io";

    const container = elements("servers");

    container.innerHTML = "";

    const totalPlayerCount = content.regions.reduce((acc, region) => acc + region.numPlayers, 0);
    elements("totalPlayers").innerText = totalPlayerCount;

    savedPlayerCounts.unshift(totalPlayerCount);
    if (savedPlayerCounts.length > 200) savedPlayerCounts.pop();
    
    updateTotalChange();

    content.regions.sort((regionA, regionB) => {
      return regionB.numPlayers - regionA.numPlayers;
    });

    content.regions.forEach((region) => {
      const regionContainer = createRegionContainer(region, totalPlayerCount);
      container.appendChild(regionContainer);
    });
  }
  return () => {
    fetchData().then(displayData);
  }
})();

const arras = (() => {
  async function fetchData() {
    const url = "https://t4mebdah2ksfasgi-c.uvwx.xyz:8443/2222/status";
    const response = await fetch(url);
    const content = await response.json();
    return content;
  }

  const gameModes = [
    { key: "ac", label: "Arms Race Clanwars" },
    { key: "af", label: "Arms Race FFA" },
    { key: "am", label: "Arms Race Maze" },
    { key: "am2", label: "Arms Race Maze 2TDM" },
    { key: "am2d", label: "Arms Race Maze 2TDM Duos" },
    { key: "am2c", label: "Arms Race Maze 2TDM CTF" },
    { key: "am3", label: "Arms Race Maze 3TDM" },
    { key: "am3d", label: "Arms Race Maze 3TDM Duos" },
    { key: "am4", label: "Arms Race Maze 4TDM" },
    { key: "am4d", label: "Arms Race Maze 4TDM Duos" },
    { key: "amf", label: "Arms Race Maze FFA" },
    { key: "ams", label: "Arms Race Maze Squads" },
    { key: "a2", label: "Arms Race 2TDM" },
    { key: "a3", label: "Arms Race 3TDM" },
    { key: "a4", label: "Arms Race 4TDM" },
    { key: "ao2", label: "Arms Race Open 2TDM" },
    { key: "ao3", label: "Arms Race Open 3TDM" },
    { key: "ao4", label: "Arms Race Open 4TDM" },
    { key: "aom", label: "Arms Race Open Maze" },
    { key: "aom2", label: "Arms Race Open Maze 2TDM" },
    { key: "am2e", label: "Arms Race Maze 2TDM Elimination" },
    { key: "am3e", label: "Arms Race Maze 3TDM Elimination" },
    { key: "am4e", label: "Arms Race  Maze 4TDM Elimination" },
    { key: "aom2e", label: "Arms Race Open Maze 2TDM Elimination" },
    { key: "aom3e", label: "Arms Race Open Maze 3TDM Elimination" },
    { key: "aom4e", label: "Arms Race Open Maze 4TDM Elimination" },
    { key: "apm2", label: "Arms Race Portal Maze 2TDM" },
    { key: "apm3", label: "Arms Race Portal Maze 3TDM" },
    { key: "apm4", label: "Arms Race Portal Maze 4TDM" },
    { key: "as", label: "Arms Race Squads" },
    { key: "ag", label: "Arms Race Growth" },
    { key: "ap", label: "Arms Race Portal" },
    { key: "ad", label: "Armsrace Duos" },
    { key: "amd", label: "Armsrace Maze Duos"},
    { key: "acropolis", label: "Assault Acropolis" },
    { key: "booster", label: "Assault Booster" },
    { key: "branches", label: "Assault Branches" },
    { key: "bunker", label: "Assault Bunker" },
    { key: "line", label: "Assault Line" },
    { key: "stronghold", label: "Assault Stronghold" },
    { key: "trenches", label: "Assault Trenches" },
    { key: "w34betas4test", label: "Beta Sandbox Test" },
    { key: "blackout", label: "Blackout (Event)" },
    { key: "c", label: "Clan Wars" },
    { key: "ctf", label: "Capture the Flag" },
    { key: "d", label: "Domination" },
    { key: "e0z", label: "Sandbox Redirect" },
    { key: "f", label: "FFA" },
    { key: "forge", label: "Forge" },
    { key: "g", label: "Growth" },
    { key: "g2", label: "Growth 2TDM" },
    { key: "gad", label: "Growth Arms Race Duos" },
    { key: "gam2", label: "Growth Arms Race 2TDM Maze" },
    { key: "gam3", label: "Growth Arms Race 3TDM Maze" },
    { key: "gam4", label: "Growth Arms Race 4TDM Maze" },
    { key: "gamd", label: "Growth Arms Race Maze Duos" },
    { key: "gao2", label: "Growth Arms Race Open 2TDM" },
    { key: "gao3", label: "Growth Arms Race Open 3TDM" },
    { key: "gao4", label: "Growth Arms Race Open 4TDM" },
    { key: "gom2", label: "Growth Open Maze 2TDM" },
    { key: "gom3", label: "Growth Open Maze 3TDM" },
    { key: "gom4", label: "Growth Open Maze 4TDM" },
    { key: "ga", label: "Growth Arms Race" },
    { key: "gc", label: "Growth Clanwars" },
    { key: "gf", label: "Growth FFA" },
    { key: "gmf", label: "Growth Maze FFA" },
    { key: "gamf", label: "Growth Armsrace Maze FFA" },
    { key: "gmd", label: "Growth Maze Duos" },
    { key: "gm2", label: "Growth Maze 2TDM" },
    { key: "gm3", label: "Growth Maze 3TDM" },
    { key: "gm4", label: "Growth Maze 4TDM" },
    { key: "go2", label: "Growth Open 2TDM" },
    { key: "go3", label: "Growth Open 3TDM" },
    { key: "go4", label: "Growth Open 4TDM" },
    { key: "grf", label: "Growth Rock FFA" },
    { key: "gs", label: "Growth Squads" },
    { key: "gd", label: "Growth Duos" },
    { key: "g4", label: "Growth 4TDM" },
    { key: "gz", label: "Growth Sandbox" },
    { key: "gae5spacemf", label: "Growth Armsrace Space Maze FFA" },
    { key: "halloween", label: "Halloween (Event)" },
    { key: "labyrinth", label: "Labyrinth" },
    { key: "limbo", label: "Limbo" },
    { key: "magicm2", label: "Magic Maze 2TDM" },
    { key: "magicm3", label: "Magic Maze 3TDM" },
    { key: "magicm4", label: "Magic Maze 4TDM" },
    { key: "magicmf", label: "Magic Maze FFA" },
    { key: "magicmd", label: "Magic Maze Duos" },
    { key: "magicms", label: "Magic Maze Squads " },
    { key: "magicmc", label: "Magic Maze Clanwars " },
    { key: "manhuntg", label: "Manhunt" },
    { key: "manhuntmf", label: "Manhunt Maze FFA" },
    { key: "marchmadness", label: "March Madness (Event)" },
    { key: "m2", label: "Maze 2TDM" },
    { key: "m2c", label: "Maze 2TDM Capture The Flag" },
    { key: "m2d", label: "Maze 2TDM Domination" },
    { key: "m4", label: "Maze 4TDM" },
    { key: "m4d", label: "Maze 4TDM Domination" },
    { key: "md", label: "Maze Duos" },
    { key: "mf", label: "Maze FFA" },
    { key: "mo3", label: "Maze Open 3TDM" },
    { key: "mo3d", label: "Maze Open 3TDM Domination" },
    { key: "ms", label: "Maze Squads" },
    { key: "classicmf", label: "Classic Maze" },
    { key: "classicf", label: "Classic FFA" },
    { key: "classic2", label: "Classic 2TDM" },
    { key: "classic3", label: "Classic 3TDM" },
    { key: "classic4", label: "Classic 4TDM" },
    { key: "yins4yang", label: "Maze Yins 4 Yang" },
    { key: "test", label: "Testing" },
    { key: "nexus", label: "Nexus" },
    { key: "o2", label: "Open 2TDM" },
    { key: "o3", label: "Open 3TDM" },
    { key: "o4", label: "Open 4TDM"},
    { key: "om3", label: "Open Maze 3TDM" },
    { key: "om3t", label: "Open Maze 3TDM Tag" },
    { key: "om4", label: "Open Maze 4TDM" },
    { key: "om4t", label: "Open Maze 4TDM Tag" },
    { key: "outbreak", label: "Outbreak" },
    { key: "outbreakmf", label: "Outbreak Maze FFA" },
    { key: "outbreakms", label: "Outbreak Maze Squads" },
    { key: "overgrowthd", label: "Overgrowth Domination" },
    { key: "overgrowth", label: "Overgrowth" },
    { key: "overgrowth2", label: "Overgrowth 2TDM" },
    { key: "overgrowth3", label: "Overgrowth 3TDM" },
    { key: "overgrowth4", label: "Overgrowth 4TDM" },
    { key: "overgrowtho2", label: "Overgrowth Open 2TDM" },
    { key: "overgrowtho3", label: "Overgrowth Open 3TDM" },
    { key: "overgrowtho4", label: "Overgrowth Open 4TDM" },
    { key: "overgrowthm2", label: "Overgrowth Maze 2TDM" },
    { key: "overgrowthm3", label: "Overgrowth Maze 3TDM" },
    { key: "overgrowthm4", label: "Overgrowth Maze 4TDM" },
    { key: "overgrowthom2", label: "Overgrowth Open Maze 2TDM" },
    { key: "overgrowthom3", label: "Overgrowth Open Maze 3TDM" },
    { key: "overgrowthom4", label: "Overgrowth Open Maze 4TDM" },
    { key: "overgrowthc", label: "Overgrowth Clanwars" },
    { key: "overgrowths", label: "Overgrowth Squads" },
    { key: "overgrowthd", label: "Overgrowth Duos" },
    { key: "overgrowthf", label: "Overgrowth FFA" },
    { key: "p2", label: "Portal 2TDM" },
    { key: "p3", label: "Portal 3TDM" },
    { key: "p4", label: "Portal 4TDM" },
    { key: "pm2", label: "Portal Maze 2TDM" },
    { key: "pm3", label: "Portal Maze 3TDM" },
    { key: "pm4", label: "Portal Maze 4TDM" },
    { key: "pumpkinpatch", label: "Pumpkin Patch (Event)" },
    { key: "rf", label: "Rock FFA" },
    { key: "space2", label: "Space 2TDM" },
    { key: "space3", label: "Space 3TDM" },
    { key: "space4", label: "Space 4TDM" },
    { key: "spacemf", label: "Space Maze FFA" },
    { key: "spacem2", label: "Space Maze 2TDM" },
    { key: "spacem3", label: "Space Maze 3TDM" },
    { key: "spacem4", label: "Space Maze 4TDM" },
    { key: "spacemc", label: "Space Maze Clanwars" },
    { key: "spacems", label: "Space Maze Squads" },
    { key: "spacems", label: "Space Maze Duos " },
    { key: "spacem", label: "Space Maze" },
    { key: "spaceo2", label: "Space Open 2TDM" },
    { key: "space3", label: "Space Open 3TDM" },
    { key: "spaceo4", label: "Space Open 4TDM" },
    { key: "s", label: "Squads" },
    { key: "t", label: "Tag" },
    { key: "z", label: "Sandbox" },
    { key: "2", label: "2TDM" },
    { key: "2b", label: "2 Teams Soccer" },
    { key: "2d", label: "2TDM Domination" },
    { key: "2m", label: "Mothership 2TDM" },
    { key: "3d", label: "3TDM Domination" },
    { key: "g3", label: "Growth 3TDM" },
    { key: "4", label: "4TDM" },
    { key: "4m", label: "Mothership 4TDM" },
    { key: "4d", label: "4TDM Domination" },
    { key: "4g", label: "4TDM Grudge Ball" },
    { key: "bastion", label: "Siege Bastion" },
    { key: "blitz", label: "Siege Blitz" },
    { key: "citadel", label: "Siege Citadel" },
    { key: "fortress", label: "Siege Fortress" },
    { key: "mothership", label: "Mothership" },
    { key: "skinwalkers", label: "Skinwalkers" },
    { key: "w33olds5forge", label: "Old Forge" },
    { key: "w33olds9labyrinth", label: "Old Labyrinth" },
    { key: "w33oldscdreadnoughts", label: "Old Dreadnoughts" },
    { key: "w33oldscdreadnoughts2", label: "Old Dreadnoughts 2TDM" },
    { key: "w33oldscdreadnoughts4", label: "Old Dreadnoughts 4TDM" },
    { key: "w33oldscdreadnoughtso3", label: "Old Dreadnoughts Open 3TDM" },
    { key: "w33oldscdreadnoughtso4", label: "Old Dreadnoughts Open 4TDM" },
  ];

  let sandboxMode = false;

  const sortedModes = [...gameModes].sort((a, b) => b.key.length - a.key.length);

  function parseRawGamemode(code = "") {
    if (!code || typeof code !== "string") return "Unknown";
    const lower = code.toLowerCase();

    for (const mode of sortedModes) {
      if (lower === mode.key.toLowerCase()) return mode.label;
    }

    const tokens = lower.split(/[^a-z0-9]+/i);
    for (const token of tokens) {
      for (const mode of sortedModes) {
        if (token === mode.key.toLowerCase()) return mode.label;
      }
    }

    for (const mode of sortedModes) {
      const regex = new RegExp(
        `(?:^|[^a-z0-9])${mode.key.toLowerCase()}(?:[^a-z0-9]|$)`
      );
      if (regex.test(lower)) return mode.label;
    }

    const modifierMap = {
      g: "Growth",
      a: "Arms Race",
      p: "Portal",
      o: "Open",
      m: "Maze",
    };
    const teamMap = {
      f: "FFA",
      d: "Duos",
      s: "Squads",
      c: "Clan Wars",
      1: "1TDM",
      2: "2TDM",
      3: "3TDM",
      4: "4TDM",
    };
    const winMap = {
      d: "Domination",
      m: "Mothership",
      a: "Assault",
      s: "Siege",
      t: "Tag",
      p: "Pandemic",
      b: "Soccer",
      g: "Grudge Ball",
      e: "Elimination",
      c: "Capture the Flag",
      z: "Sandbox",
    };

    const chars = lower.replace(/[^a-z0-9]/gi, "").split("");
    const mods = [];
    let team = null;
    let win = null;

    for (const char of chars) {
      if (!team && teamMap[char]) {
        team = teamMap[char];
      } else if (!win && winMap[char]) {
        win = winMap[char];
      } else if (modifierMap[char] && !mods.includes(modifierMap[char])) {
        mods.push(modifierMap[char]);
      }
    }

    const dynamicLabel = [...mods, team, win].filter(Boolean).join(" ");

    const fallbackMatch = sortedModes.find((m) =>
      lower.includes(m.key.toLowerCase())
    );
    if (fallbackMatch) return fallbackMatch.label;

    if (!gameModes.some((g) => lower.includes(g.key.toLowerCase()))) {
      if (!unknownLogged.has(lower)) {
        console.warn("[UNRECOGNIZED MODE]", lower);
        unknownLogged.add(lower);
      }
    }

    return dynamicLabel || "Unknown";
  }

  function createRegionHeader(region, totalPlayers) {
    const regionString = region.name;
    const regionCharacters = regionString.split("");
    const regionHTML = regionCharacters.map((character, index) => {
      return `<div class="bounceLetter" style="
        animation-delay: ${0.5 * (index - regionCharacters.length)}s;
        margin-right: ${character === " " ? "5px" : "0"};
      ">${character}</div>`;
    }).join("");

    const regionName = document.createElement("p");
    regionName.className = "regionName";
    regionName.innerHTML = regionHTML;

    const regionPlayers = document.createElement("p");
    regionPlayers.className = "regionPlayers";
    regionPlayers.innerText = region.players;

    const regionPercentage = document.createElement("p");
    regionPercentage.className = "regionPercentage";
    regionPercentage.innerText = (100 * region.players / totalPlayers).toFixed(1);

    return [regionName, regionPlayers, regionPercentage];
  }

  function createLobbyContainer(lobby) {
    const lobbyContainer = document.createElement("div");
    lobbyContainer.className = "lobbyContainer";
    
    let gamemodeString = parseRawGamemode(lobby.code.split("-")[2]);
    if (sandboxMode) {
      gamemodeString += ` (#${lobby.name})`;
    }
    const gamemodeCharacters = gamemodeString.split("");
    const gamemodeHTML = gamemodeCharacters.map((character, index) => {
      return `<div class="bounceLetter" style="
        animation-delay: ${0.5 * (index - gamemodeCharacters.length)}s;
        margin-right: ${character === " " ? "5px" : "0"};
      ">${character}</div>`;
    }).join("");

    const gamemodeText = document.createElement("p");
    gamemodeText.className = "gamemode";
    gamemodeText.innerHTML = gamemodeHTML;
    lobbyContainer.appendChild(gamemodeText);

    const playersText = document.createElement("p");
    playersText.className = "gamemodePlayers";
    playersText.innerText = lobby.clients;
    lobbyContainer.appendChild(playersText);

    return lobbyContainer;
  }

  function createRegionContainer(region, totalPlayers) {
    const container = document.createElement("div");
    container.className = "regionContainer";

    createRegionHeader(region, totalPlayers).forEach((element) => {
      container.appendChild(element);
    });

    region.servers.sort((lobbyA, lobbyB) => {
      return lobbyB.clients - lobbyA.clients;
    })

    region.servers.forEach((lobby) => {
      const element = createLobbyContainer(lobby);
      container.appendChild(element);
    });

    return container;
  }

  function updateTotalChange() {
    elements("totalChange").hidden = true;
  }

  function displayData(content) {
    elements("heading").innerText = "arras.io";

    const container = elements("servers");

    container.innerHTML = "";

    const totalPlayerCount = Object.values(content.status).reduce((acc, server) => acc + (server.clients || 0), 0);
    elements("totalPlayers").innerText = totalPlayerCount;
    
    updateTotalChange();
    
    const regions = [
      { id: "w", name: "US West", players: 0, servers: [] },
      { id: "c", name: "US Central", players: 0, servers: [] },
      { id: "e", name: "Europe", players: 0, servers: [] },
      { id: "o", name: "Australia", players: 0, servers: [] },
      { id: "a", name: "Asia", players: 0, servers: [] }
    ];

    Object.values(content.status).forEach((server) => {
      const region = regions.find((region) => region.id === server.name[0]);
      region.players += server.clients || 0;
      if (
        (!sandboxMode && (server.name.length > 2 || !server.online || server.clients < 1)) ||
        (sandboxMode && (server.name.length < 3 || !server.online || server.clients < 1))
      ) {
        return;
      }
      region.servers.push(server);
    });

    regions.sort((regionA, regionB) => {
      return regionB.players - regionA.players;
    });

    regions.forEach((region) => {
      const regionContainer = createRegionContainer(region, totalPlayerCount);
      container.appendChild(regionContainer);
    });
  }
  return (sandbox) => {
    sandboxMode = sandbox;
    fetchData().then(displayData);
  }
})();

const woomy = (() => {
  async function fetchData() {
    const url = "https://woomy.online/api/list";
    const response = await fetch(url);
    const content = await response.json();
    return content;
  }

  function createServerContainer(lobby) {
    const lobbyContainer = document.createElement("div");
    lobbyContainer.className = "lobbyContainer inlineGrid";
    
    const gamemodeString = '"' + lobby.gamemodeCode.split(".")[0] + '"';
    const gamemodeCharacters = gamemodeString.split("");
    const gamemodeHTML = gamemodeCharacters.map((character, index) => {
      return `<div class="bounceLetter" style="
        animation-delay: ${0.5 * (index - gamemodeCharacters.length)}s;
      ">${character}</div>`;
    }).join("");

    const gamemodeText = document.createElement("p");
    gamemodeText.className = "gamemode";
    gamemodeText.innerHTML = gamemodeHTML;
    lobbyContainer.appendChild(gamemodeText);

    const playersText = document.createElement("p");
    playersText.className = "gamemodePlayers";
    playersText.innerText = lobby.players;
    lobbyContainer.appendChild(playersText);

    return lobbyContainer;
  }

  function updateTotalChange() {
    elements("totalChange").hidden = true;
  }

  function displayData(content) {
    elements("heading").innerText = "woomy.online";

    const container = elements("servers");

    container.innerHTML = "";

    const totalPlayerCount = content.reduce((acc, server) => acc + server.players, 0);
    elements("totalPlayers").innerText = totalPlayerCount;
    
    updateTotalChange();

    content.forEach((region) => {
      const serverContainer = createServerContainer(region, totalPlayerCount);
      container.appendChild(serverContainer);
    });
  }
  return () => {
    fetchData().then(displayData);
  }
})();

const agar = (() => {
  async function fetchData() {
    const url = "https://webbouncer-live-v8-0.agario.miniclippt.com/info";
    const response = await fetch(url);
    const content = await response.json();
    return content;
  }

  function createRegionHeader(name, region, totalPlayers) {
    const regionString = name;
    const regionCharacters = regionString.split("");
    const regionHTML = regionCharacters.map((character, index) => {
      return `<div class="bounceLetter" style="
        animation-delay: ${0.5 * (index - regionCharacters.length)}s;
      ">${character}</div>`;
    }).join("");

    const regionName = document.createElement("p");
    regionName.className = "regionName";
    regionName.innerHTML = regionHTML;

    const regionPlayers = document.createElement("p");
    regionPlayers.className = "regionPlayers";
    regionPlayers.innerText = region.numPlayers;

    const regionPercentage = document.createElement("p");
    regionPercentage.className = "regionPercentage";
    regionPercentage.innerText = (100 * region.numPlayers / totalPlayers).toFixed(1);

    return [regionName, regionPlayers, regionPercentage];
  }

  function createRegionContainer(name, region, totalPlayers) {
    const container = document.createElement("div");
    container.className = "regionContainer";

    container.style.float = "none";
    container.style.width = "100%";

    createRegionHeader(name, region, totalPlayers).forEach((element) => {
      container.appendChild(element);
    });

    return container;
  }

  function updateTotalChange() {
    elements("totalChange").hidden = true;
  }

  function displayData(content) {
    elements("heading").innerText = "agar.io";

    const container = elements("servers");

    container.innerHTML = "";

    const totalPlayerCount = content.totals.numPlayers;
    elements("totalPlayers").innerText = totalPlayerCount;
    
    updateTotalChange();

    Object.entries(content.regions).forEach(([name, region]) => {
      const serverContainer = createRegionContainer(name, region, totalPlayerCount);
      container.appendChild(serverContainer);
    });
  }
  return () => {
    fetchData().then(displayData);
  }
})();

let currentlySelected = "agar";
function refreshServers() {
  if (currentlySelected === "diep") {
    diep();
  }
  if (currentlySelected === "arras" || currentlySelected === "arras-sandbox") {
    arras(currentlySelected === "arras-sandbox");
  }
  if (currentlySelected === "woomy") {
    woomy();
  }
  if (currentlySelected === "agar") {
    agar();
  }
}

document.querySelectorAll(".navButton").forEach((button) => {
  button.addEventListener("click", () => {
    currentlySelected = button.dataset.section;
    refreshServers();
  });
})

setInterval(refreshServers, 3000);
