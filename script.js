// script.js
let nodeCounter = 1;
const graphPanel = document.getElementById("graphPanel");
const nodeList = document.getElementById("nodeList");
const connectionCard = document.getElementById("connectionCard");
const logs = document.getElementById("logs");
const svg = document.getElementById("connectionLines");

let nodes = [];
let connections = [];
let selectedNode = null;

document.getElementById("findPathButton").addEventListener('click', () => {
  findPath();
});
document.getElementById("addNode").addEventListener('click', () => {
  addRouter();
});
document.getElementById("resetButton").addEventListener('click', () => {
  resetAll();
});


function addRouter() {
  const node = document.createElement("div");
  node.classList.add("node");
  node.textContent = nodeCounter;
  node.dataset.id = nodeCounter;

  // Position nodes spaced horizontally
  const spacing = 80;
  const left = 100 + (nodeCounter - 1) * spacing;
  const top = 100 + Math.random() * 200;
  node.style.left = `${left}px`;
  node.style.top = `${top}px`;

  node.onclick = (e) => handleNodeClick(e, node);

  graphPanel.appendChild(node);

  const li = document.createElement("li");
  li.textContent = `Router ${nodeCounter}`;
  nodeList.appendChild(li);

  nodes.push(node);
  logs.innerHTML += `<div>🟢 Router ${nodeCounter} added</div>`;
  logs.scrollTop = logs.scrollHeight;

  nodeCounter++;
}

function handleNodeClick(e, node) {
  e.stopPropagation();
  selectedNode = node;
  const rect = node.getBoundingClientRect();
  const panelRect = graphPanel.getBoundingClientRect();

  connectionCard.style.left = `${rect.right - panelRect.left + 10}px`;
  connectionCard.style.top = `${rect.top - panelRect.top}px`;
  connectionCard.classList.remove("hidden");

  document.getElementById("targetNodeInput").value = "";
  document.getElementById("weightInput").value = "";
}

document.getElementById("targetNodeInput").addEventListener("input", tryHideCard);
document.getElementById("weightInput").addEventListener("input", tryHideCard);

document.addEventListener("click", (e) => {
  if (!connectionCard.contains(e.target)) {
    connectionCard.classList.add("hidden");
  }
});

function tryHideCard() {
  const target = document.getElementById("targetNodeInput").value.trim();
  const weight = document.getElementById("weightInput").value.trim();
  if (target && weight) {
    addConnection(selectedNode.dataset.id, target, weight);
    connectionCard.classList.add("hidden");
  }
}

function addConnection(fromId, toId, weight) {
  const fromNode = nodes.find(n => n.dataset.id === fromId);
  const toNode = nodes.find(n => n.dataset.id === toId);

  if (!fromNode || !toNode) return;

  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

  const fromRect = fromNode.getBoundingClientRect();
  const toRect = toNode.getBoundingClientRect();
  const panelRect = graphPanel.getBoundingClientRect();

  const x1 = fromRect.left + fromRect.width / 2 - panelRect.left;
  const y1 = fromRect.top + fromRect.height / 2 - panelRect.top;
  const x2 = toRect.left + toRect.width / 2 - panelRect.left;
  const y2 = toRect.top + toRect.height / 2 - panelRect.top;

  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", "#555");
  line.setAttribute("stroke-width", "2");

  text.setAttribute("x", (x1 + x2) / 2);
  text.setAttribute("y", (y1 + y2) / 2 - 5);
  text.setAttribute("fill", "black");
  text.setAttribute("font-size", "12");
  text.setAttribute("text-anchor", "middle");
  text.textContent = weight;

  svg.appendChild(line);
  svg.appendChild(text);

  connections.push({ from: fromId, to: toId, weight });
  logs.innerHTML += `<div>Connected Node ${fromId} to Node ${toId} with weight ${weight}</div>`;
  logs.scrollTop = logs.scrollHeight;

}

function toggleLogs() {
  logs.classList.toggle("hidden");
}

function resetAll() {
  graphPanel.querySelectorAll(".node").forEach(n => n.remove());
  nodeList.innerHTML = "";
  svg.innerHTML = "";
  logs.innerHTML = "";
  nodes = [];
  connections = [];
  nodeCounter = 1;
}

function findPath() {
  const source = document.getElementById("sourceInput").value.trim();
  const destination = document.getElementById("destinationInput").value.trim();
  const alertIcon = document.getElementById("invalidAlert");
  const nodeIds = nodes.map(n => n.dataset.id);
  if (!nodeIds.includes(source) || !nodeIds.includes(destination)) {
    alertIcon.style.display = "inline";
    setTimeout(() => {
        alertIcon.style.display = "none";
      }, 2000);
    return;
  } else {
    alertIcon.style.display = "none";
  }
  if (!source || !destination) return;

  const graph = {};
  for (let conn of connections) {
    if (!graph[conn.from]) graph[conn.from] = [];
    if (!graph[conn.to]) graph[conn.to] = [];

    graph[conn.from].push({ node: conn.to, weight: parseInt(conn.weight) });
    graph[conn.to].push({ node: conn.from, weight: parseInt(conn.weight) });
  }

  const result = dijkstra(graph, source, destination);

  if (!result) {
    logs.innerHTML += `<div class="path-highlight">No path found from ${source} to ${destination}</div>`;
    logs.scrollTop = logs.scrollHeight;
    logs.classList.remove("hidden");

    return;
  }

  highlightPath(result.path);
  logs.innerHTML += `<div class="path-highlight">Path: ${result.path.join(" → ")} (Distance: ${result.distance})</div>`;
  logs.scrollTop = logs.scrollHeight;
  logs.classList.remove("hidden");
}

function dijkstra(graph, start, end) {
  const distances = {};
  const visited = {};
  const previous = {};
  const queue = [];

  for (let node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  distances[start] = 0;
  queue.push({ node: start, dist: 0 });

  while (queue.length) {
    queue.sort((a, b) => a.dist - b.dist);
    const current = queue.shift();
    const currentNode = current.node;

    if (visited[currentNode]) continue;
    visited[currentNode] = true;

    if (!graph[currentNode]) continue;

    for (let neighbor of graph[currentNode]) {
      const alt = distances[currentNode] + neighbor.weight;
      if (alt < distances[neighbor.node]) {
        distances[neighbor.node] = alt;
        previous[neighbor.node] = currentNode;
        queue.push({ node: neighbor.node, dist: alt });
      }
    }
  }

  const path = [];
  let currentNode = end;
  while (previous[currentNode]) {
    path.unshift(currentNode);
    currentNode = previous[currentNode];
  }
  if (distances[end] === Infinity) return null;
  path.unshift(start);
  return { path, distance: distances[end] };
}

function highlightPath(path) {
  svg.querySelectorAll("line").forEach(l => l.setAttribute("stroke", "#555"));
  for (let i = 0; i < path.length - 1; i++) {
    const from = path[i];
    const to = path[i + 1];
    const lines = Array.from(svg.querySelectorAll("line"));
    for (let line of lines) {
      const x1 = parseFloat(line.getAttribute("x1"));
      const y1 = parseFloat(line.getAttribute("y1"));
      const x2 = parseFloat(line.getAttribute("x2"));
      const y2 = parseFloat(line.getAttribute("y2"));

      const fromNode = nodes.find(n => n.dataset.id === from);
      const toNode = nodes.find(n => n.dataset.id === to);

      if (!fromNode || !toNode) continue;

      const fr = fromNode.getBoundingClientRect();
      const tr = toNode.getBoundingClientRect();
      const pr = graphPanel.getBoundingClientRect();

      const fx = fr.left + fr.width / 2 - pr.left;
      const fy = fr.top + fr.height / 2 - pr.top;
      const tx = tr.left + tr.width / 2 - pr.left;
      const ty = tr.top + tr.height / 2 - pr.top;

      const isMatch = (x1 === fx && y1 === fy && x2 === tx && y2 === ty) ||
                      (x1 === tx && y1 === ty && x2 === fx && y2 === fy);

      if (isMatch) {
        line.setAttribute("stroke", "red");
      }
    }
  }
}
