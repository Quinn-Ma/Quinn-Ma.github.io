/* ============================================================
   Site content — edit text here. Two languages: zh / en.
   Every section is rendered by assets/js/main.js from this object.
   ============================================================ */
window.SITE = {
  links: {
    email: "qm18@rice.edu",
    phoneUS: "+1 346 438 3210",
    phoneCN: "+86 182 2136 7988",
    linkedin: "https://www.linkedin.com/in/qinzhen-ma",
    github: "https://github.com/quinn-ma",
    wechat: "luckyqinzhen",
    resume: "assets/Qinzhen_Ma_Resume.pdf",
    startup: "https://brightfuture.originxairobotics.com/",
    startupEn: "https://brightfuture.originxairobotics.com/en/",
    video: "assets/media/lehome_fold_clothes.webm",
    avatar: "assets/img/avatar.jpg"
  },

  videos: [
    { id: "dual", file: "assets/media/dual_arm_pick_place.mp4", poster: "assets/media/dual_arm_pick_place.jpg", type: "video/mp4" },
    { id: "a2", file: "assets/media/originx_a2_piper_outdoor.mp4", poster: "assets/media/originx_a2_piper_outdoor.jpg", type: "video/mp4" },
    { id: "fold", file: "assets/media/lehome_fold_clothes.webm", poster: "assets/media/lehome_fold_clothes.jpg", type: "video/webm" }
  ],
  defaultVideo: "dual",

  zh: {
    meta: { title: "马沁桢 | 具身智能 · OriginX 创始人", lang: "zh-CN" },
    nav: {
      brand: "马沁桢",
      items: [
        ["startup", "创业项目"],
        ["loop", "交付闭环"],
        ["experience", "经历"],
        ["projects", "项目"],
        ["skills", "技术栈"],
        ["contact", "联系"]
      ],
      langBtn: "EN",
      themeDark: "深色",
      themeLight: "浅色",
      menu: "菜单"
    },
    hero: {
      eyebrow: "EMBODIED AI · VLA / VTLA · WORLD MODEL EVALUATOR",
      greeting: "你好，我是",
      name: "马沁桢",
      roles: [
        "具身智能算法与系统负责人",
        "OriginX 创始人 · 家庭场景物理 AI",
        "Rice ECE 硕士 · Kavraki Lab / RobotΠ Lab",
        "百度大模型产品「法行宝」0→1"
      ],
      lead:
        "端到端技术负责人，横跨工业级大模型与具身智能。从真机数据采集、VLA / VTLA 训练、闭环仿真评测到真机部署，围绕成功率、稳定性、可复现性与失败恢复建立完整工程闭环。",
      ctaPrimary: "查看创业项目 OriginX",
      ctaSecondary: "工作经历",
      ctaTertiary: "下载简历",
      stats: [
        { n: 4, suffix: "+", label: "年 AI 研发" },
        { n: 2, suffix: "", label: "个 0→1 系统交付" },
        { n: 2, suffix: "", label: "个 Rice 实验室" },
        { n: 1, suffix: "", label: "家创业公司" }
      ],
      facts: [
        ["身份", "OriginX 创始人 · Rice ECE 硕士生"],
        ["坐标", "Houston, TX · 北京 / 上海"],
        ["方向", "VLA / VTLA · World Model 评测 · Sim-to-Real"],
        ["目标角色", "联创 CTO / 具身智能技术负责人"]
      ],
      scrollHint: "向下滚动"
    },
    startup: {
      num: "01",
      title: "创业项目",
      badge: "FOUNDER · 2026",
      brand: "OriginX · 弦跃星河",
      tagline: "基于家庭场景的物理 AI",
      headline: "世界模型驱动的家庭教育机器人，从第一台真机开始自进化",
      desc:
        "OriginX 以世界模型为核心，用低成本真机进入家庭场景，通过真实环境的数据回流、自动实验与持续评测，让机器人从第一台样机开始自我进化。首代产品面向家庭教育场景。",
      points: [
        ["世界模型驱动", "以 World Model 作为评测器与规划核心，闭环仿真与真机数据互相校准。"],
        ["低成本真机", "首代 MicroDuck 约 ¥3,000，轮式双臂平台控制在 ¥20,000 以内。"],
        ["真实数据飞轮", "家庭环境中的数据回流 → 自动实验 → 策略迭代，形成自进化闭环。"],
        ["技术负责人", "创始人，负责技术路线、算法系统与研发交付。"]
      ],
      cta: "打开商业计划书站点",
      ctaNote: "brightfuture.originxairobotics.com · 中 / EN"
    },
    loop: {
      num: "02",
      title: "负责人交付闭环",
      lead: "把研发链路拆成四个可交付的环节，每一环都有可验证的产出。点击节点查看细节。",
      autoHint: "自动轮播 · 点击暂停",
      nodes: [
        {
          key: "data",
          short: "0→1 数据",
          sub: "遥操作数采",
          title: "真机数据闭环",
          desc:
            "从 0→1 搭建遥操作与数据采集链路，自主开发数采 App，贯通设备控制、相机 / 状态 / 动作同步、数据落盘与质量检查，为 VLA 训练提供可复现的数据基础。",
          tags: ["遥操作", "数采 App", "多模态同步", "质量检查"]
        },
        {
          key: "train",
          short: "训练部署",
          sub: "训练 - 推理 - 执行",
          title: "真机部署闭环",
          desc:
            "打通模型训练、推理服务与机器人动作执行链路，完成策略真机部署验证，并建立安全检查、动作限幅与失败回收机制。",
          tags: ["VLA / VTLA", "推理服务", "安全限幅", "失败回收"]
        },
        {
          key: "eval",
          short: "可信评测",
          sub: "参数辨识 + WM 纠偏",
          title: "仿真评测可靠性",
          desc:
            "主导机器人参数辨识与仿真模型校准，降低动力学偏差与随机评测波动；设计评测结果纠偏 / 校准模块，增强 World Model as an Evaluator 在任务成败判定与模型排序中的可靠性；开发 Newton Solver 模块完善动力学求解链路。",
          tags: ["参数辨识", "World Model Evaluator", "Newton Solver", "Sim-to-Real"]
        },
        {
          key: "eco",
          short: "生态协同",
          sub: "NVIDIA + LeRobot",
          title: "技术生态合作",
          desc:
            "负责与 NVIDIA 及 LeRobot 相关团队的技术对接，推进框架适配、关键问题定位、联合验证与资源协同；对内协同产品、销售、运营完成 KPI 与验收。",
          tags: ["NVIDIA", "LeRobot", "框架适配", "跨职能交付"]
        }
      ]
    },
    experience: {
      num: "03",
      title: "工作与研究经历",
      lead: "工业界 4 年多大模型与具身智能研发，同时在 Rice 两个实验室做研究。悬停右侧技术栈可高亮相关经历。",
      filters: [
        ["all", "全部"],
        ["industry", "工业界"],
        ["research", "研究"]
      ],
      expand: "展开详情",
      collapse: "收起",
      items: [
        {
          type: "industry",
          org: "Lightwheel · 光轮智能",
          role: "具身智能算法与系统负责人",
          date: "2026.05 – 2026.08",
          meta: "直接汇报创始人 · 团队数十人 · 数据 / 训练 / 评测 / 部署 / 技术合作",
          tags: ["vla", "vtla", "lerobot", "ros2", "isaacsim", "sim2real", "sysid", "newton", "wm", "python", "cpp", "docker"],
          bullets: [
            "真机数据闭环：从 0→1 搭建遥操作与数据采集链路，自主开发数采 App，贯通设备控制、相机 / 状态 / 动作同步、数据落盘与质量检查。",
            "真机部署闭环：打通模型训练、推理服务与机器人动作执行链路，完成策略真机部署验证，建立安全检查、动作限幅与失败回收机制。",
            "仿真评测可靠性：主导机器人参数辨识与仿真模型校准，降低动力学偏差及随机评测波动，提升闭环仿真结果的稳定性与可复现性。",
            "World Model 纠偏：设计并实现评测结果纠偏 / 校准模块，降低系统性预测偏差，增强 World Model as an Evaluator 的可靠性。",
            "求解器研发：开发 Newton Solver 模块，完善动力学求解与仿真执行链路。",
            "技术生态合作：负责与 NVIDIA 及 LeRobot 团队的技术对接，推进框架适配、问题定位、联合验证与资源协同。"
          ]
        },
        {
          type: "research",
          org: "Rice University · RobotΠ Lab",
          role: "VTLA 研究 · LeRobot × Open-PI 流水线",
          date: "2026 – 至今",
          meta: "Vision-Tactile-Language-Action · 触觉融合 · 在线纠偏",
          tags: ["vtla", "vla", "lerobot", "isaacsim", "ros2", "pytorch", "jax", "sim2real"],
          bullets: [
            "VTLA 多模态融合：构建视觉 - 语言 - 触觉 - 动作融合方案，利用接触反馈提升精细控制、抓取稳定性与在线纠偏能力。",
            "端到端 VLA 流水线：真机数据采集 → 跨数据集训练 → Isaac Sim 评测 → Sim-to-Real 反馈迭代，桥接 LeRobot 与 Open-PI。",
            "紧凑视觉触觉世界模型、想象轨迹强化学习与力约束评测研究；预印本已公开于 arXiv:2609.09597。"
          ]
        },
        {
          type: "research",
          org: "Rice University · Kavraki Lab",
          role: "研究助理",
          date: "2025.09 – 至今",
          meta: "SuperAgent 自进化 · 多 Agent 协作 · 自动实验 · 持续评测",
          tags: ["agent", "python", "eval"],
          bullets: [
            "SuperAgent 架构：研究可自动分解任务、调用工具并协同执行的 Agent 群体架构，构建规划 - 执行 - 评测 - 反思闭环。",
            "自进化闭环：围绕实验自动化、经验回流和策略迭代设计自进化机制，提升复杂任务的自主性、稳定性与持续优化能力。"
          ]
        },
        {
          type: "industry",
          org: "百度在线网络技术（北京）有限公司",
          role: "大模型算法",
          date: "2022.07 – 2025.06",
          meta: "核心产品：法律垂类大模型「法行宝」· 覆盖训练、检索、评测、上线与跨职能验收",
          tags: ["sft", "rlhf", "ppo", "rag", "faiss", "eval", "pytorch", "python", "onnx"],
          bullets: [
            "大模型产品 0→1：主导「法行宝」算法研发与上线，搭建领域预训练、SFT 与 RLHF（PPO）链路，围绕指令遵循、事实性、拒答策略与稳定性持续迭代。",
            "Hybrid RAG：融合向量检索、语义检索、BM25、重排与过滤策略，提升复杂法律查询及长文档证据检索的召回质量与答案可追溯性。",
            "评测与迭代闭环：建立事实性、一致性与覆盖率导向的测试集与评测指标，推动离线评测与线上 A/B 对齐。",
            "工程交付：落地流式索引、增量更新与性能优化，在召回效果、线上延迟和系统稳定性之间取得可交付平衡；协同产品、销售、运营完成 KPI 与验收。"
          ]
        }
      ]
    },
    projects: {
      num: "04",
      title: "精选项目",
      lead: "从具身操作到法律大模型，每个项目都以可验证的指标收口。",
      demoLabel: "▶ LeRobot 真机演示 · 叠衣服",
      demoFallback: "视频加载失败：assets/media/lehome_fold_clothes.webm",
      items: [
        {
          accent: "cyan",
          badge: "研究预印本 · arXiv:2609.09597",
          title: "紧凑视觉触觉世界模型：预测、奖励对齐与力约束",
          desc:
            "联合视觉、触觉和本体状态预测抓取提升过程，并通过世界模型中的想象轨迹训练强化学习策略。MuJoCo 对照实验分别评估预测精度、奖励设计与力约束：高度奖励下，同分布严格抬升成功率为 93.3%，8 N 力预算内成功率为 33.3%（力反馈基线为 70.0%）。三种训练种子在十个共享同分布环境上评估；公共 GelSight 数据用于独立感知实验，尚无真机控制或仿真到真机迁移验证。",
          chips: ["65.2 万参数", "160 条建模轨迹", "680 次控制执行 / 40 个独立环境", "世界模型 + RL"],
          tags: ["wm", "vtla", "franka", "pytorch"],
          links: [{label: "项目网站 ↗", url: "https://compact-visuotactile-world-models.thumbnodirosving.chatgpt.site/"}, {label: "arXiv 论文 ↗", url: "https://arxiv.org/abs/2609.09597"}, {label: "GitHub ↗", url: "https://github.com/Quinn-Ma/compact-visuotactile-world-models"}],
          publicationStatus: "预印本已公开：arXiv:2609.09597。"
        },
        {
          accent: "amber",
          badge: "RobotΠ Lab · 2025 – 至今",
          title: "LeRobot × Open-PI · 指令条件 VLA 桌面操作流水线",
          desc:
            "覆盖完整研发周期：ROS 2 遥操作采集同步 RGB-D / 本体状态 / 语言标注 → 适配 Open-PI 数据格式做多任务训练（PyTorch / JAX）→ Isaac Sim 标准化评测（成功率、轨迹长度、延迟、指令遵循）→ 失败模式分析与域随机化迭代。",
          chips: ["LeRobot", "Open-PI", "Isaac Sim", "OpenVLA", "域随机化"],
          tags: ["vla", "lerobot", "isaacsim", "ros2", "jax", "sim2real"]
        },
        {
          accent: "mint",
          badge: "百度 · 2022 – 2025",
          title: "「法行宝」法律垂类大模型 0→1",
          desc:
            "从领域预训练、SFT 到 RLHF（PPO）的全链路训练；Hybrid RAG 融合向量 / 语义 / BM25 检索与重排；建立事实性、一致性与覆盖率评测集，离线评测与线上 A/B 对齐，并以流式索引与增量更新完成生产部署。",
          chips: ["SFT / RLHF", "Hybrid RAG", "评测闭环", "流式索引"],
          tags: ["sft", "rlhf", "rag", "faiss", "eval"]
        },
        {
          accent: "violet",
          badge: "Kavraki Lab · 2025.09 – 至今",
          title: "SuperAgent：自进化多 Agent 系统",
          desc:
            "可自动分解任务、调用工具并协同执行的 Agent 群体架构，构建规划 - 执行 - 评测 - 反思闭环；围绕实验自动化、经验回流和策略迭代设计自进化机制。",
          chips: ["多 Agent", "自动实验", "持续评测"],
          tags: ["agent", "eval", "python"]
        }
      ]
    },
    skills: {
      num: "05",
      title: "技术栈",
      lead: "悬停任一标签，左侧相关经历与项目会同步高亮。",
      groups: [
        {
          label: "具身 / 仿真",
          items: [
            ["VLA", "vla"], ["VTLA", "vtla"], ["World Model Evaluator", "wm"], ["LeRobot", "lerobot"],
            ["ROS 2", "ros2"], ["Isaac Sim", "isaacsim"], ["OMPL", "ompl"], ["Sim-to-Real", "sim2real"]
          ]
        },
        {
          label: "模型 / 算法",
          items: [
            ["PyTorch", "pytorch"], ["JAX", "jax"], ["CUDA", "cuda"], ["参数辨识", "sysid"],
            ["Newton Solver", "newton"], ["PPO / SAC", "ppo"], ["SFT / RLHF", "rlhf"], ["Hybrid RAG", "rag"]
          ]
        },
        {
          label: "工程 / 工具",
          items: [
            ["Python", "python"], ["C++", "cpp"], ["Docker", "docker"], ["FAISS", "faiss"],
            ["ONNX", "onnx"], ["Git", "git"]
          ]
        }
      ],
      leadershipTitle: "技术领导力与交付证据",
      leadership: [
        ["技术路线", "围绕数据、训练、评测、部署拆解研发链路；聚焦 VLA / VTLA 与 World Model 评测。"],
        ["0→1 建设", "搭建真机遥操作数采链路；主导百度法律大模型产品算法研发与上线。"],
        ["系统交付", "贯通模型训练、推理服务与机器人执行；建立安全、限幅与失败回收机制。"],
        ["组织协同", "创始人直汇报；对接 NVIDIA、LeRobot，并协同产品、销售、运营完成验收。"]
      ]
    },
    education: {
      num: "06",
      title: "教育与荣誉",
      items: [
        { school: "Rice University · 美国莱斯大学", degree: "电气与计算机工程 · 硕士", date: "2025 – 2026.12（预计）", note: "Kavraki Lab · RobotΠ Lab" },
        { school: "西北民族大学", degree: "电子信息工程 · 本科", date: "2018 – 2022", note: "" }
      ],
      honors: [["蓝桥杯全国软件和信息技术专业人才大赛", "全国一等奖"]],
      langs: "English · Fluent"
    },
    contact: {
      num: "07",
      title: "联系我",
      lead: "欢迎交流具身智能、World Model 评测与机器人产品 0→1。目标角色：联创 CTO / 具身智能技术负责人。",
      email: "邮箱",
      phoneUS: "美国电话",
      phoneCN: "中国电话",
      wechat: "微信",
      linkedin: "LinkedIn",
      github: "GitHub",
      resume: "简历 PDF",
      copy: "复制",
      copied: "已复制",
      open: "打开"
    },
    desk: {
      hint: "点击桌上的物件放大查看 · 按住拖动可环视 · Esc 返回",
      hintTouch: "点按桌上的物件放大查看 · 左右滑动可环视",
      back: "返回桌面",
      scrollMore: "查看完整内容",
      unsupported: "当前设备不支持 3D 场景，请向下浏览。",
      videoNote: "视频在显示器上播放，可切换、暂停或开启声音。",
      play: "播放", pause: "暂停", mute: "静音", unmute: "开启声音",
      demoTitle: "真机 / 仿真演示",
      hotspots: {
        monitor: { label: "真机演示", title: "机器人演示视频", desc: "双臂真机分拣、OriginX A2 户外巡回抓取、LeRobot 叠衣服，三段演示可切换播放。" },
        duck: { label: "OriginX", title: "创业项目 · OriginX 弦跃星河", desc: "桌上这只小鸭代表 OriginX 首代产品 MicroDuck：世界模型驱动的家庭教育机器人。" },
        arm: { label: "交付闭环", title: "具身智能交付闭环", desc: "遥操作数采、训练部署、可信评测、生态协同，我负责的四个环节。" },
        laptop: { label: "研究项目", title: "研究与精选项目", desc: "视觉触觉世界模型预印本、LeRobot × Open-PI 流水线、法行宝、SuperAgent。" },
        notebook: { label: "简历 · 经历", title: "工作与研究经历", desc: "光轮智能、百度、Rice 两个实验室，可在此下载完整简历。" },
        books: { label: "教育背景", title: "教育与荣誉", desc: "Rice University ECE 硕士、西北民族大学本科、蓝桥杯全国一等奖。" },
        phone: { label: "联系我", title: "联系方式", desc: "邮箱、微信、电话、LinkedIn、GitHub。" }
      },
      videos: {
        dual: { title: "双臂真机 · 瓶罐分拣回收", desc: "两台机械臂协同抓取桌面上的饮料瓶并投入回收桶，真机运行。", tags: ["双臂", "真机", "抓取放置"] },
        a2: { title: "OriginX A2 + Piper X · 户外巡回搜索与抓取", desc: "四足平台搭载 Piper X 机械臂：RGB-D SLAM 建图与 A* 搜索，大范围道路巡回，物理抓取回收瓶罐（无 IK、无瞬移）。", tags: ["四足 + 机械臂", "RGB-D SLAM", "自主抓取"] },
        fold: { title: "LeRobot · 叠衣服", desc: "指令条件 VLA 策略（LeRobot + Open-PI）执行叠衣服任务。", tags: ["LeRobot", "VLA", "Open-PI"] }
      }
    },
    footer: {
      text: "© 2026 马沁桢 · Qinzhen Ma",
      built: "纯 HTML / CSS / JS · 托管于 GitHub Pages"
    }
  },

  en: {
    meta: { title: "Qinzhen Ma | Embodied AI · Founder, OriginX", lang: "en" },
    nav: {
      brand: "Qinzhen Ma",
      items: [
        ["startup", "Startup"],
        ["loop", "Delivery Loop"],
        ["experience", "Experience"],
        ["projects", "Projects"],
        ["skills", "Skills"],
        ["contact", "Contact"]
      ],
      langBtn: "中文",
      themeDark: "Dark",
      themeLight: "Light",
      menu: "Menu"
    },
    hero: {
      eyebrow: "EMBODIED AI · VLA / VTLA · WORLD MODEL EVALUATOR",
      greeting: "Hi, I'm",
      name: "Qinzhen (Maxwell) Ma",
      roles: [
        "Embodied AI Algorithm & Systems Lead",
        "Founder, OriginX · Physical AI for the Home",
        "M.S. ECE @ Rice · Kavraki Lab / RobotΠ Lab",
        "Shipped Baidu's legal LLM product from 0→1"
      ],
      lead:
        "End-to-end technical lead spanning industrial LLMs and embodied AI. I own the full loop from real-robot data collection, VLA / VTLA training and closed-loop simulation evaluation to real-world deployment, engineered around success rate, stability, reproducibility and failure recovery.",
      ctaPrimary: "See my startup, OriginX",
      ctaSecondary: "Experience",
      ctaTertiary: "Download résumé",
      stats: [
        { n: 4, suffix: "+", label: "years in AI R&D" },
        { n: 2, suffix: "", label: "0→1 systems shipped" },
        { n: 2, suffix: "", label: "research labs at Rice" },
        { n: 1, suffix: "", label: "startup founded" }
      ],
      facts: [
        ["Now", "Founder, OriginX · M.S. ECE student at Rice"],
        ["Based", "Houston, TX · Beijing / Shanghai"],
        ["Focus", "VLA / VTLA · World Model evaluation · Sim-to-Real"],
        ["Open to", "Co-founder CTO / Embodied AI tech lead"]
      ],
      scrollHint: "Scroll"
    },
    startup: {
      num: "01",
      title: "Startup",
      badge: "FOUNDER · 2026",
      brand: "OriginX",
      tagline: "Physical AI for the Home",
      headline: "A world-model-driven home education robot that self-evolves from the very first unit",
      desc:
        "OriginX puts a world model at the core, enters the home with low-cost real robots, and closes the loop with real-world data return, automated experiments and continuous evaluation, so the robot improves from its first prototype onward. The first product targets home education.",
      points: [
        ["World-model driven", "The World Model serves as evaluator and planning core; closed-loop sim and real-robot data calibrate each other."],
        ["Low-cost hardware", "First-gen MicroDuck at about ¥3,000; a wheeled dual-arm platform kept under ¥20,000."],
        ["Real-data flywheel", "Data from real homes → automated experiments → policy iteration, forming a self-evolving loop."],
        ["My role", "Founder, owning technical strategy, algorithm systems and R&D delivery."]
      ],
      cta: "Open the business plan site",
      ctaNote: "brightfuture.originxairobotics.com · 中 / EN"
    },
    loop: {
      num: "02",
      title: "The Delivery Loop I Own",
      lead: "I break the R&D pipeline into four deliverable stages, each with verifiable output. Click a node for details.",
      autoHint: "Auto-cycling · click to pause",
      nodes: [
        {
          key: "data",
          short: "0→1 Data",
          sub: "Teleop collection",
          title: "Real-robot data loop",
          desc:
            "Built the teleoperation and data-collection pipeline from scratch, including an in-house capture app that ties together device control, camera / state / action synchronization, on-disk logging and quality checks, giving VLA training a reproducible data foundation.",
          tags: ["Teleoperation", "Capture app", "Multimodal sync", "Quality checks"]
        },
        {
          key: "train",
          short: "Train & Deploy",
          sub: "Train - infer - execute",
          title: "Real-robot deployment loop",
          desc:
            "Connected model training, the inference service and robot action execution end to end, validated policies on real hardware, and added safety checks, action limiting and failure-recovery mechanisms.",
          tags: ["VLA / VTLA", "Inference service", "Safety limits", "Failure recovery"]
        },
        {
          key: "eval",
          short: "Trusted Eval",
          sub: "System ID + WM correction",
          title: "Reliable simulation evaluation",
          desc:
            "Led robot parameter identification and simulator calibration to cut dynamics error and evaluation variance; designed a result-correction module that reduces systematic bias and makes World-Model-as-Evaluator reliable for pass/fail judgment and model ranking; built a Newton Solver module for the dynamics pipeline.",
          tags: ["System ID", "World Model Evaluator", "Newton Solver", "Sim-to-Real"]
        },
        {
          key: "eco",
          short: "Ecosystem",
          sub: "NVIDIA + LeRobot",
          title: "Technical partnerships",
          desc:
            "Owned technical engagement with NVIDIA and LeRobot teams: framework adaptation, root-causing key issues, joint validation and resource coordination; internally aligned product, sales and operations on KPIs and acceptance.",
          tags: ["NVIDIA", "LeRobot", "Framework adaptation", "Cross-functional delivery"]
        }
      ]
    },
    experience: {
      num: "03",
      title: "Experience & Research",
      lead: "Four-plus years of industry LLM and embodied-AI R&D, plus research in two labs at Rice. Hover a skill on the right to highlight related roles.",
      filters: [
        ["all", "All"],
        ["industry", "Industry"],
        ["research", "Research"]
      ],
      expand: "Show details",
      collapse: "Collapse",
      items: [
        {
          type: "industry",
          org: "Lightwheel",
          role: "Embodied AI Algorithm & Systems Lead",
          date: "May 2026 – Aug 2026",
          meta: "Reported to the founder · team of dozens · data / training / evaluation / deployment / partnerships",
          tags: ["vla", "vtla", "lerobot", "ros2", "isaacsim", "sim2real", "sysid", "newton", "wm", "python", "cpp", "docker"],
          bullets: [
            "Real-robot data loop: built teleoperation and data collection from 0→1, including an in-house capture app covering device control, camera / state / action sync, logging and quality checks.",
            "Deployment loop: connected training, inference serving and robot execution; validated policies on hardware with safety checks, action limiting and failure recovery.",
            "Evaluation reliability: led parameter identification and simulator calibration, reducing dynamics error and evaluation variance for stable, reproducible closed-loop results.",
            "World Model correction: designed and implemented a result-correction / calibration module that reduces systematic prediction bias in World-Model-as-Evaluator.",
            "Solver work: developed a Newton Solver module to strengthen dynamics solving and simulation execution.",
            "Ecosystem: owned technical engagement with NVIDIA and LeRobot teams on framework adaptation, issue triage, joint validation and resources."
          ]
        },
        {
          type: "research",
          org: "Rice University · RobotΠ Lab",
          role: "VTLA Research · LeRobot × Open-PI pipeline",
          date: "2026 – present",
          meta: "Vision-Tactile-Language-Action · tactile fusion · online correction",
          tags: ["vtla", "vla", "lerobot", "isaacsim", "ros2", "pytorch", "jax", "sim2real"],
          bullets: [
            "VTLA fusion: built a vision-language-tactile-action scheme that uses contact feedback to improve fine control, grasp stability and online correction.",
            "End-to-end VLA pipeline: real-robot data collection → cross-dataset training → Isaac Sim evaluation → sim-to-real iteration, bridging LeRobot with Open-PI.",
            "Compact visuotactile world models, reinforcement learning in imagination, and force-constraint evaluation; preprint available as arXiv:2609.09597."
          ]
        },
        {
          type: "research",
          org: "Rice University · Kavraki Lab",
          role: "Research Assistant",
          date: "Sep 2025 – present",
          meta: "Self-evolving SuperAgent · multi-agent collaboration · automated experiments · continuous evaluation",
          tags: ["agent", "python", "eval"],
          bullets: [
            "SuperAgent architecture: agent collectives that decompose tasks, call tools and execute collaboratively, closing a plan - execute - evaluate - reflect loop.",
            "Self-evolution: mechanisms for experiment automation, experience return and policy iteration that raise autonomy, stability and continuous improvement on complex tasks."
          ]
        },
        {
          type: "industry",
          org: "Baidu",
          role: "LLM Algorithm Engineer",
          date: "Jul 2022 – Jun 2025",
          meta: "Core product: the legal-domain LLM Faxingbao · training, retrieval, evaluation, launch and cross-functional acceptance",
          tags: ["sft", "rlhf", "ppo", "rag", "faiss", "eval", "pytorch", "python", "onnx"],
          bullets: [
            "Product 0→1: led algorithm R&D and launch of Faxingbao, building domain pre-training, SFT and RLHF (PPO) pipelines and iterating on instruction following, factuality, refusal policy and stability.",
            "Hybrid RAG: combined vector, semantic and BM25 retrieval with reranking and filtering to improve recall and answer traceability on complex legal queries and long documents.",
            "Evaluation loop: built factuality-, consistency- and coverage-oriented test sets and metrics, aligning offline evaluation with online A/B tests.",
            "Engineering delivery: shipped streaming indexing, incremental updates and performance work, balancing recall, latency and stability; coordinated product, sales and operations on KPIs and acceptance."
          ]
        }
      ]
    },
    projects: {
      num: "04",
      title: "Selected Projects",
      lead: "From embodied manipulation to legal LLMs, each project closes on verifiable metrics.",
      demoLabel: "▶ LeRobot real-robot demo · fold clothes",
      demoFallback: "Video failed to load: assets/media/lehome_fold_clothes.webm",
      items: [
        {
          accent: "cyan",
          badge: "Research preprint · arXiv:2609.09597",
          title: "Compact Visuotactile World Models for Lifting: Prediction, Reward Alignment, and Force Constraints",
          desc:
            "A compact world model combines vision, touch, and proprioception to predict lifting dynamics and train reinforcement-learning policies in imagination. MuJoCo experiments distinguish forecast accuracy, reward alignment, and force constraints: height-reward RL reaches 93.3% strict lift success and 33.3% success within an 8 N per-finger budget, versus 70.0% for force feedback. These results average three trained policies on ten shared in-distribution environments. Public GelSight sensing is evaluated separately; no physical-robot control or sim-to-real transfer is reported.",
          chips: ["652,157 parameters", "160 model-data episodes", "680 executions / 40 independent environments", "World model + RL"],
          tags: ["wm", "vtla", "franka", "pytorch"],
          links: [{label: "Project website ↗", url: "https://compact-visuotactile-world-models.thumbnodirosving.chatgpt.site/"}, {label: "arXiv paper ↗", url: "https://arxiv.org/abs/2609.09597"}, {label: "GitHub ↗", url: "https://github.com/Quinn-Ma/compact-visuotactile-world-models"}],
          publicationStatus: "Preprint available: arXiv:2609.09597."
        },
        {
          accent: "amber",
          badge: "RobotΠ Lab · 2025 – present",
          title: "LeRobot × Open-PI · Instruction-Conditioned VLA for Tabletop Manipulation",
          desc:
            "Full development cycle: ROS 2 teleoperation recording synchronized RGB-D / proprioception / language annotations → Open-PI format adaptation for multi-task training (PyTorch / JAX) → standardized Isaac Sim benchmarking (success rate, trajectory length, latency, instruction following) → failure-mode analysis with domain randomization.",
          chips: ["LeRobot", "Open-PI", "Isaac Sim", "OpenVLA", "Domain randomization"],
          tags: ["vla", "lerobot", "isaacsim", "ros2", "jax", "sim2real"]
        },
        {
          accent: "mint",
          badge: "Baidu · 2022 – 2025",
          title: "Faxingbao · Legal-Domain LLM from 0→1",
          desc:
            "Full training stack from domain pre-training and SFT to RLHF (PPO); Hybrid RAG fusing vector / semantic / BM25 retrieval with reranking; factuality, consistency and coverage evaluation sets aligned with online A/B; production deployment with streaming indexing and incremental updates.",
          chips: ["SFT / RLHF", "Hybrid RAG", "Evaluation loop", "Streaming index"],
          tags: ["sft", "rlhf", "rag", "faiss", "eval"]
        },
        {
          accent: "violet",
          badge: "Kavraki Lab · Sep 2025 – present",
          title: "SuperAgent: Self-Evolving Multi-Agent System",
          desc:
            "Agent collectives that decompose tasks, call tools and execute collaboratively in a plan - execute - evaluate - reflect loop, with self-evolution driven by experiment automation, experience return and policy iteration.",
          chips: ["Multi-agent", "Automated experiments", "Continuous evaluation"],
          tags: ["agent", "eval", "python"]
        }
      ]
    },
    skills: {
      num: "05",
      title: "Skills",
      lead: "Hover any tag to highlight the roles and projects where I used it.",
      groups: [
        {
          label: "Embodied / Simulation",
          items: [
            ["VLA", "vla"], ["VTLA", "vtla"], ["World Model Evaluator", "wm"], ["LeRobot", "lerobot"],
            ["ROS 2", "ros2"], ["Isaac Sim", "isaacsim"], ["OMPL", "ompl"], ["Sim-to-Real", "sim2real"]
          ]
        },
        {
          label: "Models / Algorithms",
          items: [
            ["PyTorch", "pytorch"], ["JAX", "jax"], ["CUDA", "cuda"], ["System ID", "sysid"],
            ["Newton Solver", "newton"], ["PPO / SAC", "ppo"], ["SFT / RLHF", "rlhf"], ["Hybrid RAG", "rag"]
          ]
        },
        {
          label: "Engineering / Tools",
          items: [
            ["Python", "python"], ["C++", "cpp"], ["Docker", "docker"], ["FAISS", "faiss"],
            ["ONNX", "onnx"], ["Git", "git"]
          ]
        }
      ],
      leadershipTitle: "Leadership & Delivery Evidence",
      leadership: [
        ["Technical roadmap", "Decompose R&D into data, training, evaluation and deployment; focus on VLA / VTLA and World Model evaluation."],
        ["0→1 building", "Built the real-robot teleop data pipeline; led algorithm R&D and launch of Baidu's legal LLM product."],
        ["Systems delivery", "Connected training, inference serving and robot execution; established safety, limiting and failure-recovery mechanisms."],
        ["Organization", "Reported directly to the founder; partnered with NVIDIA and LeRobot; aligned product, sales and operations on acceptance."]
      ]
    },
    education: {
      num: "06",
      title: "Education & Honors",
      items: [
        { school: "Rice University", degree: "M.S., Electrical & Computer Engineering", date: "2025 – Dec 2026 (expected)", note: "Kavraki Lab · RobotΠ Lab" },
        { school: "Northwest Minzu University", degree: "B.E., Electronic Information Engineering", date: "2018 – 2022", note: "" }
      ],
      honors: [["Lanqiao Cup National Software & IT Talent Competition", "National First Prize"]],
      langs: "English · Fluent · Mandarin · Native"
    },
    contact: {
      num: "07",
      title: "Contact",
      lead: "Happy to talk embodied AI, World Model evaluation and robot products from 0→1. Open to co-founder CTO / embodied AI tech lead roles.",
      email: "Email",
      phoneUS: "US phone",
      phoneCN: "CN phone",
      wechat: "WeChat",
      linkedin: "LinkedIn",
      github: "GitHub",
      resume: "Résumé (PDF)",
      copy: "Copy",
      copied: "Copied",
      open: "Open"
    },
    desk: {
      hint: "Click an object on the desk to zoom in · drag to look around · Esc to go back",
      hintTouch: "Tap an object on the desk to zoom in · swipe sideways to look around",
      back: "Back to desk",
      scrollMore: "See the full section",
      unsupported: "3D scene is not supported on this device; scroll down to browse.",
      videoNote: "Videos play on the monitor. Switch, pause, or turn on sound.",
      play: "Play", pause: "Pause", mute: "Mute", unmute: "Sound on",
      demoTitle: "Real-robot / simulation demos",
      hotspots: {
        monitor: { label: "Demos", title: "Robot demo videos", desc: "Dual-arm sorting on real hardware, OriginX A2 outdoor patrol-and-grasp, LeRobot cloth folding. Switch between the three clips." },
        duck: { label: "OriginX", title: "Startup · OriginX", desc: "The little duck on the desk stands for MicroDuck, OriginX's first product: a world-model-driven home education robot." },
        arm: { label: "Delivery loop", title: "Embodied AI delivery loop", desc: "Teleop data collection, training and deployment, trusted evaluation, ecosystem partnerships: the four stages I own." },
        laptop: { label: "Research", title: "Research & selected projects", desc: "Visuotactile world-model manuscript, LeRobot × Open-PI pipeline, Faxingbao, SuperAgent." },
        notebook: { label: "Résumé", title: "Experience & research", desc: "Lightwheel, Baidu, and two labs at Rice. Download the full résumé here." },
        books: { label: "Education", title: "Education & honors", desc: "M.S. ECE at Rice, B.E. at Northwest Minzu University, Lanqiao Cup national first prize." },
        phone: { label: "Contact", title: "Contact", desc: "Email, WeChat, phone, LinkedIn, GitHub." }
      },
      videos: {
        dual: { title: "Dual-arm real robot · bottle sorting", desc: "Two arms cooperatively pick bottles off the bench and drop them into a bin, running on real hardware.", tags: ["Dual-arm", "Real robot", "Pick & place"] },
        a2: { title: "OriginX A2 + Piper X · outdoor patrol, search & grasp", desc: "Quadruped base with a Piper X arm: RGB-D SLAM mapping with A* search, wide road coverage, physical grasping of bottles (no IK shortcuts, no teleport).", tags: ["Quadruped + arm", "RGB-D SLAM", "Autonomous grasp"] },
        fold: { title: "LeRobot · fold clothes", desc: "Instruction-conditioned VLA policy (LeRobot + Open-PI) performing a cloth-folding task.", tags: ["LeRobot", "VLA", "Open-PI"] }
      }
    },
    footer: {
      text: "© 2026 Qinzhen Ma · 马沁桢",
      built: "Plain HTML / CSS / JS · hosted on GitHub Pages"
    }
  }
};

// The desktop companion miniature is the entry to the embodied AI workflow.
Object.assign(window.SITE.zh.desk.hotspots.arm, {label:'P1 机器人', title:'P1 · 桌面陪伴机器人', desc:'轮式双臂陪伴机器人的桌面缩小模型。探索从数据采集、模型训练到评测与真机部署的完整链路。'});
Object.assign(window.SITE.en.desk.hotspots.arm, {label:'P1 Robot', title:'P1 · Desktop companion', desc:'A miniature of our wheeled, dual-arm companion robot. Explore the workflow from data collection and model training to evaluation and real-world deployment.'});

Object.assign(window.SITE.zh.desk.hotspots.duck, {label:'MicroDuck', title:'MicroDuck · 双足陪伴机器人', desc:'浅青色外壳、镜头眼与双足机械结构，探索 OriginX 的家庭物理 AI 项目。'});
Object.assign(window.SITE.en.desk.hotspots.duck, {label:'MicroDuck', title:'MicroDuck · Biped companion', desc:'A cyan shell, camera eyes and an exposed biped mechanism. Explore the OriginX physical AI project for the home.'});
