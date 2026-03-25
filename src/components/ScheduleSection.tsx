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
  <section id="schedule" className="relative py-20 px-4">
    <div className="pixel-divider-yellow mb-16" />

    <div className="container mx-auto max-w-4xl">
      <motion.h2
        className="font-display text-4xl md:text-6xl text-center text-arcade-pink mb-14"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        GAME TIMELINE
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
              <span className="font-arcade text-xs text-arcade-yellow bg-arcade-yellow/10 px-3 py-1">{day.day}</span>
              <span className="text-muted-foreground font-body text-sm">— {day.date}</span>
            </div>

            <div className="relative border-l-4 border-arcade-pink pl-6 space-y-4">
              {day.events.map((ev, i) => (
                <motion.div
                  key={ev.title}
                  className="relative group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="absolute -left-[29px] top-2 w-3 h-3 bg-arcade-pink" />

                  <div className="bg-card p-4 pixel-border group-hover:bg-secondary transition-colors">
                    <span className="font-arcade text-[8px] text-arcade-yellow">{ev.time}</span>
                    <h4 className="font-display text-base text-foreground mt-1">{ev.title}</h4>
                    <p className="text-xs text-muted-foreground font-body">{ev.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    <div className="pixel-divider mt-16" />
  </section>
);

export default ScheduleSection;
