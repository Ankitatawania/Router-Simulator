# 🛰️ Router Network Simulator

A visual and interactive network routing simulator built using HTML, CSS, and JavaScript. The tool allows users to simulate routers (nodes), create weighted connections, and visualize the shortest path between two routers.

---

## 🚀 Features

- 🔗 Add/remove routers (nodes) to build a custom network
- ⚖️ Define weighted connections between routers
- 📍 Visualize the shortest path between routers using a pathfinding algorithm
- 🧠 Toggleable logs panel to track actions
- 🎨 Smooth UI with FontAwesome icons and transitions.

---

## 🧠 Graph-Based Logic

This simulator models the network as a **graph**:

- Each **router is a node**
- Each **connection is an edge** with an associated weight
- The shortest path is calculated using **Dijkstra’s algorithm**
- The visualized path helps understand routing behavior in a weighted network

---

## 🛠️ Tech Stack

- **HTML/CSS** – Structure & styling
- **JavaScript** – Functionality and interactivity
- **FontAwesome** – Icons for better visuals

---

## 🧩 How It Works

1. Click **Add Router** to create nodes on the interface.
2. Click on any router to:
   - Add or remove a connection (with weight).
3. Use the **Find Path** button to calculate and show the shortest path in red.
4. View recent actions in the **log panel**, which slides in/out.
5. Hover over the ℹ️ icon for a brief about the project and how it works.
