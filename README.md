# Wuvee Spatial Intelligence SDK

> AI-native spatial intelligence operating agent for smart campus operations

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.10+-blue.svg)](https://python.org)
[![Status](https://img.shields.io/badge/status-active-green.svg)]()

## 🌟 Overview

Wuvee Spatial Intelligence SDK provides the core framework for building AI Agent-driven smart campus operations. Instead of layering AI on top of legacy systems, we redesign campus operations from the Agent's perspective — making the building a self-regulating organism.

**Key Innovation**: Space Event Bus — a unified protocol for cross-system dialogue, enabling HVAC, lighting, security, and access control systems to coordinate autonomously.

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│              Cloud Layer                  │
│   LLM Agent · Analytics · Digital Twin   │
└──────────────────┬──────────────────────┘
                   │ gRPC / WebSocket
┌──────────────────┴──────────────────────┐
│              Edge Layer                   │
│   Rule Engine · Event Bus · Local Control │
└──────────────────┬──────────────────────┘
                   │ MQTT / Modbus / BACnet
┌──────────────────┴──────────────────────┐
│              Device Layer                 │
│   Sensors · Cameras · Gateways · PLCs     │
└─────────────────────────────────────────┘
```

## 🚀 Quick Start

```bash
pip install wuvee-spatial-sdk
```

```python
from wuvee import SpaceAgent, EventBus, PerceptionLayer

# Initialize the space agent
agent = SpaceAgent(config="config.yaml")

# Register perception sources
perception = PerceptionLayer()
perception.add_camera("entrance", rtsp_url="rtsp://...")
perception.add_sensor("zone_3f_south", sensors=["temperature", "humidity", "co2"])

# Connect to the event bus
bus = EventBus(redis_url="redis://localhost:6379")
agent.connect(bus)

# Define a rule
@agent.on("zone_occupancy_changed")
def on_occupancy_change(event):
    if event.occupancy == 0 and event.duration_minutes > 15:
        agent.execute([
            agent.hvac.set_mode(event.zone, "eco", target_temp=26),
            agent.lighting.set_level(event.zone, 0),
            agent.security.increase_patrol(event.zone, freq="2x")
        ])

# Start the agent
agent.run()
```

## 📦 Core Modules

| Module | Description |
|:--|:--|
| `wuvee.agent` | Space Agent core with rule engine + LLM hybrid reasoning |
| `wuvee.bus` | Space Event Bus with CloudEvents compliance |
| `wuvee.perception` | Unified perception layer for cameras, sensors, devices |
| `wuvee.semantics` | Spatial semantic model (Building → Floor → Zone → Room → Desk) |
| `wuvee.conflict` | Conflict resolution engine (Safety > Compliance > Energy > Comfort) |
| `wuvee.digital_twin` | Real-time digital twin with state synchronization |

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

## 🏢 About

Built by **Wuvee Group** — make cities valuable through spatial intelligence since 2002.

🌐 [www.wuvee.com](https://www.wuvee.com) | 📧 Bs@wuvee.com

## Project Introduction
BemIot Core is an out-of-the-box, lightweight digital infrastructure IoT platform that can be further developed. It provides a complete solution for IoT access, management, analysis, and application. The platform is developed based on the Java language and supports cross-platform independent deployment or distributed deployment, enabling the rapid establishment of a complete IoT business system that includes device management, rule linkage, alarm notification, video surveillance, edge computing, and other functions.

## Copyright Notice
BemIot Core adheres to the GPL-3.0 open-source license, making all its source code available for technical exchange and learning. According to this license, any code modified or derived from BemIot Core must not be distributed or sold as closed-source commercial software. If you intend to use BemIot Core locally for any commercial purpose, please obtain authorization by joining the [Cooperation Alliance](#) for free through the platform's official website, or contact the project leader for commercial authorization, to ensure your use complies with the GPL license.

## Core Features
- **Quick Deployment**: Developed based on Spring Boot 3.2.3, it provides out-of-the-box functionality for quickly setting up an IoT system.
- **Open Source**: All source codes are open and can be freely extended as needed. The software is designed with a separation of front-end and back-end, and all interfaces are fully open.
- **Flexible Access**: Supports multiple protocols such as TCP, UDP, HTTP, Websocket, MQTT, CoAP, OPC UA, Modbus, SNMP, ICE104, JT808, GB212, and more.
- **Plugin-Driven**: Adopting a hot-swappable plug-in model, it supports plug-in development, allows for rapid expansion of various protocol drivers, and supports cross-language development in languages such as C/C++, Python, Go, C#, PHP, Ruby, and Lua.
- **Rules Engine**: Utilizing a visual rule engine, rapid implementation of interconnected control over various business rules can be achieved through simple drag-and-drop operations.
- **Access Control**: Flexible non-intrusive data permission control. It can achieve data permission control at three dimensions: menu, button, and data. It can control the operation permission of single data.
- **Efficient Storage**: Integrating TDengine time-series database, it supports second-level processing of millions of data points, enhancing the efficiency of massive data storage and querying.

## Tech Stack
### Server
- **Technology Selection**: Spring boot、MyBatis、Jwt、PostgreSQL、Redis、TDengine、EMQX、Netty
- **Development Tools**: IntelliJ IDEA
### Web
- **Technology Selection**: ES6、Vue、Vuex、Vue-router、Vue-cli、Axios、Naive UI、Echart
- **Development Tools**: Visual Studio Code

Please obtain the front-end source code from this link: https://github.com/bemcn/BemIot-Web

## System Requirements
### Minimum Requirements
- **Operating System** - Linux、macOS、Windows
- **Memory** - 4GB(8GB+ recommended)
- **Disk** - 20GB(50GB+ recommended)
- **Network** - Stable network connection
- **Java Version** - JDK 17 or later

### Demo
It has not been launched yet and is in the near-term plan.
### Quick Start
The document is currently being produced.
### Platform Architecture
The document is currently being produced.
### Core Dependency
| Module         | Version  | Purpose             |
|----------------|----------|---------------------|
| **PostgreSQL** | 14.x+    | Relational database, storing business data        |
| **Redis**      | 6.0+     | Cache and message queue             |
| **TDengine**   | 3.0+     | Time-series database, used for efficiently storing device time-series data  |
| **EMQX**       | 5.8.2+   | Message middleware (other middleware or cloud services can be used) |
| **Zlmediakit** | -        | Streaming media service framework, monitoring video push and pull streams     |
| **Nginx**      | ≥ 1.27.2 | HTTP server              |

## Common application scenarios
### Industrial production monitoring
- Real-time monitoring of factory equipment and collection of production data.
- Equipment operation and maintenance alerts, fault warnings, and handling.
- Production efficiency analysis and optimization.

### Smart Building
- Integrated control of building equipment (HVAC, lighting, security).
- Energy consumption management and optimization.
- Environmental monitoring (temperature and humidity, air quality, etc.).

### Environmental Monitoring
- Real-time environmental data collection and monitoring.
- Pollutant early warning and alert.
- Environmental protection data reporting and compliance verification.

### Smart Agriculture
- Sensor deployment and data collection in farmland.
- Environmental monitoring (temperature and humidity, illumination, soil moisture content).
- Automated irrigation and fertilization control.

### New Energy Management
- Monitoring of photovoltaic, wind power, and energy storage equipment.
- Real-time statistics and analysis of power generation.
- Battery Management System (BMS) integration.

### Connected Vehicle Platform
- Vehicle equipment access and management.
- Vehicle location tracking and route planning.
- Fault early warning and maintenance reminder.


### Contribute Code
We welcome contributions in all forms! Whether it's code, documentation, bug reports, or feature suggestions, all can help us improve the project.
For details, please visit the document link below.
- [Contributor Guide>>](./Contributions.md)
- [Git Commit Quidelines>>](./GitSubmit.md)
- [Functional Planning>>](./RoadMap.md)

## 📋 Frequently Asked Questions (FAQ)

### Q: Is the open-source version of BemIot Core free to use?
**A:** BemIot Core follows the GPL-3.0 open source license, making it completely free for personal learning and use. If you require commercial licensing, please join the [Cooperation Alliance](#) through the platform's official website for free to obtain authorization, or contact the project leader for commercial licensing.

### Q: What deployment environments are supported?
**A:** BemIot Core is a cross-platform software that can be deployed on Windows, Linux, Unix, and Mac systems. In addition to private deployment, it also supports deployment on cloud platforms such as AWS, Alibaba Cloud, Tencent Cloud, and Huawei Cloud. In subsequent versions, Docker and Kubernetes deployment methods will be introduced.

### Q: What devices are supported for access?
**A:** BemIot Core supports the access of any device that supports protocols such as TCP, MQTT, UDP, CoAP, HTTP, Websocket, etc., and can also extend support for more protocols through plug-ins. In subsequent versions, protocol drivers will be continuously updated.

### Q: The data volume is huge. Can the performance keep up?
**A:** BemIot Core integrates with the TDengine time-series database, enabling second-level processing of millions of data points. It also supports performance optimization solutions such as data sharding and cache optimization.

### Q: How to achieve remote control of devices?
**A:** Remote control can be achieved through the device command function in the device management module. It supports real-time control, scheduled control, single device control, batch device group control, and automatic control based on scene-specific rules.

### Q: Does it support private deployment?
**A:** Fully supports private deployment. You can deploy BemIot Core on your own server or intranet, and the data belongs entirely to you.

### Q: How to implement edge computing?
**A:** BemIot Core supports offline deployment and local rule execution, and can run on edge devices to achieve edge computing and offline autonomy.

### Q: Can third-party systems be integrated?
**A:** Supporting OpenAPI integration, future versions will gradually interface with major cloud platforms' IoT services, enabling easy integration with third-party systems.

## Disclaimers

The BemIot Core open source version is an open source learning project unrelated to commercial activities. Users should comply with laws and regulations when using this project and refrain from engaging in illegal activities.

- If any illegal behavior is found on the part of the user, we will cooperate with relevant law enforcement agencies to conduct an investigation.
- Any legal liability caused by the user's illegal behavior shall be borne by the user himself/herself.
- If the user's use causes damage to a third party, the user shall compensate according to law.
- All risks associated with the use of BemIot Core and its related resources are borne by the user.
- This project does not provide any guarantees or warranties.

## License
This project adopts the [GPL-3.0](./LICENSE) open source license. For details, please refer to the [LICENSE](./LICENSE) file.
