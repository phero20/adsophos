import { motion } from "framer-motion";

const days = [
  {
    day: "Day 1",
    date: "Coming Soon",
    events: [
      { time: "9:00 AM", title: "Opening Ceremony", desc: "Welcome & keynote" },
      { time: "10:30 AM", title: "Hackathon Begins", desc: "24-hr code sprint starts" },
      { time: "12:00 PM", title: "Robotics Arena", desc: "Bot battles & races" },
      { time: "2:00 PM", title: "Gaming Tournament", desc: "Esports qualifiers" },
      { time: "5:00 PM", title: "Fun Events Round 1", desc: "Quizzes & treasure hunt" },
    ],
  },
  {
    day: "Day 2",
    date: "Coming Soon",
    events: [
      { time: "9:00 AM", title: "Project Expo", desc: "Showcase innovations" },
      { time: "11:00 AM", title: "Gaming Finals", desc: "Esports championship" },
      { time: "1:00 PM", title: "Hackathon Judging", desc: "Present your projects" },
      { time: "3:00 PM", title: "Fun Events Finale", desc: "Meme contest & talent show" },
      { time: "5:30 PM", title: "Closing Ceremony", desc: "Awards & celebration" },
    ],
  },
];

const ScheduleSection = () => (
  <section id="schedule" className="relative py-24 px-4">
    <div className="container mx-auto max-w-4xl">
      <motion.h2
        className="font-arcade text-lg md:text-2xl text-center text-glow-purple mb-14"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Game Timeline
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-10">
        {days.map((day, di) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, x: di === 0 ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="font-arcade text-sm text-neon-cyan">{day.day}</span>
              <span className="text-muted-foreground font-body">— {day.date}</span>
            </div>

            <div className="relative border-l-2 border-neon-cyan/20 pl-6 space-y-6">
              {day.events.map((ev, i) => (
                <motion.div
                  key={ev.title}
                  className="relative group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  {/* Dot */}
                  <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-neon-cyan/30 border-2 border-neon-cyan group-hover:bg-neon-cyan transition-colors" />

                  <div className="bg-card rounded-lg p-4 neon-border group-hover:neon-glow transition-all duration-300">
                    <span className="font-display text-xs text-neon-cyan">{ev.time}</span>
                    <h4 className="font-display font-bold text-foreground mt-1">{ev.title}</h4>
                    <p className="text-sm text-muted-foreground font-body">{ev.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ScheduleSection;
